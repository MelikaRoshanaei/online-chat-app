import Form from "./form";
import Label from "./label";
import Input from "./input";
import Button from "./button";
import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO : integrate axios
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="login-email">Email:</Label>
        <Input
          type="email"
          id="login-email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="login-password">Password:</Label>
        <Input
          type="password"
          id="login-password"
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
          Login
        </Button>
      </div>
    </Form>
  );
}

export default Login;
