import axios from 'axios';

// 建立 Axios 實例
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://26.67.49.248:8080',
  timeout: 10000, // 請求超時時間
});

// 請求攔截器
apiClient.interceptors.request.use(
  function (config) {
    // 在請求發送之前做些什麼
    const token = localStorage.getItem('token'); // 僅作為範例

    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// 回應攔截器
apiClient.interceptors.response.use(
  (response: any) => response,
  (error) => {
    // 統一錯誤處理
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error.response || error.message);
  },
);

export default apiClient;
