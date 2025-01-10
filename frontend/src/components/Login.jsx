import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUserData } from "../redux/slices/userSlice";
import { useNavigate } from "react-router";

const Login = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username);
    dispatch(fetchUserData(username)).unwrap();
    navigate("/home");
  };

  return (
    <div>
      <h1>Github</h1>
      <div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            placeholder="Github UserName"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <button type="submit">Get</button>
        </form>
      </div>
      <div style={{marginTop:"25px"}}>
        <h3>
          <span style={{ color: "red" }}>Note :</span>
          <span> To run backend please refer to readme file in backend folder</span>
        </h3>
        <h3>
        <span style={{ color: "red" }}>Note :</span>
        <span> Backend has all functionality completed.</span>
        </h3>
      </div>
    </div>
  );
};

export default Login;
