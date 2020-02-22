// this method will take a list of error objects and generate an error response object
const generateErrorResponse = (errorList) => {
    if(errorList && errorList.length > 0) {
        let errors = [];

        // loop over each error and add it to the response
        errorList.forEach(error => {
            const errorObject = {
                code: error.code,
                message: error.message
            }
            console.error('error code: ', error.code);

            errors.push(errorObject);
        });

        // build the response object
        const errorResponse = {
            "errors": errors
        }
    
        return errorResponse;
    }

    console.error('The generateErrorResponse function was called without passing in a list of error objects');
    return null;
}

module.exports = {
    generateErrorResponse
}