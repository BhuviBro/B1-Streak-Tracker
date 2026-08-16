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

function MainRouter() {
  const { currentUser } = useAuth();
  const [demoMode, setDemoMode] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  // Auth Guard: If user is not logged in and hasn't chosen Demo mode, show Login screen
  if (!currentUser && !demoMode) {
    return <LoginScreen onSkipDemo={() => setDemoMode(true)} />;
  }

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
