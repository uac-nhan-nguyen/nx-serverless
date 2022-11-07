import {APIGatewayEventRequestContextV2, APIGatewayProxyEventV2, APIGatewayProxyResultV2} from "aws-lambda";
import middy from "@middy/core";
import {APIGatewayProxyEventWrapper} from "@app/http/parseRequestBody.middleware";
import {parseError} from "@app/http/APIResponse";

export function createPOST<T>(handler: (e: APIGatewayProxyEventWrapper<T>, context: APIGatewayEventRequestContextV2) => Promise<APIGatewayProxyResultV2>) {
  return middy(async (e: APIGatewayProxyEventWrapper<T>, context: any) => {
    try {
      const r = await handler(e, context);
      return r;
    } catch (e) {
      return parseError(e);
    }
  })
}

export function createGET(handler: (e: APIGatewayProxyEventV2, context: APIGatewayEventRequestContextV2) => Promise<APIGatewayProxyResultV2>) {
  return middy(async (e: APIGatewayProxyEventV2, context: any) => {
    try {
      const r = await handler(e, context);
      return r;
    } catch (e) {
      return parseError(e);
    }
  })
}
