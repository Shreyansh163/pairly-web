import React from "react";
import { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  //   console.log(user);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [age, setAge] = useState(user.age);
  const [gender, setGender] = useState(user.gender);
  const [about, setAbout] = useState(user.about);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();

  const updateProfile = async () => {
    // clear error
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, age, gender, photoUrl, about },
        { withCredentials: true },
      );
      //   console.log(res);
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      console.log(error);
      setError(error.response.data);
    }
  };

  return (
    <>
      <div className="flex justify-center justify-items-center my-10">
        <div className="flex justify-center justify-items-center mx-10">
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
            <legend className="fieldset-legend">Edit Profile</legend>

            <label className="label">First Name</label>
            <input
              type="text"
              className="input"
              placeholder="first name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />

            <label className="label">Last Name</label>
            <input
              type="text"
              className="input"
              placeholder="last name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />

            <label className="label">Age</label>
            <input
              type="number"
              className="input"
              placeholder="age"
              value={age}
              onChange={e => setAge(e.target.value)}
            />

            <label className="label">Gender</label>
            <select
              defaultValue="Select a gender"
              className="select"
              value={gender}
              onChange={e => setGender(e.target.value)}
            >
              <option disabled={true}>Select</option>
              <option value="male">male</option>
              <option value="female">female</option>
              <option value="others">others</option>
            </select>

            <label className="label">Photo URL</label>
            <input
              type="text"
              className="input"
              placeholder="photo url"
              value={photoUrl}
              onChange={e => setPhotoUrl(e.target.value)}
            />

            <label className="label">About</label>
            <textarea
              className="textarea"
              placeholder="about"
              value={about}
              onChange={e => setAbout(e.target.value)}
            ></textarea>

            <p className="text-red-500">{error}</p>
            <button className="btn btn-neutral mt-4" onClick={updateProfile}>
              Update Profile
            </button>
          </fieldset>
        </div>

        <div className="pt-4">
          <UserCard
            user={{ firstName, lastName, age, gender, photoUrl, about }}
          ></UserCard>
        </div>
      </div>
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>User updated successfully.</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
