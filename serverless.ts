import type { Serverless } from "serverless/aws";

const serverlessConfiguration: Serverless = {
  service: {
    name: "serverless-mailer",
  },
  frameworkVersion: ">=1.72.0",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
  plugins: ["serverless-webpack"],
  provider: {
    name: "aws",
    runtime: "nodejs12.x",
    region: "ap-southeast-2",
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "ses:SendEmail",
        Resource: ["*"],
      },
    ],
  },
  functions: {
    sendEmail: {
      handler: "handler.sendEmail",
      events: [
        {
          http: {
            method: "post",
            path: "sendEmail",
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;
