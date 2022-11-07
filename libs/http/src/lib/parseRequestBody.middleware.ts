import middy from '@middy/core';
import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda';
import {APIResponse} from './APIResponse';
import {validateData} from './validator';
import {JSONSchemaType} from "ajv";

/// use `APIGatewayProxyEventV2` https://github.com/DefinitelyTyped/DefinitelyTyped/issues/46689
export interface APIGatewayProxyEventWrapper<T> extends APIGatewayProxyEventV2 {
  data: T;
}

export function parseRequestBody<T>(inputSchema: JSONSchemaType<T>) : middy.MiddlewareObj<APIGatewayProxyEventWrapper<T>, APIGatewayProxyResultV2> {
  const before = async (request: any) => {
    if (!request.event.body) {
      request.response = APIResponse.BadRequest('Missing body in request');
    }
    try {
      request.event.data = JSON.parse(request.event.body!);

      if (inputSchema != null) {
        const {valid, errors} = validateData(inputSchema, request.event.data);
        if (!valid) {
          request.response = APIResponse.BadRequest('Request validation failed', {
            errors,
          });
        }
      }
    } catch (e) {
      request.response = APIResponse.BadRequest('Failed to parse body in request: not json');
    }
  };

  return {before};
}
