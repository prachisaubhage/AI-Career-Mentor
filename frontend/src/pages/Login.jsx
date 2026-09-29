import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser, registerUser } from "../utils/auth";

function Login({ initialMode = "login" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isSignUp =
    initialMode === "signup" || location.pathname === "/signup";

  const setMode = (signUp) => {
    setError("");
    navigate(signUp ? "/signup" : "/login", { replace: true });
  };

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isSignUp) {
      if (!fullName.trim() || !email.trim() || !password.trim()) {
        setError("Please enter your full name, email, and password to sign up.");
        return;
      }

      if (password.trim().length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }

      try {
        setLoading(true);
        // Register new user via backend API, save to MongoDB Atlas
        await registerUser(fullName.trim(), email.trim(), password.trim());
        // Correct Flow: Sign Up -> Profile
        navigate("/profile");
      } catch (err) {
        console.error("Signup error in UI:", err);
        setError(err.message || "Failed to sign up. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      if (!email.trim() || !password.trim()) {
        setError("Please enter your email and password to log in.");
        return;
      }

      try {
        setLoading(true);
        // Log in existing user via backend API
        await loginUser(email.trim(), password.trim());
        // Correct Flow: Login -> Profile (Review/update information first)
        navigate("/profile");
      } catch (err) {
        console.error("Login error in UI:", err);
        setError(err.message || "Invalid email or password.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="login-page">

      <div className="login-left">

        <div className="login-brand">
          <div className="brand-icon">AI</div>
          <h2>AI Career Mentor</h2>
        </div>

        <div className="login-content">
          <p className="eyebrow">INTELLIGENT PLACEMENT GUIDANCE</p>

          <h1>
            Know where you stand.
            <br />
            Know what to do next.
          </h1>

          <p className="login-description">
            An intelligent career mentoring platform that combines
            placement prediction, explainable AI and personalized
            career planning.
          </p>

          <div className="feature-list">

            <div>
              <strong>01</strong>
              <span>Placement Readiness Prediction</span>
            </div>

            <div>
              <strong>02</strong>
              <span>Explainable Skill Gap Analysis</span>
            </div>

            <div>
              <strong>03</strong>
              <span>Personalized Career Roadmap</span>
            </div>

          </div>
        </div>

      </div>

      <div className="login-right">

        <form className="login-card" onSubmit={handleSubmit}>

          <div className="auth-toggle-tabs">
            <button
              type="button"
              className={`auth-tab-btn ${!isSignUp ? "active" : ""}`}
              onClick={() => setMode(false)}
            >
              Login
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${isSignUp ? "active" : ""}`}
              onClick={() => setMode(true)}
            >
              Sign Up
            </button>
          </div>

          <div className="login-header">
            <h2>{isSignUp ? "Create Account" : "Welcome back"}</h2>
            <p>
              {isSignUp
                ? "Sign up to start your personalized career mentoring."
                : "Login to continue your career journey."}
            </p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          {isSignUp && (
            <>
              <label htmlFor="signup-fullname">Full Name</label>
              <input
                id="signup-fullname"
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </>
          )}

          <label htmlFor="auth-email">Email Address</label>
          <input
            id="auth-email"
            type="email"
            placeholder="student@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            type="password"
            placeholder={isSignUp ? "Create a password" : "Enter password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="primary-btn"
            id="auth-submit-btn"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isSignUp
              ? "Sign Up & Continue →"
              : "Login & Continue →"}
          </button>

          <div className="auth-switch-prompt">
            {!isSignUp ? (
              <p>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={() => setMode(true)}
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={() => setMode(false)}
                >
                  Login
                </button>
              </p>
            )}
          </div>

          <p className="demo-note">
            Prototype demonstration • AI Career Mentor
          </p>

        </form>

      </div>

    </div>
  );
}

export default Login;