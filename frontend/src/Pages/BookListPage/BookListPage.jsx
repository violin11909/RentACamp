import {useState, useEffect} from "react";
import Cookies from 'js-cookie';
import { getRequests } from "../../service/booking";
import { getMe } from "../../service/userService";

function BookListPage() {
    const [Booking, setBooking] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    const [editingBooking, setEditingBooking] = useState(null);

    const fetchBookings = async () => {
        setIsLoading(true);
        const token = Cookies.get("token");
        if (!token) {
            setError("กรุณาเข้าสู่ระบบเพื่อดูรายการจอง");
            setIsLoading(false);
            return;
        }

        const response = await getRequests();
        setBooking(response.data);

    };

    useEffect(() => {
        const token = Cookies.get("token");
        if (token) {
            getMe().then(data => {
                if (data.success) {
                    console.log("user = ", data.data.name);
                    setUser(data.data);
                }
            });
        }
        fetchBookings();
    }, []);

    // if (isLoading) return <div>Loading...</div>
    if (error) return <div className="text-red-500">{error}</div>
    
    return (
        <div className="bg-[#e4eaf2] p-5 md:p-7 min-h-screen overflow-auto grid grid-cols-1 md:grid-cols-5 gap-x-5">
            <div className="max-w-5xl bg-white rounded-lg shadow-lg px-10 py-3 relative md:col-span-3 col-span-1">

            </div>
        </div>
    );
}

export default BookListPage;