import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { TaskProvider } from './src/contexts/TaskContext';
import RootNavigator from './src/screens/RootNavigator';

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <RootNavigator />
        <StatusBar style="auto" />
      </TaskProvider>
    </AuthProvider>
  );
}
