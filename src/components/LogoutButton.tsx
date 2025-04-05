// src/components/LogoutButton.tsx
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/");
    };

    return (
        <button
            onClick={handleLogout}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold shadow-md"
        >
            Logout
        </button>
    );
}
