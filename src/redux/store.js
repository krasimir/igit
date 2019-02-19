import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

// import rootSaga from './saga';
import rootReducer from './reducer';

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer);

// sagaMiddleware.run(rootSaga);

export default store;
