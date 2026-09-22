import { GalleryVerticalEnd, School, Loader2Icon } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {AuthAPI} from "../../lib/axiosInstance";

export function LoginForm({ className, ...props }) {
  const [usn, setUsn] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      username: usn,
      password,
    };

    try {
      const response = await AuthAPI.post("login/", payload);

      localStorage.setItem("token", response.data.access);

      navigate("/student");
    } catch (error) {
      console.log(error)
      toast.error(error.response.data);
    } finally {
      setLoading(false);
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
              ( ONLY FOR STUDENTS )
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="grid gap-3">
              <Label htmlFor="usn">Register No or USN</Label>
              <Input
                id="usn"
                type="text"
                placeholder="EX:- 2SD22CS039"
                required
                value={usn}
                onChange={(e) => setUsn(e.target.value)}
              />
            </div>
            <Link
              to="/forgetpassword"
              className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
            <div className="grid gap-3">
              <Label htmlFor="phoneno">Password</Label>
              <Input
                id="pass"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full cursor-pointer">
              {loading ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  Please wait
                </>
              ) : (
                <span>Login</span>
              )}
            </Button>
            <Link to="/registerpassword">
              <Button
                type="submit"
                variant="outline"
                className="w-full cursor-pointer border-2"
              >
                Register Password
              </Button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
