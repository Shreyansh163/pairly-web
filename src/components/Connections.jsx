import React, { useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { MessageCircle, Users } from "lucide-react";
import { BASE_URL } from "../utils/constants";
import { addConnection } from "../utils/connectionSlice";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnection(res?.data?.data));
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }
      console.log(error);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-3 text-center px-6">
        <Users size={48} className="opacity-50" />
        <h1 className="text-2xl font-bold">No connections yet</h1>
        <p className="opacity-70 max-w-sm">
          Head to the feed and swipe right on devs you'd like to build with.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="text-3xl font-bold">Connections</h1>
        <span className="text-sm text-base-content/60">
          {connections.length} {connections.length === 1 ? "match" : "matches"}
        </span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {connections.map((c) => (
          <div
            key={c._id}
            className="group bg-base-200/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-rose-400/40 hover:-translate-y-1 transition"
          >
            <div className="relative aspect-4/3 overflow-hidden">
              <img
                src={c.photoUrl}
                alt={c.firstName}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <h2 className="text-xl font-bold leading-tight">
                  {c.firstName} {c.lastName}
                </h2>
                {(c.age || c.gender) && (
                  <p className="text-xs opacity-80 capitalize">
                    {[c.age, c.gender].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-base-content/70 line-clamp-2 min-h-10">
                {c.about || "No bio yet."}
              </p>
              <Link
                to={`/chat/${c._id}`}
                state={{ target: c }}
                className="btn btn-sm w-full mt-3 border-none bg-white/5 hover:bg-rose-500/20 text-rose-300"
              >
                <MessageCircle size={14} /> Message
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Connections;
