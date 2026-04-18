import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

// store consists of slices
const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
