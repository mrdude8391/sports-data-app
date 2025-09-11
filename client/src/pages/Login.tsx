import { Button } from "@/components/ui/button";
import React from "react";

const Login = () => {
  return (
    <div>
      <div className="flex flex-col border-1 rounded-2xl p-5 gap-5 min-w-sm">
        <div className="flex flex-col gap-1">
          <label>Email</label>
          <input
            className="border-1 rounded-lg p-2"
            placeholder="Email"
          ></input>
        </div>
        <div className="flex flex-col gap-1">
          <label>Password</label>
          <input
            className="border-1 rounded-lg p-2"
            placeholder="Password"
          ></input>
        </div>
        <div className="flex gap-5 justify-between">
          <Button className="flex-1">Login</Button>
          <Button className="flex-1">Sign Up</Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
