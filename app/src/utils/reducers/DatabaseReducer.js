import { createSlice } from "@reduxjs/toolkit";

export const PathSlice = createSlice({
    name:"path",
    initialState:{
        path: {
            baseUrl: 'http://192.168.43.101:5000',
            apikey: 'c2964966ece452dba2b8d4c029c8d73'
        },
    },
    reducers:{
       setPath:(state, action) => {
        state.path = action.payload
       }
    }
});


export const { setPath } = PathSlice.actions;

export default PathSlice.reducer;