import { API_URL } from "./api";

export const createRequest = async (data) => {
  try {
    const res = await fetch(`${API_URL}/booking`, {
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
    const res = await fetch(`${API_URL}/booking`, {
      method: "GET",
      credentials: "include"
    });
    return res.json();
  } catch(e) {
    console.error("Get bookings error:", e);
    throw new Error("Can not get booking list: " + e.message);
  }
};

export const updateRequest = async (data) => {
  try {
    const res = await fetch(`${API_URL}/booking`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });

    return await res.json();
  } catch(e) {
    console.error("Update booking error: ", e);
    throw new Error("Can not update the booking: " + e.message);
  }
};

export const deleteRequest = async (id) => {
  try {
    const res = await fetch(`${API_URL}/booking/${id}`, {
      method: "DELETE",
      credentials: "include"
    });
    return await res.json();
  } catch(e) {
    console.error("Delete booking error: ", e);
    throw new Error("Can not delete the booking: " + e.message);
  }
};