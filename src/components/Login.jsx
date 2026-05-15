import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Flame, Mail, Lock, User } from "lucide-react";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true },
      );
      dispatch(addUser(res.data));
      navigate("/");
    } catch (err) {
      setError(err?.response?.data || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true },
      );
      dispatch(addUser(res.data.data));
      navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    isLoginForm ? handleLogin() : handleSignup();
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center p-12 px-34 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-rose-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-fuchsia-600/20 blur-3xl" />
        <div className="relative max-w-md ">
          <div className="flex items-center gap-3 mb-6">
            <span className="grid place-items-center w-14 h-14 rounded-2xl bg-linear-to-br from-rose-500 to-fuchsia-600 shadow-xl shadow-rose-500/30">
              <Flame size={30} className="text-white" strokeWidth={2.5} />
            </span>
            <h1 className="text-5xl font-extrabold bg-linear-to-r from-rose-400 to-fuchsia-400 bg-clip-text text-transparent">
              Pairly
            </h1>
          </div>
          <p className="text-xl text-base-content/80 leading-relaxed border-red-600 ">
            Find your people. Swipe right on the ones worth keeping.
          </p>
          <ul className="mt-8 space-y-3 text-base-content/70">
            <li className="flex items-center gap-2">✨ Curated profiles</li>
            <li className="flex items-center gap-2">💬 Chat once you match</li>
            <li className="flex items-center gap-2">
              🎯 Matched on what matters
            </li>
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-center p-6">
        <form
          onSubmit={submit}
          className="w-full max-w-sm bg-base-200/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
        >
          <h2 className="text-2xl font-bold mb-1">
            {isLoginForm ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-sm text-base-content/60 mb-6">
            {isLoginForm
              ? "Sign in to keep swiping."
              : "Join devs already shipping together."}
          </p>

          {!isLoginForm && (
            <div className="grid grid-cols-2 gap-3 mb-3">
              <label className="input input-bordered flex items-center gap-2 bg-base-100/50">
                <User size={16} className="opacity-60" />
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={e => setFirstname(e.target.value)}
                  className="grow"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2 bg-base-100/50">
                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={e => setLastname(e.target.value)}
                  className="grow"
                />
              </label>
            </div>
          )}

          <label className="input input-bordered flex items-center gap-2 bg-base-100/50 mb-3">
            <Mail size={16} className="opacity-60" />
            <input
              type="email"
              placeholder="you@dev.to"
              value={emailId}
              onChange={e => setEmailId(e.target.value)}
              className="grow"
            />
          </label>

          <label className="input input-bordered flex items-center gap-2 bg-base-100/50 mb-2">
            <Lock size={16} className="opacity-60" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="grow"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="opacity-60 hover:opacity-100"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </label>

          {error && (
            <p className="text-rose-400 text-sm mt-2 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">
              {typeof error === "string" ? error : "Something went wrong"}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn w-full mt-5 border-none bg-linear-to-r from-rose-500 to-fuchsia-600 hover:from-rose-600 hover:to-fuchsia-700 text-white shadow-lg shadow-rose-500/30"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : isLoginForm ? (
              "Sign in"
            ) : (
              "Create account"
            )}
          </button>

          <p
            className="text-center text-sm mt-5 text-base-content/70 cursor-pointer hover:text-white"
            onClick={() => setIsLoginForm(v => !v)}
          >
            {isLoginForm
              ? "New here? Create an account"
              : "Already have an account? Sign in"}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
