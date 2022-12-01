type IData = {
  code?: string,
  errors?: any,
}

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

export interface IAPIResponse {
  headers?: { [header: string]: string | number | boolean } | undefined;
  statusCode: number;
  body: string;
}

const response = (code: number, data: object, headers?: object): IAPIResponse => ({
  headers: {
    ...defaultHeaders,
    ...headers,
  },
  statusCode: code,
  body: JSON.stringify(data),
});

export const parseError = (e: any) => {
  if (typeof e === 'string') {
    const [code, ...m] = e.split(': ');
    const message = m.join(': ')
    if (code === 'NOT_FOUND') {
      return APIResponse.NotFound(message);
    } else if (code === 'BAD_REQUEST') {
      return APIResponse.BadRequest(message);
    } else if (code === 'FORBIDDEN') {
      return APIResponse.Forbidden(message);
    } else if (code === 'VALIDATION_FAILED') {
      return APIResponse.BadRequest(message, {code})
    } else if (code === 'DATA_ERROR') {
      return APIResponse.BadRequest(message, {code})
    } else if (code === 'ERROR') {
      return APIResponse.Error(message, {code});
    } else if (message) {
      return APIResponse.Error(message, {code});
    }
  } else if (typeof e === 'object') {
    const {code} = e
    if (code === 'VALIDATION_FAILED') {
      return APIResponse.BadRequest(e);
    }
  }

  return APIResponse.Error(e.toString());
}


export const APIResponse = {
  OK: (data: object) => response(200, data),
  NoContent: (message: string, data?: IData) => response(204, {message, ...data}),
  BadRequest: (message: string, data?: IData) => response(400, {message, ...data}),
  Unauthorized: (message: string, data?: IData) => response(401, {message, ...data}),
  Forbidden: (message: string, data?: IData) => response(403, {message, ...data}),
  NotFound: (message: string, data?: IData) => response(404, {message, ...data}),
  Conflict: (message: string, data?: IData) => response(409, {message, ...data}),
  Error: (message: string, data?: IData) => response(500, {message, ...data}),
  NotImplemented: (message: string, data?: IData) => response(501, {message, ...data}),
  parseError,
};

