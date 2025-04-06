import Login from "./Login";

export default function LoginWrapper() {
    return (
        <div
            className="w-screen h-screen flex items-center justify-center"
            style={{
                backgroundImage: "url('/images/top-view-back-school-supplies-with-watercolor-stapler.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="w-full max-w-xl bg-transparent p-6 rounded-2xl shadow-none mx-4">
                <Login />
            </div>
        </div>
    );
}
