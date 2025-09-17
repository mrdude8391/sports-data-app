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
import { Link } from "react-router-dom";
import * as sportsDataService from "../services/sportsDataService";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await sportsDataService.register(email, password);
    console.log(user);
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
                className="justify-center cursor-pointer"
              >
                Register
              </Button>
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full cursor-pointer">
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
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Register;
