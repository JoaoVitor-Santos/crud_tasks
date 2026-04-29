import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import TableTasks from './TableTasks';
import { useTasks } from '../contexts/TaskContext';
import { useHome } from '../contexts/HomeContext';

const HomeScreen: React.FC = () => {
  const { tasks, isLoading, error } = useTasks();
  const { handleView, handleEdit, handleDelete, handleCreateTask } = useHome();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.newTaskButton} onPress={handleCreateTask}>
        <Text style={styles.newTaskButtonText}>+ Nova Tarefa</Text>
      </TouchableOpacity>
      {isLoading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <TableTasks data={tasks} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  newTaskButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  newTaskButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HomeScreen;