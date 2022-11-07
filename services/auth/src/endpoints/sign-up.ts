import {createJWT} from '../auth.utils';
import {APIResponse} from "@app/http/APIResponse";
import {createPOST} from "@app/http/create-handler";
import {parseRequestBody} from "@app/http/parseRequestBody.middleware";
import {JSONSchemaType} from "ajv";
import {UserRepo} from "libs/model/src/lib/user.model";


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
