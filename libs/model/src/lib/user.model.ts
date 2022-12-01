import {getItem, putItem} from "@app/db/dynamo-utils";
import {env} from "@app/env";
import {MAIN_TABLE} from "@app/common";

export type UserData = {
  PK: `User#${string}`; // {email}
  SK: '#';
  email: string;
  name: string;
}

export abstract class UserRepo {
  static async create(email: string, props: { name: string }) {
    const item: UserData = {
      PK: `User#${email}`, SK: "#",
      email, name: props.name

    }
    await putItem({
      TableName: env.dynamo.tableName,
      Item: item,
    })
  }

  static async get(email: string) {
    return await getItem<UserData>({
      TableName: MAIN_TABLE,
      Key: { PK: `User#${email}`, SK: "#", }
    })
  }
}
