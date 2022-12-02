import {APIResponse, createPOST, parseRequestBody} from "@app/http";
import {JSONSchemaType} from "ajv";
import {PingRepo} from "@app/model";

export const handler = createPOST<Payload>(async (event) => {
  const {email, message} = event.data;

  const item = await PingRepo.add(email, {message});
  console.log(`Ping written [${email}]: ${message}`);

  return APIResponse.OK({
    email,
    item,
  });
})

type Payload = {
  email: string;
  message: string;
}

const inputSchema: JSONSchemaType<Payload> = {
  type: 'object',
  required: ['email', 'message'],
  properties: {
    email: {type: 'string', format: 'email'},
    message: {type: 'string'},
  }
}

handler
  .use(parseRequestBody(inputSchema));
