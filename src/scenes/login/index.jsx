import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook for navigation

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // State to manage loading state
  const [error, setError] = useState(null); // State to manage login error
  const navigate = useNavigate(); // Get navigate function from useNavigate hook

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      verifyToken(accessToken);
    }
  }, []);

  const verifyToken = async (accessToken) => {
    try {
      const response = await fetch("https:limspakistan.org/api/verify-token/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Token verification failed");
      }

      // Navigate to dashboard upon valid token
      navigate("/dashboard");
    } catch (error) {
      console.error("Token verification error:", error.message);
      // Clear tokens and stay on login page
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("accessHash");
    }
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loading state

    try {
      const response = await fetch("https:limspakistan.org/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      // Assuming data is { refresh, access, access_hash }
      const { refresh, access, access_hash } = data;

      // Save tokens to localStorage or cookies
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("accessToken", access);
      localStorage.setItem("accessHash", access_hash);

      // Verify token after successful login
      verifyToken(access);
    } catch (error) {
      console.error("Login error:", error.message);
      setError("Invalid username or password"); // Set error message
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="row w-100">
        <div className="col-md-6 offset-md-3 col-lg-4 offset-lg-4">
          <form className="p-4 border rounded bg-light" onSubmit={handleSubmit}>
            <h3 className="mb-3 text-dark text-center">Sign In</h3>

            <div className="mb-3">
              <label className="text-dark">Email address</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter username"
                value={username}
                onChange={handleUsernameChange}
              />
            </div>

            <div className="mb-3">
              <label className="text-dark">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
