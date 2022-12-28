import type { Environment } from './environment.types';
import {getCognitoPoolId} from "libs/aws-utils/src";

export const env: Environment = {
  name: 'dev',
  region: 'us-east-2',
  profile: 'nx-test',
  jwtSecret: 'secret',
  cognito: {
    poolId: 'us-east-2_BkphPYk6O',
    clientId: '4o27gh9vijkjgqss2p34h49tj8',
  },
  dynamo: {
    // endpoint: 'http://localhost:4566',
    tableName: `nx-test-dev`,
  },
};
