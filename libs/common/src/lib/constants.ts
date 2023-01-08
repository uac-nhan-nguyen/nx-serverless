export const MAIN_TABLE = getEnv('MAIN_TABLE')
export const REGION = getEnv('REGION')
export const JWT_SECRET = () => getEnv('JWT_SECRET')
export const API_KEY = () => getEnv('API_KEY')

export const GSI1 = 'gsi1-index'


function getEnv(name: string): string {
  const a = process.env[name];
  if (!a) {
    throw `Missing ${name} in env`;
  }
  return a;
}

