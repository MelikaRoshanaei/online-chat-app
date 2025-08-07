import Form from "./form";
import Label from "./label";
import Input from "./input";
import Button from "./button";

function SignUp() {
  return (
    <Form>
      <div>
        <Label htmlFor="user-name">Name:</Label>
        <Input type="text" id="user-name" name="name" />
      </div>
      <div>
        <Label htmlFor="email">Email:</Label>
        <Input type="email" id="email" name="email" />
      </div>
      <div>
        <Label htmlFor="password">Password:</Label>
        <Input type="password" id="password" name="password" />
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
