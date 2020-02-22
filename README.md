# secrets

## To-Do:
- Fix bug where message contains special characters (', ", etc.) can't be inserted into Dynamo
- Test against "SQL" injection attacks
- Run API on a lambda
- HTTPS support

## How to run this application:
- `npm i`
- `npm start`
- Navigate to http://localhost:3002 in the browser.  Try hitting the random secret endpoint: http://localhost:3002/secrets/random