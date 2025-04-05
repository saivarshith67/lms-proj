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
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-colors font-semibold shadow-lg hover:shadow-2xl border border-amber-200"
        >
            Logout
        </button>
    );
}
