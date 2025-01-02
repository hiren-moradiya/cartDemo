import {types} from '../../action/Types';

const initialState = {
  ProductListLoading: false,
  ProductListSuccess: [],
  ProductListError: '',
};

/**
 * get user's friend activity reducer
 */
export const ProductListReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case types.GET_PRODUCT_LOADING:
      return {
        ...state,
        ProductListLoading: true,
      };

    case types.GET_PRODUCT_SUCCESS:
      return {
        ...state,
        ProductListLoading: false,
        ProductListSuccess: action.payload,
        ProductListError: '',
      };

    case types.GET_PRODUCT_ERROR:
      return {
        ...state,
        ProductListLoading: false,
        ProductListSuccess: [],
        ProductListError: action.payload,
      };

    default:
      return {
        ...state,
      };
  }
};
