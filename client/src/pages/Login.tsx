import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import * as sportsDataservice from "../services/sportsDataService";
import type { User } from "@/types/User";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const user = await sportsDataservice.login(email, password);
      console.log("login Successful");
      login(user);
      navigate("/profile");
    } catch (err: any) {
      setError(err.message);
      console.log(err.message);
    }
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
          <Button className="w-full" type="submit" form="loginForm">
            Login
          </Button>

          <Link className="w-full" to="/register">
            <Button variant="outline" className="w-full">
              Sign Up
            </Button>
          </Link>

          {error && (
            <Alert
              variant="destructive"
              className="flex justify-between items-center"
            >
              <AlertCircleIcon />
              <AlertTitle className="text-center">{error}</AlertTitle>
              <Button variant="destructive" onClick={() => setError("")}>
                X
              </Button>
            </Alert>
          )}
        </CardFooter>
      </Card>
    </>
  );
};

export default Login;
