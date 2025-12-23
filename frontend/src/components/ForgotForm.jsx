import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, X, ArrowBigRight } from "lucide-react";
import { useAuthenticationStore } from "../store/authStore";

const ForgotPassForm= () => {
  const [ formData, setFormData ] = useState({
    email: "",
  })
  const [ isSending, setIsSending ] = useState(false);
  const { isLoading, forgotPassword } = useAuthenticationStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(formData.email);
    setIsSending(true);
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-600">
            Reset Password
          </h2>
          <button
            onClick={() => navigate("/")}
            className="text-gray-500 hover:text-blue-600 transition"
          >
            <X size={22} />
          </button>
        </div>
        {!isSending && <p className="text-xs md:text-sm -mt-4 mb-2 text-gray-500">Enter your email address and we'll send a link to reset your password</p>}

        {/* Form */}
        {!isSending ? (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="input input-bordered flex items-center gap-2 rounded-lg">
                <Mail size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="grow outline-none"
                  placeholder="Email Address"
                  required
                />
              </label>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full btn btn-primary text-white rounded-lg shadow-md uppercase tracking-wide hover:scale-[1.02] transition transform"
            >
              {isLoading ? "Sending reset link..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <Mail size={20} className="mx-auto mb-2" />
            <p className="text-gray-300 mb-6">If an account exists for {formData.email}, you will receive a password reset link shortly.</p>
          </div>
        )}

        {/* Footer */}
        <p className="text-sm md:text-base text-center text-gray-600 mt-6 flex items-center justify-center gap-3">
          Back to Login?{" "}
          <a
            href="/login"
            className="text-blue-500 font-medium hover:underline"
          >
            <ArrowBigRight size={20} />
          </a>
        </p>
      </div>
    </section>
  );
};

export default ForgotPassForm;