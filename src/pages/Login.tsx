import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      return setError(loginError.message);
    }

    const user = data.user;

    if (user) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError || !profile) {
        return setError(profileError?.message || "No role found for this user");
      }

      navigate(profile.role === "teacher" ? "/teacher" : "/student");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent">
      <Card className="w-[540px] bg-[#fefae0]/70 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/30">
        <CardHeader>
          <CardTitle className="text-center text-[28px] font-bold text-gray-800">
            Login
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-black/30 bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-600"
            />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-black/30 bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-600 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm transition-all duration-300 text-black/70 hover:text-blue-600 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full rounded-xl text-base bg-gradient-to-r from-orange-400 to-yellow-500 text-white hover:from-orange-500 hover:to-yellow-600 transition-all shadow-md py-2.5"
            >
              Log in
            </Button>
          </form>

          <p className="text-sm text-center mt-6 text-gray-700">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-orange-600 underline cursor-pointer hover:text-orange-800 transition"
            >
              Create one
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
