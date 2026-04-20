import React from "react";

const UserCard = ({ user }) => {
  console.log(user);
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
          <button className="btn btn-warning">Ignore</button>
          <button className="btn btn-secondary">Interested</button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
