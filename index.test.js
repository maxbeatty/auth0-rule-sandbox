/* globals test */
const assert = require('assert');

const auth0runner = require('./');

test('works', (done) => {
  const user = { name: 'tester' };

  const options = {
    user,
  };

  auth0runner('./test/rules/hello.js', options, (err) => {
    assert.ifError(err);
    assert.equal(user.hello, 'world');

    done();
  });
});

test('configuration', (done) => {
  const user = {};

  const options = {
    user,
    configuration: {
      place: 'world',
    },
  };

  auth0runner('./test/rules/hello.js', options, (err) => {
    assert.ifError(err);
    assert.equal(user.hello, 'world');

    done();
  });
});
