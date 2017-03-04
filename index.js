const path = require('path');
const fs = require('fs');
const vm = require('vm');

// uses error stack to determine who called this module
function getCaller() {
  var stack, traceFn;
  traceFn = Error.prepareStackTrace;
  Error.prepareStackTrace = function(err, stack) {
    return stack;
  };
  stack = (new Error()).stack;
  Error.prepareStackTrace = traceFn;
  return stack[2].getFileName();
};

module.exports = function(rulePath, options, cb) {
  // get rule
  const ruleFile = path.resolve(path.dirname(getCaller()), rulePath);
  const ruleCode = fs.readFileSync(ruleFile, { encoding: 'utf8' });

  // wrap in IIFE applying arguments
  const code = '(' + ruleCode + ')(__runner.user, __runner.context, __runner.callback)';

  // execute in VM w/ context
  const script = new vm.Script(code)

  const globals = {
    process: process,
    Buffer: Buffer,
    clearImmediate: clearImmediate,
    clearInterval: clearInterval,
    clearTimeout: clearTimeout,
    setImmediate: setImmediate,
    setInterval: setInterval,
    setTimeout: setTimeout,
    console: console,

    __runner: {
      user: options.user,
      context: options.context,
      callback: cb
    }
  }

  script.runInNewContext(Object.assign(globals, options.globals || {}), {
    filename: rulePath
  });
}
