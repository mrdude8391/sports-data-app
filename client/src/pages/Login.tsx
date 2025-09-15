import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import * as sportsDataservice from "../services/sportsDataService";
import type { User } from "@/types/User";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await sportsDataservice.login(email, password);
    console.log("login page", user);
  };

  return (
    <>
      <Card className="w-full max-w-sm">
        <CardContent>
          <form id="loginForm" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  placeholder="Email"
                  id="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                ></Input>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  placeholder="Password"
                  id="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                ></Input>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2 justify-between">
          <Button
            className="w-full cursor-pointer"
            type="submit"
            form="loginForm"
          >
            Login
          </Button>
          <Button variant="outline" className="w-full">
            <Link to="/register">Sign Up</Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default Login;
