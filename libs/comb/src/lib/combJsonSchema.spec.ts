import { combJsonSchema } from 'libs/comb/src/lib/combJsonSchema';

describe('comb', () => {
  it('should work', () => {
    expect(combJsonSchema(`
    {
      email: string [email]
      optional?: string
      number: number
      boolean: boolean
      comma: string,
      semi-colon: string,
      object: {
        email: string [email]
      }
      array: [
        email: string [email]
      ]
    }
    `)).toEqual({
      type: "object",
      additionalProperties: false,
      required: ['email'],
      properties: {
        'email': {type: 'string', format: 'email'},
        'boolean': {type: 'boolean', format: 'email'},
      }
    });
  });
});
