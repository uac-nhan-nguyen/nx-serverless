import type { Environment } from './environment.types';
import * as fs from "fs";
import * as os from "os";
import {env as defaultEnv} from './environment'

/// credential is needed for initializing DynamoDB client
const getCredentials = (name) => {
  const file = Buffer.from(fs.readFileSync(`${os.homedir()}/.aws/credentials`)).toString('utf-8');
  const lines = file.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith(`[${name}]`)) {
      return {
        accessKeyId: lines[i + 1].split('=')[1].trim(),
        secretAccessKey: lines[i + 2].split('=')[1].trim(),
      }
    }
  }
  throw `Credential [${name}] not found`;
}

const profile = defaultEnv.profile

export const env: Environment = {
  name: 'local',
  profile: profile,
  region: defaultEnv.region,
  jwtSecret: 'secret',
  ...getCredentials(profile),
  dynamo: {
    // endpoint: 'http://localhost:4566',
    tableName: `nx-test-dev`,
  },
};
