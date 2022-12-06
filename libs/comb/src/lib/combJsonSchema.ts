import {SomeJSONSchema} from "ajv/dist/types/json-schema";

export const combJsonSchema = (s: string): SomeJSONSchema => {
  return {
    type: "object",
    additionalProperties: false,
    required: [],
  };
}
