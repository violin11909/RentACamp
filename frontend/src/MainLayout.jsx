import { Outlet } from "react-router-dom";
import Header from "./Components/Header";

function MainLayout() {
    return (
        <div className="flex flex-col min-h-screen overflow-x-hidden">
            <Header />
            <main className="relative min-w-screen flex flex-grow justify-center bg-gray-200 z-0">
                <img
                    src="https://iili.io/Kg9FG3v.md.jpg"
                    alt="background-login"
                    className="absolute w-full h-full object-cover"
                />
                <Outlet />
            </main>
        </div>

    );
}

export default MainLayout;