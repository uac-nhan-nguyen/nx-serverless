import type { Environment } from './environment.types';

export const env: Environment = {
  name: 'prod',
  profile: 'nftjam',
  jwtSecret: '<SECRET>',
  dynamo: {
    tableName: `nx-test-prod`,
  },
  region: 'us-east-2',
};
