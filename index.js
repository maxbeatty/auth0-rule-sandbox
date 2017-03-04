const path = require('path');
const fs = require('fs');
const vm = require('vm');

// uses error stack to determine who called this module
function getCaller() {
  const traceFn = Error.prepareStackTrace;
  Error.prepareStackTrace = function prepareStackTrace(err, stack) {
    return stack;
  };
  const stack = (new Error()).stack;
  Error.prepareStackTrace = traceFn;
  return stack[2].getFileName();
}

module.exports = function auth0runner(rulePath, options, cb) {
  // get rule
  const ruleFile = path.resolve(path.dirname(getCaller()), rulePath);
  const ruleCode = fs.readFileSync(ruleFile, { encoding: 'utf8' });

  // wrap in IIFE applying arguments
  const code = `(${ruleCode})(__runner.user, __runner.context, __runner.callback)`;

  // execute in VM w/ context
  const script = new vm.Script(code);

  const globals = {
    process,
    Buffer,
    clearImmediate,
    clearInterval,
    clearTimeout,
    setImmediate,
    setInterval,
    setTimeout,
    console,

    configuration: options.configuration,

    __runner: {
      user: options.user,
      context: options.context,
      callback: cb,
    },
  };

  script.runInNewContext(Object.assign(globals, options.globals || {}), {
    filename: rulePath,
  });
};
