import Form from "./form";
import Label from "./label";
import Input from "./input";
import Button from "./button";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/chat");
  }, [user]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleReset = () => {
    setFormData({
      email: "",
      password: "",
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleValidation = () => {
    let newErrors = {};
    const trimmed = {
      email: formData.email.trim(),
      password: formData.password.trim(),
    };

    if (trimmed.email === "") {
      newErrors.email = "Email Is Required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed.email)) {
      newErrors.email = "Email Must Be In Valid Format.";
    }

    if (trimmed.password === "") {
      newErrors.password = "Password Is Required.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = handleValidation();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        await login(formData.email, formData.password);
        navigate("/chat");
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="login-email">Email:</Label>
          <Input
            type="email"
            id="login-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            variant={errors.email ? "error" : "primary"}
          />
          {errors.email ? (
            <p className="text-red-500 text-sm mt-1 -mb-1">{errors.email}</p>
          ) : (
            <div className="h-3"></div>
          )}
        </div>
        <div>
          <Label htmlFor="login-password">Password:</Label>
          <Input
            type="password"
            id="login-password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            variant={errors.password ? "error" : "primary"}
          />
          {errors.password ? (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          ) : (
            <div className="h-3"></div>
          )}
        </div>
        <div className="flex gap-1">
          <Button className="w-1/2" type="button" onClick={handleReset}>
            Reset
          </Button>
          <Button className="w-1/2" type="submit">
            Login
          </Button>
        </div>
        <div className="text-center mt-4 text-sm">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </Form>
    </div>
  );
}

export default Login;
