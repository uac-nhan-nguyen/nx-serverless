import * as AWS from 'aws-sdk';
import {REGION} from "@app/common";

export const cognito = new AWS.CognitoIdentityServiceProvider({
  region: REGION,
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
