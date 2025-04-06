import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    <div className="w-screen h-screen flex items-center justify-center bg-[#0a1525]">
      <div className="flex flex-col items-center">
        <div className="flex items-center mb-4">
          <div className="bg-blue-600 text-white p-2 rounded mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Signup</h1>
        </div>
        
        <div className="w-96 bg-[#172338] p-8 rounded-lg shadow-lg">
          <form onSubmit={handleSignup} className="space-y-4">
            {error && <p className="text-red-400 text-sm">{error}</p>}
            
            <div>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Display Name"
                required
                className="w-full bg-[#0e1b2b] border border-[#253755] text-gray-200 rounded-md placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full bg-[#0e1b2b] border border-[#253755] text-gray-200 rounded-md placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full bg-[#0e1b2b] border border-[#253755] text-gray-200 rounded-md placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#1a1a1a] p-1.5 rounded-md"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={16} className="text-gray-400" />
                ) : (
                  <AiOutlineEye size={16} className="text-gray-400" />
                )}
              </button>
            </div>
            
            <div>
              <Select
                value={role}
                onValueChange={(value: string) => setRole(value as "student" | "teacher")}
              >
                <SelectTrigger className="w-full bg-[#0e1b2b] border border-[#253755] text-gray-200 focus:ring-blue-500 focus:ring-1">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent className="bg-[#172338] border border-[#253755] text-gray-200">
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
            >
              Sign up
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <span 
                className="text-blue-400 hover:text-blue-300 cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Create one
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}