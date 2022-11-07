import type { Environment } from './environment.types';

export const env: Environment = {
  name: 'stg',
  profile: 'nftjam',
  jwtSecret: 'secret',
  dynamo: {
    tableName: `stg-AppTable`,
  },
  region: 'us-east-2',
};
