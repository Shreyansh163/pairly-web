import axios from "axios";
import React, { useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { Heart, X, Briefcase } from "lucide-react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const SWIPE_THRESHOLD = 120;
const FLING_DISTANCE = 800;

const UserCard = ({ user, index = 0, isTop = true, onSwiped, preview = false }) => {
  const dispatch = useDispatch();
  const [gone, setGone] = useState(false);

  if (preview) {
    return (
      <div className="relative w-full max-w-sm h-140 rounded-3xl overflow-hidden shadow-2xl bg-base-300">
        {user.photoUrl ? (
          <img
            src={user.photoUrl}
            alt={user.firstName}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-linear-to-br from-rose-500/40 to-fuchsia-600/40 text-6xl">
            👤
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold leading-tight">
              {user.firstName} {user.lastName}
            </h2>
            {user.age && <span className="text-2xl opacity-90">{user.age}</span>}
          </div>
          {user.gender && (
            <p className="text-sm opacity-80 capitalize mt-0.5">{user.gender}</p>
          )}
          {user.about && (
            <p className="text-sm opacity-90 mt-2 line-clamp-3">{user.about}</p>
          )}
        </div>
      </div>
    );
  }

  const [{ x, y, rot, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    rot: 0,
    scale: 1 - index * 0.04,
    config: { tension: 280, friction: 30 },
  }));

  const sendRequest = async (status, userId) => {
    try {
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true },
      );
      dispatch(removeUserFromFeed(userId));
    } catch (error) {
      console.log(error);
      dispatch(removeUserFromFeed(userId));
    }
  };

  const fling = (dir) => {
    if (gone) return;
    setGone(true);
    const status = dir > 0 ? "interested" : "ignored";
    api.start({
      x: dir * FLING_DISTANCE,
      y: 40,
      rot: dir * 25,
      scale: 1,
      config: { tension: 200, friction: 28 },
      onRest: () => {
        sendRequest(status, user._id);
        onSwiped?.();
      },
    });
  };

  const bind = useDrag(
    ({ active, movement: [mx, my], direction: [xDir], velocity: [vx] }) => {
      if (!isTop || gone) return;
      const trigger = Math.abs(mx) > SWIPE_THRESHOLD || vx > 0.5;
      if (!active && trigger) {
        fling(xDir < 0 ? -1 : 1);
        return;
      }
      api.start({
        x: active ? mx : 0,
        y: active ? my : 0,
        rot: active ? mx / 12 : 0,
        scale: active ? 1.03 : 1 - index * 0.04,
        config: { tension: active ? 800 : 280, friction: active ? 50 : 30 },
      });
    },
    { enabled: isTop },
  );

  const likeOpacity = x.to((v) => Math.max(0, Math.min(1, v / SWIPE_THRESHOLD)));
  const nopeOpacity = x.to((v) => Math.max(0, Math.min(1, -v / SWIPE_THRESHOLD)));

  return (
    <animated.div
      {...(isTop ? bind() : {})}
      style={{
        x,
        y,
        rotate: rot,
        scale,
        touchAction: "none",
        zIndex: 100 - index,
      }}
      className="absolute w-[88vw] max-w-sm h-[70vh] max-h-140 rounded-3xl overflow-hidden shadow-2xl bg-base-300 cursor-grab active:cursor-grabbing select-none"
    >
      <img
        src={user.photoUrl}
        alt={user.firstName}
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

      <animated.div
        style={{ opacity: likeOpacity }}
        className="absolute top-8 left-6 rotate-[-18deg] border-4 border-green-400 text-green-400 px-4 py-1 rounded-lg text-3xl font-extrabold tracking-wider"
      >
        LIKE
      </animated.div>
      <animated.div
        style={{ opacity: nopeOpacity }}
        className="absolute top-8 right-6 rotate-18 border-4 border-rose-500 text-rose-500 px-4 py-1 rounded-lg text-3xl font-extrabold tracking-wider"
      >
        NOPE
      </animated.div>

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="flex items-baseline gap-2">
          <h2 className="text-3xl font-bold leading-tight">
            {user.firstName} {user.lastName}
          </h2>
          {user.age && <span className="text-2xl opacity-90">{user.age}</span>}
        </div>
        {user.gender && (
          <p className="text-sm opacity-80 capitalize mt-0.5">{user.gender}</p>
        )}
        {user.about && (
          <p className="text-sm opacity-90 mt-2 line-clamp-3">{user.about}</p>
        )}
        {Array.isArray(user.skills) && user.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {user.skills.slice(0, 6).map((s) => (
              <span
                key={s}
                className="text-xs bg-white/15 backdrop-blur px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1"
              >
                <Briefcase size={11} />
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {isTop && (
        <div className="absolute -bottom-18 left-0 right-0 flex justify-center gap-6 pointer-events-none">
          <button
            onClick={() => fling(-1)}
            className="pointer-events-auto btn btn-circle bg-white hover:bg-rose-50 border-none shadow-xl w-16 h-16 text-rose-500"
            aria-label="Ignore"
          >
            <X size={28} strokeWidth={3} />
          </button>
          <button
            onClick={() => fling(1)}
            className="pointer-events-auto btn btn-circle bg-white hover:bg-green-50 border-none shadow-xl w-16 h-16 text-green-500"
            aria-label="Interested"
          >
            <Heart size={26} strokeWidth={3} fill="currentColor" />
          </button>
        </div>
      )}
    </animated.div>
  );
};

export default UserCard;
