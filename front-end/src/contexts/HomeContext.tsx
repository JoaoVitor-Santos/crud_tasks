import React, { createContext, useContext, ReactNode } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTasks } from './TaskContext';
import { Task } from '../types/task';

interface HomeContextType {
  handleView: (task: Task) => void;
  handleEdit: (task: Task) => void;
  handleDelete: (task: Task) => Promise<void>;
  handleCreateTask: () => void;
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);

export const useHome = (): HomeContextType => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useHome must be used within a HomeProvider');
  }
  return context;
};

interface HomeProviderProps {
  children: ReactNode;
}

export const HomeProvider: React.FC<HomeProviderProps> = ({ children }) => {
  const navigation = useNavigation<any>();
  const { deleteTask } = useTasks();

  const handleView = (task: Task) => {
    alert(`Visualizar tarefa: ${task.nom_tarefa}`);
  };

  const handleEdit = (task: Task) => {
    navigation.navigate('EditTask' as never, { task } as never);
  };

  const handleDelete = async (task: Task) => {
    try {
      await deleteTask(task.idt_tarefa);
      alert('Tarefa deletada com sucesso!');
    } catch (error) {
      alert('Erro ao deletar tarefa.');
    }
  };

  const handleCreateTask = () => {
    navigation.navigate('NewTask' as never);
  };

  const value: HomeContextType = {
    handleView,
    handleEdit,
    handleDelete,
    handleCreateTask,
  };

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
};