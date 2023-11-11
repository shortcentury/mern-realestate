import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../redux/user/userSlice.js";
import OAuth from "../../components/oauth/OAuth.jsx";

export default function Signin() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());
      const res = await fetch(`/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }

    // console.log(data);
  };

  // console.log(formData);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center my-7 font-semibold">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          id="email"
          type="email"
          placeholder="Email..."
          className="input-primary border p-3 rounded-lg"
          onChange={handleChange}
          required
        />
        <input
          id="password"
          type="password"
          placeholder="Password..."
          className="input-primary border p-3 rounded-lg"
          onChange={handleChange}
          required
        />
        <button
          disabled={loading}
          className="btn btn-primary p-3 rounded-lg hover:underline disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign in"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-3">
        <p>Dont have an accound?</p>
        <Link to="/signup">
          <span className="link-primary">Sign up</span>
        </Link>
      </div>
      {error && <p className="text-error">{error}</p>}
    </div>
  );
}
