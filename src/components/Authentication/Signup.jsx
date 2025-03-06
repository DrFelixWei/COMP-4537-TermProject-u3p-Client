import { useSignIn } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;


const Signup = () => {
  const signIn = useSignIn();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    confirmEmail: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, confirmEmail, password } = formData;

    if (!name || !email || !confirmEmail || !password) {
      setError("All fields are required.");
      return;
    }

    if (email !== confirmEmail) {
      setError("Emails do not match.");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/auth/signup`, {
        method: "POST",
        credentials: "include", // needed for cookies
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signup failed");

      signIn({
        token: data.token,
        expiresIn: 3600,
        tokenType: "Bearer",
        authState: { id: data.user.id, name: data.user.name, role: data.user.role },
      });

      navigate("/dashboard"); // Redirect to dashboard after signup
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <h2>Sign Up</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        type="email"
        name="confirmEmail"
        placeholder="Confirm Email"
        value={formData.confirmEmail}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;
