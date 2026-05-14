import { createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../../services/userService";

export const fetchUsers = createAsyncThunk("fetchUsers", async () => {
  const data = await userService.fetchUsers();
  return data;
});

export const addUser = createAsyncThunk("addUser", async (user) => {
  const data = await userService.addUser(user);
  return data;
});

export const updateUser = createAsyncThunk(
  "updateUser",
  async ({ id, updatedData }) => {
    const data = await userService.updateUser(id, updatedData);

    return data;
  },
);

export const deleteUser = createAsyncThunk("table/deleteUser", async (id) => {
  const data = await userService.deleteUser(id);
  return data;
});
