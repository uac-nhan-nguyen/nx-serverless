'use strict';

const AWS = require('aws-sdk');
const fs = require('fs')
const os = require('os')

class getHttpApiPlugin {
  constructor(serverless, options, {log}) {
    this.serverless = serverless;
    this.options = options;
    this.configurationVariablesSources = {
      fetchHttpApi: {
        async resolve({address, params, resolveConfigurationProperty, __}) {
          const [serviceName] = params;
          if (!serviceName) throw 'No serviceName passed to fetchHttpApi'

          const [configuredRegion, configuredProfile] = await Promise.all([
            resolveConfigurationProperty(['provider', 'region']),
            resolveConfigurationProperty(['provider', 'profile'])
          ]);

          let region = options?.region ?? configuredRegion ?? undefined;
          let profile = options?.profile ?? configuredProfile ?? undefined;

          log.info(`Fetching HttpApi of [ Service : ${serviceName} ] in region ${region} with profile ${profile}`);

          const found = await getHttpApi(profile, region, serviceName);
          if (!found) {
            throw `HttpAPI not found`;
          }

          return {
            value: found?.ApiId
          }

        },
      },

      fetchAuthorizer: {
        async resolve({address, params, resolveConfigurationProperty, __}) {
          const [serviceName, authorizerName] = params;

          if (!serviceName) throw 'Missing serviceName in params';
          if (!authorizerName) throw 'Missing authorizerName in params';

          const [configuredRegion, configuredProfile] = await Promise.all([
            resolveConfigurationProperty(['provider', 'region']),
            resolveConfigurationProperty(['provider', 'profile'])
          ]);

          let region = options?.region ?? configuredRegion ?? undefined;
          let profile = options?.profile ?? configuredProfile ?? undefined;

          log.info( `Fetching Authorizer of [ Service : ${serviceName}, AuthorizerName : ${authorizerName} ] in region ${region} with profile (${profile})` );

          const found = await getHttpApi(profile, region, serviceName);
          if (!found) {
            throw `HttpAPI not found`;
          }

          const authorizer = await getAuthorizer(profile, region, found.ApiId, authorizerName)

          if (!authorizer) {
            throw Error('Authorizer not found');
          }

          return {
            value: authorizer.AuthorizerId
          }

        },
      },
    };
  }
}

const getHttpApi = async (profile, region, serviceName) => {
  const s = new AWS.ApiGatewayV2({
    region: region,
    credentials: getCredentials(profile)
  });
  const all = await s.getApis({
    MaxResults: '200'
  }).promise();

  const found = all.Items.find((i) => i.Name === serviceName);
  return found;
};

const getAuthorizer = async (profile, region, apiId, authorizerName) => {
  const s = new AWS.ApiGatewayV2({
    region: region,
    credentials: getCredentials(profile)
  });
  const authorizers = await s.getAuthorizers({
    ApiId: apiId,
    MaxResults: '10',
  }).promise()
  const found = authorizers.Items.find((i) => i.Name === authorizerName);
  return found
}

const getCredentials = (profile) => {
  if (profile == null) return undefined;
  const file = Buffer.from(fs.readFileSync(`${os.homedir()}/.aws/credentials`)).toString('utf-8');
  const lines = file.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith(`[${profile}]`)) {
      return new AWS.Credentials({
        accessKeyId: lines[i + 1].split('=')[1].trim(),
        secretAccessKey: lines[i + 2].split('=')[1].trim(),
      })
    }
  }
  throw `Profile ${profile} not found`
}

module.exports = getHttpApiPlugin;
