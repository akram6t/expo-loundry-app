import { createSlice } from
 
'@reduxjs/toolkit';

const initialState = {
  value: [
    {
      _id: "656f279191d80eb75fca3dd9",
      icon: "/icons/icon_order_confirmed.png",
      tag: "Confirmed",
      color: "#638585",
      position: 1,
      status: 'Active'
    },
    {
      _id: "656f279191d80eb75fca3dda",
      icon: "/icons/icon_order_pickup.png",
      tag: "Pickup",
      color: "#00B7C8",
      position: 2,
      status: 'Active'
    },
    {
      _id: "656f279191d80eb75fca3ddb",
      icon: "/icons/icon_order_process.png",
      tag: "InProgress",
      color: "#FFA500",
      position: 3,
      status: 'Active'
    },
    {
      _id: "656f279191d80eb75fca3ddc",
      icon: "/icons/icon_order_shipped.png",
      tag: "Shipped",
      color: "#1E0080",
      position: 4,
      status: 'Active'
    },
    {
      _id: "656f279191d80eb75fca3ddd",
      icon: "/icons/icon_order_delivered.png",
      tag: "Delivered",
      color: "#008000",
      position: 5,
      status: 'Active'
    },
    {
      _id: "656f279191d80eb75fca3ddd",
      icon: "/icons/order_returned.png",
      type: 'cancelled',
      tag: "Returned",
      color: "#800000",
      position: 6,
      status: 'Active'
    },
  ]
};

const counterSlice = createSlice({
name: 'orderstatus',
  initialState,
  reducers: {
    addorderStatus: (state, action) => {
      // state.value += 1;
        action.payload.forEach(element => {
          state.value.push(element);
        });
    },
    clearOrderStatus: (state) => {
      state.value = [];
    },
  },
});

export const { addorderStatus, clearOrderStatus } = counterSlice.actions;

export default counterSlice.reducer;