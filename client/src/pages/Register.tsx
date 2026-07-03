import React, { useState } from "react";
import {
  Card,
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
import { AlertCircleIcon, Loader, Volleyball } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import type { RegisterPayload } from "../features/auth/types/Auth";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { useRegister } = useAuth();

  // const { isPending, mutate } = useMutation({
  //   mutationFn: sportsDataService.register,
  //   onSuccess: (userData) => {
  //     setError("");
  //     setShowAlert(true);
  //     login(userData);
  //     navigate("/profile");
  //   },
  //   onError: (error) => {
  //     setError(error.message);
  //   },
  // });

  const { isPending, error, mutate } = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const registerPayload: RegisterPayload = { username, email, password };
    mutate(registerPayload);
  };

  return (
    <>
      <div className="w-full max-w-sm flex flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Volleyball className="size-5" />
          </div>
          Volleyball Tracker
        </a>
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
          <CardFooter className="flex-col gap-2 justify-between">
            {isPending && <Loader className="animate-spin" />}
            <Button
              form="registerForm"
              type="submit"
              className="w-full"
              disabled={isPending}
            >
              Register
            </Button>
            <Link to="/login" className="w-full">
              <Button variant="outline" className="w-full">
                Back to Login
              </Button>
            </Link>
            {error && (
              <Alert
                variant="destructive"
                className="flex justify-between items-center"
              >
                <AlertCircleIcon />
                <AlertTitle className="text-center">{error.message}</AlertTitle>
                <Button variant="destructive">X</Button>
              </Alert>
            )}
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Register;
