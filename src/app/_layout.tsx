import "../global.css";
import { Slot } from "expo-router";
import Navbar from "./ui/navbar";
import { View } from "react-native";

export default function Layout() {
  
  return (
    <View className={"bg-gradient-to-br from-black to-black backdrop-blur-md h-full text-white"}>
      <Navbar/>
      <Slot></Slot>
    </View>
  )
}
