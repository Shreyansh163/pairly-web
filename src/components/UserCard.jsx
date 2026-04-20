import axios from "axios";
import React from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  console.log(user);
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true },
      );
      console.log(userId);
      //   console.log(res);
      dispatch(removeUserFromFeed(userId));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="card bg-black w-70 shadow-sm">
      <figure className="">
        <img src={user.photoUrl} alt="profile pic" className="" />
      </figure>
      <div className="card-body">
        <h2 className="card-title leading-tight -mb-2">
          {user.firstName} {user.lastName}
        </h2>
        <p>
          {user.age}, {user.gender}
        </p>
        <p>{user.about}</p>
        <div className="card-actions">
          <button
            className="btn btn-warning"
            onClick={() => handleSendRequest("ignored", user._id)}
          >
            Ignore
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleSendRequest("interested", user._id)}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
