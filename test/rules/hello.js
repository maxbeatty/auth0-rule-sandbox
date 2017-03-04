function (user, context, callback) {
  user.hello = 'world';
  console.log('===> set "hello" for ' + user.name);
  callback(null, user, context);
}
