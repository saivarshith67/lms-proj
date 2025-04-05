// src/components/LogoutButton.tsx
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/");
    };

    return <button onClick={handleLogout}>Logout</button>;
}
