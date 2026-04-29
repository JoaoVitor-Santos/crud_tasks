import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import HomeScreen from './HomeScreen';
import NewTaskScreen from './NewTaskScreen';
import EditTaskScreen from './EditTaskScreen';
import BtnLogout from './BtnLogout';
import { HomeProvider } from '../contexts/HomeContext';
import { AuthActionsProvider } from '../contexts/AuthActionsContext';

const Stack = createNativeStackNavigator();

const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <AuthActionsProvider>
        <HomeProvider>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registrar' }} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Minhas Tarefas', headerLeft: () => null, headerRight: () => <BtnLogout /> }} />
            <Stack.Screen name="NewTask" component={NewTaskScreen} options={{ title: 'Nova Tarefa' }} />
            <Stack.Screen name="EditTask" component={EditTaskScreen} options={{ title: 'Editar Tarefa' }} />
          </Stack.Navigator>
        </HomeProvider>
      </AuthActionsProvider>
    </NavigationContainer>
  );
};

export default RootNavigator;