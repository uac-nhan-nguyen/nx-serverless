// Policy helper function

import {API_KEY} from "@app/common";

const generatePolicy = (principalId, effect, resource, authContext) => {
  const authResponse = {
    principalId: principalId,
    context: authContext,
  };

  if (effect && resource) {
    authResponse['policyDocument'] = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    };
  }

  return authResponse;
};
const deny = (principalId) => generatePolicy(principalId, 'Deny', [], {})

const getAllowedResources = (groups, event) => {
  const resources: string[] = [];
  const region = '*';
  const {accountId, apiId} = event.requestContext;
  const apiArnPrefix = `arn:aws:execute-api:${region}:${accountId}:${apiId}`;

  // Allow all resources under this API
  resources.push(`${apiArnPrefix}/*`);

  return resources;
};

/**
 * https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-lambda-authorizer.html
 */
export const handler = async (event, context) => {
  const apiKey = event?.headers?.['api-key'];

  if (apiKey !== API_KEY()) {
    return deny('api-env')
  }


  return generatePolicy(
    'api-env',
    'Allow',
    getAllowedResources(null, event),
    {}
  );
};
