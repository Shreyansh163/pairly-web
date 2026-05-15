import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Check } from "lucide-react";
import UserCard from "./UserCard";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";

const Field = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="text-xs uppercase tracking-wider text-base-content/60 font-semibold">
      {label}
    </label>
    {children}
  </div>
);

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [saving, setSaving] = useState(false);
  const dispatch = useDispatch();

  const updateProfile = async () => {
    setError("");
    setSaving(true);
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, age, gender, photoUrl, about },
        { withCredentials: true },
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setError(err.response?.data || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Profile</h1>
        <p className="text-base-content/60 mt-1">
          Changes update your card live on the right.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <div className="bg-base-200/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="First name">
              <input
                className="input input-bordered w-full bg-base-100/50"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Field>
            <Field label="Last name">
              <input
                className="input input-bordered w-full bg-base-100/50"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Age">
              <input
                type="number"
                className="input input-bordered w-full bg-base-100/50"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </Field>
            <Field label="Gender">
              <select
                className="select select-bordered w-full bg-base-100/50"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </Field>
          </div>

          <Field label="Photo URL">
            <input
              type="text"
              className="input input-bordered w-full bg-base-100/50"
              placeholder="https://..."
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
          </Field>

          <Field label="About">
            <textarea
              className="textarea textarea-bordered w-full bg-base-100/50 min-h-28"
              placeholder="Tell devs what you're building..."
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
          </Field>

          {error && (
            <p className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">
              {typeof error === "string" ? error : "Update failed"}
            </p>
          )}

          <button
            onClick={updateProfile}
            disabled={saving}
            className="btn w-full border-none bg-linear-to-r from-rose-500 to-fuchsia-600 hover:from-rose-600 hover:to-fuchsia-700 text-white shadow-lg shadow-rose-500/30"
          >
            {saving ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              "Save changes"
            )}
          </button>
        </div>

        <div className="flex justify-center lg:sticky lg:top-24">
          <UserCard
            preview
            user={{ firstName, lastName, age, gender, photoUrl, about }}
          />
        </div>
      </div>

      {showToast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert border-none bg-green-500/90 text-white shadow-xl">
            <Check size={18} />
            <span>Profile updated</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
