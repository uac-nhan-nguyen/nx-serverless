import AWS from "aws-sdk";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'
import os from 'os'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getCredentials(name) {
  const file = Buffer.from(fs.readFileSync(`${os.homedir()}/.aws/credentials`)).toString('utf-8');
  const lines = file.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith(`[${name}]`)) {
      return new AWS.Credentials({
        accessKeyId: lines[i + 1].split('=')[1].trim(),
        secretAccessKey: lines[i + 2].split('=')[1].trim(),
      })
    }
  }
  return null;
}

/** PROJECT */
const REGION = 'us-east-2'
export const GSI1_INDEX = 'gsi1-index'

const cred = getCredentials('nx-test');

/** AWS Clients */

export const db = new AWS.DynamoDB.DocumentClient({
  region: REGION,
  credentials: cred,
})

export const dynamo = new AWS.DynamoDB({
  region: REGION,
  credentials: cred,
});

export const s3 = new AWS.S3({
  region: REGION,
  credentials: cred,
})

export const cognito = new AWS.CognitoIdentityServiceProvider({
  region: REGION,
  credentials: cred,
})

/** COGNITO */

export const getCognitoPoolId = async (name) => {
  const pools = await cognito.listUserPools({MaxResults: 50}).promise()
  const UserPoolId = pools.UserPools.find((i) => i.Name === name)?.Id;

  if (!UserPoolId) {
    console.log('UserPools', pools.UserPools.map((i) => i.Name))
    throw 'Cannot find UserPoolId'
  }
  return UserPoolId;
}

export const getCognitoClientId = async (poolId, name) => {
  const clients = await cognito.listUserPoolClients({UserPoolId: poolId}).promise()
  const found = clients.UserPoolClients.find((i) => i.ClientName === name);

  if (!found) {
    throw `Cannot find ClientId: [${clients.UserPoolClients.map((i) => i.ClientName)}]`
  }
  return found.ClientId;
}

export const cognitoGetUserByEmail = async (poolId, email) => {
  const userResponse = await cognito.listUsers({
    UserPoolId: poolId,
    Filter: `email = "${email}"`,
  }).promise()
  if (userResponse.Users.length === 0) {
    throw `User [${email}] not found`
  }
  return userResponse.Users[0]
}

/** DYNAMO */
export const query = (table, index, expression, pkValue, skValue) => db.query({
  TableName: table,
  IndexName: index,
  KeyConditionExpression: expression,
  ExpressionAttributeNames: Object.fromEntries([...expression.matchAll(/(#\w+)/g)].map(([key]) => {
    return [key, key.replace('#', '')]
  })),
  ExpressionAttributeValues: Object.fromEntries([...expression.matchAll(/(:\w+)/g)].map(([key]) => {
    if (key.endsWith('PK')) {
      return [key, pkValue]
    } else if (key.endsWith('SK')) {
      return [key, skValue]
    } else {
      throw `Unhandled value key ${key}`
    }
  })),
}).promise().then((r) => r.Items)

/** UTILS */
const price = 0.31 / 1000000
export const stringTotalConsumed = (rcu) => `Consume ${rcu.toFixed(0)}, cost $${(rcu * price).toFixed(6)}`;

export function useCount() {
  const counts = {}
  const count = (id) => {
    if (!counts[id]) counts[id] = 0
    counts[id]++
  }

  return [counts, count];
}
