import { configureStore } from
 
'@reduxjs/toolkit';
import counterReducer from './utils/reducers/OrderStatus';
import UtilsReducer from './utils/reducers/Utils';

export const store = configureStore({
  reducer: {
    orderstatus: counterReducer,
    utils: UtilsReducer
  },
});