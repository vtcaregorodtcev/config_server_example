# API Gateway Lambda Template

## How to use?

You need an AWS account to have access to [AWS console](https://console.aws.amazon.com/iam/home#/security_credentials).

1. Click <b>`"Access keys (access key ID and secret access key)"`</b> tab and create Id and Key
2. Create or update <b>`~/.aws/config`</b> and <b>`~/.aws/credentials`</b> on your machine to setup profile with secrets which you got on the first step.

```bash
# ~/.aws/config

[rest-dev] # or rest-prod, configured in sls/profiles, applied from serverless.yml/stage
region = us-west-1 # or whatever you prefer
output = json
```

```bash
# ~/.aws/credentials

[rest-dev] # or rest-prod, configured in sls/profiles, applied from serverless.yml/stage
aws_access_key_id=YOUR_ID
aws_secret_access_key=YOUR_KEY
```

3. Then deploy.

```bash
pnpm run deploy
```

4. After deploy you can check your [api services](https://console.aws.amazon.com/apigateway/main/apis) under your AWS account and test endpoints.
5. If you want to use preconfigured profiles or other regions you can extend above command.

```bash
PROFILE=local REGION=us-west-2 pnpm run deploy
```
