import type { ActionFunctionArgs } from "react-router-dom";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { AlertCircle } from "lucide-react";
import { login } from "../api";
import { Alert, AlertDescription, AlertTitle } from "../components/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/card";
import { FormError } from "../components/form-error";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { LoadingButton } from "../components/loading-button";

export async function action({ request }: ActionFunctionArgs) {
  const errors: Record<string, string> = {};
  const formData = await request.formData();

  // Validate the form fields
  const email = formData.get("email") as string;
  if (email === "") {
    errors.email = "Email is required.";
  } else if (
    email.match(
      /^([A-Z0-9_+-]+\.?)*[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i,
    ) === null
  ) {
    errors.email = "Please enter a valid email address.";
  }
  const password = formData.get("password") as string;
  if (password === "") {
    errors.password = "Password is required.";
  }

  // Do we have any errors?
  if (Object.keys(errors).length > 0) {
    return errors;
  }

  try {
    const session = await login(email, password);
    // Store the token
    Cookies.set("token", session.token);
    // Get the URL and look for a "to" search param
    const url = new URL(request.url);
    // Redirect
    return redirect(url.searchParams.get("to") ?? "/");
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return { form: "Invalid email or password." };
    }
    throw error;
  }
}

export function Component() {
  const error = useActionData() as Record<string, string> | undefined;
  const navigation = useNavigation();

  return (
    <Form method="post">
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/10">
        {/* Efecto de partículas */}
        <div className="absolute inset-0 -z-10">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-primary/10"
              style={{
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
        
        <Card className="m-6 w-full max-w-sm bg-background/90 backdrop-blur-sm border-border/50 shadow-xl transition-all duration-300 hover:shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="text"
                inputMode="email"
              />
              {error?.email && <FormError>{error.email}</FormError>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
              />
              {error?.password && <FormError>{error.password}</FormError>}
            </div>
          </CardContent>
          <CardFooter>
            <LoadingButton
              loading={navigation.state === "submitting"}
              type="submit"
              className="w-full"
            >
              Sign in
            </LoadingButton>
          </CardFooter>


          {error?.form && (
            <CardFooter>
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertTitle>Oops!</AlertTitle>
                <AlertDescription>{error.form}</AlertDescription>
              </Alert>
            </CardFooter>
          )}
        </Card>
      </div>
    </Form>
  );
}
Component.displayName = "Login";
