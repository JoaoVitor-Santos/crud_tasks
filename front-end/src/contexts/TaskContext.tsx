import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import taskService from '../services/taskService';
import { Task, CreateTaskRequest, UpdateTaskRequest, StatusOption } from '../types/task';

interface TaskContextType {
  tasks: Task[];
  statuses: StatusOption[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  fetchStatuses: () => Promise<void>;
  createTask: (data: CreateTaskRequest) => Promise<void>;
  updateTask: (idt_tarefa: number, data: UpdateTaskRequest) => Promise<void>;
  deleteTask: (idt_tarefa: number) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statuses, setStatuses] = useState<StatusOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatuses = async () => {
    try {
      const response = await taskService.listStatuses();
      setStatuses(response);
    } catch (err: any) {
      setError('Erro ao carregar status.');
    }
  };

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const tasksFromApi = await taskService.listMyTasks();
      setTasks(tasksFromApi);
    } catch (err: any) {
      setError('Erro ao carregar tarefas.');
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (data: CreateTaskRequest) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    await taskService.createTask({
      ...data,
      idt_usuario: user.id,
    });
    await fetchTasks();
  };

  const updateTask = async (idt_tarefa: number, data: UpdateTaskRequest) => {
    await taskService.updateTask(idt_tarefa, data);
    await fetchTasks();
  };

  const deleteTask = async (idt_tarefa: number) => {
    await taskService.deleteTask(idt_tarefa);
    await fetchTasks();
  };

  useEffect(() => {
    if (user) {
      fetchStatuses();
      fetchTasks();
    } else {
      setTasks([]);
      setStatuses([]);
    }
  }, [user]);

  const value: TaskContextType = {
    tasks,
    statuses,
    isLoading,
    error,
    fetchTasks,
    fetchStatuses,
    createTask,
    updateTask,
    deleteTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
