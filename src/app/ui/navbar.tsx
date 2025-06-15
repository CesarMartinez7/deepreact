import { View, Text, Button } from "react-native";
import { Image } from "react-native";

import { Icon } from "@iconify/react/dist/iconify.js";

export default function Navbar() {
  return (
    <View className="rounded-md px-5 w-full fixed top-0 p-5 flex-row flex-1  backdrop-blur-2xl shadow-md  rounded-b-md  flex justify-between items-center ">
      <Text>
        <Icon
          icon="mingcute:arrow-left-line"
          width="20"
          height="20"
          color="white"
        />
      </Text>
      <Text className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 font-bold text-xl bg-clip-text text-transparent tracking-wide">
        reactdeep
      </Text>

      <Text>
        
      </Text>
    </View>
  );
}
