import useMessageStore from '@/store/message';
import useTourStore from '@/store/tour';
import axios from 'axios';

const errorMap: {
  [key: number]: string;
} = {
  1700: '請至少設定一個收款方式',
  1601: '請先完成 KYC 認證',
};

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
    const { setData } = useMessageStore.getState();
    const { setKycTour, setBankTour } = useTourStore.getState();

    if (error.response?.data?.code) {
      const code = error.response.data.code;

      if (errorMap[code]) {
        setData({
          show: true,
          content: errorMap[code],
          type: 'error',
        });
      }

      if (code === 1601) {
        setTimeout(() => {
          window.location.href = '/profile/info';
        }, 500);
        setKycTour(true);
      }

      if (code === 1700) {
        setTimeout(() => {
          window.location.href = '/profile/payment';
        }, 500);
        setBankTour(true);
      }
    }

    return Promise.reject(error.response?.data);
  },
);

export default apiClient;
