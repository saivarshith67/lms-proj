import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
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
    <div className="flex items-center justify-center min-h-screen w-full bg-[#0f172a] overflow-hidden">
      {/* Main container with fixed width to prevent background images from showing */}
      <div className="fixed inset-0 bg-[#0f172a] z-0"></div>

      {/* Login content */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center gap-2 text-white">
            <span className="text-blue-400 bg-blue-500/20 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            </span>
            <h1 className="text-[28px] font-bold">Login</h1>
          </div>
        </div>

        <div className="bg-[#1e293b] rounded-lg p-6 shadow-lg">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-[#475569]/50 bg-[#1e293b] focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400"
            />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-[#475569]/50 bg-[#1e293b] focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[#334155]/40 transition-all duration-300 text-gray-400 hover:text-blue-400 focus:outline-none"
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
              className="w-full rounded-lg text-base bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md py-2.5"
            >
              Log in
            </Button>
          </form>

          <p className="text-sm text-center mt-6 text-gray-400">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-400 cursor-pointer hover:text-blue-300 transition"
            >
              Create one
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}