// when a new POST is make to the /secrets endpoint, validate that the request body is valid
const validateNewPostBody = (requestBody) => {
    // requirements: JS object with a message property that is a non empty string
   let isValidRequestBody = false;

    if(
        requestBody && 
        requestBody.message && 
        typeof requestBody.message === 'string' && 
        requestBody.message.length > 0
    ) {
        isValidRequestBody = true;    
    }
    
    return isValidRequestBody;
}

// create obects to write to DynamoDB and to return to the API caller
const createDynamoDbObjects = (uuid, message) => {
    // get the current timestamp
    const date = new Date();
    const formattedDate = date.toISOString();

    // create the strucutred DB object that can be written to the DB
    const dynamoStructuredObject = {
        uuid: {'S': uuid},
        message: {'S': escapeString(message)},
        likes: {'N': '0'},
        dislikes: {'N': '0'},
        socialSharing: {
            'M': {
                facebook: {'N': '0'},
                twitter: {'N': '0'}
            }
        },
        href: {'S': `https://api.mjamore.com/secrets/id/${uuid}`},
        createdOn: {'S': formattedDate},
        updatedOn: {'S': formattedDate}
    }

    // create a simpler version of the object for returning a response to the API caller
    const dynamoSimpleObject = {
        uuid: uuid,
        message: escapeString(message),
        likes: '0',
        dislikes: '0',
        socialSharing: {
            facebook: '0',
            twitter: '0'
        },
        href: `https://api.mjamore.com/secrets/id/${uuid}`,
        createdOn: formattedDate,
        updatedOn: formattedDate
    }

    const dynamoObjects = {
        structured: dynamoStructuredObject,
        simple: dynamoSimpleObject
    }

    return dynamoObjects;
}

// To-Do: Properly escape any weird characters that will break when we write to DynamoDB
const escapeString = (string) => {
    return string.replace(/'/g, "\'");
}

module.exports = {
    validateNewPostBody,
    createDynamoDbObjects
};