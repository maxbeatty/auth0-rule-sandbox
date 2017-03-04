# auth0-rule-sandbox
Provides a test environment for Auth0 Rules similar to their sandbox environment.

## Example

Assuming you have a GitHub repository to deploy rules, pages, and custom database connections to Auth0 ([see example](https://github.com/auth0-samples/github-source-control-integration)), then this module will allow you to run your rules locally with controlled inputs.

`rule.js`:

```js
function example(user, context, callback) {
  // TODO: implement your rule
  callback(null, user, context);
}
```

`rule.test.js`:
```js
const auth0runner = require('auth0-rule-sandbox');

const options = {
  user: {
    name: 'test'
  },
  context: {
    clientID: '123456789'
  },
  configuration: {
    key: 'value'
  },
  globals: {
    request: require('request')
  }
};

auth0runner('./relative/path/to/your/rule.js', options, function(err, user, context) {
  if (err) {
    console.error(err);
  } else {
    // TODO: assertions
    console.log(user, context);
  }
});
```

## Usage

Exports a function that takes arguments:

- `path` (string): relative path to your rule file
- `options` (object):
  - `user` (object): represents the logged in user that's passed through the Rules pipeline
  - `context` (object): contains contextual information about the current authentication transaction
  - `configuration` (object): key-value settings from the [Rules UI](https://manage.auth0.com/#/rules)
  - `globals` (object): See section below
- `callback` (function): send back the potentially modified user and context objects back to Auth0 (or an error)

## Bring Your Own Dependencies

It looks like Auth0 Rules run in Node.js v4.4.5 based on `console.log(process.version)`. [These modules are provided](https://auth0.com/docs/appliance/modules) as part of the `global` object but not populated by this module. Instead, you can pick and choose which global modules are populated and how (actual vs mock).

```js
const options = {
  // ...
  globals: {
    auth0: {
      users: {
        updateAppMetadata: function () { return Promise.resolve() }
      }
    },
    jwt: require('jsonwebtoken')
  }
}
```

### built-in

These global properties are provided from the parent Node context:

- process
- Buffer
- clearImmediate
- clearInterval
- clearTimeout
- setImmediate
- setInterval
- setTimeout
- console

### require

[Additional modules can be required](https://tehsis.github.io/webtaskio-canirequire/) but you'll have to roll your own `require` shim until one is added here.
