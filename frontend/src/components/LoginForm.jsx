import { useState } from "react";
import { loginUser, updateOnlineStatus } from "../api/userApi";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [form, setForm] = useState({ username: "", password: "", userId: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form);
      const user = res.data;
      setForm((prevForm) => ({ ...prevForm, userId: user.id })); // Store userId in form state
      await updateOnlineStatus(user.id, true);
      localStorage.setItem("user", JSON.stringify(user)); // Save user session
      setMessage(`Welcome, ${user.username}`);
      navigate("/dashboard"); // Redirect after login (optional)
    } catch (err) {
      setMessage(err.response?.data || "Login failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        placeholder="Username"
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />
      <button type="submit">Login</button>
      <p>{message}</p>
    </form>
  );
}

export default LoginForm;
