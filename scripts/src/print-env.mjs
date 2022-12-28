import {cognito, cognitoGetUserByEmail, getCognitoClientId, getCognitoPoolId} from "./utils.mjs";


const poolId = await getCognitoPoolId('nx-test-pool-dev');
const clientId = await getCognitoClientId(poolId, 'nx-test-client-dev');


console.log(JSON.stringify({
  'dev': {
    userPoolId: poolId,
    userClientId: clientId
  }
}, null, 2));
