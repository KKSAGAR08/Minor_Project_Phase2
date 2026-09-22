import { Lock, Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { AuthAPI } from "../../lib/axiosInstance";
import toast from "react-hot-toast";

function LoginForm() {
  const { id, usn } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await AuthAPI.post(`set-password/${usn}/${id}/`, {
        password,
        confirmPassword,
      });

      if (response.status === 200) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.log(error)
      const data = error.response?.data;

      if (data.message) {
        Object.values(data.messages).forEach((message) => {
          toast.error(message.message);
        });
      } else {
        toast.error(data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div
        className={cn(
          "flex flex-col gap-6 w-full max-w-md mx-auto p-6 rounded-2xl shadow-md bg-card",
        )}
      >
        {isSubmitted ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex size-12 items-center justify-center rounded-md bg-green-100">
              <Lock className="size-6 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-green-700">Thank you!</h1>
            <p className="text-muted-foreground">
              Your password has been set successfully. <br />
              You can safely close this tab now.
            </p>
          </div>
        ) : (
          // ✅ Form
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-md bg-muted">
                <Lock className="size-6" />
              </div>
              <h1 className="text-2xl font-bold text-center">
                Set Password Here
              </h1>
            </div>

            {/* Inputs */}
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="pass">Enter Password</Label>
                <Input
                  id="pass"
                  name="pass"
                  type="password"
                  placeholder="minimum 8 character"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cpass">Confirm Password</Label>
                <Input
                  id="cpass"
                  name="cpass"
                  type="password"
                  placeholder="minimum 8 character"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full cursor-pointer flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2Icon className="animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginForm;
