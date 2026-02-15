import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import CalendarScreen from '../screens/diary/CalendarScreen';
import DiaryListScreen from '../screens/diary/DiaryListScreen';
import DiaryCreateScreen from '../screens/diary/DiaryCreateScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { colors } from '../styles/globalStyles';

export type TabParamList = {
  Calendar: undefined;
  List: undefined;
  Create: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Calendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'List') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Create') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary[400],
        tabBarInactiveTintColor: colors.gray[500],
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(10, 14, 39, 0.95)',
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
          borderTopWidth: 1,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          height: Platform.OS === 'ios' ? 85 : 65,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen 
        name="Calendar" 
        component={CalendarScreen}
        options={{ tabBarLabel: 'Takvim' }}
      />
      <Tab.Screen 
        name="List" 
        component={DiaryListScreen}
        options={{ tabBarLabel: 'Liste' }}
      />
      <Tab.Screen 
        name="Create" 
        component={DiaryCreateScreen}
        options={{ tabBarLabel: 'Yeni' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profil' }}
      />
    </Tab.Navigator>
  );
}