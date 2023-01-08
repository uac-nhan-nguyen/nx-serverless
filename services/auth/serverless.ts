import type { Serverless } from 'serverless/aws';
import { baseServerlessConfig } from '../../serverless.base';
import { tableResource } from '../environments/config.serverless';

const serverlessConfig: Partial<Serverless> = {
  ...baseServerlessConfig,
  service: 'auth',
  provider: {
    ...baseServerlessConfig.provider,
    name: "aws",
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['dynamodb:PutItem'],
            Resource: tableResource,
          },
        ],
      },
    },
  },
  custom: {
    ...baseServerlessConfig.custom,
    'serverless-offline': {
      lambdaPort: 3000,
      httpPort: 3001,
    },
  },
  functions: {
    'sign-up': {
      handler: 'src/endpoints/sign-up.handler',
      events: [
        {
          http: {
            method: 'post',
            path: 'auth/sign-up',
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfig;
