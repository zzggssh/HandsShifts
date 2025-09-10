import React, {useContext} from 'react';
import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ThemeContext} from './ThemeProvider';
import {TouchableOpacity, Text} from 'react-native';
import ShiftsListScreen from '../screens/ShiftsListScreen';
import ShiftDetailsScreen from '../screens/ShiftDetailsScreen';

export type RootStackParamList = {
  ShiftsList: undefined;
  ShiftDetails: {id: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const ThemeToggle = () => {
  const theme = useContext(ThemeContext);
  if (!theme) return null;
  return (
    <TouchableOpacity onPress={theme.toggle}>
      <Text style={{color: theme.colors.accent}}>Тема</Text>
    </TouchableOpacity>
  );
};

export default function Navigation() {
  const theme = useContext(ThemeContext);
  const navTheme = theme?.theme === 'dark' ? DarkTheme : DefaultTheme;
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator>
        <Stack.Screen
          name="ShiftsList"
          component={ShiftsListScreen}
          options={{title: 'Смены', headerRight: () => <ThemeToggle />}}
        />
        <Stack.Screen name="ShiftDetails" component={ShiftDetailsScreen} options={{title: 'Детали смены'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

