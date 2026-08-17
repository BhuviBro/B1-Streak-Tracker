import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { AppLayout } from './components/layout/AppLayout';
import { HomeScreen } from './components/home/HomeScreen';
import { RoutinesScreen } from './components/routines/RoutinesScreen';
import { HistoryScreen } from './components/history/HistoryScreen';
import { SettingsScreen } from './components/settings/SettingsScreen';
import { AddTaskModal } from './components/tasks/AddTaskModal';
import { LoginScreen } from './components/common/LoginScreen';

import { useData } from './context/DataContext';
import { CarryForwardModal } from './components/common/CarryForwardModal';

function MainRouter() {
  const { currentUser } = useAuth();
  const { tasks, profile, batchCarryForwardTasks } = useData();
  const [demoMode, setDemoMode] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  // Today tracker date constant matching app design
  const todayStr = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  // Auth Guard: If user is not logged in and hasn't chosen Demo mode, show Login screen
  if (!currentUser && !demoMode) {
    return <LoginScreen onSkipDemo={() => setDemoMode(true)} />;
  }

  // Scan for past incomplete tasks
  const overdueIncompleteTasks = tasks.filter(t => {
    // If task is completed or cancelled, ignore
    if (t.completed || t.cancelled) return false;
    // If task scheduledDate is in the past compared to todayStr, it is overdue
    return t.scheduledDate < todayStr;
  });

  // Verify if popup check-in was already processed for today
  const hasProcessedToday = profile.lastActiveDate === todayStr;
  const showOverduePopup = !hasProcessedToday && overdueIncompleteTasks.length > 0;

  const handleCarryForwardConfirm = (taskActions) => {
    batchCarryForwardTasks(taskActions, todayStr);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':     return <HomeScreen onNavigate={setActiveTab} />;
      case 'routines': return <RoutinesScreen />;
      case 'history':  return <HistoryScreen />;
      case 'settings': return <SettingsScreen />;
      default:         return <HomeScreen onNavigate={setActiveTab} />;
    }
  };

  return (
    <AppLayout
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      onAddTaskClick={() => setIsAddTaskOpen(true)}
    >
      {renderScreen()}
      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
      />
      <CarryForwardModal
        isOpen={showOverduePopup}
        incompleteTasks={overdueIncompleteTasks}
        onConfirm={handleCarryForwardConfirm}
      />
    </AppLayout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <MainRouter />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
