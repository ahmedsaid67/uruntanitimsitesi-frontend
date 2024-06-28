import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import loginSlice from"../context/features//auth/loginSlice";
import userSlice from "../context/features/user/userSlice";
import messageSlice from "../context/features/message/messageSlice";


const combinedReducer = combineReducers({
    login: loginSlice,
    message: messageSlice,
    user: userSlice,
  });
  
  const reducer = (state, action) => {
  
    switch (action.type) {
      case HYDRATE:
        return { ...state, ...action.payload };
      case "TICK":
        return { ...state, tick: action.payload };
      default:
        return combinedReducer(state, action);
    }
  };
  export const makeStore = () =>
    configureStore({
      reducer,
    });
  
  export const wrapper = createWrapper(makeStore);
