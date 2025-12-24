import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { CircleUser, KeyRound, Mail, User, X, Loader } from "lucide-react";
import { useAuthenticationStore } from "../store/authStore";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const SignUpForm = () => {
  const navigate = useNavigate();
  const { signup, error, isLoading } = useAuthenticationStore();

  const [formData, setFormData] = useState({
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

      setFormData({ 
        username: "", 
        name: "", 
        email: "", 
        password: "", 
      });
      navigate("/verify-email");
    } catch (err) {
      toast.error(error || "Sign up failed!");
    }
  }

  return (
    <section
      className="relative min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-cyan-400 via-sky-600 to-indigo-700"
    >
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>

      <div className="relative w-full max-w-5xl bg-white shadow-[0_20px_60px_rgba(8,_112,_184,_0.5)] rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Form code section */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col justify-center p-10 md:p-14 bg-white"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Register</h2>
              <div className="h-1 w-17 bg-blue-600 rounded-full mt-1"></div>
            </div>
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={22} />
            </button>
          </div>
          <p className="text-base -mt-4 mb-8 text-gray-500 font-medium">Create your SolEase account</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {[
              { name: "username", icon: <User size={18}/>, label: "Username", placeholder: "e.g. JDoe" },
              { name: "name", icon: <CircleUser size={18}/>, label: "Full Name", placeholder: "e.g. John Doe" },
              { name: "email", icon: <Mail size={18}/>, label: "Email Address", placeholder: "jdoe@company.com", type: "email" },
              { name: "password", icon: <KeyRound size={18}/>, label: "Password", placeholder: "••••••••", type: "password" }
            ].map((field) => (
              <div key={field.name} className="space-y-1">
                <label className="text-[14px] font-bold text-gray-400 uppercase ml-1 tracking-widest">{field.label}</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50 transition-all">
                  <span className="text-gray-400">{field.icon}</span>
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="grow bg-transparent outline-none text-gray-700 text-sm placeholder:text-gray-300"
                    placeholder={field.placeholder}
                    required
                  />
                </div>
              </div>
            ))}

            {error?.toLowerCase().includes("sign") && (
              <p className="text-red-500 text-[14px] font-medium text-center mt-2">{error}</p>
            )}

            <button
              disabled={isLoading}
              type="submit"
              className="w-full py-4 bg-blue-600 text-white 
              rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200 
              active:scale-95 transition-all transform uppercase 
              tracking-widest text-base mt-4 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin" size={18} />
                  <span>Creating Account...</span>
                </>
              ) : "Sign Up"}
            </button>
          </form>

          <p className="text-base text-center text-gray-500 mt-8 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">Login here</Link>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-600 via-sky-600 to-emerald-600 text-white p-12 relative overflow-hidden"
        >
          {/* Decorative glass circle */}
          <div className="absolute top-[-20%] right-[-20%] w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Welcome to SOLEASE</h1>
          <p className="text-lg text-center leading-relaxed max-w-sm opacity-90">
            Streamline your IT support operations, manage tickets efficiently, 
            and empower your team with smart solutions.
          </p>
          <div className="mt-10 border-t border-white/20 pt-6 text-xs font-bold tracking-[0.3em] uppercase opacity-70">
            <p>Smart • Reliable • Efficient</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SignUpForm;