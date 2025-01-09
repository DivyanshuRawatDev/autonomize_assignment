import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export const fetchUserData = createAsyncThunk(
  "autonomize/userData",
  async function (userData) {
    try {
      const response = await fetch("http://localhost:8080/api/user/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: userData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      toast.success(data?.message);

      return data;
    } catch (error) {
      console.error("Error in fetchUserData:", error.message);
      throw error;
    }
  }
);

export const getMutualFriends = createAsyncThunk(
  "autonomize/mutualFriend",
  async function (username) {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/user/mutualFriends/${username}`
      );
      toast.success(response?.data?.message);
      return response.data;
    } catch (error) {
      console.log(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "autonomize",
  initialState: {
    users: [],
    isLoading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserData.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      state.users = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(fetchUserData.rejected, (state, action) => {
      state.users = [];
      state.isLoading = false;
    });

    builder.addCase(getMutualFriends.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getMutualFriends.fulfilled, (state, action) => {
      state.users = action.payload.data;
      state.isLoading = false;
    });
    builder.addCase(getMutualFriends.rejected, (state, action) => {
      state.users = [];
      state.isLoading = false;
    });
  },
});

export default userSlice.reducer;
