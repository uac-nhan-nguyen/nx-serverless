# Nx Serverless ajv flavor

Default aws profile is `nx-test`
Default environment is `dev`

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

## How To

### Deploy function only

```shell
nx upload <SERVICE_NAME> --function=<FUNCTION_NAME>
```

Example: `nx upload ping --function=post`

### Logs a function

```shell
nx logs <SERVICE_NAME> --function=<FUNCTION_NAME>
```

Example: `nx logs ping --function=get`

### Deploy all affected service

```shell
nx affected --target=deploy --all
```

### Add new service

```shell
yarn g:service <SERVICE_NAME>
```

Example: `yarn g:service ping`

A new service is equivalent to a new CloudFormation Stack. Service should only create new lambdas. Resources such as
DynamoDB, Cognito User Pool, Secrets Manager are created and managed separately

### Add new http controller

```shell
yarn g:http-handler
```

### Add new service

```shell
yarn g:service <SERVICE_NAME>
```

Example: `yarn g:service ping`

### Add new lambda controller

TODO

### Delete a service

1. Delete the folder
2. Delete declaration in `workspace.json`

### Use another environment

Append `NODE_ENV=<ENV>` in front of the command

Example `NODE_ENV=prod nx logs ping --function=post`
