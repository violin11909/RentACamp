import { useNavigate } from "react-router-dom";

function HomePage() {
    const navigate = useNavigate();
    const goToMapPage = () => {
        navigate("/map-container");
    }

    const goToMyListPage = () => {
        navigate("/booklistpage");
    }

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center relative"
        >
            <div
                className="absolute insert-0 bg-cover bg-center opacity-30"
                style={{ backgroundImage: "url('https://iili.io/Kg9FG3v.md.jpg')" }}
            ></div>
            {/* <img
                src="https://iili.io/Kg9FG3v.md.jpg"
                alt="bg-login"
                className="w-screen h-screen object-cover"
            /> */}
            <div className="relative z-10 flex flex-col items-center text-center">
                <h1 className="text-3xl font-bold mb-8 drop-shadow-lg">
                    ยินดีต้อนรับสู่เว็บไซต์จองจุดตั้งแคมป์!
                </h1>

                <div className="flex flex-col gap-4 w-full max-w-sm">
                    <button
                        className="cursor-pointer py-3 w-full bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-lg font-semibold shadow-md transition"
                        onClick={goToMapPage}
                    >
                        ค้นหาจุดตั้งแคมป์
                    </button>
                    <button
                        className="cursor-pointer py-3 w-full bg-green-500 hover:bg-green-600 rounded-lg text-white text-lg font-semibold shadow-md transition"
                        onClick={goToMyListPage}
                    >
                        การจองของฉัน
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HomePage;