import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import { AuthProvider } from './context/authContext';
import HomeScreen from './screens/HomeScreen';
import ManageChildrenScreen from './screens/ManageChildren';
import ManageClassesScreen from './screens/ManageClass';
import ManageUsersScreen from './screens/ManageUsers';
import ManageAgendamentosScreen from './screens/ManageAgendamentos';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {


  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='WelcomeScreen'>
          <Stack.Screen
            name="WelcomeScreen"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ManageChildren"
            component={ManageChildrenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ManageClass"
            component={ManageClassesScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ManageUsers"
            component={ManageUsersScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ManageAgendamentos"
            component={ManageAgendamentosScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
