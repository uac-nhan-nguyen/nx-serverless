import {APIResponse, createGET} from "@app/http";

export const handler = createGET(async (event) => {
  return APIResponse.OK({
    message: "OK"
  })
});
