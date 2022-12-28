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
