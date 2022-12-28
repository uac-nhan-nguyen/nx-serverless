import {APIResponse, createPOST, parseRequestBody} from "@app/http";
import {JSONSchemaType} from "ajv";
import {UserRepo} from "libs/model/src/lib/User";
import {createJWT} from '../auth.utils';


export const handler = createPOST<Payload>(async (event) => {
  const {email, name} = event.data;

  await UserRepo.create(email, {name});

  return APIResponse.OK({
    token: createJWT(email),
  });
})

type Payload = { email: string; name: string }

const inputSchema: JSONSchemaType<Payload> = {
  type: 'object',
  required: ['email', 'name'],
  properties: {
    email: {type: 'string'},
    name: {type: 'string'}
  }
}

handler
  .use(parseRequestBody(inputSchema));
