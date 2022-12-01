import type { Serverless } from 'serverless/aws';
import { baseServerlessConfig } from '../../serverless.base';

const serverlessConfig: Partial<Serverless> = {
  ...baseServerlessConfig,
  service: 'ping',
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
    }
  },
};

module.exports = serverlessConfig;
