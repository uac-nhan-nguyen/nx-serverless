const { Stack, Duration, aws_cognito} = require('aws-cdk-lib');
// const sqs = require('aws-cdk-lib/aws-sqs');
const dynamo = require('aws-cdk-lib/aws-dynamodb');

class ResourceStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const env = 'dev';

    const mainTable = new dynamo.Table(this, `nx-test-${env}`, {
      partitionKey: { name: "PK", type: "S" },
      sortKey: { name: "SK", type: "S" },
      tableName: 'nx-test-dev',
      billingMode: "PAY_PER_REQUEST",
    })

    mainTable.addGlobalSecondaryIndex({
      indexName: 'gsi1-index',
      partitionKey: { name: "GSI1PK", type: "S" },
      sortKey: { name: "GSI1SK", type: "S" },
      projectionType: "ALL"
    })

    const userPool = new aws_cognito.UserPool(this, `nx-test-pool-${env}`, {
      userPoolName: `nx-test-pool-${env}`,
      // standardAttributes: {
      //   email:{
      //     required: true
      //   },
      // },

      signInAliases: {
        email: true,
      },
    })
    userPool.addClient(`nx-test-client-${env}`, {
      userPoolClientName: `nx-test-client-${env}`
    });


    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'ResourceQueue', {
    //   visibilityTimeout: Duration.seconds(300)
    // });
  }
}

module.exports = { ResourceStack }
