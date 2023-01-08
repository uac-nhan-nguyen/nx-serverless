/**
 *  Load env vars into Serverless environment
 *  You can do more complicated env var resolution with dotenv here
 */
const dotenv = require('dotenv');

module.exports = async ({ options }) => {
  const stage = options.stage ?? 'dev';
  const path = `${__dirname}/.env.${stage}`;
  console.log('Loading env from', path);

  const envVars = dotenv.config({ path: path }).parsed;
  return Object.assign(
    {},
    envVars // `dotenv` environment variables
  );
};
