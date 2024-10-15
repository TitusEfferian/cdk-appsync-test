import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as appsync from "aws-cdk-lib/aws-appsync";
import * as path from "path";
import * as logs from "aws-cdk-lib/aws-logs";
export class AppsyncTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const api = new appsync.GraphqlApi(this, "MyGraphqlAPI", {
      name: "MyGraphqlAPI",
      definition: appsync.Definition.fromFile(
        path.join(__dirname, "schema.graphql")
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
            name: "1 year api key",
            description: "1 year api key",
          },
        },
      },
      logConfig: {
        fieldLogLevel: appsync.FieldLogLevel.ALL,
        retention: logs.RetentionDays.ONE_DAY,
      },
    });

    const noneDS = new appsync.NoneDataSource(this, "NoneDataSource", {
      api,
      name: "NoneDataSource",
      description: "None Data Source",
    });

    const firstFunction = new appsync.AppsyncFunction(this, "FirstFunction", {
      api: api,
      dataSource: noneDS,
      name: "FirstFunction",
      description: "FirstFunction",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset(
        path.join(__dirname, "function", "first-function.js")
      ),
    });

    const secondFunction = new appsync.AppsyncFunction(this, "SecondFunction", {
      api: api,
      dataSource: noneDS,
      name: "SecondFunction",
      description: "SecondFunction",
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      code: appsync.Code.fromAsset(
        path.join(__dirname, "function", "second-function.js")
      ),
    });

    new appsync.Resolver(this, "ListDemoPipeline", {
      api,
      typeName: "Query",
      fieldName: "listDemos",
      code: appsync.Code.fromAsset(
        path.join(__dirname, "resolver", "listDemosResolver.js")
      ),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
      pipelineConfig: [firstFunction, secondFunction],
    });
  }
}
