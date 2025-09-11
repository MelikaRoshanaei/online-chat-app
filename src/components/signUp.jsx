import Form from "./form";
import Label from "./label";
import Input from "./input";
import Button from "./button";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function SignUp() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

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

  const handleBlur = (e) => {
    const { name } = e.target;

    const validationErrors = handleValidation(name);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validationErrors[name],
    }));
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", password: "" });
    setErrors({});
  };

  const handleValidation = (fieldName) => {
    let newErrors = {};
    const trimmed = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
    };

    if (!fieldName || fieldName === "name") {
      if (trimmed.name === "" || !/^[a-zA-Z\s]{3,50}$/.test(trimmed.name)) {
        newErrors.name =
          "User Name Must Be Between 3-50 Alphabetical Characters.";
      }
    }

    if (!fieldName || fieldName === "email") {
      if (
        trimmed.email === "" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed.email)
      ) {
        newErrors.email = "Email Must Be In Valid Format.";
      }
    }

    if (!fieldName || fieldName === "password") {
      if (
        trimmed.password === "" ||
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,64}$/.test(
          trimmed.password
        )
      ) {
        newErrors.password =
          "Password must be 8-64 chars & include cases, numbers, & symbols.";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = handleValidation();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        await register(formData.name, formData.email, formData.password);
        navigate("/chat");
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Form onSubmit={handleSubmit} className="w-full max-w-md">
        <div>
          <Label htmlFor="user-name">Name:</Label>
          <Input
            type="text"
            id="user-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            variant={errors.name ? "error" : "primary"}
            className="w-full"
          />
          {errors.name ? (
            <p className="text-red-500 text-sm mt-1 -mb-1">{errors.name}</p>
          ) : (
            <div className="h-4"></div>
          )}
        </div>
        <div>
          <Label htmlFor="email">Email:</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            variant={errors.email ? "error" : "primary"}
            className="w-full"
          />
          {errors.email ? (
            <p className="text-red-500 text-sm mt-1 -mb-1">{errors.email}</p>
          ) : (
            <div className="h-4"></div>
          )}
        </div>
        <div>
          <Label htmlFor="password">Password:</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            variant={errors.password ? "error" : "primary"}
            className="w-full"
          />
          {errors.password ? (
            <p className="text-red-500 text-sm mt-1 -mb-1">{errors.password}</p>
          ) : (
            <div className="h-4"></div>
          )}
        </div>
        <div className="flex gap-1">
          <Button className="w-1/2" type="button" onClick={handleReset}>
            Reset
          </Button>
          <Button className="w-1/2" type="submit">
            Sign Up
          </Button>
        </div>
        <div className="text-center mt-4 text-sm">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </Form>
    </div>
  );
}

export default SignUp;
