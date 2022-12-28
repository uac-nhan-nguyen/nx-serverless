import type { Environment } from './environment.types';
import {env as defaultEnv} from './environment'

export const env: Environment = {
  name: 'stg',
  profile: defaultEnv.profile,
  region: defaultEnv.region,
  jwtSecret: 'secret',
  dynamo: {
    tableName: `nx-test-staging`,
  },
};
