import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Check, X, Inbox } from "lucide-react";
import { BASE_URL } from "../utils/constants";
import { addRequest, removeRequest } from "../utils/requestSlice";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequest(res?.data?.data));
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }
      console.log(error);
    }
  };

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true },
      );
      dispatch(removeRequest(_id));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-3 text-center px-6">
        <Inbox size={48} className="opacity-50" />
        <h1 className="text-2xl font-bold">No pending requests</h1>
        <p className="opacity-70 max-w-sm">
          When devs swipe right on you, they'll show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="text-3xl font-bold">Pending Requests</h1>
        <span className="text-sm text-base-content/60">
          {requests.length} waiting
        </span>
      </div>

      <div className="space-y-4">
        {requests.map((request) => {
          const { _id, firstName, lastName, age, gender, photoUrl, about } =
            request.fromUserId;
          return (
            <div
              key={_id}
              className="flex items-center gap-4 bg-base-200/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-lg hover:border-rose-400/40 transition"
            >
              <img
                src={photoUrl}
                alt={firstName}
                className="w-20 h-20 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold leading-tight">
                  {firstName} {lastName}
                </h2>
                {(age || gender) && (
                  <p className="text-xs text-base-content/60 capitalize">
                    {[age, gender].filter(Boolean).join(" · ")}
                  </p>
                )}
                <p className="text-sm text-base-content/70 line-clamp-2 mt-1">
                  {about}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => reviewRequest("rejected", request._id)}
                  className="btn btn-circle btn-sm bg-white/5 hover:bg-rose-500/30 border-none text-rose-400"
                  aria-label="Reject"
                >
                  <X size={18} strokeWidth={3} />
                </button>
                <button
                  onClick={() => reviewRequest("accepted", request._id)}
                  className="btn btn-circle btn-sm bg-white/5 hover:bg-green-500/30 border-none text-green-400"
                  aria-label="Accept"
                >
                  <Check size={18} strokeWidth={3} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;
