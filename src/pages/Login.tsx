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

            // Redirect based on role
            navigate(profile.role === "teacher" ? "/teacher" : "/student");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card className="w-96 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center text-xl font-semibold">Login</CardTitle>
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
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button type="submit" className="w-full">
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

        </div>
    );
}