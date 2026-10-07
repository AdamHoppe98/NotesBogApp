import { StyleSheet, Text, View, TextInput, Pressable, FlatList, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Home.js'
import NoteComponent from './NoteComponent.js';


const Stack = createNativeStackNavigator();


export default function App() {
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Home' component={Home}/>
        <Stack.Screen name='Note' component={NoteComponent}/>
      </Stack.Navigator>
    </NavigationContainer>
          
        );
      }
      
     
      

