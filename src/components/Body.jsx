import React from "react";
import NavBar from "./NavBar";
import { Outlet, useNavigate } from "react-router";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import axios from "axios";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // to avoid api calls when user is already logged in as user's data is already in redux store
  const userData = useSelector(store => store.user);

  const fetchUser = async () => {
    // If we can get data from redux store no need to make api call 
    if (userData) return;
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (error) {
      if (error.status === 401) {
        navigate("/login");
      }
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Body;
