import ApiService from './api';
import { Task, CreateTaskRequest, UpdateTaskRequest, StatusOption } from '../types/task';

const taskService = {
  async listMyTasks(): Promise<Task[]> {
    return ApiService.list_my_tasks();
  },

  async createTask(data: CreateTaskRequest): Promise<any> {
    return ApiService.createTask(data);
  },

  async updateTask(idt_tarefa: number, data: UpdateTaskRequest): Promise<any> {
    return ApiService.updateTask(idt_tarefa, data);
  },

  async deleteTask(idt_tarefa: number): Promise<any> {
    return ApiService.deleteTask(idt_tarefa);
  },

  async listStatuses(): Promise<StatusOption[]> {
    return ApiService.listStatus();
  },
};

export default taskService;
