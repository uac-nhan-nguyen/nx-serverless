export interface Environment {
  name: 'local' | 'dev' | 'stg' | 'prod';
  region: string;
  profile: string;
  jwtSecret: string;
  accessKeyId?: string,
  secretAccessKey?: string,
  dynamo: {
    endpoint?: string;
    tableName: string;
  };
}
