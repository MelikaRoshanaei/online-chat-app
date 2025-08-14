import Form from "./form";
import Label from "./label";
import Input from "./input";
import Button from "./button";
import { useState } from "react";

function Login() {
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = handleValidation();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // TODO : integrate axios
      console.log("Form submitted successfully:", formData);
      handleReset();
    }
  };

  return (
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
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
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
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
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
    </Form>
  );
}

export default Login;
