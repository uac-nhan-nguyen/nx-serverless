import type { Environment } from './environment.types';

export const env: Environment = {
  name: 'prod',
  profile: 'nftjam',
  jwtSecret: '<SECRET>',
  dynamo: {
    tableName: `prod-AppTable`,
  },
  region: 'us-east-2',
};
