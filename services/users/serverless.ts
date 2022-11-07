import type { Serverless } from 'serverless/aws';
import { baseServerlessConfig } from '../../serverless.base';
import { tableResource } from '../../environments/environment.serverless';

const serverlessConfig: Partial<Serverless> = {
  ...baseServerlessConfig,
  service: 'users',
  provider: {
    ...baseServerlessConfig.provider,
    name: "aws",
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['dynamodb:GetItem'],
            Resource: tableResource,
          },
        ],
      },
    },
  },
  custom: {
    ...baseServerlessConfig.custom,
    'serverless-offline': {
      lambdaPort: 3002,
      httpPort: 3003,
    },
  },
  functions: {
    'user-get': {
      handler: 'src/endpoints/get.handler',
      events: [
        {
          http: {
            method: 'get',
            path: 'user/{id}',
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfig;
