import { API_URL } from "./api";

export const createRequest = async (data) => {
  try {
    const res = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ส่ง coookies ไปยัง backend -> req.cookies.token
    });
    return res.json();
  } catch (e) {
    console.error("Booking error:", e);
    throw new Error("Can not book this camp: " + e.message);
  }
};

export const getRequests = async () => {
  try {
    const res = await fetch(`${API_URL}/bookings`, {
      method: "GET",
      credentials: "include"
    });
    return res.json();
  } catch (e) {
    console.error("Get bookings error:", e);
    throw new Error("Can not get booking list: " + e.message);
  }
};

export const getRequest = async (id) => {
  try {
    const res = await fetch(`${API_URL}/bookings/${id}`, {
      method: "GET",
      credentials: "include"
    });
    return res.json();
  } catch (err) {
    console.error("Get booking error:", err);
    throw new Error("Can not get booking: " + err.message);
  }
};

export const updateRequest = async (bookingReq, updatedStatus) => {
  try {
    const { _id } = bookingReq;
    if (!_id) {
      throw new Error("ไม่พบ Booking ID (_id) ในข้อมูลที่ส่งไปอัปเดต");
    }

    const res = await fetch(`${API_URL}/bookings/${_id}`, {
      method: "PUT",
      body: JSON.stringify({ ...bookingReq, status: updatedStatus }),
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });
    
    if (!res.ok) {
      throw new Error(`Server ตอบกลับมาว่ามีปัญหา: ${res.status}`);
    }

    return await res.json();
  } catch (e) {
    console.error("Update booking error: ", e);
    throw new Error("Can not update the booking: " + e.message);
  }
};

export const deleteRequest = async (id) => {
  try {
    const res = await fetch(`${API_URL}/bookings/${id}`, {
      method: "DELETE",
      credentials: "include"
    });
    return await res.json();
  } catch (e) {
    console.error("Delete booking error: ", e);
    throw new Error("Can not delete the booking: " + e.message);
  }
};
