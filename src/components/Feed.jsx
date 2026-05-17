import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { BASE_URL } from "../utils/constants";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getFeed = async () => {
    if (feed) return;
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res.data));
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }
      console.log(error);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (feed === null) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!feed.data || feed.data.length <= 0) {
    return (
      <div className="flex flex-col justify-center items-center h-[80vh] gap-3 px-6 text-center">
        <div className="text-6xl">✨</div>
        <h1 className="text-2xl font-bold">You're all caught up</h1>
        <p className="opacity-70 max-w-sm">
          No new developers right now. Check back soon — fresh profiles drop
          all the time.
        </p>
      </div>
    );
  }

  const stack = feed.data.slice(0, 3).reverse();

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] pt-6 pb-28">
      <div className="relative w-[88vw] max-w-sm h-[70vh] max-h-140 flex items-center justify-center">
        {stack.map((user, i) => {
          const index = stack.length - 1 - i;
          return (
            <UserCard
              key={user._id}
              user={user}
              index={index}
              isTop={index === 0}
            />
          );
        })}
      </div>
      <p className="mt-24 text-xs opacity-60">
        Swipe right to connect · Swipe left to skip
      </p>
    </div>
  );
};

export default Feed;
