import { GalleryVerticalEnd, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../../lib/axiosInstance";

function LoginForm({ className, heading, subheading, url, ...props }) {
  const navigate = useNavigate();
  const [usn, setUSN] = useState("");
  const [send, setSend] = useState(false);

  async function handleSubmit(e) {
    setSend(true);
    e.preventDefault();

    try {
      await AuthAPI.post("sendmail/", { usn });

      toast.success("mail Sent SuccessFully Check Inbox");
      navigate("/stdlogin");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSend(false);
    }
  }
  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center  px-4",
        className,
      )}
      {...props}
    >
      <div className="w-full max-w-md space-y-6 rounded-2xl  p-8 shadow-md">
        {/* Logo + Title */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-md ">
            <Mail className="size-8 text-gray-700" />
          </div>
          <h1 className="text-xl font-bold">{heading}</h1>
          <div className="text-center text-sm">
            {subheading}
            <a href="/stdlogin" className="underline underline-offset-4">
              Login
            </a>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">USN</Label>
            <Input
              id="usn"
              type="text"
              placeholder="2SD22CS000"
              value={usn}
              onChange={(e) => setUSN(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={send}
          >
            {send ? <span>Sending Email...</span> : <span>Send Email</span>}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
