import {createGET} from "@app/http/create-handler";
import {UserRepo} from "libs/model/src/lib/user.model";
import {APIResponse} from "@app/http/APIResponse";

export const main = createGET(async (e) => {
  const {id} = e.pathParameters ?? {};
  if (!id) throw "BAD_REQUEST: missing id";
  const user = await UserRepo.get(id);

  return APIResponse.OK({user});
});
