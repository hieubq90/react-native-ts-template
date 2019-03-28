import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();
let m = [sagaMiddleware];
if (__DEV__) {
  const { logger } = require("redux-logger");
  m.push(logger);
}
export const middlewares = m;
