import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { MessageSquare } from "lucide-react";
import { BASE_URL } from "../utils/constants";
import { getSocket } from "../utils/socket";

const formatTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays < 7) return d.toLocaleDateString([], { weekday: "short" });
  return d.toLocaleDateString();
};

const Messages = () => {
  const [chats, setChats] = useState(null);
  const [error, setError] = useState("");

  const fetchChats = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/chats", {
        withCredentials: true,
      });
      setChats(res.data?.data || []);
    } catch (err) {
      console.log(err);
      setError("Could not load messages");
      setChats([]);
    }
  };

  useEffect(() => {
    fetchChats();
    const socket = getSocket();
    const refresh = () => fetchChats();
    socket.on("messageReceived", refresh);
    return () => socket.off("messageReceived", refresh);
  }, []);

  if (chats === null) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-3 text-center px-6">
        <MessageSquare size={48} className="opacity-50" />
        <h1 className="text-2xl font-bold">No conversations yet</h1>
        <p className="opacity-70 max-w-sm">
          Match with someone on the feed, then start the conversation from
          Connections.
        </p>
        {error && <p className="text-rose-400 text-sm">{error}</p>}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      <div className="space-y-2">
        {chats.map(({ target, lastMessage, unreadCount }) => (
          <Link
            key={target._id}
            to={`/chat/${target._id}`}
            state={{ target }}
            className="flex items-center gap-3 p-3 rounded-2xl bg-base-200/60 backdrop-blur-xl border border-white/10 hover:border-rose-400/40 hover:bg-base-200/80 transition"
          >
            <img
              src={target.photoUrl}
              alt={target.firstName}
              className="w-12 h-12 rounded-full object-cover shrink-0 ring-2 ring-rose-400/30"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="font-semibold truncate">
                  {target.firstName} {target.lastName}
                </h2>
                {lastMessage && (
                  <span className="text-[11px] text-base-content/50 shrink-0">
                    {formatTime(lastMessage.createdAt)}
                  </span>
                )}
              </div>
              <p
                className={`text-sm truncate ${
                  unreadCount > 0
                    ? "text-base-content font-medium"
                    : "text-base-content/60"
                }`}
              >
                {lastMessage
                  ? (lastMessage.mine ? "You: " : "") + lastMessage.text
                  : "Say hi 👋"}
              </p>
            </div>
            {unreadCount > 0 && (
              <span className="shrink-0 min-w-6 h-6 px-1.5 grid place-items-center text-xs font-bold rounded-full bg-rose-500 text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Messages;
