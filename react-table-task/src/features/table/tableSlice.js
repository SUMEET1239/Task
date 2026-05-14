import { createSlice } from "@reduxjs/toolkit";

import { fetchUsers, addUser, updateUser, deleteUser } from "./tableThunk";

const initialState = {
  users: [],
  loading: false,
};

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH USERS
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;

        state.users = action.payload || [];
      })

      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false;
      })

      // ADD USER
      .addCase(addUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;

        state.users.push(action.payload);
      })

      .addCase(addUser.rejected, (state) => {
        state.loading = false;
      })

      // UPDATE USER
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;

        state.users = state.users.map((user) =>
          user.id === action.payload.id ? { ...user, ...action.payload } : user,
        );
      })

      // Delete USER
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(
          (user) => user.id !== action.payload.id,
        );
      });
  },
});

export default tableSlice.reducer;
