# Flixcheck JavaScript SDK

Welcome to the [Flixcheck](https://www.flixcheck.de) JavaScript SDK!

## Getting started

### 1. Install the library

`npm install flixcheck-javascript-sdk`

### 2. Require the module

`const flixcheck = require("flixcheck-javascript-sdk");`

### 3. Instantiate a new `FlixcheckClient`

We strongly advise to not write the Flixcheck User ID and its API key in your code. Use process environment variables instead. Given the User ID and API key are stored in local variables `userId` and `apiKey` respectively, create a new client like this:

`const client = new flixcheck.FlixcheckClient(userId, apiKey)`

You can optionally provide more options as third parameter:

```
{
    "endpoint": "https://preview.flixcheck.de"
}
```

### 4. Start using it!

E.g. get a check:

```
client.getCheck(checkId)
    .then((check) => {
        console.log("Check Subject:", check.subject);
    })
    .catch((error) => {
        console.error("Cannot receive check:", error);
    })
```

## Functions

_ToDo_
