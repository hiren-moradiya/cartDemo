import {createStore, applyMiddleware} from 'redux';
import {RootReducer} from './reducer';
import {thunk} from 'redux-thunk';

const store = createStore(RootReducer, applyMiddleware(thunk));

export type RootState = ReturnType<typeof RootReducer>;

export default store;
