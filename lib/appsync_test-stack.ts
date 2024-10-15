import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as path from 'path';
export class AppsyncTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const api = new appsync.GraphqlApi(this, 'MyGraphqlAPI', {
      name: 'MyGraphqlAPI',
      definition: appsync.Definition.fromFile(path.join(__dirname, 'schema.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        }
      }
    });

    const noneDS = new appsync.NoneDataSource(this, 'NoneDataSource', {
      api,
      name: 'NoneDataSource',
      description: 'None Data Source',
    });

    new appsync.Resolver(this, 'PipelineResolver', {
      api,
      typeName: 'Query',
      dataSource: noneDS,
      fieldName: 'listDemos',
      code: appsync.Code.fromInline(`
        // The before step
        export function request(...args) {
          console.log(args);
          return {}
        }
    
        // The after step
        export function response(ctx) {
          return [
            { id: 'demo1', version: '1.0' },
            { id: 'demo2', version: '2.0' }
          ];
        }
      `),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

    new appsync.Resolver(this, 'NameFieldResolver', {
      api,
      typeName: 'demo',
      fieldName: 'name', 
      dataSource: noneDS, 
      code: appsync.Code.fromInline(`
        // Resolver for 'name' field
        export function request(ctx) {
          // You can add any logic here to fetch or compute the name
          return {};
        }

        export function response(ctx) {
          // Returning a fixed name value for demonstration purposes
          return 'hello world';
        }
      `),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });
  }
}
