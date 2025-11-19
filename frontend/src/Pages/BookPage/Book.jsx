import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import Calendar from "./Calendar";
import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import { createRequest, getRequest, updateRequest } from "../../service/booking";
import { getMe } from "../../service/userService";
import { getCampground } from "../../service/campService";

const Input = ({ label, placeholder, value, setNewValue }) => (
  <div className="mb-6">
    <label className="block text-base font-medium text-gray-800 mb-2">
      {label} <span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => setNewValue(e.target.value)}
      className="w-full lg:w-7/8 px-4 py-2.5 bg-white border border-green-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-colors placeholder-gray-400"
    />
  </div>
);

const Book = () => {
  const {id} = useParams();
  const isEditMode = Boolean(id);

  const [camp, setCamp] = useState();
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date());
  const [prevcheckOut, setPrevcheckOut] = useState(new Date());

  const [userName, setUserName] = useState("");
  const [tel, setTel] = useState("");
  const [number, setNumber] = useState("");
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);

  const { state } = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      setError("กรุณาเข้าสู่ระบบเพื่อดูรายการการจอง");
      return;
    }
    getMe().then(data => {
      if (data.success) {
        setUserId(data.data._id);
        setRole(data.data.role);
      }
    });
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (isEditMode) {
        try {
          const bookingRes = await getRequest(id);
          if (!bookingRes.success) throw new Error("ไม่พบข้อมูลการจอง");
          
          const data = bookingRes.data;
          setUserName(data.userName);
          setTel(data.tel);
          setNumber(data.number);
          setCheckIn(new Date(data.checkIn));
          setCheckOut(new Date(data.checkOut));
          setPrevcheckOut(new Date(data.checkOut));
          setUserId(data.user);

          const campRes = await getCampground(data.campgroundId);
          if (campRes.success) {
            setCamp(campRes.data);
          }
        } catch(err) {
          setError(err.message);
        }
      } else {
        if (!state || !state.camp) {
          alert("ไม่พบข้อมูลแคมป์");
          nav(-1);
          return;
        }
        setCamp(state.camp);
      }
    };
    loadData();
  }, [id, isEditMode, state, nav]);

  useEffect(() => {
    const diff = (checkOut - checkIn) / (24 * 60 * 60 * 1000);
    if (diff > 3) {
      alert("จองได้มากสุด 3 วัน กรุณาเลือกวันใหม่");
      setCheckOut(prevcheckOut);
    } else {
      setPrevcheckOut(checkOut);
    }
  }, [checkOut]);

  const check = () => {
    if (!number || !tel || !userName) {
      alert("กรุณาเลือกกรอกข้อมูลให้ครบถ้วน");
      return false;
    }
    if (userName.length > 50) {
      alert("ชื่อ-นามสกุล มีความยาวได้มากสุด 50 ตัวอักษร");
      return false;
    }
    if (tel.length != 10) {
      alert("กรุณาเลือกกรอกเบอร์โทรศัพท์ใหม่");
      return false;
    }
    if (isNaN(number) || number < 0) {
      alert("กรุณาเลือกกรอกจำนวนผู้เข้าพักใหม่");
      return false;
    }
    return true;
  };

  const submit = async () => {
    if (!check()) return;
    const data = {
      userName,
      user: userId,
      tel,
      number,
      checkIn,
      checkOut,
      campgroundId: camp._id,
    };
    
    try {
      let res;
      if (isEditMode) {
        const updateData = {...data, _id: id};
        res = await updateRequest(updateData);
        alert(res.msg || "อัปเดตข้อมูลสำเร็จ!");
      } else {
        res = await createRequest(data);
        alert(res.msg);
      }

      if (res.success) {
        if (role == "user") nav("/homepage");
        if (role == "admin") nav("/booklistpage");
      }
    } catch(err) {
      console.error("Submit error:", err);
      alert("เกิดข้อผิดพลาด: " + err.message);
    }
  };

  if (!camp) return null;
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="min-h-screen flex flex-col items-center p-4 font-sans relative z-50">
      <div className="w-full max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-sm">
        {/* head */}
        <div className="flex flex-row w-full gap-5 items-center justify-center relative p-5 mb-5">
          <div
            className="hover:bg-gray-200 cursor-pointer rounded-full p-2 absolute left-[-20px] top-[-5px] lg:left-0 lg:top-5"
            onClick={() => nav(-1)}
          >
            <FaArrowLeft className="lg:w-10 lg:h-10 md:w-8 md:h-8  w-6 h-6" />
          </div>
          <div className="flex flex-row items-center justify-center">
            <img
              src="https://i.postimg.cc/HL2jYJDc/camping-tent.png"
              alt="Camping Logo"
              className="lg:w-16 w-12 md:w-14 aspect-square rounded-full mr-4 border-2 border-white shadow-md"
            />

            <h1 className="text-xl lg:text-3xl md:text-2xl font-bold text-gray-800">
              {camp.name}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-5">
          {/* Date*/}
          <div className="text-center lg:text-start">
            <div className="text-gray-800 mb-5 font-semibold text-xl">
              เลือกวัน Check-in
            </div>
            <Calendar date={checkIn} setDate={setCheckIn} />
          </div>

          <div className="text-center lg:text-start" >
            <div className="text-gray-800 mb-5 font-semibold text-xl">
              เลือกวัน Check-out
            </div>
            <Calendar date={checkOut} setDate={setCheckOut} />
          </div>

          {/* Info */}
          <div>
            <div className="text-gray-800 mb-5 font-semibold text-xl">
              ข้อมูล
            </div>

            <Input
              label="ชื่อ-นามสกุล"
              placeholder="กรุณากรอก ชื่อ-นามสกุล"
              value={userName}
              setNewValue={setUserName}
            />
            <Input
              label="เบอร์โทรศัพท์"
              placeholder="กรุณากรอก เบอร์โทรศัพท์ "
              value={tel}
              setNewValue={setTel}
            />

            <Input
              label="จำนวนผู้เข้าพัก"
              placeholder="กรุณากรอกข้อมูล"
              value={number}
              setNewValue={setNumber}
            />
          </div>
        </div>

        <div className="w-full flex justify-center">
          <button
            className="bg-[#3A6F43] hover:bg-green-900 text-white font-bold py-3 w-1/4 mb-3 rounded-sm  cursor-pointer hover:scale-101  hover:shadow-black/40 ease-in-out transition duration-100"
            onClick={submit}
          >
            {isEditMode ? "บันทึกการเปลี่ยนแปลง" : "ยืนยันการจอง"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Book;
