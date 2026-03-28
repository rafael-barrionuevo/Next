import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import subscriptionReducer from "./subscriptionSlice";


export const store = configureStore({
  reducer: {
    user: userReducer,
    subscription: subscriptionReducer
  }
});


//store