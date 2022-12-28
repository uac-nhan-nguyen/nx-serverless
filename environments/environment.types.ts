export interface Environment {
  name: 'local' | 'dev' | 'stg' | 'prod';
  region: string;
  profile: string;
  jwtSecret: string;
  accessKeyId?: string,
  secretAccessKey?: string,
  cognito: {
    poolId: string,
    clientId: string,
  },
  dynamo: {
    endpoint?: string;
    tableName: string;
  };
}
