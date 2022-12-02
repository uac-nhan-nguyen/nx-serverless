import {buildUpdateExpression, getItem, putItem, putItemIfNotNull, queryItems, updateItem} from "@app/db/dynamo-utils";
import {MAIN_TABLE} from "@app/common";

export type UserData = {
  PK: `User#${string}`; // {email}
  SK: '#';
  GSI1PK: 'User';
  GSI1SK: string;
  name: string;
  createdAt: number;
  updatedAt: number;
}

export abstract class UserRepo {
  static async create(email: string, props: { name: string }) {
    const now = Date.now();
    const item: UserData = {
      PK: `User#${email}`, SK: "#",
      GSI1PK: 'User',
      GSI1SK: now.toString(),
      createdAt: now,
      updatedAt: now,
      name: props.name
    }
    await putItemIfNotNull({
      TableName: MAIN_TABLE,
      Item: item,
    })
  }

  static async updateName(email: string, props: { name: string }): Promise<UserData> {
    const r = await updateItem<UserData>({
      TableName: MAIN_TABLE,
      Key: {PK: `User#${email}`, SK: "#",},
      ConditionExpression: "attribute_exists(#PK)",
      UpdateExpression: buildUpdateExpression({
        set: [
          "#name = :name"
        ]
      }),
      ExpressionAttributeNames: {
        "#PK": "PK",
        "#name": "name",
      },
      ExpressionAttributeValues: {
        ":name": props.name
      },
    })
    return r;
  }

  static async list(): Promise<UserData[]> {
    const r = await queryItems<UserData>({
      TableName: MAIN_TABLE,
      KeyConditionExpression: "#GSI1PK = :GSI1PK",
      ExpressionAttributeNames: {
        "#GSI1PK": "GSI1PK",
      },
      ExpressionAttributeValues: {
        ":GSI1PK": "User"
      },
    })
    return r.items;
  }

  static async get(email: string) {
    return await getItem<UserData>({
      TableName: MAIN_TABLE,
      Key: {PK: `User#${email}`, SK: "#",}
    })
  }
}
