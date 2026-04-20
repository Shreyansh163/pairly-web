import React from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";

const Connections = () => {
  const connections = useSelector(store => store.connections);
  const dispatch = useDispatch();
  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      //   console.log(res?.data?.data);
      dispatch(addConnection(res?.data?.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return;
  if (connections.length === 0)
    return (
      <div className="flex justify-center items-center pt-10 h-140">
        <h1 className="text-lg font-semibold">No connections found</h1>
      </div>
    );
  return (
    <div>
      <h1 className="mt-5 mx-10 font-bold text-2xl">Connections</h1>
      {connections.map(connection => {
        const { _id, firstName, lastName, age, gender, photoUrl, about } =
          connection;
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
              <p>{about}</p>
              <div className="card-actions justify-end">
                {/* <button
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
                </button> */}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
