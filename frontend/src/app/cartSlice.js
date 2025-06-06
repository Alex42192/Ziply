import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  customerName: '',
  address: '',
  pincode: '',
  latitude: null,
  longitude: null,
  products: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addCustomerInfo: (state, action) => {
      const { customerName, address, pincode, latitude, longitude } = action.payload;
      state.customerName = customerName;
      state.address = address;
      state.pincode =pincode;
      state.latitude = latitude;
      state.longitude = longitude;
    },
    addProductToCart: (state, action) => {
      state.products.push(action.payload);
    },
    clearCart: (state) => {
      state.customerName = '';
      state.address = '';
      state.pincode = '';
      state.latitude = null;
      state.longitude = null;
      state.products = [];
    },
  },
});

export const { addCustomerInfo, addProductToCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
