# Nx Serverless ajv flavor

Default aws profile is `nx-test`


## Features

- [x] CDK for resource management
- [x] Update `http-handler` generator
- [x] Update `model` generator
- [x] Access dev DB from local
- [x] Remove DB creation
- [ ] Add cognito auth
- [ ] Watch changes when serve
- [x] Service generator
- [ ] Support aws layer
- [ ] nx logs lambda
- [ ] nx deploy function only
- [x] serverless config only 1 version lambda 
- [x] Simple ping-get
- [x] Simple ping-post
- [x] Simple ping-list
- [x] Simple Ping model

## How To

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

### Add new lambda controller

### Print lambda logs
```shell
nx logs <SERVICE_NAME> --function=<FUNCTION_NAME>
```

Example: `nx logs ping --function=get`

### Delete a service

1. Delete the folder
2. Delete declaration in `workspace.json`

