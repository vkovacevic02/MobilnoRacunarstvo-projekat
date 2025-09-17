import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Putovanje } from '../types';
import HomeScreen from './HomeScreen';
import BookedScreen from './BookedScreen';
import ProfileScreen from './ProfileScreen';
import DestinationDetail from './DestinationDetail';

const Tab = createBottomTabNavigator();

interface MainTabsProps {
  onLogout: () => void;
}

export default function MainTabs({ onLogout }: MainTabsProps) {
  const [selectedDestination, setSelectedDestination] = useState<Putovanje | null>(null);
  const [showDestinationDetail, setShowDestinationDetail] = useState(false);

  const handleDestinationSelect = (destination: Putovanje) => {
    setSelectedDestination(destination);
    setShowDestinationDetail(true);
  };

  const handleBackToHome = () => {
    setShowDestinationDetail(false);
    setSelectedDestination(null);
  };

  if (showDestinationDetail && selectedDestination) {
    return (
      <DestinationDetail 
        destination={selectedDestination}
        onBack={handleBackToHome}
      />
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Booked') {
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'ellipse-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        options={{ tabBarLabel: 'Početna' }}
      >
        {() => <HomeScreen onLogout={onLogout} onDestinationSelect={handleDestinationSelect} />}
      </Tab.Screen>
      
      <Tab.Screen 
        name="Booked" 
        component={BookedScreen}
        options={{ tabBarLabel: 'Rezervacije' }}
      />
      
      <Tab.Screen 
        name="Profile" 
        options={{ tabBarLabel: 'Profil' }}
      >
        {() => <ProfileScreen onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
