const assert = require('assert');

const auth0runner = require('../');

const user = {};

const options = {
  user: user
};

auth0runner('./rules/hello.js', options, function (err, user, context) {
  assert.ifError(err);
  assert.equal(user.hello, 'world');
});
