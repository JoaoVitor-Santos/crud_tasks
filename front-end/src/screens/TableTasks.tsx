import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Task } from '../types/task';

interface TableTasksProps {
  data: Task[];
  onView?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

const TaskRow: React.FC<{
  task: Task;
  onView?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}> = ({ task, onView, onEdit, onDelete }) => {
  const handleView = () => {
    onView?.(task);
  };

  const handleEdit = () => {
    onEdit?.(task);
  };

  const handleDelete = () => {
    onDelete?.(task);
  };

  return (
    <View style={styles.row}>
      <Text style={styles.cell}>{task.nom_tarefa}</Text>
      <Text style={styles.cell}>{task.ind_status ?? '—'}</Text>
      <Text style={styles.cell}>{task.des_tarefa}</Text>

      <View style={styles.actions}>
        <TouchableOpacity onPress={handleEdit}>
          <Text style={styles.icon}>✏️</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDelete}>
          <Text style={styles.icon}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const TableTasks: React.FC<TableTasksProps> = ({
  data,
  onView,
  onEdit,
  onDelete,
}) => {
  const renderItem = ({ item }: { item: Task }) => (
    <TaskRow task={item} onView={onView} onEdit={onEdit} onDelete={onDelete} />
  );

  return (
    <View style={styles.container}>
      {/* HEADER FIXO */}
      <View style={styles.header}>
        <Text style={[styles.cell, styles.headerCell]}>Tarefa</Text>
        <Text style={[styles.cell, styles.headerCell]}>Status</Text>
        <Text style={[styles.cell, styles.headerCell]}>Descrição</Text>
        <Text style={[styles.actions, styles.headerCell]}>Ações</Text>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.idt_tarefa?.toString() ?? index.toString()
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  headerCell: {
    fontWeight: 'bold',
  },
  actions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  icon: {
    fontSize: 18,
  },
});

export default TableTasks;