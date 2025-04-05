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
        <div className="w-screen h-screen flex items-center justify-center bg-amber-50">
            <Card className="w-full max-w-md shadow-xl rounded-2xl border border-amber-100 bg-white">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold text-amber-800">
                        Create an Account
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="space-y-4">
                        {error && <p className="text-red-600 text-sm">{error}</p>}

                        <div>
                            <Label htmlFor="display-name" className="text-amber-700">
                                Display Name
                            </Label>
                            <Input
                                id="display-name"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="John Doe"
                                required
                                className="rounded-lg border border-amber-200 focus:ring-amber-300 focus:border-amber-400"
                            />
                        </div>

                        <div>
                            <Label htmlFor="email" className="text-amber-700">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@email.com"
                                required
                                className="rounded-lg border border-amber-200 focus:ring-amber-300 focus:border-amber-400"
                            />
                        </div>

                        <div>
                            <Label htmlFor="password" className="text-amber-700">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="rounded-lg border border-amber-200 focus:ring-amber-300 focus:border-amber-400"
                            />
                        </div>

                        <div>
                            <Label className="text-amber-700">Role</Label>
                            <Select
                                value={role}
                                onValueChange={(value: string) => setRole(value as "student" | "teacher")}
                            >
                                <SelectTrigger className="w-full rounded-lg border border-amber-200 focus:ring-amber-300 focus:border-amber-400">
                                    <SelectValue placeholder="Select Role" />
                                </SelectTrigger>
                                <SelectContent
                                    className="bg-white border border-amber-200 shadow-lg rounded-lg text-amber-800"
                                    sideOffset={8}
                                >
                                    <SelectItem
                                        value="student"
                                        className="hover:bg-amber-100 focus:bg-amber-100 cursor-pointer px-3 py-2 rounded-md transition-colors"
                                    >
                                        Student
                                    </SelectItem>
                                    <SelectItem
                                        value="teacher"
                                        className="hover:bg-amber-100 focus:bg-amber-100 cursor-pointer px-3 py-2 rounded-md transition-colors"
                                    >
                                        Teacher
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-lg transition-colors shadow-md"
                        >
                            Create Account
                        </Button>
                    </form>

                    <p className="text-sm text-center mt-4 text-amber-700">
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

            <style>{`
        .radix-select-content[data-state='open'] {
          animation: scaleIn 150ms ease-out;
        }

        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
        </div>
    );
}
