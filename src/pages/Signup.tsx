import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signupError) return setError(signupError.message);

    const user = signupData.user;
    if (!user) return setError("User signup failed");

    const { error: profileInsertError } = await supabase.from("profiles").insert({
      id: user.id,
      email,
      display_name: displayName,
      role,
    });

    if (profileInsertError) return setError(profileInsertError.message);

    navigate("/");
  };

  return (
    <div
      className="w-screen h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('/images/top-view-back-school-supplies-with-watercolor-stapler.jpg')",
      }}
    >
      <Card className="w-full max-w-md bg-[#fefae0]/70 backdrop-blur-md shadow-2xl border border-white/30 rounded-2xl px-6 py-8">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-gray-800">
            Create Your Account
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignup} className="space-y-5">
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div>
              <Label htmlFor="display-name" className="text-gray-800">
                Display Name
              </Label>
              <Input
                id="display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full rounded-xl border border-black/30 bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-600"
                />
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-800">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-black/30 bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-600"
                />
            </div>

            <div className="relative">
              <Label htmlFor="password" className="text-gray-800">
                Password
              </Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-black/30 bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-600"
                />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 bottom-1 p-1 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm transition-all duration-300 text-black/70 hover:text-blue-600 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>

            <div>
              <Label className="text-gray-800">Role</Label>
              <Select
                value={role}
                onValueChange={(value: string) => setRole(value as "student" | "teacher")}
              >
                <SelectTrigger className="w-full mt-1 bg-white/70 backdrop-blur-sm text-gray-800">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full text-base rounded-xl py-2.5 bg-gradient-to-r from-orange-400 to-yellow-500 text-white hover:from-orange-500 hover:to-yellow-600 transition-all shadow-md"
            >
              Sign Up
            </Button>
          </form>

          <p className="text-sm text-center mt-5 text-gray-700">
            Already have an account?{" "}
            <span
              className="text-orange-600 underline cursor-pointer hover:text-orange-800 transition"
              onClick={() => navigate("/")}
            >
              Log in
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
