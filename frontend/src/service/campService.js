import { API_URL } from "./api";

export const getCampgrounds = async () => {
  try {
    const res = await fetch(`${API_URL}/campgrounds`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await res.json();
  } catch (e) {
    console.error("Error to get all campgrounds data:", e);
    throw new Error("Can not get all campgrounds data: " + e.message);
  }
};

export const getCampground = async (campId) => {
  try {
    const res = await fetch(`${API_URL}/campgrounds/${campId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    return await res.json();
  } catch(err) {
    console.error("Error to get campground:", err);
    throw new Error("Can not get campground data: " + e.message);
  }
};
