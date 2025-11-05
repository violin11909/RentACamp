import {useState, useEffect} from "react";
import { FaArrowLeft, FaTrashCan, FaPencil } from "react-icons/fa6";
import Cookies from 'js-cookie';
import { getRequests, deleteRequest } from "../../service/booking";
import { getCampground } from "../../service/campService";
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
            const bookingsData = response.data;

            const bookingsWithCampName = await Promise.all(
                bookingsData.map(async (b) => {
                    try {
                        const campRes = await getCampground(b.campgroundId);
                        return {...b, campName: campRes.data.name};
                    } catch(err) {
                        console.error("Error fetching campground for booking:", err);
                        return {...b, campName: "ไม่พบข้อมูลสถานที่"};
                    }
                })
            );
            console.log(bookingsWithCampName);
            setBooking(bookingsWithCampName);
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

    const handleDelete = async (id) => {
        if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบการจองนี้?")) {
            try {
                const response = await deleteRequest(id);
                if (response.success) {
                    alert("ลบการจองสำเร็จ");
                    fetchBookings();
                } else {
                    alert("ลบไม่สำเร็จ: " + (response.message || "เกิดข้อผิดพลาด"));
                }
            } catch(err) {
                console.error("Error deleting booking:", error);
                alert("เกิดข้อผิดพลาดในการลบการจอง");
            }
        }
    };

    const handleEdit = (bookingId) => {
        console.log("แก้ไข ID:", bookingId);
        nav(`/bookpage/${bookingId}`);
    };

    if (error) return <div className="text-red-500">{error}</div>
    
    return (
        <div className="min-h-screen relative">
            <div
                className="absolute inset-0 bg-cover bg-center object-cover"
                style={{ backgroundImage: "url('https://iili.io/Kg9FG3v.md.jpg')" }}
            ></div>
            <div className="p-5 md:p-7 min-h-screen overflow-auto flex items-center justify-center relative z-10">
                <div className="w-full min-h-[300px] max-w-5xl bg-white rounded-lg shadow-lg px-10 py-3 relative">
                    <div className="p-6 py-4 pb-3 relative">
                        <div
                            className="top-3 left-[-30px] absolute hover:bg-gray-200 cursor-point rounded-full p-2"
                            onClick={() => nav(-1)}
                        >
                            <FaArrowLeft size={30}/>
                        </div>

                        <div className="mt-6 flex flex-col gap-4 py-3">
                            <h1 className="text-2xl font-semibold text-gray-800 text-center pb-4 mb-6 border-b">
                                รายการการจอง
                            </h1>
                            {isLoading ? (
                                <div className="text-2xl text-gray-800 text-center">Loading...</div>
                            ) : (
                                booking.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex flex-col md:flex-row justify-between items-start p-4 border rounded-lg shadow-sm hover:shadow-md relative">
                                        <div className="flex-1">
                                            <img
                                                src="https://iili.io/Kkde2wJ.md.png"
                                                alt="mark"
                                                className="w-8 h-8 my-1"
                                            />
                                            <h3 className="text-xl font-semibold text-blue-700">สถานที่: {item.campName}</h3>
                                            <p className="text-gray-600">ผู้จอง: {item.userName}</p>
                                            <p className="text-gray-600">เบอร์โทรศัพท์: {item.tel}</p>
                                            <p className="text-gray-600">วันที่เช็คอิน: {new Date(item.checkIn).toLocaleDateString("th-TH", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric"
                                            })}</p>
                                            <p className="text-gray-600">วันที่เช็คเอาท์: {new Date(item.checkOut).toLocaleDateString("th-TH", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric"
                                            })}</p>
                                        </div>
                                        <div className="mt-4 md:mt-0 md:text-right">
                                            <p className="text-lg font-bold">{item.number} คน</p>
                                            <p className={`font-medium ${item.status === "success" ? "text-green-600" : "text-yellow-600"}`}>
                                                {item.status}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleEdit(item._id)}
                                            className="absolute bottom-14 right-4 text-gray-400 hover:text-blue-600 transition-color cursor-pointer"
                                            aria-label="แก้ไขข้อมูลการจอง">
                                            <FaPencil size={20}/>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="absolute bottom-4 right-4 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                                            aria-label="ลบการจอง">
                                                <FaTrashCan size={20}/>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookListPage;