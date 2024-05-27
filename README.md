# Build on Weekly, S03E17

Hello and welcome! Here you can find some code for the **[Build on Weekly](https://community.aws/livestreams/build-on-weekly)** S03E17. It's not perfect, and it's not meant to be :) Play with it and feel free to make things fail, that's where the fun begins!

The AWS infrastructure is created and managed by [AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/home.html). The application code is in TypeScript.

## Prerequisites
* Node.js 20.x
* npm
* TypeScript 2.7 or later (`npm -g install typescript`)
* AWS CLI
  * Configure AWS account credentials and region (`aws configure`)
* AWS CDK (`npm install -g aws-cdk`)
  * Bootstrap CDK resourses (`cdk bootstrap aws://ACCOUNT-NUMBER/REGION`)

## Useful commands

 * `npm install`     install project dependencies 
 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emit the synthesized CloudFormation template
 * `cdk destroy`     destroy this stack from your AWS account

## Lambda functions

The two lambda functions that act as a Kinesis producer and a Kinesis consumer are in the `lambdas` directory. The lambda code itself is Node.js.

### Deploying lambdas

From the corresponding lambda directories, run
```
  npm i --omit=dev
```

After that, the actual deployment is handled by the CDK, along with the rest of the AWS resources (`cdk deploy` from the root directory).
