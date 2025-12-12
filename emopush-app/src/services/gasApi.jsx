import axios from 'axios';

// GASのWeb AppのURLを設定（後でGASデプロイ後に更新）
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbzCdA-4VDYdssNOsvElDcc6hg2GAYnNB0vKCz7LPO6E0kfbBTsVGTtZsQUnttGL2MxQ/exec";

// 今日のカウントデータを取得
export const getTodayCount = async () => {
  try {
    const response = await axios.get(GAS_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching count:', error);
    return null;
  }
};

// カウントを更新
export const updateCount = async () => {
  try {
    const response = await axios.post(GAS_API_URL,
      { "emoji": "🌻"
    });
    return response.data;
  } catch (error) {
    console.error('Error updating count:', error);
    return null;
  }
};
