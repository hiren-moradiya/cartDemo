import {combineReducers} from 'redux';
import {ProductListReducer} from './ProductListReducer';

export const RootReducer: any = combineReducers({
  ProductList: ProductListReducer,
});
