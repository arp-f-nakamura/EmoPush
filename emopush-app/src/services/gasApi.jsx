import axios from "axios";

// ブラウザからは同一オリジンに見える（CORS回避）
const GAS_API_URL = "/gas";

export const getTodayCount = async () => {
  try {
    const response = await axios.get(GAS_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching count:", error);
    return null;
  }
};

export const updateCount = async (id) => {
  try {
    // ←ここが「そのボディ」。必要ならこの形に合わせて差し替え
    const body = { id: id};

    const response = await axios.post(GAS_API_URL, body, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating count:", error);
    return null;
  }
};
