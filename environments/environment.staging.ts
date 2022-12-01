import type { Environment } from './environment.types';

export const env: Environment = {
  name: 'stg',
  profile: 'nftjam',
  jwtSecret: 'secret',
  dynamo: {
    tableName: `nx-test-staging`,
  },
  region: 'us-east-2',
};
