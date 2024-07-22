import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instanceUserService from "../../api/UserService";

const storedUser = JSON.parse(localStorage.getItem("user"));
const storedIsLight = JSON.parse(localStorage.getItem("isLight"));

const initialState = {
  isLoggedIn: false,
  error: null,
  email: storedUser?.user.email || null,
  token: storedUser?.user.token || null,
  username: storedUser?.user.username || null,
  image: storedUser?.user.image || null,
  loginStatus: null,
  registerStatus: null,
  reloading: false,
  editProfileStatus: null,
  password: null,
  isLight: storedIsLight?.isLight || false,
};

export const createUser = createAsyncThunk(
  "user/register",

  async function (data, { rejectWithValue }) {
    try {
      return await instanceUserService.registerAccount(data);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);
export const login = createAsyncThunk(
  "user/login",

  async function (data, { rejectWithValue }) {
    try {
      return await instanceUserService.login(data);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);
export const editProfile = createAsyncThunk(
  "user/edit",

  async function ({ data, token }, { rejectWithValue }) {
    try {
      return await instanceUserService.editProfile(data, token);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loggedIn(state) {
      state.isLoggedIn = true;
    },
    remove(state) {
      state.email = null;
      state.token = null;
      state.username = null;
      state.image = null;
      state.isLoggedIn = false;
    },
    clearRegisterData(state) {
      state.error = null;
      state.registerStatus = "idle";
      state.loginStatus = "idle";
      state.editProfileStatus = "idle";
    },
    clearLoginData(state) {
      state.loginStatus = "idle";
      state.error = null;
    },
    setTheme(state) {
      state.isLight = !state.isLight;
      localStorage.setItem("isLight", state.isLight);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.registerStatus = "loading";
        state.error = null;
        state.reloading = true;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.registerStatus = "loading";
        state.error = action.payload;
        state.reloading = false;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.registerStatus = "succeeded";
        state.reloading = false;
      })
      .addCase(login.pending, (state) => {
        state.loginStatus = "loading";
        state.error = null;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loginStatus = "failed";
        state.error = action.payload;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loginStatus = "succeeded";
        state.isLoggedIn = true;
        state.email = action.payload.user.email;
        state.token = action.payload.user.token;
        state.username = action.payload.user.username;
        state.image = action.payload.user.image;
        state.error = null;
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.editProfileStatus = "succeeded";
        state.isLoggedIn = true;
        state.email = action.payload.user.email;
        state.username = action.payload.user.username;
        state.image = action.payload.user.image;
        state.error = null;
      })
      .addCase(editProfile.rejected, (state) => {
        state.editProfileStatus = "failed";
      })
      .addCase(editProfile.pending, (state) => {
        state.editProfileStatus = "loading";
      });
  },
});

export default userSlice.reducer;

export const {
  remove,
  create,
  loggedIn,
  clearRegisterData,
  clearLoginData,
  setTheme,
} = userSlice.actions;
