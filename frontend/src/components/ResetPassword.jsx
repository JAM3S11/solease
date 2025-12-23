import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Mail, X, ArrowBigRight } from "lucide-react";
import { useAuthenticationStore } from "../store/authStore";
import toast from "react-hot-toast";

const ResetPassword= () => {
  const [ formData, setFormData ] = useState({
    password: "",
  })
  const [ confirmPassword, setConfirmPassword ] = useState("");
  const { resetPassword, error, isLoading, message } = useAuthenticationStore();

  const { token } = useParams();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if both password match
    if(formData.password !== confirmPassword){
        alert("Password don't match! Try again..");
        return;
    }

    try {
        await resetPassword(token, formData.password);
        toast.success("Password reset successfully! Redirecting to login page...");

        // Clear the fields
        setFormData({
            password: "",
        });
        setConfirmPassword("");

        // Go to Login Page
        setTimeout(() => {
            navigate("/login");
        }, 2000);
    } catch (error) {
        console.error(error);
        toast.error("Error resetting your password.");
    }
  };
  
  return (
    <section
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{
        background:
          "linear-gradient(120deg, rgba(173, 194, 230, 0.57) 0%, rgba(133, 175, 242, 0.43) 100%)",
      }}
    >
      <div className="w-full max-w-md bg-white shadow-2xl rounded-xl p-8 relative">
        {/* Header */}
        <div className="flex items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-600">
            Reset Password
          </h2>
        </div>
        {!message && !error && <p className="text-xs md:text-sm -mt-4 mb-2 text-gray-500">Enter your email address and we'll send a link to reset your password</p>}

        {error && <p className="text-xs md:text-sm mt-1 mb-2 text-red-600">{error}</p>}
        {message && <p className="text-xs md:text-sm mt-1 mb-2 text-green-600">{message}</p>}
        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="input input-bordered flex items-center gap-2 rounded-lg">
                <Mail size={18} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="grow outline-none"
                  placeholder="Password"
                  required
                />
              </label>
            </div>

            <div className="form-control">
              <label className="input input-bordered flex items-center gap-2 rounded-lg">
                <Mail size={18} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="grow outline-none"
                  placeholder="Confirm Password"
                  required
                />
              </label>
            </div>

            {/* Button */}
            <button
              disabled={isLoading}
              type="submit"
              className="w-full btn btn-primary text-white rounded-lg shadow-md uppercase tracking-wide hover:scale-[1.02] transition transform"
            >
              {isLoading ? "Resetting..." : "Set New Password"}
            </button>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;