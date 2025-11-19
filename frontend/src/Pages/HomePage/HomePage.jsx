import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function HomePage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const goToMapPage = () => {
        navigate("/google-maps");
    }

    const goToMyListPage = () => {
        navigate("/booklistpage");
    }
    if(!user) return;

    return (
        <div className="flex items-center">

            <div className="relative z-10 flex flex-col items-center text-center bg-white p-10 rounded-lg shadow-xl text-gray-800 max-w-md w-full">
                <h1 className="text-4xl font-extrabold text-green-600 mb-8">
                    ยินดีต้อนรับสู่ <span className="text-blue-700">RentACamp!</span>
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
                        {user.role == "admin" ? "การจองทั้งหมด" : " การจองของฉัน"}

                    </button>
                </div>
            </div>
        </div>
    );
}

export default HomePage;