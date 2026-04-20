import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";
import { useNavigate } from "react-router";

const Feed = () => {
  const feed = useSelector(store => store.feed);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getFeed = async () => {
    if (feed) return;
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      console.log(res);

      dispatch(addFeed(res.data));
    } catch (error) {
      console.log(error);
      // TO DO
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  // console.log(feed?.data);
  if (!feed) return navigate("/login");

  if (feed.data.length <= 0)
    return (
      <div className="flex justify-center items-center pt-10 h-140">
        <h1 className="text-lg font-semibold">No new users found</h1>
      </div>
    );

  return (
    feed && (
      <div className="flex justify-center items-center my-18">
        <UserCard user={feed.data[0]}></UserCard>
      </div>
    )
  );
};

export default Feed;
