import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + "/update-password",
            });

            if (error) {
                setError(error.message);
            } else {
                setMessage("Password reset link sent! Check your email inbox for further instructions.");
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-cover bg-center"
            style={{
                backgroundColor: "#f0f7ff",
                backgroundImage: "radial-gradient(circle at 25% 25%, #e6f0ff 0%, transparent 50%), radial-gradient(circle at 75% 75%, #e6f0ff 0%, transparent 50%)"
            }}
        >
            <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-lg">
                <div className="flex justify-center mb-6">
                    <div className="flex items-center justify-center gap-2 text-gray-800">
                        <span className="text-blue-600 bg-blue-100 p-2 rounded-lg">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="flex-shrink-0"
                            >
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </span>
                        <h1 className="text-[28px] font-bold">Reset Password</h1>
                    </div>
                </div>

                {message ? (
                    <div className="space-y-6 flex flex-col items-center">
                        <p className="text-green-600 text-sm text-center">{message}</p>
                        <Button
                            onClick={() => navigate("/login")}
                            className="w-full rounded-lg text-base bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md py-2.5"
                        >
                            Back to Login
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

                        <p className="text-gray-600 text-sm text-center">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>

                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400"
                        />

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-lg text-base bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md py-2.5"
                        >
                            {isLoading ? "Sending..." : "Send Reset Link"}
                        </Button>

                        <div className="flex justify-center">
                            <span
                                onClick={() => navigate("/login")}
                                className="text-sm text-blue-600 cursor-pointer hover:text-blue-500 transition"
                            >
                                Back to Login
                            </span>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}