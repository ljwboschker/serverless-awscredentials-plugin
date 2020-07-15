# serverless-awscredentials

[npm version](https://img.shields.io/npm/v/serverless-awscredentials.svg?style=flat)](https://www.npmjs.com/package/serverless-awscredentials)

This plugin will preload the AWS_REGION, AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY variables into serverless, based on the configuration you created using `aws configure`.

The AWS_REGION is loaded from the `~/.aws/config` file. The access and secret access key are loaded from the `~/.aws/credentials` file.

You can use this if you need access to read AWS services from your Lambdas.

### Install and Setup

```
> npm install --save-dev serverless-awscredentials-plugin
```

Next, add the plugin to your serverless configuration:

```
service: mine

plugins:
    - serverless-awscredentials-plugin
```

You can configure which profile to use:

```
custom:
    awscredentials:
        profile: my-profile
```

If not specified, the default profile will be used.

### Usage

The variables are now loaded in serverless and can be accessed by any Lambda as environment variables.