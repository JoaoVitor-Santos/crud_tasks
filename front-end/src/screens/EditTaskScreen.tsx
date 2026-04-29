import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTasks } from '../contexts/TaskContext';
import { Task, StatusOption } from '../types/task';

const EditTaskScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { task } = route.params as { task: Task };
  const { statuses, updateTask } = useTasks();
  const [taskName, setTaskName] = useState(task.nom_tarefa);
  const [description, setDescription] = useState(task.des_tarefa);
  const [selectedStatus, setSelectedStatus] = useState<number>(task.idt_status);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggleDropdown = () => {
    setIsDropdownOpen((current) => !current);
  };

  const handleSelectStatus = (statusId: number) => {
    setSelectedStatus(statusId);
    setIsDropdownOpen(false);
  };

  const handleSave = async () => {
    if (!taskName.trim() || !description.trim()) {
      Alert.alert('Erro', 'Por favor, preencha nome e descrição.');
      return;
    }

    setIsLoading(true);
    try {
      await updateTask(task.idt_tarefa, {
        nom_tarefa: taskName.trim(),
        des_tarefa: description.trim(),
        idt_status: selectedStatus,
      });

      Alert.alert('Sucesso', 'Tarefa atualizada com sucesso.', [
        {
          text: 'OK',
          onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Home' as never }] }),
        },
      ]);
      navigation.reset({ index: 0, routes: [{ name: 'Home' as never }] });
    } catch (error: any) {
      Alert.alert('Erro', error?.response?.data?.detail || 'Falha ao atualizar tarefa.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedStatusOption = statuses.find((option) => option.idt_status === selectedStatus);
  const currentStatusLabel = selectedStatusOption?.ind_status ?? task.ind_status ?? 'Selecione um status';

  const StatusOptionItem: React.FC<{ statusOption: StatusOption }> = ({ statusOption }) => {
    const handlePress = () => {
      handleSelectStatus(statusOption.idt_status);
    };

    return (
      <TouchableOpacity style={styles.dropdownItem} onPress={handlePress}>
        <Text style={styles.dropdownItemText}>{statusOption.ind_status}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Tarefa</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome da tarefa"
        value={taskName}
        onChangeText={setTaskName}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descrição"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Text style={styles.label}>Status</Text>
      <TouchableOpacity style={styles.dropdown} onPress={handleToggleDropdown}>
        <Text style={styles.dropdownText}>{currentStatusLabel}</Text>
      </TouchableOpacity>
      {isDropdownOpen && (
        <View style={styles.dropdownList}>
          {statuses.map((statusOption: StatusOption) => (
            <StatusOptionItem key={statusOption.idt_status} statusOption={statusOption} />
          ))}
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Salvar</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
  },
  dropdownText: {
    color: '#333',
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    color: '#333',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditTaskScreen;
