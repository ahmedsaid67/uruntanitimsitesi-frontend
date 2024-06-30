import { createSlice } from '@reduxjs/toolkit';
import axios from "axios";
import { setUser,userLoggedOut } from '../user/userSlice';
import { showMessage } from "../message/messageSlice";
import { deleteTokenFromCookie } from "../lib/common";
import {  storeTokenInCookie } from "../lib/common";

import {API_ROUTES} from "../../../utils/constants"



export const submitLogin = (username, password) => async (dispatch) => {
  try {
    dispatch(loginLoading());
    const response = await axios.post(API_ROUTES.TOKEN, { username, password });
    storeTokenInCookie(response.data.token);
    axios.defaults.headers.common["Authorization"] = `Token ${response.data.token}`;

    const userInfoResponse = await axios.get(API_ROUTES.USER_INFO);
    dispatch(setUser(userInfoResponse.data));
    dispatch(loginSuccess());
    dispatch(showMessage({ message: "Başarılı giriş", variant: "success" }));
    
    
  } catch (err) {
    console.error("Giriş sırasında hata oluştu: ", err);
    const errorMessage ="Giriş başarısız";
    dispatch(showMessage({ message: errorMessage, variant: "error" }));
    dispatch(loginError(errorMessage));
  } finally {
    dispatch(loginLoadingDone());
  }
};


export const submitLogout = () => async (dispatch) => {
  try {
    const response = await axios({
      method: "post",
      url: API_ROUTES.LOGOUT,
    });
    if (response?.data?.detail) {
      console.log("Something went wrong during logout: ", response);
      return;
    }
    axios.defaults.headers.common["Authorization"] = null;
    deleteTokenFromCookie();
    dispatch(userLoggedOut());
    dispatch(logout());
    dispatch(
      showMessage({
        message: "Oturum kapatıldı.",
        variant: "success",
      })
    );
    console.log("Logout response:", response);
  } catch (err) {
    console.log("Error during logout:", err);

      dispatch(
        showMessage({
          message:  "Oturum kapatılamadı",
          variant: "error",
        })
      );

  } 
};


const initialState= {
  success: false,
  loading: false,
  errors: [],
}

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    loginLoading: (state, action) => {
      state.loading = true;
    },
    loginLoadingDone: (state, action) => {
      state.loading = false;
    },
    loginSuccess: (state, action) => {
      state.success = true;
      state.errors = [];
    },
    loginError: (state, action) => {
      state.success = false;
      state.errors = action.payload;
    },
    logout: (state) => {
      state.success = false;
    },
  },
});

export const {
  loginLoading,
  loginLoadingDone,
  loginSuccess,
  loginError,
  logout,
} = loginSlice.actions;

export default loginSlice.reducer;
