import React, { useState } from "react";
import { useNavigate } from "react-router";
import { CircleUser, KeyRound, Mail, User, X, Loader } from "lucide-react";
import { useAuthenticationStore } from "../store/authStore";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const SignUpForm = () => {
  const navigate = useNavigate();

  const { signup, error, isLoading } = useAuthenticationStore();

  const [ formData, setFormData ] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!formData.username || !formData.name || !formData.email || !formData.password){
      toast.error("All fields are required!!");
      return;
    }

    try {
      await signup(formData.username, formData.name, formData.email, formData.password);
      toast.success("Signup successful! Please verify your email..");

      // Reset the fields
      setFormData({
        username: "",
        name: "",
        email: "",
        password: "",
      });

      navigate("/verify-email")
    } catch (err) {
      toast.error(error || "Sign up failed!");
    }
  }

  return (
    <section
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-200 from-10% via-cyan-600 via-40% to-cyan-700 to-80%"
    >
      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col justify-center p-8 sm:p-10 md:p-12"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-600">
              Register
            </h2>
            <button
              onClick={() => navigate("/")}
              className="text-gray-500 hover:text-blue-600 transition"
            >
              <X size={22} />
            </button>
          </div>
          <p className="text-xs md:text-sm -mt-4 mb-2 text-gray-500">Create a new account</p>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
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
                <CircleUser size={18} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="grow outline-none"
                  placeholder="Enter your full name's"
                  required
                />
              </label>
            </div>

            <div className="form-control">
              <label className="input input-bordered flex items-center gap-2 rounded-lg">
                <Mail size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="grow outline-none"
                  placeholder="Enter your email address"
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

            {error?.toLowerCase().includes("sign") && (
              <p className="text-red-600 mt-2 font-semibold">{error}</p>
            )}


            {/* Button */}
            <button
              disabled={isLoading}
              type="submit"
              className="w-full btn btn-primary text-white rounded-lg shadow-md uppercase tracking-wide hover:scale-[1.02] transition transform"
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-sm md:text-base text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-500 font-medium hover:underline"
            >
              Login here
            </a>
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 16 }}
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
      </div>
    </section>
  );
};

export default SignUpForm;