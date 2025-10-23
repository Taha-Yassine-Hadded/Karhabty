import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-hot-toast";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: "", // Changed from firstName/lastName to single name field
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // Default role
    entrepriseName: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    
    // Clear entreprise fields when role changes to user
    if (name === "role" && value !== "entreprise") {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        entrepriseName: "",
        address: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    } else if (formData.name.length > 50) {
      newErrors.name = "Name cannot exceed 50 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Validate entreprise-specific fields
    if (formData.role === "entreprise") {
      if (!formData.entrepriseName.trim()) {
        newErrors.entrepriseName = "Enterprise name is required";
      }
      
      if (!formData.address.trim()) {
        newErrors.address = "Address is required";
      } else if (formData.address.length > 100) {
        newErrors.address = "Address cannot exceed 100 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const submitData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          ...(formData.role === "entreprise" && {
            entrepriseName: formData.entrepriseName,
            address: formData.address
          })
        };

        // Make API call with the centralized API configuration
        const response = await api.post("/api/auth/register", submitData);

        console.log("Registration successful:", response.data);
        toast.success("Sign up successful!");
      } catch (error) {
        console.error("Registration error:", error);
        setErrors({
          ...errors,
          api: error.response?.data?.msg || error.response?.data?.message || "Registration failed. Please try again.",
        });
      }
    }
  };

  return (
    <div className="signup-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="signup-form-wrapper">
              <div className="signup-header">
                <h2 className="signup-title">Create Account</h2>
                <p className="signup-subtitle">Join us today and get started</p>
              </div>

              <form onSubmit={handleSubmit} className="signup-form">
                <div className="form-group">
                  <label htmlFor="role">
                    Account Type <span className="required">*</span>
                  </label>
                  <select
                    id="role"
                    name="role"
                    className={`form-control ${errors.role ? "error" : ""}`}
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="user">Individual User</option>
                    <option value="entreprise">Enterprise</option>
                  </select>
                  {errors.role && (
                    <span className="error-message">{errors.role}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="name">
                    {formData.role === "entreprise" ? "Contact Name" : "Full Name"} <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`form-control ${errors.name ? "error" : ""}`}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={formData.role === "entreprise" ? "Enter contact person name" : "Enter your full name"}
                  />
                  {errors.name && (
                    <span className="error-message">{errors.name}</span>
                  )}
                </div>

                {formData.role === "entreprise" && (
                  <div className="form-group">
                    <label htmlFor="entrepriseName">
                      Enterprise Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="entrepriseName"
                      name="entrepriseName"
                      className={`form-control ${errors.entrepriseName ? "error" : ""}`}
                      value={formData.entrepriseName}
                      onChange={handleChange}
                      placeholder="Enter enterprise name"
                    />
                    {errors.entrepriseName && (
                      <span className="error-message">{errors.entrepriseName}</span>
                    )}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="email">
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-control ${errors.email ? "error" : ""}`}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>

                {formData.role === "entreprise" && (
                  <div className="form-group">
                    <label htmlFor="address">
                      Address <span className="required">*</span>
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      className={`form-control ${errors.address ? "error" : ""}`}
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter enterprise address"
                      rows="3"
                    />
                    {errors.address && (
                      <span className="error-message">{errors.address}</span>
                    )}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="password">
                    Password <span className="required">*</span>
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      className={`form-control ${errors.password ? "error" : ""}`}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </button>
                  </div>
                  {errors.password && (
                    <span className="error-message">{errors.password}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    Confirm Password <span className="required">*</span>
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      className={`form-control ${errors.confirmPassword ? "error" : ""}`}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <i className={`fa ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className="error-message">{errors.confirmPassword}</span>
                  )}
                </div>

                {errors.api && (
                  <div className="form-group">
                    <div className="alert alert-danger" role="alert">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      {errors.api}
                    </div>
                  </div>
                )}

                <button type="submit" className="btn-signup">
                  Create Account
                </button>

                <div className="signup-footer">
                  <p>
                    Already have an account?{" "}
                    <Link to="/login" className="login-link">
                      Sign In
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;