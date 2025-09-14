import { createSlice } from "@reduxjs/toolkit";
import { saveResponse, beforeVisit } from "@thoughtbot/superglue";

export type UserState = {
  id: number | null;
  is_authenticated: boolean;
  email_address: string | null;
  username: string | null;
  slug: string | null;
  sign_out_form: { form: any; extras: any } | null;
};

const initialState: UserState = {
  id: null,
  is_authenticated: false,
  email_address: null,
  username: null,
  slug: null,
  sign_out_form: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    signOut(state) {
      return {
        ...initialState,
      };
    },
    updateUser(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(beforeVisit, (state, _action) => {
      return state;
    });
    builder.addCase(saveResponse, (state, action) => {
      const { page } = action.payload;

      if (page.slices.user) {
        return {
          ...state,
          ...(page.slices.user as UserState),
        };
      }

      return state;
    });
  },
});

export const { setUser, signOut, updateUser } = userSlice.actions;

// Selectors
export const selectUser = (state: { user: UserState }) => state.user;
export const selectIsAuthenticated = (state: { user: UserState }) =>
  state.user.is_authenticated;
export const selectUserId = (state: { user: UserState }) => state.user.id;
export const selectUserEmail = (state: { user: UserState }) =>
  state.user.email_address;
export const selectUsername = (state: { user: UserState }) =>
  state.user.username;
export const selectUserSlug = (state: { user: UserState }) => state.user.slug;
