import type { Environment } from './environment.types';
import {env as defaultEnv} from './environment'

export const env: Environment = {
  name: 'prod',
  profile: defaultEnv.profile,
  region: defaultEnv.region,
  jwtSecret: '<SECRET>',
  dynamo: {
    tableName: `nx-test-prod`,
  },
};
