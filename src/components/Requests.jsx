import axios from "axios";
import React from "react";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequest, removeRequest } from "../utils/requestSlice";

const Requests = () => {
  const requests = useSelector(store => store.requests);
  const dispatch = useDispatch();
  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      //   console.log(res?.data?.data);
      dispatch(addRequest(res?.data?.data));
    } catch (error) {
      console.log(error);
    }
  };

  const reviewRequest = async (status, _id) => {
    try {
      const res = await axios.post(
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

  //   console.log(requests);
  if (!requests) return;
  if (requests.length === 0)
    return (
      <div className="flex justify-center items-center pt-10 h-140">
        <h1 className="text-lg font-semibold">No pending requests</h1>
      </div>
    );

  return (
    <div>
      <h1 className="mt-5 mx-10 font-bold text-2xl">Pending Requests</h1>
      {requests.map(request => {
        const { _id, firstName, lastName, age, gender, photoUrl, about } =
          request.fromUserId;
        return (
          <div
            key={_id}
            className="card card-side bg-black shadow-sm h-40 mt-5 mx-10"
          >
            <figure>
              <img src={photoUrl} alt="pic" />
            </figure>
            <div className="card-body">
              <h2 className="card-title -mb-2">
                {firstName} {lastName}
              </h2>
              <p>{age + ", " + gender}</p>
              <div className="card-actions justify-end">
                <button
                  className="btn btn-success"
                  onClick={() => reviewRequest("accepted", request._id)}
                >
                  Accept
                </button>
                <button
                  className="btn btn-error"
                  onClick={() => reviewRequest("rejected", request._id)}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
