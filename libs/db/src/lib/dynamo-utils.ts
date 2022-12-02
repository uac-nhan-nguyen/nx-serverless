import {DocumentClient} from "aws-sdk/clients/dynamodb";
import {env} from '@app/env'
import AWS from "aws-sdk";

const cred = env.accessKeyId && env.secretAccessKey ? new AWS.Credentials({
  accessKeyId: env.accessKeyId,
  secretAccessKey: env.secretAccessKey,
}) : undefined

export const db = new DocumentClient({
  region: env.region,
  credentials: cred
});

type DataKeys = {
  PK: string,
  SK: string,
  GSI1PK?: string,
  GSI1SK?: string,
  GSI2PK?: string,
  GSI2SK?: string,
  GSI3PK?: string,
  GSI3SK?: string,
}

export type UpdateTransaction<T extends DataKeys> = DocumentClient.Update & {
  Key: {
    PK: T['PK'],
    SK: T['SK'],
  },
  ExpressionAttributeValues: {
    [P in keyof DataKeys as `:${P}`]?: T[P]
  }
}

export type PutTransaction<T> = DocumentClient.Put & {
  Item: T,
}

export async function getItem<T extends DataKeys>(
  params: DocumentClient.GetItemInput & {
    Key: {
      PK: T['PK'],
      SK: T['SK'],
    }
  }
): Promise<T | null> {
  const r = await db.get(params).promise();
  if (r.Item) return r.Item as T;
  else return null;
}

export async function putItem(
  params: DocumentClient.PutItemInput
): Promise<boolean> {
  const ok = await db
    .put({
      ...params,
    })
    .promise()
    .then(() => true)
    .catch((e) => {
      if (e.toString().startsWith("ConditionalCheckFailedException")) {
        return false;
      }
      throw e;
    });
  return ok;
}


export async function putItemIfNotNull(
  params: DocumentClient.PutItemInput
): Promise<boolean> {
  const ok = await db
    .put({
      ...params,
      ConditionExpression: "attribute_not_exists(#PK)",
      ExpressionAttributeNames: {
        "#PK": "PK",
      }
    })
    .promise()
    .then(() => true)
    .catch((e) => {
      if (e.toString().startsWith("ConditionalCheckFailedException")) {
        return false;
      }
      throw e;
    });
  return ok;
}

export async function updateItem<T extends DataKeys>(
  params: DocumentClient.UpdateItemInput & {
    Key: {
      PK: T['PK'],
      SK: T['SK'],
    },
    ExpressionAttributeValues: {
      [P in keyof DataKeys as `:${P}`]?: T[P]
    }
  }
): Promise<T> {
  const r = await db
    .update({
      ...params,
      ReturnValues: "ALL_NEW",
    })
    .promise();
  return r.Attributes as T;
}

export async function updateItemIfExists<T>(
  params: DocumentClient.UpdateItemInput
): Promise<T> {
  const r = await db
    .update({
      ...params,
      ReturnValues: "ALL_NEW",
      ConditionExpression: "attribute_exists(#PK)",
      ExpressionAttributeNames: {
        "#PK": "PK",
        ...params.ExpressionAttributeNames,
      },
    })
    .promise();
  return r.Attributes as T;
}

export async function queryItems<T extends DataKeys>(
  params: DocumentClient.QueryInput & {
    ExpressionAttributeValues?: {
      [P in keyof DataKeys as `:${P}`]?: T[P]
    }
  }, cursor?: string,
): Promise<{ items: T[], cursor: string | undefined, consumed?: number }> {
  const r = await db.query({
    ...params,
    ExclusiveStartKey: params.ExclusiveStartKey ?? convertCursorToKey(cursor)
  }).promise();

  return {
    items: r.Items as T[],
    cursor: convertKeyToCursor(r.LastEvaluatedKey),
    consumed: r.ConsumedCapacity?.CapacityUnits
  };
}

