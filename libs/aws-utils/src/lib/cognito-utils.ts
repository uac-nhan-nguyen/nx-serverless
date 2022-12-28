import * as AWS from 'aws-sdk';
import {env} from "@app/env";

const cred = env.accessKeyId && env.secretAccessKey ? new AWS.Credentials({
  accessKeyId: env.accessKeyId,
  secretAccessKey: env.secretAccessKey,
}) : undefined

export const cognito = new AWS.CognitoIdentityServiceProvider({
  region: env.region,
  credentials: cred,
})

export const getCognitoPoolId = async (name) => {
  const pools = await cognito.listUserPools({MaxResults: 50}).promise();
  const UserPoolId = pools.UserPools?.find((i) => i.Name === name)?.Id;

  if (!UserPoolId) {
    console.log('UserPools', pools.UserPools?.map((i) => i.Name))
    throw 'Cannot find UserPoolId'
  }
  return UserPoolId;
}
