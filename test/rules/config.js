function (user, context, callback) {
  user.hello = configuration.place;
  callback(null, user, context);
}
