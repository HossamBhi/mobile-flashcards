import React, { Component } from "react";
import { View, StatusBar } from "react-native";
import Constatns from "expo-constants";
import { PRIMARY_COLOR, white } from "./utils/colors";
import Decks from "./components/Decks";
import AddNewDeck from "./components/AddNewDeck";
import AddNewCard from "./components/AddNewCard";
import DeckDetails from "./components/DeckDetails";
import Quiz from "./components/Quiz";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { setLocalNotification } from "./utils/helpers";
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const AppStatusBar = () => {
  return (
    <View
      style={{
        backgroundColor: PRIMARY_COLOR,
        height: Constatns.statusBarHeight,
      }}
    >
      <StatusBar
        backgroundColor={PRIMARY_COLOR}
        animated={true}
        translucent
        barStyle="light-content"
      />
    </View>
  );
};
const Tabs = createMaterialBottomTabNavigator();
const Home = () => {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Decks")
            return (
              <MaterialCommunityIcons name="cards" size={24} color={color} />
            );
          return <Entypo name="new-message" size={24} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="Decks" component={Decks} />
      <Tabs.Screen name="New Deck" component={AddNewDeck} />
    </Tabs.Navigator>
  );
};
const Stack = createStackNavigator();

export default class App extends Component {
  componentDidMount() {
    // AsyncStorage.clear()
    setLocalNotification();
  }

  render() {
    return (
      <NavigationContainer>
        <AppStatusBar />
        <Stack.Navigator>
          <Stack.Screen name="Mobile Flashcards" component={Home} />
          <Stack.Screen name="Deck Details" component={DeckDetails} />
          <Stack.Screen name="New Card" component={AddNewCard} />
          <Stack.Screen name="Quiz" component={Quiz} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
