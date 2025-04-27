import { useState } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/auth/login", form, {
        headers: { "Content-Type": "application/json" },
      });
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setMessage(`Welcome, ${user.username}`);
      navigate("/chat");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        display: "inline-block",
        maxWidth: 400,
        padding: 3,
      }}
    >
      <form onSubmit={handleSubmit}>
        <TextField
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          placeholder="Email"
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          name="password"
          type="password"
          label="Password"
          autoComplete="current-password"
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          size="large"
          fullWidth
          sx={{ marginTop: 2 }}
          type="submit"
        >
          Login
        </Button>
        {message && (
          <p style={{ marginTop: "1rem", color: "red", textAlign: "center" }}>
            {message}
          </p>
        )}
      </form>
    </Card>
  );
}

export default LoginForm;
