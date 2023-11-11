import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../../components/oauth/OAuth";

export default function Signup() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/signin");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }

    // console.log(data);
  };

  // console.log(formData);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center my-7 font-semibold"> Signup</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          id="username"
          type="text"
          placeholder="Username..."
          className="input-primary border p-3 rounded-lg"
          onChange={handleChange}
        />
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
          {loading ? "Loading..." : "Sign up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-3">
        <p>Have an accound?</p>
        <Link to="/signin">
          <span className="link-primary">Sign in</span>
        </Link>
      </div>
      {error && <p className="text-error">{error}</p>}
    </div>
  );
}
