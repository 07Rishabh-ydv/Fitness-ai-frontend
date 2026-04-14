import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API,
  withCredentials: true
});

// Auth
export const register = (email, password, name) =>
  api.post('/auth/register', { email, password, name });

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const getMe = () => api.get('/auth/me');

export const logout = () => api.post('/auth/logout');

export const refreshToken = () => api.post('/auth/refresh');

// Profile
export const getProfile = () => api.get('/profile');

export const updateProfile = (data) => api.put('/profile', data);

// Chat
export const sendMessage = (message, chatSessionId) =>
  api.post('/chat/message', { message, chat_session_id: chatSessionId });

export const getChatHistory = (sessionId) =>
  api.get(`/chat/history/${sessionId}`);

export const getChatSessions = () => api.get('/chat/sessions');

export const deleteChatSession = (sessionId) =>
  api.delete(`/chat/sessions/${sessionId}`);

// Meals
export const generateMealPlan = () => api.post('/meals/generate');

export const getMealPlans = () => api.get('/meals');

// Workouts
export const generateWorkout = () => api.post('/workouts/generate');

export const getWorkouts = () => api.get('/workouts');

export const completeWorkout = (workoutId) =>
  api.put(`/workouts/${workoutId}/complete`);

// Progress
export const addProgress = (data) => api.post('/progress', data);

export const getProgress = () => api.get('/progress');

export const getProgressSummary = () => api.get('/progress/summary');

// Password Reset
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });

export const resetPassword = (token, new_password) =>
  api.post('/auth/reset-password', { token, new_password });

// PDF Export
export const exportMealPDF = (planId) =>
  api.get(`/meals/${planId}/pdf`, { responseType: 'blob' });

export const exportWorkoutPDF = (workoutId) =>
  api.get(`/workouts/${workoutId}/pdf`, { responseType: 'blob' });

// RAG
export const refreshRAG = () => api.post('/rag/refresh');

export const getRAGStatus = () => api.get('/rag/status');
