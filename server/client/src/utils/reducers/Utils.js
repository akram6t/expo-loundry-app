import { createSlice } from
 
'@reduxjs/toolkit';

const initialState = {
  value: {
    baseUrl: 'http://localhost:5000'
  }
};

const counterSlice = createSlice({
name: 'utils',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

export const { increment, decrement } = counterSlice.actions;

export default counterSlice.reducer;