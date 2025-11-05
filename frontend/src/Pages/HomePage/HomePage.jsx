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
                className="absolute inset-0 bg-cover bg-center opacity-80"
                style={{ backgroundImage: "url('https://iili.io/Kg9FG3v.md.jpg')" }}
            ></div>
            
            <div className="relative z-10 flex flex-col items-center text-center bg-white p-10 rounded-lg shadow-xl text-gray-800 max-w-md w-full">
                <h1 className="text-4xl font-extrabold text-blue-700 mb-8">
                    ยินดีต้อนรับสู่ <span className="text-green-600">RentACamp!</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                    เว็บจองจุดกางเต็นท์ทั่วประเทศไทย
                </p>

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