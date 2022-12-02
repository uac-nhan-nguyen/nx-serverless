import {APIResponse, createGET} from "@app/http";
import {PingRepo} from "@app/model";

export const handler = createGET(async (event) => {
  const items = await PingRepo.list();
  return APIResponse.OK(items.map((i) => {
    const [,email] = i.PK.split('#')
    const {message} = i.data;
    return {
      email,
      message,
    }
  }))
});
