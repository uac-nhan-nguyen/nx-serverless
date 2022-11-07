import type { Environment } from './environment.types';

export const env: Environment = {
  name: 'dev',
  region: 'us-east-2',
  profile: 'local',
  jwtSecret: 'secret',
  dynamo: {
    endpoint: 'http://localhost:4566',
    tableName: `dev-AppTable`,
  },
};
