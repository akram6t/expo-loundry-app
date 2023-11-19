import { createSlice } from "@reduxjs/toolkit";

export const PathSlice = createSlice({
    name:"path",
    initialState:{
        path: {
            baseUrl: ''
        },
    },
    reducers:{
       setPath:(state, action) => {
        state.path.baseUrl = action.payload
       }
    }
});


export const { setPath } = PathSlice.actions;

export default PathSlice.reducer;