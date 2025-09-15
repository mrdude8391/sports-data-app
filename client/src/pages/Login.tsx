import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import * as sportsDataservice from "../services/sportsDataService";
import type { User } from "@/types/User";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await sportsDataservice.login(email, password);
    console.log("login page", user);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col border-1 rounded-2xl p-5 gap-5 min-w-sm">
        <div className="flex flex-col gap-1">
          <label>Email</label>
          <input
            className="border-1 rounded-lg p-2"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div className="flex flex-col gap-1">
          <label>Password</label>
          <input
            className="border-1 rounded-lg p-2"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div className="flex gap-5 justify-between">
          <Button className="flex-1" type="submit">
            Login
          </Button>
          <Button className="flex-1">Sign Up</Button>
        </div>
      </div>
    </form>
  );
};

export default Login;
