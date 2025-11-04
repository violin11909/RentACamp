import {useState, useEffect} from "react";
import { FaArrowLeft } from "react-icons/fa6";
import Cookies from 'js-cookie';
import { getRequests } from "../../service/booking";
import { getCampgrounds } from "../../service/campService";
import { getMe } from "../../service/userService";
import { useNavigate } from "react-router-dom";

function BookListPage() {
    const nav = useNavigate();

    const [token, setToken] = useState(null);
    const [booking, setBooking] = useState([]);
    const [camp, setCamp] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [editingBooking, setEditingBooking] = useState(null);

    const fetchBookings = async () => {
        if (!token) return;
        try {
            const response = await getRequests();
            if (response) console.log(response);
            setBooking(response.data);
        } catch(err) {
            setError("ไม่สามารถโหลดข้อมูลการจองได้");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            setError("กรุณาเข้าสู่ระบบเพื่อดูรายการการจอง");
            return;
        }
        setToken(token);
        getMe().then(data => {
            if (data.success) {
                console.log("user = ", data.data.name);
                setUser(data.data);
            }
        });
    }, []);

    useEffect(() => {
        if (token) fetchBookings();
    }, [token]);

    if (error) return <div className="text-red-500">{error}</div>
    
    return (
        <div className="bg-[#e4eaf2] p-5 md:p-7 min-h-screen overflow-auto flex items-center justify-center">
            <div className="w-full min-h-[300px] max-w-5xl bg-white rounded-lg shadow-lg px-10 py-3 relative">
                <div className="p-6 py-4 pb-3 relative">
                    <div
                        className="top-3 left-[-30px] absolute hover:bg-gray-200 cursor-point rounded-full p-2"
                        onClick={() => nav(-1)}
                    >
                        <FaArrowLeft size={30}/>
                    </div>

                    <div className="mt-6 flex flex-col gap-4">
                        {isLoading ? (
                            <div>Loading...</div>
                        ) : (
                            booking.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex flex-col md:flex-row justify-between items-start p-4 border rounded-lg shadow-sm hover:shadow-md">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-blue-700">สถานที่: {item.campgroundId}</h3>
                                        <p className="text-gray-600">ผู้จอง: {item.userName}</p>
                                        <p className="text-gray-600">เบอร์โทร: {item.tel}</p>
                                        <p className="text-gray-600">วันที่เช็คอิน: {item.checkIn}</p>
                                        <p className="text-gray-600">วันที่เช็คเอาท์: {item.checkOut}</p>
                                    </div>
                                    <div className="mt-4 md:mt-0 md:text-right">
                                        <p className="text-lg font-bold">{item.number} คน</p>
                                        <p className={`font-medium ${item.status === "success" ? "text-green-600" : "text-yellow-600"}`}>
                                            {item.status}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookListPage;