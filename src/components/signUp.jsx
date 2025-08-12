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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", password: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO : integrate axios
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
        />
      </div>
      <div>
        <Label htmlFor="email">Email:</Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="password">Password:</Label>
        <Input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
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
