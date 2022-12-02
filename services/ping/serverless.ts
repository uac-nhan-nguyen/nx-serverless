import type {Serverless} from 'serverless/aws';
import {baseServerlessConfig} from '../../serverless.base';
import {tableIndex, tableResource} from '../../environments/environment.serverless';

const serverlessConfig: Partial<Serverless> = {
  ...baseServerlessConfig,
  service: 'ping',
  provider: {
    ...baseServerlessConfig.provider,
    name: "aws",
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['dynamodb:PutItem', 'dynamodb:GetItem'],
            Resource: tableResource,
          },
          {
            Effect: 'Allow',
            Action: ['dynamodb:Query'],
            Resource: tableIndex,
          },
        ],
      },
    },
  },
  custom: {
    ...baseServerlessConfig.custom,
    'serverless-offline': {
      lambdaPort: 3005,
      httpPort: 3001,
    },
  },
  functions: {
    'get': {
      handler: 'src/endpoints/get.handler',
      events: [{
        http: {
          method: 'get',
          path: 'ping'
        }
      }]
    },
    'post': {
      handler: 'src/endpoints/post.handler',
      events: [{
        http: {
          method: 'post',
          path: 'ping'
        }
      }]
    },
    'list': {
      handler: 'src/endpoints/list.handler',
      events: [{
        http: {
          method: 'get',
          path: 'ping/list'
        }
      }]
    }
  },
};

module.exports = serverlessConfig;
