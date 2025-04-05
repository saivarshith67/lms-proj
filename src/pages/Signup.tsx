import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [role, setRole] = useState<"student" | "teacher">("student");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const { data: signupData, error: signupError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (signupError) {
            return setError(signupError.message);
        }

        const user = signupData.user;
        if (!user) {
            return setError("User signup failed");
        }

        const { error: profileInsertError } = await supabase.from("profiles").insert({
            id: user.id,
            email,
            display_name: displayName,
            role,
        });

        if (profileInsertError) {
            return setError(profileInsertError.message);
        }

        navigate("/");
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md shadow-lg rounded-xl border">
                <CardHeader>
                    <CardTitle className="text-center text-xl font-semibold">Sign Up</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="space-y-4">
                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <div>
                            <Label htmlFor="display-name">Display Name</Label>
                            <Input
                                id="display-name"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@email.com"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <Label>Role</Label>
                            <Select
                                value={role}
                                onValueChange={(value: string) => setRole(value as "student" | "teacher")}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="student">Student</SelectItem>
                                    <SelectItem value="teacher">Teacher</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button type="submit" className="w-full">
                            Create Account
                        </Button>
                    </form>

                    <p className="text-sm text-center mt-4">
                        Already have an account?{" "}
                        <span
                            className="text-blue-600 underline cursor-pointer"
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
