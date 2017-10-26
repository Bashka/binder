module.exports = {
  Binder: require('./DefaultHandlers'),
  CompositeBinder: require('./CompositeBinder'),
  factory: {
    HandlersPipeFactory: require('./Factory/HandlersPipeFactory'),
    NodeBindersFactory: require('./Factory/NodeBindersFactory')
  }
};
