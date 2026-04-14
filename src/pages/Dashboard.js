import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SignOut, User, List } from '@phosphor-icons/react';
import { Toaster, toast } from 'sonner';
import ChatInterface from '../components/ChatInterface';
import ChatSidebar from '../components/ChatSidebar';
import MealWidget from '../components/MealWidget';
import WorkoutWidget from '../components/WorkoutWidget';
import ProgressWidget from '../components/ProgressWidget';
import ProfileModal from '../components/ProfileModal';
import {
  getMe, logout as logoutApi,
  sendMessage, getChatHistory, getChatSessions, deleteChatSession,
  generateMealPlan, getMealPlans,
  generateWorkout, getWorkouts, completeWorkout,
  addProgress, getProgress, getProgressSummary
} from '../api';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(location.state?.user || null);
  const [isAuthenticated, setIsAuthenticated] = useState(location.state?.user ? true : null);
  const [currentChatSession, setCurrentChatSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSessions, setChatSessions] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [workouts, setWorkoutsState] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [progressSummary, setProgressSummary] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  useEffect(() => {
    if (location.state?.user) return;
    const checkAuth = async () => {
      try {
        const res = await getMe();
        setUser(res.data);
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
        navigate('/login');
      }
    };
    checkAuth();
  }, [location.state, navigate]);

  const loadAllData = useCallback(async () => {
    try {
      const [sessionsRes, mealsRes, workoutsRes, progressRes, summaryRes] = await Promise.all([
        getChatSessions(),
        getMealPlans(),
        getWorkouts(),
        getProgress(),
        getProgressSummary()
      ]);
      setChatSessions(sessionsRes.data);
      setMealPlans(mealsRes.data);
      setWorkoutsState(workoutsRes.data);
      setProgressData(progressRes.data);
      setProgressSummary(summaryRes.data);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadAllData();
  }, [isAuthenticated, loadAllData]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMsg = { role: 'user', content: inputMessage, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    const msgText = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await sendMessage(msgText, currentChatSession);
      const aiMsg = {
        role: 'assistant', content: res.data.content,
        intent: res.data.intent, timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMsg]);
      setCurrentChatSession(res.data.chat_session_id);
      const sessionsRes = await getChatSessions();
      setChatSessions(sessionsRes.data);
    } catch (err) {
      console.error('Send failed:', err);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSession = async (sessionId) => {
    try {
      const res = await getChatHistory(sessionId);
      setMessages(res.data);
      setCurrentChatSession(sessionId);
      setShowMobileSidebar(false);
    } catch (err) {
      console.error('Failed to load chat:', err);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatSession(null);
    setShowMobileSidebar(false);
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await deleteChatSession(sessionId);
      if (currentChatSession === sessionId) {
        setMessages([]);
        setCurrentChatSession(null);
      }
      const sessionsRes = await getChatSessions();
      setChatSessions(sessionsRes.data);
      toast.success('Chat deleted');
    } catch (err) {
      toast.error('Failed to delete chat');
    }
  };

  const handleGenerateMeal = async () => {
    try {
      await generateMealPlan();
      const res = await getMealPlans();
      setMealPlans(res.data);
      toast.success('Meal plan generated!');
    } catch (err) {
      toast.error('Failed to generate meal plan');
    }
  };

  const handleGenerateWorkout = async () => {
    try {
      await generateWorkout();
      const res = await getWorkouts();
      setWorkoutsState(res.data);
      toast.success('Workout generated!');
    } catch (err) {
      toast.error('Failed to generate workout');
    }
  };

  const handleCompleteWorkout = async (workoutId) => {
    try {
      await completeWorkout(workoutId);
      const res = await getWorkouts();
      setWorkoutsState(res.data);
      const summaryRes = await getProgressSummary();
      setProgressSummary(summaryRes.data);
      toast.success('Workout completed!');
    } catch (err) {
      toast.error('Failed to complete workout');
    }
  };

  const handleAddProgress = async (data) => {
    try {
      await addProgress(data);
      const [progressRes, summaryRes] = await Promise.all([getProgress(), getProgressSummary()]);
      setProgressData(progressRes.data);
      setProgressSummary(summaryRes.data);
      toast.success('Progress saved!');
    } catch (err) {
      toast.error('Failed to save progress');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
      navigate('/login');
    } catch {
      navigate('/login');
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FF3B30] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#A1A1AA] uppercase tracking-wide text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Toaster position="top-right" theme="dark" />

      {/* Header */}
      <header className="backdrop-blur-xl bg-[#0A0A0A]/80 border-b border-[#27272A] sticky top-0 z-40">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              data-testid="mobile-menu-btn"
              className="md:hidden p-2 hover:bg-[#1A1A1A] transition-colors"
            >
              <List size={20} />
            </button>
            <h1
              className="text-xl sm:text-2xl font-black tracking-tighter uppercase"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              FITNESS<span className="text-[#FF3B30]">AI</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setShowProfile(true)}
              data-testid="open-profile-btn"
              className="flex items-center gap-2 p-2 hover:bg-[#1A1A1A] transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[#FF3B30] flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="text-xs text-[#A1A1AA] hidden sm:block">{user?.name}</span>
            </button>
            <button
              onClick={handleLogout}
              data-testid="logout-btn"
              className="p-2 hover:bg-[#1A1A1A] transition-colors"
            >
              <SignOut size={18} className="text-[#A1A1AA]" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-3 sm:p-4 lg:p-6">
        {/* Left Sidebar - Chat Sessions */}
        <div className={`md:col-span-2 lg:col-span-2 ${showMobileSidebar ? 'block' : 'hidden'} md:block`}>
          <ChatSidebar
            sessions={chatSessions}
            currentSession={currentChatSession}
            onSelectSession={handleSelectSession}
            onNewChat={handleNewChat}
            onDeleteSession={handleDeleteSession}
          />
        </div>

        {/* Center - Chat */}
        <div className="md:col-span-7 lg:col-span-7">
          <ChatInterface
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
          />
        </div>

        {/* Right Sidebar - Widgets */}
        <div className="md:col-span-3 lg:col-span-3 space-y-4">
          <MealWidget mealPlans={mealPlans} onGenerate={handleGenerateMeal} />
          <WorkoutWidget
            workouts={workouts}
            onGenerate={handleGenerateWorkout}
            onComplete={handleCompleteWorkout}
          />
          <ProgressWidget
            progressData={progressData}
            summary={progressSummary}
            onAddProgress={handleAddProgress}
          />
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        user={user}
      />
    </div>
  );
};

export default Dashboard;
