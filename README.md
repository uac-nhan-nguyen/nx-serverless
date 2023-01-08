# Nx Serverless ajv flavor

## Todos

- [x] CDK for resource management
- [x] Access dev DB from local
- [x] Remove DB creation
- [ ] Add cognito auth
- [ ] Add api authorizer
- [ ] Watch changes when serve
- [ ] Support aws layer?
- [x] nx logs lambda -> `nx logs ping --function=post`
- [x] nx deploy function only -> `nx upload ping --function=post`
- [x] Update `http-handler` generator templates
- [x] Update `model` generator templates
- [x] Update `service` generator templates
- [x] serverless config only 1 version lambda
- [x] Simple ping-get
- [x] Simple ping-post
- [x] Simple ping-list
- [x] Simple Ping model
- [ ] Add vite frontend portal
- [ ] Add nextjs frontend
- [ ] Document for file layout
- [ ] Add HttpAPI service


## Resource
Resources such as S3, DynamoDB, Cognito are managed separately using CDK in [resource folder](./resource).

Commands

```shell
cdk diff --profile nx-test
cdk deploy --profile nx-test
```

## Deployment

### Commands 

```shell
# Deploy function only
nx upload <SERVICE_NAME> --function=<FUNCTION_NAME>
nx upload ping --function=post

# Logs a function
nx logs <SERVICE_NAME> --function=<FUNCTION_NAME>
nx logs ping --function=get

# Deploy all affected service
nx affected --target=deploy --all

# Build all affected service
nx affected --target=build --all
```

### Configure AWS Profile and Region

Default AWS profile and region is configurable in [environment.ts](services/environments/environment.ts);

### Use another environment

Append `NODE_ENV=<ENV>` in front of the command

Example `NODE_ENV=prod nx logs ping --function=post`

Environments are configurable in [environments folder](services/environments)

## Generate Codes

A new service is equivalent to a new CloudFormation Stack. Service should only create new lambdas. Resources such as
DynamoDB, Cognito User Pool, Secrets Manager are created and managed separately

### Commands

```shell
# Generate new service
yarn g:service <SERVICE_NAME>
yarn g:service ping

# Generate new http controller
yarn g:http-handler

# Generate new lambda controller
# TODO update doc

# Generate library
nx g lib <LIBRARY_NAME>
```

### Delete a service

1. Delete the folder
2. Delete declaration in `workspace.json`



## File layout

Layout for multiple independent services:

```
./
├─ libs/
├─ service-A/
|  ├─ serverless.base.yml
|  ├─ serverless.provider.yml
├─ service-B/
```
