import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
        <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-orange-50 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-20 w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            <Card className="w-96 shadow-lg bg-white/80 backdrop-blur-sm border border-amber-200 relative z-10">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-semibold text-amber-800">Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="border border-amber-200 rounded-md focus:ring-amber-400"
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="border border-amber-200 rounded-md focus:ring-amber-400"
                        />
                        <Button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-2xl">
                            Log in
                        </Button>
                    </form>
                    <p className="text-sm text-center mt-4">
                        Don’t have an account?{" "}
                        <span
                            className="text-blue-600 underline cursor-pointer"
                            onClick={() => navigate("/signup")}
                        >
                            Create one
                        </span>
                    </p>
                </CardContent>
            </Card>
            <style>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 15s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
}
