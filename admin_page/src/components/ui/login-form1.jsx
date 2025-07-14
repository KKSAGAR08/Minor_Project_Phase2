import { GalleryVerticalEnd, School } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ className, ...props }) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      username,
      password,
    };

    try {
      console.log(payload);

      const response = await axios.post(
        "https://minor-project-phase2.onrender.com/admin_login",
        payload
      );

      console.log(response.data.message);
      console.log(response.data.token1)

      localStorage.setItem("token1", response.data.token1);
      navigate("/admin");
    } catch (error) {
      if (error.response) {
        alert("Login failed: " + error.response.data.message);
      } else {
        alert("Network error");
      }
      console.error("Login error:", error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-md">
              <School className="size-6" />
            </div>
            <span className="sr-only">Acme Inc.</span>
            <h1 className="text-xl font-bold text-center">
              Welcome to Hostel Management System
            </h1>
            <div className="text-muted-foreground text-xs">
              ( ONLY FOR ADMIN )
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="username">User Name</Label>
              <Input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full cursor-pointer">
              Login
            </Button>
          </div>
        </div>
      </form>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
