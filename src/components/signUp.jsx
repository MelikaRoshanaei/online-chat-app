import Form from "./form";
import Label from "./label";
import Input from "./input";
import Button from "./button";
import { useState } from "react";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="email">Email:</Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="password">Password:</Label>
        <Input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex gap-1">
        <Button className="w-1/2" type="reset">
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
