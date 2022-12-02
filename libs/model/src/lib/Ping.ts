import {buildUpdateExpression, getItem, putItemIfNotNull, queryItems, updateItem} from "@app/db/dynamo-utils";
import {GSI1, MAIN_TABLE} from "@app/common";

// prettier-ignore
export interface PingData {
  PK: `Ping#${string}`;       // {email} -> query message by user
  SK: string;                 // {createdTime}
  GSI1PK: 'Ping';             // -> query all items
  GSI1SK: string;             // {createdTime}  -> sort by created time

  /// Default
  createdAt: number;
  updatedAt: number;

  /// Data should be at second level
  data: {
    message: string;
  }
}

export class PingRepo {
  static async add(id: string, props: PingData['data']): Promise<PingData | null> {
    const now = Date.now()
    const item: PingData = {
      PK: `Ping#${id}`,
      SK: `${now}`,
      GSI1PK: "Ping",
      GSI1SK: `${now}`,
      createdAt: now,
      updatedAt: now,
      data: props
    }

    const added = await putItemIfNotNull({
      TableName: MAIN_TABLE,
      Item: item,
    })
    return added ? item : null;
  }

  static async list(): Promise<PingData[]> {
    const r = await queryItems<PingData>({
      TableName: MAIN_TABLE,
      IndexName: GSI1,
      KeyConditionExpression: "#GSI1PK = :GSI1PK",
      ExpressionAttributeNames: {
        "#GSI1PK": "GSI1PK",
      },
      ExpressionAttributeValues: {
        ":GSI1PK": "Ping"
      },
    })
    return r.items;
  }

  static async get(id: string): Promise<PingData | null> {
    return await getItem<PingData>({
      TableName: MAIN_TABLE,
      Key: {PK: `Ping#${id}`, SK: "#"}
    })
  }

  static async update(id: string, props: PingData['data']): Promise<PingData> {
    const r = await updateItem<PingData>({
      TableName: MAIN_TABLE,
      Key: {PK: `Ping#${id}`, SK: "#",},
      ConditionExpression: "attribute_exists(#PK)",
      UpdateExpression: buildUpdateExpression({
        set: [
          "#data = :data"
        ]
      }),
      ExpressionAttributeNames: {
        "#PK": "PK",
        "#data": "data",
      },
      ExpressionAttributeValues: {
        ":data": props
      },
    })
    return r;
  }
}
