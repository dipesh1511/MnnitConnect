import { createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";

const cookie = new Cookies();
const initialState = {
  signupData: null,
  loading: false,
  token: cookie.get("token") ? cookie.get("token") : null,
  user: cookie.get("user") ? cookie.get("user") : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, value) {
      state.signupData = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
    },
    setUser(state, value) {
      state.user = value.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setSignupData, setLoading, setToken, setUser, clearUser } =
  authSlice.actions;

export default authSlice.reducer;
