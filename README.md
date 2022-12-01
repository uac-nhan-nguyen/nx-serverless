Nx Serverless ajv flavor

[ ] Update `http-handler` generator
[x] Access dev DB from local
[x] Remove DB creation
[ ] Add cognito auth
[ ] Watch changes when serve
[ ] Simple ping
[x] Service generator
[ ] Model generator
[ ] Support aws layer
[ ] nx logs lambda
[ ] nx deploy function only

# How To

## Add new service

```shell
yarn g:service <SERVICE_NAME>
```

Example: `yarn g:service ping`

A new service is equivalent to a new CloudFormation Stack. Service should only create new lambdas. Resources such as
DynamoDB, Cognito User Pool, Secrets Manager are created and managed separately

## Add new http controller 
```shell
yarn g:http-handler
```

## Add new lambda controller

## Print lambda logs
```shell
nx logs <SERVICE_NAME> --function=<FUNCTION_NAME>
```

Example: `nx logs ping --function=get`

## Delete a service
1. Delete the folder
2. Delete declaration in `workspace.json`

