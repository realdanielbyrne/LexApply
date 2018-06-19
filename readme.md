# Lex Apply 

A sample lambda microservice application that is used by Amazon Lex for configuration and validation of responses in the CandidateQualifer chat bot.

## Setup & Deployment
Deploying the demo will require [npm](https://www.npmjs.com/), the [AWS CLI](https://aws.amazon.com/cli/), and an AWS account. The AWS credentials for that account should be [set up in the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html).

First, download the dependencies using `npm`:

    npm install


[ClaudiaJs](https://claudiajs.com/) makes it easy to deploy Node.js projects to AWS Lambda and API Gateway. It automates all the error-prone deployment and configuration tasks, and sets everything up the way JavaScript developers expect out of the box.

Send this function to AWS using Claudia. You will need to specify the main method for the Lambda to execute (in the Lambda terminology, that’s the handler). The syntax is module.method. Because the main micro-service module is lambda.js, and the method is handler, this argument should be lambda.handler. (Note that you need to use the module name, not the file name).

    claudia create --region us-east-1 --handler index.handler

The webUI is a clone of the [lex-web-ui](https://github.com/aws-samples/aws-lex-web-ui) demo project. 
The easiest way to test drive the chatbot UI is to deploy it using the
[AWS CloudFormation](https://aws.amazon.com/cloudformation/) templates
provided in teh project. Once you have launched the CloudFormation stack,
you will get a fully working demo site hosted in your account.


1. Click this button to launch the CloudFormation install process:

<a target="_blank" href="https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=lex-web-ui&templateURL=https://s3.amazonaws.com/aws-bigdata-blog/artifacts/aws-lex-web-ui/artifacts/templates/master.yaml"><span><img height="24px" src="https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png"/></span></a>

2. In the Lex Bot Configuration Parameters section, for BotName, type your bot’s name.
3. In the Web Application Parameters section, complete each of the parameters.

Note: It’s essential that you use your site’s origin for WebAppParentOrigin if you are hosting the ui on your own site.
Also, make sure you deploy your lambda and your chatbot to the same AWS availability region. The CloudFormation
stack installs the chatbot ui in us-east-1 by default.



