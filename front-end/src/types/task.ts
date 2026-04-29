export interface Task {
  idt_tarefa: number;
  nom_tarefa: string;
  des_tarefa: string;
  ind_ativo: boolean;
  idt_status: number;
  ind_status: string;
}

export interface StatusOption {
  idt_status: number;
  ind_status: string;
}

export interface CreateTaskRequest {
  nom_tarefa: string;
  des_tarefa: string;
  idt_usuario?: number;
}

export interface UpdateTaskRequest {
  nom_tarefa: string;
  des_tarefa: string;
  idt_status: number;
}
