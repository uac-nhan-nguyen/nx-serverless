import { validateData, validateSchema } from './validator';

test('returns error', () => {
  const inputSchema = {
    type: 'object',
    additionalProperties: false,
    required: ['items', 'cred'],
    properties: {
      cred: {
        type: 'object',
        additionalProperties: false,
        properties: {
          'Profile URL': { type: 'string', format: 'uri' },
        },
      },
      items: {
        type: 'array',
        additionalItems: true,
        items: {
          type: 'object',
          required: ['email', 'registrationStatus'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
            },
            registrationStatus: {
              type: 'string',
              pattern: '^(Pending|Expired|Registered)$',
            },
            registeredAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
  };

  const data = {
    cred: {
      'Profile URL': 'https://www.yahoo.co',
    },
    items: [
      {
        email: 'nhan.nguyen@uac.edu.au',
        registrationStatus: 'Pending',
        registeredAt: '2022-02-28T09:21:13.361Z',
      },
    ],
  };
  const { valid, errors } = validateData(inputSchema, data);
  expect(valid).toBeFalsy();
  console.log(errors);

});

test('support iso-date-time', () => {
  const inputSchema = {
    type: 'object',
    additionalProperties: false,
    required: ['items', 'cred'],
    properties: {
      cred: {
        type: 'object',
        additionalProperties: false,
        properties: {
          'Profile URL': { type: 'string', format: 'uri' },
        },
      },
      items: {
        type: 'array',
        items: {
          type: 'object',
          required: ['email', 'registrationStatus'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
            },
            registrationStatus: {
              type: 'string',
              pattern: '^(Pending|Expired|Registered)$',
            },
            registeredAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
  };

  expect(validateSchema(inputSchema)).toBeNull();

  const data = {
    cred: {
      'Profile URL': 'https://www.yahoo.co',
    },
    items: [
      {
        email: 'nhan.nguyen@uac.edu.au',
        registrationStatus: 'Pending',
        registeredAt: '2022-02-28T09:21:13.361Z',
      },
    ],
  };
  const { valid, errors } = validateData(inputSchema, data);
  expect(valid).toBeTruthy();
});
