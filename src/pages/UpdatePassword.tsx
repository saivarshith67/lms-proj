// UpdatePassword.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function UpdatePassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Check if we have a session when the component mounts
    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (!data.session) {
                setError("Invalid or expired password reset link. Please try again.");
            }
        };

        checkSession();
    }, []);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage(null);

        // Validate passwords match
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        // Validate password strength
        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters long");
            setIsLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (error) {
                setError(error.message);
            } else {
                setMessage("Password updated successfully!");
                // Reset the form
                setNewPassword("");
                setConfirmPassword("");

                // Redirect to login after a short delay
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-[#0f172a] overflow-hidden">
            {/* Main container with fixed width to prevent background images from showing */}
            <div className="fixed inset-0 bg-[#0f172a] z-0"></div>

            {/* Update Password content - centered in the page */}
            <div className="relative z-10 w-full max-w-md px-4 flex flex-col items-center">
                <div className="flex justify-center mb-6 w-full">
                    <div className="flex items-center justify-center gap-2 text-white">
                        <span className="text-blue-400 bg-blue-500/20 p-2 rounded-lg flex items-center justify-center">
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
                        <h1 className="text-[28px] font-bold">Update Password</h1>
                    </div>
                </div>

                <div className="bg-[#1e293b] rounded-lg p-6 shadow-lg w-full">
                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                        {error && (
                            <p className="text-red-400 text-sm text-center w-full">{error}</p>
                        )}
                        {message && (
                            <p className="text-green-400 text-sm text-center w-full">{message}</p>
                        )}

                        <div className="space-y-4 w-full">
                            <div className="relative w-full">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
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

                            <div className="relative w-full">
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full rounded-lg border border-[#475569]/50 bg-[#1e293b] focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400 pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[#334155]/40 transition-all duration-300 text-gray-400 hover:text-blue-400 focus:outline-none"
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? (
                                        <AiOutlineEyeInvisible size={20} />
                                    ) : (
                                        <AiOutlineEye size={20} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-lg text-base bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md py-2.5"
                        >
                            {isLoading ? "Updating..." : "Update Password"}
                        </Button>

                        <div className="flex justify-center w-full">
                            <span
                                onClick={() => navigate("/login")}
                                className="text-sm text-blue-400 cursor-pointer hover:text-blue-300 transition"
                            >
                                Back to Login
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}