import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router";
import { useSelector } from "react-redux";
import { ArrowLeft, Send } from "lucide-react";
import { getSocket } from "../utils/socket";

const formatTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const ChatWindow = () => {
  const { userId: targetUserId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const me = useSelector((store) => store.user);
  const target = state?.target;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("connecting");
  const [error, setError] = useState("");
  const [peerTyping, setPeerTyping] = useState(false);
  const scrollRef = useRef(null);
  const typingTimerRef = useRef(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    if (!me) return;
    const socket = getSocket();

    const handleReceive = (msg) => {
      setMessages((prev) => [...prev, msg]);
      const senderId =
        typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;
      if (String(senderId) !== String(me._id)) {
        socket.emit("markRead", { targetUserId });
      }
    };
    const handlePeerTyping = ({ userId: from, isTyping }) => {
      if (String(from) === String(targetUserId)) setPeerTyping(isTyping);
    };
    socket.on("messageReceived", handleReceive);
    socket.on("peerTyping", handlePeerTyping);

    const join = () => {
      setStatus("connecting");
      socket.emit("joinChat", { targetUserId }, (res) => {
        if (res?.ok) {
          setMessages(res.messages || []);
          setStatus("ready");
          socket.emit("markRead", { targetUserId });
        } else {
          setError(res?.error || "Could not join chat");
          setStatus("error");
        }
      });
    };

    if (socket.connected) join();
    else socket.once("connect", join);

    return () => {
      socket.off("messageReceived", handleReceive);
      socket.off("peerTyping", handlePeerTyping);
      if (isTypingRef.current) {
        socket.emit("typing", { targetUserId, isTyping: false });
        isTypingRef.current = false;
      }
      clearTimeout(typingTimerRef.current);
      socket.emit("leaveChat", { targetUserId });
    };
  }, [targetUserId, me]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const send = (e) => {
    e?.preventDefault();
    const clean = text.trim();
    if (!clean || status !== "ready") return;
    const socket = getSocket();
    socket.emit("sendMessage", { targetUserId, text: clean }, (res) => {
      if (!res?.ok) setError(res?.error || "Failed to send");
    });
    setText("");
    if (isTypingRef.current) {
      socket.emit("typing", { targetUserId, isTyping: false });
      isTypingRef.current = false;
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
    if (status !== "ready") return;
    const socket = getSocket();
    if (!isTypingRef.current) {
      socket.emit("typing", { targetUserId, isTyping: true });
      isTypingRef.current = true;
    }
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      socket.emit("typing", { targetUserId, isTyping: false });
      isTypingRef.current = false;
    }, 1500);
  };

  if (!me) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-circle btn-sm btn-ghost"
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>
        {target?.photoUrl && (
          <img
            src={target.photoUrl}
            alt={target.firstName}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-400/40"
          />
        )}
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold leading-tight truncate">
            {target ? `${target.firstName} ${target.lastName || ""}` : "Chat"}
          </h2>
          <p className="text-xs text-base-content/60">
            {peerTyping && status === "ready" ? (
              <span className="text-rose-300">typing…</span>
            ) : status === "ready" ? (
              "Online"
            ) : status === "connecting" ? (
              "Connecting…"
            ) : (
              "Unavailable"
            )}
          </p>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto py-4 space-y-2"
      >
        {status === "error" && (
          <div className="text-center text-rose-400 text-sm bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">
            {error}
            <div className="mt-2">
              <Link to="/connections" className="link link-hover text-xs">
                Back to connections
              </Link>
            </div>
          </div>
        )}

        {status === "ready" && messages.length === 0 && (
          <div className="text-center text-base-content/50 text-sm mt-10">
            No messages yet — say hi 👋
          </div>
        )}

        {messages.map((m) => {
          const senderId =
            typeof m.senderId === "object" ? m.senderId._id : m.senderId;
          const mine = String(senderId) === String(me._id);
          return (
            <div
              key={m._id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl shadow ${
                  mine
                    ? "bg-linear-to-br from-rose-500 to-fuchsia-600 text-white rounded-br-md"
                    : "bg-base-200 text-base-content rounded-bl-md"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">
                  {m.text}
                </p>
                <p
                  className={`text-[10px] mt-1 ${
                    mine ? "text-white/70" : "text-base-content/50"
                  }`}
                >
                  {formatTime(m.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <form
        onSubmit={send}
        className="flex items-center gap-2 pt-3 border-t border-white/10"
      >
        <input
          type="text"
          value={text}
          onChange={handleChange}
          placeholder="Type a message…"
          disabled={status !== "ready"}
          className="input input-bordered flex-1 bg-base-100/50"
        />
        <button
          type="submit"
          disabled={!text.trim() || status !== "ready"}
          className="btn btn-circle border-none bg-linear-to-br from-rose-500 to-fuchsia-600 text-white shadow-lg shadow-rose-500/30 disabled:opacity-50"
          aria-label="Send"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
