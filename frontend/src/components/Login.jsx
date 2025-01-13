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
    <div style={{backgroundColor:"#E8F9FF", height:"100vh", display:"flex",justifyContent:"center",alignItems:"center"}}>
      <div className="main" style={{backgroundColor:"#C4D9FF",padding:"40px"}}>
        <h1 style={{fontSize:"30px",paddingBottom:"10px"}}>Github</h1>
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
      </div>
    </div>
  );
};

export default Login;
