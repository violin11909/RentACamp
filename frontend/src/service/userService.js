import { API_URL } from "./api";
import Cookies from 'js-cookie';

const getAuthHeaders = () => {
  const token = Cookies.get("token");
  if (!token) {
    return { "Content-Type": "application/json" };
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
};

export const register = async (newUser) => {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser)
    });
    return await res.json();
  } catch (err) {
    console.error("Registration failed: ", err);
    throw new Error("Can not create user");
  }
};

export const login = async (email, password) => {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    return data;
  } catch (e) {
    console.error("Login error:", e);
    throw new Error("Can not login: " + e.message);
  }
};

export const getMe = async () => {
  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error("Failed to fetch profile");
    return await res.json();
  } catch (err) {
    console.error("GetMe failed: ", err);
    throw err;
  }
};

export const getUserLocation = async () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };
      console.log("User location :", userLocation);
      return userLocation;
    },
    () => {
      // ถ้าล้มเหลว (เช่น ผู้ใช้ไม่อนุญาต)
      console.error("Error: Geolocation service failed or permission denied.");
      return null;
    }
  );

}