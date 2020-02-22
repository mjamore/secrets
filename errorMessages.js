const errors = {
    secrets: {
        invalid_request_body_structure: {
            code: "secrets.invalid_request_body_structure",
            message: 'When posting a new secret to the /secrets endpoint, the request body must be in the following JSON format: {"message": "[NEW_SECRET_MESSAGE_HERE]"}.'
        },
        failure_writing_to_database: {
            code: "secrets.failure_writing_to_database",
            message: 'An error occurred while attempting to write record to database.'
        }
    }
}

module.exports = {
    errors
}