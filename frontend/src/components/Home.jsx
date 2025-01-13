import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMutualFriends, updateUserProfile } from "../redux/slices/userSlice";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { BASE_URL } from "../config/common";

const Home = () => {
  const [username, setUsername] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const data = useSelector((store) => store?.user?.autonomize?.users);
  const [sortField, setSortField] = useState("created_at");

  const handleClick = () => {
    dispatch(getMutualFriends(data?.username));
  };

  const handleUpdateProfile = (username) => {
    const updates = { location: location, bio: bio };
    dispatch(updateUserProfile({ username, updates }));
    setLocation("");
    setBio("");
  };

  const handleSort = async (field) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/sorteduser?sortBy=${field}`
      );
      setSearchedUsers(response?.data?.data);
      toast.success("Users sorted successfully");
    } catch (error) {
      console.error("Error fetching sorted users:", error.message);
      toast.error("Failed to sort users");
    }
  };

  const handleSearch = async (username) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/search?username=${username}`
      );
      setSearchedUsers(response?.data?.data);
      console.log(searchedUsers);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDelete = async (username) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/softDelete/${username}`
      );
      toast.success(response?.data?.message);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(searchedUsers);
  return (
    <div className="container">
      <div className="first">
        <img
          width={150}
          height={150}
          className="avatar"
          src={data?.avatar_url}
          alt="avatar_user"
        />
        <hr />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            paddingTop: "10px",
            paddingBottom: "10px",
          }}
        >
          <h2 style={{}}>{data?.name}</h2>
          <h2 style={{ fontWeight: 400, color: "grey" }}>{data?.username}</h2>
          <p>{data?.bio}</p>
          <p>Location : {data?.location}</p>
        </div>

        <div style={{ marginTop: "20px" }}>
          <input
            type="text"
            placeholder="Update Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{ marginBottom: "10px", width: "100%" }}
          />
          <textarea
            placeholder="Update Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            style={{ marginBottom: "10px", width: "100%", height: "60px" }}
          />
          <button
            onClick={()=>handleUpdateProfile(data?.username)}
            style={{ backgroundColor: "blue", color: "white", padding: "10px" }}
          >
            Update Profile
          </button>
        </div>

        <hr />
        <div
          style={{
            display: "flex",
            gap: "5px",
            marginTop: "5px",
            fontWeight: 600,
          }}
        >
          <p>{data?.followers} followers</p>
          <p>{data?.following} Followings</p>
        </div>
        <hr />
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            gap: "15px",
            alignItems: "center",
          }}
        >
          <button
            onClick={handleClick}
            style={{ backgroundColor: "green", color: "white", padding: "3px" }}
          >
            Get Mutual Friends
          </button>
          {data?.mutualFriends ? (
            <span>You have {data?.mutualFriends.length} mutual friends</span>
          ) : (
            <span>Click to see mutual friends</span>
          )}
          <hr />
          <button
            style={{ padding: "3px", color: "white", backgroundColor: "red" }}
            onClick={() => handleDelete(data?.username)}
          >
            Delete User
          </button>
        </div>
      </div>
      <div className="second">
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "10px",
          }}
        >
          <div>
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <button onClick={() => handleSearch(username)}>Search</button>
          </div>
          <div>
            <label for="sort">Sort By:</label>
            <select
              id="sort"
              value={sortField}
              onChange={(e) => {
                setSortField(e.target.value);
                handleSort(e.target.value);
              }}
            >
              <option value="followers">Followers</option>
              <option value="following">following</option>
              <option value="public_gists">Public Gists</option>
              <option value="public_repos">Public Repos</option>
              <option value="created_at" selected>
                created_at
              </option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: "20px" }}>
          {searchedUsers.map((user) => {
            return (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px",
                    border: "1px solid black",
                  }}
                >
                  <img
                    width={50}
                    height={50}
                    style={{ borderRadius: "50%" }}
                    src={user?.avatar_url}
                  />
                  <p>{user?.name}</p>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
