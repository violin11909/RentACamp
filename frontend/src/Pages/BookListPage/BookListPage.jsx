import { useMemo, useState } from "react";
import { FaArrowLeft, FaTrashCan, FaPencil } from "react-icons/fa6";
import { getRequests, deleteRequest, updateRequest } from "../../service/booking";
import { getCampground } from "../../service/campService";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";

function BookListPage() {
    const { user } = useAuth();
    const nav = useNavigate();
    const queryClient = useQueryClient();

    const [camp, setCamp] = useState(null);
    const [editingBooking, setEditingBooking] = useState(null);

    const filterList = ["ทั้งหมด", "รออนุมติ", "อนุมติเเล้ว", "ปฎิเสธเเล้ว"];
    const [selectedFilter, setSelectedFilter] = useState("ทั้งหมด");

    const { data: bookingList, isLoading: isLoading, isError: isError, } = useQuery({ queryKey: ['booking-list'], queryFn: () => fetchBookings(), enabled: !!user, });

    const { mutate: updateBookingStatus } = useMutation({
        mutationFn: ({ bookingReq, updatedStatus }) => updateReqStatus(bookingReq, updatedStatus),
        onMutate: async ({ bookingReq, updatedStatus }) => {
            await queryClient.cancelQueries({ queryKey: ['booking-list'] });

            const previousBookingList = queryClient.getQueryData(['booking-list']);
            queryClient.setQueryData(['booking-list'], (oldData) => {
                if (!oldData) return [];
                return oldData.map((req) => req._id === bookingReq._id ? { ...req, status: updatedStatus } : req);
            });
            return { previousBookingList }; //มันจะได้รับ context ซึ่งก็คือสิ่งที่เรา return มาจาก onMutate
        },

        onError: (err, variables, context) => {
            if (context?.previousBookingList) queryClient.setQueryData(['booking-list'], context.previousBookingList);
            console.error("Update failed, rolling back", err);
        },
        // ดึงข้อมูลจริงจาก Server
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['booking-list'] });
        },
    });

    const fetchBookings = async () => {
        const response = await getRequests();
        const bookingsData = response.data;

        const bookingsWithCampName = await Promise.all(
            bookingsData.map(async (b, index) => {
                try {
                    const campRes = await getCampground(b.campgroundId);
                    return { ...b, campName: campRes.data.name };
                } catch (err) {
                    console.error(`Error fetching campground ${b.campgroundId} for  booking`);
                    return { ...b, campName: "ไม่พบข้อมูลสถานที่" };
                }
            })
        );

        return bookingsWithCampName;
    };


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
            } catch (err) {
                console.error("Error deleting booking:", error);
                alert("เกิดข้อผิดพลาดในการลบการจอง");
            }
        }
    };

    const updateReqStatus = async (bookingReq, status) => await updateRequest(bookingReq, status);
    const handleEdit = (bookingId) => nav(`/bookpage/${bookingId}`);

    const toggleStatus = (bookingReq, newStatus) => {
        const updatedStatus = bookingReq.status === newStatus ? "pending" : newStatus;
        updateBookingStatus({ bookingReq, updatedStatus });
    };

    const displayedList = useMemo(() => {
        if (!bookingList) return [];
        if (selectedFilter === "รออนุมัติ") return bookingList.filter((item) => item.status === "pending");
        if (selectedFilter === "อนุมติเเล้ว") return bookingList.filter((item) => item.status === "approved");
        if (selectedFilter === "ปฎิเสธเเล้ว") return bookingList.filter((item) => item.status === "declined");
        return bookingList;

    }, [bookingList, selectedFilter]);

    const displayThDate = (date) => {
        return new Date(date).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })
    }


    if (!user) return;
    if (isError) return <div className="text-red-500">เกิดข้อผิดพลาดในการโหลดข้อมูลการจอง</div>

    return (
        <div className="my-10 overflow-x-hidden">
            <div className="min-h-[300px] max-w-250 md:w-180 lg:w-200 bg-white rounded-lg shadow-lg px-10 py-3 relative overflow-y-auto">
                <div className="p-6 py-4 pb-3 relative">
                    <div
                        className="top-3 left-[-30px] absolute hover:bg-gray-200 cursor-point rounded-full p-2"
                        onClick={() => nav(-1)}
                    >
                        <FaArrowLeft size={30} />
                    </div>

                    <div className="mt-4 flex flex-col gap-4">
                        <h1 className="text-2xl font-semibold text-gray-800 text-center ">
                            {user.role == "admin" ? "รายการการจองทั้งหมด" : "รายการการจองของฉัน"}
                        </h1>

                        <div className="w-full flex flex-row cursor-pointer border-b-1 border-gray-300 overflow-x-auto">
                            {filterList.map((item) => (
                                <div
                                    onClick={() => setSelectedFilter(item)}
                                    className={`flex-shrink-0 p-4 w-30 text-center ${selectedFilter == item ? "border-b-2 border-blue-500 text-gray-800" : "text-gray-400"}`}>
                                    {item}
                                </div>

                            ))}
                        </div>

                        {isLoading ? (<div className="text-2xl text-gray-800 text-center">Loading...</div>)

                            : (displayedList.length === 0 ? (
                                <div className="font-bold flex items-center justify-center h-20 text-2xl text-red-500">
                                    ไม่มีข้อมูล
                                </div>
                            ) : (
                                displayedList.map((item) => {

                                    let status = item.status;
                                    <div className="font-bold w-full h-50 text-2xl text-red-500 text-center">ไม่มีข้อมูล</div>

                                    return (
                                        <div
                                            key={item._id}
                                            className="flex flex-col md:flex-row justify-between items-start p-4 border-[1px] border-gray-300 rounded-lg shadow-sm shadow-gray-400 hover:shadow-md relative ">
                                            <div >
                                                <div className="flex items-center gap-3 mb-2">
                                                    <img
                                                        src="https://iili.io/Kkde2wJ.md.png"
                                                        alt="mark"
                                                        className="w-8 h-8 my-1"
                                                    />
                                                    <h3 className="text-xl font-semibold text-blue-700">{item.campName}</h3>
                                                </div>

                                                <p className="text-gray-600">ผู้จอง: {item.userName}</p>
                                                <p className="text-gray-600">เบอร์โทรศัพท์: {item.tel}</p>
                                                <p className="text-gray-600">วันที่เช็คอิน: {displayThDate(item.checkIn)}</p>
                                                <p className="text-gray-600">วันที่เช็คเอาท์: {displayThDate(item.checkOut)} </p>
                                            </div>

                                            <div className="mt-4 md:mt-0 md:text-right ">
                                                <p className="text-lg font-bold">{item.number} คน</p>
                                                <p className={`font-medium ${item.status === "approved" ? "text-green-600" : item.status === "declined" ? "text-red-500" : "text-yellow-600"}`}>
                                                    {item.status}
                                                </p>
                                            </div>

                                            {user.role == "user" && (
                                                <div className="absolute right-0 bottom-0 flex flex-row gap-5 p-5">
                                                    <button
                                                        onClick={() => handleEdit(item._id)}
                                                        className="text-gray-400 hover:text-blue-600 transition-color cursor-pointer"
                                                        aria-label="แก้ไขข้อมูลการจอง">
                                                        <FaPencil size={20} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                                                        aria-label="ลบการจอง">
                                                        <FaTrashCan size={20} />
                                                    </button>

                                                </div>
                                            )}

                                            {user.role == "admin" && (
                                                <div className="absolute right-0 bottom-0 flex flex-row gap-5 p-5">
                                                    <button
                                                        onClick={() => toggleStatus(item, "approved")}
                                                        disabled={status == "declined"}
                                                        className={`${status == "approved" ? "bg-white border-2 border-[#64a60b] text-[#64a60b]" : "text-white bg-[#64a60b] "} font-bold cursor-pointer p-1 px-3 flex flex-row gap-2 justify-center items-center w-28 h-10 ${status == "declined" ? "bg-gray-300" : ""}`}    >
                                                        {status == "approved" ? "อนุมติเเล้ว" : "อนุมัติ"}
                                                    </button>

                                                    <button
                                                        onClick={() => toggleStatus(item, "declined")}
                                                        disabled={status == "approved"}
                                                        className={`${status == "declined" ? "bg-white border-2 border-[#d20013]  text-[#d20013] " : "text-white bg-[#d20013] "} font-bold cursor-pointer p-1 px-3 flex flex-row gap-2 justify-center items-center w-28 h-10 ${status == "approved" ? "bg-gray-300" : ""}`}    >
                                                        {status == "declined" ? "ปฎิเสธเเล้ว" : "ปฎิเสธ"}
                                                    </button>

                                                </div>
                                            )}



                                        </div>
                                    );
                                }))
                            )}
                    </div>
                </div>
            </div>

        </div>
    );
}

export default BookListPage;