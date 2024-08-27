"use client";  // Make sure this is at the very top

import { useState } from "react";
import Link from "next/link";
// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";
import LoginWithSocial from "./LoginWithSocial";
import { signIn } from "@/appwrite/Services/authServices"; // Adjust the path as necessary

const FormContent2 = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();  // Ensure this is being used in a client component

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await signIn(email, password);
      console.log("User signed in successfully:", response.session);
      console.log("User team:", response.team);

      // Redirect to the appropriate dashboard based on the user's team
      if (response.team === "companies") {
        router.push("/employers-dashboard/company-profile");
      } else if (response.team === "jobSeekers") {
        router.push("/candidates-dashboard/my-profile");
      } else {
        router.push("/dashboard"); // Fallback if team is not identified
      }
    } catch (error) {
      setErrorMessage("Login failed. Please check your credentials and try again.");
      console.error("Error during sign-in:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-inner">
      <h3>Login to Superio</h3>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <form method="post" onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <div className="field-outer">
            <div className="input-group checkboxes square">
              <input type="checkbox" name="remember-me" id="remember" />
              <label htmlFor="remember" className="remember">
                <span className="custom-checkbox"></span> Remember me
              </label>
            </div>
            <a href="#" className="pwd">
              Forgot password?
            </a>
          </div>
        </div>
        <div className="form-group">
          <button
            className="theme-btn btn-style-one"
            type="submit"
            name="log-in"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </div>
      </form>
      <div className="bottom-box">
        <div className="text">
          Don&apos;t have an account? <Link href="/register">Signup</Link>
        </div>
        <div className="divider">
          <span>or</span>
        </div>
        <LoginWithSocial />
      </div>
    </div>
  );
};

export default FormContent2;
