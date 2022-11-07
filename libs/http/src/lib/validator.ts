import Ajv, { AnySchema } from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv();
addFormats(ajv);

export function validateData(schema: AnySchema, data: any) {

  try {
    const validate = ajv.compile(schema);
    const valid = validate(data);

    return {
      valid,
      errors: validate.errors,
    };
  }
  catch (e: any) {
    return {
      valid: false,
      errors: e.toString(),
    }
  }
}

export function validateSchema(schema: Record<string, unknown>): null | Error {
  try {
    ajv.compile(schema);
    return null;
  } catch (e) {
    console.error(e);
    return new Error(`invalid_schema: ${e}`);
  }
  // return ajv.validateSchema(schema) as boolean;
}
