import api from "./axios";


/* DASHBOARD STATS */
export const getDashboardStats = async () => {
  const res = await api.get("/dashboard/stats");
  return res.data;
};

/* TOP STORES */
export const getTopStores = async (period = "month") => {
  const res = await api.get(`/dashboard/top-stores?period=${period}`);
  return res.data;
};

/* EXPORT EXCEL */
export const downloadTopStoresExcel = (period = "month") => {
  window.open(
    `${import.meta.env.VITE_API_URL}/dashboard/top-stores/export?period=${period}`,
    "_blank"
  );
};