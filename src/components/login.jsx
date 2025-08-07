import Form from "./form";
import Label from "./label";
import Input from "./input";
import Button from "./button";

function Login() {
  return (
    <Form>
      <div>
        <Label htmlFor="login-email">Email:</Label>
        <Input type="email" id="login-email" name="email" />
      </div>
      <div>
        <Label htmlFor="login-password">Password:</Label>
        <Input type="password" id="login-password" name="password" />
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
