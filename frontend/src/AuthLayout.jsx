import { Outlet } from "react-router-dom";

function AuthLayout() {
    return (
        <main className="min-h-screen min-w-screen justify-center flex items-center relative">
            <img
                src="https://iili.io/Kg9FG3v.md.jpg"
                alt="background-login"
                className="absolute w-full h-full object-cover"
            />
            <Outlet />
        </main>
    );
}

export default AuthLayout;