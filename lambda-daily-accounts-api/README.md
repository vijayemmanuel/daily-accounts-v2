<!--
title: 'Serverless Framework Node Express API service backed by DynamoDB on AWS'
description: 'This template demonstrates how to develop and deploy a simple Node Express API service backed by DynamoDB running on AWS Lambda using the Serverless Framework.'
layout: Doc
framework: v4
platform: AWS
language: nodeJS
priority: 1
authorLink: 'https://github.com/serverless'
authorName: 'Serverless, Inc.'
authorAvatar: 'https://avatars1.githubusercontent.com/u/13742415?s=200&v=4'
-->

# Serverless Framework Node Express API on AWS

This project uses serverless framework to develop and deploy a simple Node Express API service, backed by DynamoDB table, running on AWS Lambda using the Serverless Framework.

## Serverless Setup
Install the Serverless Framework globally via npm:

```
npm install -g serverless
```

Run the setup command and follow the prompts, or manually create a project directory with a serverless.yml file:
```
npm install -g serverless
```

## Usage

The Express.js application exposes two endpoints, `POST /expense` and `GET /expense/:yyyymm`, which create and retrieve a expense record.


### Deployment

Install dependencies with:

``` 
npm install
```

and then deploy with:

```
serverless deploy
```

After running deploy, you should see output similar to:

```
Deploying "aws-node-express-dynamodb-api" to stage "dev" (ap-south-1)

✔ Service deployed to stack aws-node-express-dynamodb-api-dev (109s)

endpoint: ANY - https://xxxxxxxxxx.execute-api.ap-south-1.amazonaws.com
functions:
  api: aws-node-express-dynamodb-api-dev-api (3.8 MB)
```

### Invocation

After successful deployment, you can create a new user by calling the corresponding endpoint:

```
curl --request POST 'https://xxxxxx.execute-api.ap-south-1.amazonaws.com/expense' --header 'Content-Type: application/json'
```

Which should result in the following response:

```json
{
    "message": [
        {
            "Date": "20260102",
            "Food": "1700",
            "Transport": "765",
            "Utility": "915",
            "Other": "54000",
            "Adhoc": "0"
        },
        {
            "Date": "20260103",
            "Food": "3814",
            "Transport": "0",
            "Utility": "0",
            "Other": "1300",
            "Adhoc": "0"
        }
    ]
}
```

### Local development

The easiest way to develop and test your function is to use the `dev` command:

```
serverless dev
```

This will start a local emulator of AWS Lambda and tunnel your requests to and from AWS Lambda, allowing you to interact with your function as if it were running in the cloud.

Now you can invoke the function as before, but this time the function will be executed locally. Now you can develop your function locally, invoke it, and see the results immediately without having to re-deploy.

When you are done developing, run `serverless deploy` to deploy the function to the cloud.
