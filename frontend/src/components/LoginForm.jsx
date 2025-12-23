import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { KeyRound, User, X } from "lucide-react";
import { useAuthenticationStore } from "../store/authStore";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const { error, isLoading, login } = useAuthenticationStore();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await login(formData.username, formData.password);

      toast.success(`Welcome back, ${user.name || "User"}!`, { 
        duration: 2000,
        style: {
          background: "#0093FF3D",
        },
        icon: "✔️" 
      });

      switch (user.role) {
        case "Client":
          navigate("/client-dashboard");
          break;
        case "IT Support":
          navigate("/itsupport-dashboard");
          break;
        case "Service Desk":
          navigate("/servicedesk-dashboard");
          break;
        case "Manager":
          navigate("/admin-dashboard");
          break;
        default:
          navigate("/");
      }

      setFormData({ username: "", password: "" });
    } catch (err) {
      const message = err.message;
      if (message.toLowerCase().includes("awaiting admin approval")) {
        toast.error("Your account is awaiting admin approval");
      } else if (message.toLowerCase().includes("rejected")) {
        toast.error("Your account has been rejected");
      } else {
        toast.error("Invalid email or password! Please try again");
      }
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 px-4">
      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-600 via-sky-600 to-emerald-600 text-white p-10"
        >
          <h1 className="text-4xl font-bold mb-4">Welcome to SOLEASE</h1>
          <p className="text-lg text-center leading-relaxed max-w-sm">
            Streamline your IT support operations, manage tickets efficiently, 
            and empower your team with smart solutions.
          </p>
          <div className="mt-6 border-t border-white/40 pt-4 text-sm opacity-90">
            <p>Smart. Reliable. Efficient.</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col justify-center p-8 sm:p-10 md:p-12"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-600">
              Login
            </h2>
            <button
              onClick={() => navigate("/")}
              className="text-gray-500 hover:text-blue-600 transition"
            >
              <X size={22} />
            </button>
          </div>

          <p className="text-xs md:text-sm -mt-4 mb-2 text-gray-500">
            Enter your credentials to access your account
          </p>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="form-control">
              <label className="input input-bordered flex items-center gap-2 rounded-lg">
                <User size={18} />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="grow outline-none"
                  placeholder="Enter your username"
                  required
                />
              </label>
            </div>

            <div className="form-control">
              <label className="input input-bordered flex items-center gap-2 rounded-lg">
                <KeyRound size={18} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="grow outline-none"
                  placeholder="Enter your password"
                  required
                />
              </label>
            </div>

            <Link
              to={"/forgot-password"}
              className="text-sm md:text-base hover:underline hover:text-blue-700"
            >
              Forgot Password?
            </Link>

            {error?.toLowerCase().includes("invalid credentials") && (
              <p className="text-red-600 mt-2 font-semibold">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary text-white rounded-lg shadow-md uppercase tracking-wide hover:scale-[1.02] transition transform"
            >
              {isLoading ? "Authenticating..." : "Login"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-sm md:text-base text-center text-gray-600 mt-6">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-blue-500 font-medium hover:underline"
            >
              Signup here
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default LoginForm;