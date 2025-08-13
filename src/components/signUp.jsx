import Form from "./form";
import Label from "./label";
import Input from "./input";
import Button from "./button";
import { useState } from "react";

function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", password: "" });
    setErrors({});
  };

  const handleValidation = () => {
    let newErrors = {};

    const trimmed = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
    };

    if (trimmed.name === "" || !/^[a-zA-Z\s]{3,50}$/.test(trimmed.name)) {
      newErrors.name =
        "User Name Must Be Between 3-50 Alphabetical Characters.";
    }

    if (
      trimmed.email === "" ||
      trimmed.email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed.email)
    ) {
      newErrors.email = "Email Must Be In Valid Format.";
    }

    if (
      trimmed.password === "" ||
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,64}$/.test(
        trimmed.password
      )
    ) {
      newErrors.password =
        "Password Must Be Between 8-64 Chars Including Uppercases, Lowercases, numbers & Special Characters.";
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
        <Label htmlFor="user-name">Name:</Label>
        <Input
          type="text"
          id="user-name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          variant={errors.name ? "error" : "primary"}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>
      <div>
        <Label htmlFor="email">Email:</Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          variant={errors.email ? "error" : "primary"}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>
      <div>
        <Label htmlFor="password">Password:</Label>
        <Input
          type="password"
          id="password"
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
          Sign Up
        </Button>
      </div>
    </Form>
  );
}

export default SignUp;