export async function queryItemsWithRCU<T extends DataKeys>(
  params: DocumentClient.QueryInput & {
    ExpressionAttributeValues: {
      [P in keyof DataKeys as `:${P}`]?: T[P]
    }
  }
): Promise<{
  results: T[];
  consumed: number;
}> {
  const r = await db
    .query({
      ...params,
      ReturnConsumedCapacity: "TOTAL",
    })
    .promise();

  return {
    results: r.Items as T[],
    consumed: r.ConsumedCapacity?.CapacityUnits ?? 0,
  };
}

export async function deleteItem<T extends DataKeys>(
  params: Omit<DocumentClient.DeleteItemInput, 'ReturnValues'> & {
    Key: {
      PK: T['PK'],
      SK: T['SK'],
    }
  },
): Promise<T | null> {
  const ok = await db
    .delete({
      ...params,
      ReturnValues: "ALL_OLD",
    })
    .promise()
    .then((e) => e.Attributes as T)
    .catch((e) => {
      if (e.toString().startsWith("ConditionalCheckFailedException")) {
        return null;
      }
      throw e;
    });
  return ok;
}


export async function deleteItemIfExists<T extends DataKeys>(
  params: Omit<DocumentClient.DeleteItemInput, 'ReturnValues' | 'ConditionExpression' | 'ExpressionAttributeNames'> & {
    Key: {
      PK: T['PK'],
      SK: T['SK'],
    }
  },
): Promise<T | null> {
  const ok = await db
    .delete({
      ...params,
      ConditionExpression: "attribute_exists(#PK)",
      ReturnValues: "ALL_OLD",
      ExpressionAttributeNames: {
        "#PK": "PK",
      }
    })
    .promise()
    .then((e) => e.Attributes as T)
    .catch((e) => {
      if (e.toString().startsWith("ConditionalCheckFailedException")) {
        return null;
      }
      throw e;
    });
  return ok;
}

/// HELPERS
function convertKeyToCursor(key: DocumentClient.Key | undefined): string | undefined {
  if (key == null) return undefined;
  return Buffer.from(JSON.stringify(key), 'utf-8').toString('base64');
}

function convertCursorToKey(cursor: string | undefined): DocumentClient.Key | undefined {
  if (cursor == null) return undefined;
  return JSON.parse(Buffer.from(cursor, 'base64').toString('utf8'));
}

/**
 * helpers to build UpdateExpression
 */
export function buildUpdateExpression(props: {
  set?: (string | any)[];
  remove?: (string | any)[];
}): DocumentClient.UpdateExpression {
  let ans = "";
  let {set, remove} = props;
  set = set?.filter((i) => i);
  if (set && set.length > 0) {
    ans += "SET " + set.join(", ");
  }

  remove = remove?.filter((i) => i);
  if (remove && remove.length > 0) {
    ans += " REMOVE " + remove.join(", ");
  }
  return ans.length > 0 ? ans : "";
}

/**
 * helpers to build ExpressionAttributeValues
 */
export function buildAttributeValues(props: {
  [key: string]: any;
}): DocumentClient.ExpressionAttributeValueMap | undefined {
  const ans : DocumentClient.ExpressionAttributeValueMap = {};
  Object.entries(props).forEach(([key, value]) => {
    if (value !== undefined) {
      ans[key] = value;
    }
  });

  return Object.entries(ans).length === 0 ? undefined : ans;
}

/**
 * helpers to build ExpressionAttributeNames
 * ignore value without value
 */
export function buildAttributeNames(props: {
  [key: string]: string | undefined | false | 0;
}): DocumentClient.ExpressionAttributeValueMap | undefined {
  const ans : DocumentClient.ExpressionAttributeValueMap = {};
  Object.entries(props).forEach(([key, value]) => {
    if (value) {
      ans[key] = value;
    }
  });

  return Object.entries(ans).length === 0 ? undefined : ans;
}
