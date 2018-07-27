import { createStore, applyMiddleware, compose } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
// import { browserHistory } from 'react-router';
import _history from '../util/history'
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';
import ajaxMiddleware from './ajaxMiddleware'

const initialState = {};
// for redux-tools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const createStoreWithMiddleware = composeEnhancers(applyMiddleware(
	thunkMiddleware, ajaxMiddleware
))(createStore);

const store = createStoreWithMiddleware(rootReducer, initialState);
export const history = syncHistoryWithStore(_history, store);

window.store = store;
export default store;

