import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { BASE_URL } from "../../config/common";

export const fetchUserData = createAsyncThunk(
  "autonomize/userData",
  async function (userData) {
    try {
      const response = await fetch(`${BASE_URL}/api/user/add`, {
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
        `${BASE_URL}/api/user/mutualFriends/${username}`
      );
      toast.success(response?.data?.message);
      return response.data;
    } catch (error) {
      console.log(error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "autonomize/updateProfile",
  async function ({ username, updates }) {
    try {
      console.log(username + "asd");
      console.log(updates + "sad");
      const response = await axios.put(
        `${BASE_URL}/api/updateProfile/${username}`,
        updates
      );

      // if (response.status === 200) {
      //   toast.success(
      //     response?.data?.message || "Profile updated successfully"
      //   );
      // }

      return response.data;
    } catch (error) {
      console.error("Error in updateUserProfile:", error.message);
      toast.error(error?.response?.data?.message || "Failed to update profile");
      throw error;
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

    // Update User Profile
    builder.addCase(updateUserProfile.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.users=action.payload.data
      
      state.isLoading = false;
    });
    builder.addCase(updateUserProfile.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export default userSlice.reducer;
