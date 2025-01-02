import axios from 'axios';
import {Dispatch} from 'redux';
import {types} from '../Types';

const getProductListLoading = () => {
  return {
    type: types.GET_PRODUCT_LOADING,
  };
};

const getProductListSuccess = (data: any) => {
  return {
    type: types.GET_PRODUCT_SUCCESS,
    payload: data,
  };
};

const getProductListError = (error: any) => {
  return {
    type: types.GET_PRODUCT_ERROR,
    payload: error,
  };
};

export const getProductList = () => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(getProductListLoading());
      const response = await axios.get('https://fakestoreapi.com/products');
      dispatch(getProductListSuccess(response?.data));
    } catch (error) {
      dispatch(getProductListError(error));
    }
  };
};
