/************** Require dependencies **************/
const express = require('express');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4');
const cmd = require('node-cmd');
const helpers = require('./helpers');
const responseObjects = require('./responseObjects');
const errorMessages = require('./errorMessages');


/************** Create the Express application **************/
const app = express();


/************** Configure Express middleware **************/
app.use(bodyParser.json())


/************** API endpoint routing **************/
app.get('/', (request, response) => {
    response.send('hello');
});

// GET a random secret message
app.get('/secrets/random', (request, response) => {
    response.send('secrets/random GET');
});

// POST a new secret message
app.post('/secrets', (request, response) => {
    // valiate body
    const isValidRequestBody = helpers.validateNewPostBody(request.body);

    if(!isValidRequestBody) {
        // return a 400 error to caller
        console.error('Invalid request body for new POST: ', request.body);
        const errors = [errorMessages.errors.secrets.invalid_request_body_structure];
        const errorResponse = responseObjects.generateErrorResponse(errors);
        response.status(400).json(errorResponse);
        return;
    }

    // generate uuid for this POST
    const uuid = uuidv4();

    // generate JSON object to write to DynamoDB
    const dynamoObjects = helpers.createDynamoDbObjects(uuid, request.body.message);
    const dynamoString = JSON.stringify(dynamoObjects.structured);

    // write object to DynamoDB
    cmd.get(`aws dynamodb put-item --table-name secrets --item '${dynamoString}' --return-consumed-capacity TOTAL`, (err, data) => {
        if(err) {
            // return a 503 error to the caller
            console.error('Error writing new POST to DynamoDB: ', err);
            console.error('Error writing to DynamoDB may be due to unescaped character in message string: ', request.body.message);
            const errors = [errorMessages.errors.secrets.failure_writing_to_database];
            const errorResponse = responseObjects.generateErrorResponse(errors);
            response.status(503).json(errorResponse);
        } else {
            // per API cookbook, set Location response header and return POST body with 201
            console.info('Result of DynamoDB put-item : ' ,data);
            response.set('Location', dynamoObjects.simple.href);
            response.status(201).json(dynamoObjects.simple);
        }
    });
});


/************** Start HTTP server **************/
app.listen('3002', () => {
    console.log('listening on http://localhost:3002');
});