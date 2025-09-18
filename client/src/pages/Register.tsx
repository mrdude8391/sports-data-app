import React, { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Link, Navigate, useNavigate } from "react-router-dom";
import * as sportsDataService from "../services/sportsDataService";
import type { User } from "@/types/User";
import { AlertCircleIcon } from "lucide-react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await sportsDataService.register(username, email, password);
      if (user) {
        setError("");
        setShowAlert(true);
        navigate("/profile");
      }
      console.log(user);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>
              Please enter an email and password to sign up
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="registerForm" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    type="username"
                    placeholder="username"
                    id="username"
                    required
                    onChange={(e) => setUsername(e.target.value)}
                  ></Input>
                </div>
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
          <CardFooter className="grid">
            <div className="flex flex-col gap-2">
              <Button
                form="registerForm"
                type="submit"
                className="justify-center "
              >
                Register
              </Button>
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full">
                  Back to Login
                </Button>
              </Link>
              {showAlert && (
                <Alert>
                  <AlertTitle className="text-center">
                    Success! Your have registered your account
                  </AlertTitle>
                </Alert>
              )}
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
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Register;
