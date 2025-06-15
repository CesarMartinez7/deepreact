import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useAudioPlayer } from "expo-audio";
import Navbar from "./ui/navbar";
import { Icon } from "@iconify/react";

const MusicPlayer = () => {
  const currentSong = {
    title: "Aiport Lady",
    artist: "Ai furihata",
    duration: "3:45",
    currentTime: "1:23",
    progress: 0.3,
  };

  const player = useAudioPlayer(require("../assets/aiport_lady.mp3"));

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [canRepeat, setCanRepeat] = useState<boolean>(false);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (player && player.duration && !player.paused && Number(player.currentStatus) !== Number(player.currentTime)) {
        setCurrentTime(player.currentTime);
        setDuration(player.duration);
        setProgress(player.currentTime / player.duration);
      }

      if (player.duration === player.currentTime) {
        if (canRepeat) {
          player.play();
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleCanRepeat = () => {
    setCanRepeat(!canRepeat);
  };

  const handlePlayPause = () => {
    if (player.paused) {
      player.play();
      setIsPlaying(true);
    } else {
      player.pause();
      setIsPlaying(false);
    }
  };

  return (
    <View className=" h-full flex items-center justify-center px-6">
      <Navbar />
      {/* Portada del álbum */}
      <View className="w-80 h-72 rounded-xl overflow-hidden shadow-lg flex justify-center items-center shadow-blue-500/20 border border-gray-700">
        <Icon icon="mingcute:music-2-fill" width="54" height="54" color="white" />
        <View className="absolute inset-0 bg-black/30" />
      </View>

      {/* Información de la canción */}
      <View className="my-8 items-center w-full">
        <Text className="text-blue-300  font-light uppercase text-xs tracking-wider">
          {currentSong.artist}
        </Text>
        <Text className="text-white text-2xl font-bold mt-1 text-center">
          {currentSong.title}
        </Text>
      </View>

      {/* Barra de progreso */}
      <View className="w-full mb-8">
        <View className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
          <View
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
            style={{ width: `${progress * 100}%` }}
          />
        </View>
        <View className="flex-row justify-between mt-2">
          <Text className="text-gray-400 text-xs">
            {formatTime(currentTime)}
          </Text>
          <Text className="text-gray-400 text-xs">
            {formatTime(duration - currentTime)}
          </Text>
        </View>
      </View>

      {/* Controles */}
      <View className="flex-row items-center justify-center gap-5">
        <TouchableOpacity className="p-3" onPress={handleCanRepeat}>
          <Icon icon={`mingcute:${!canRepeat ? "repeat-line" : "repeat-one-line"}`} color="white" width="24" height="24" />
        </TouchableOpacity>

        <TouchableOpacity className="p-3">
          <Icon color="white" icon="fe:fast-backward" width="24" height="24" />
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-gradient-to-t from-blue-600 to-blue-500 px-4 py-4 rounded-full shadow-lg shadow-blue-500/50"
          onPress={handlePlayPause}
        >
          <Icon
            icon={`mingcute:${isPlaying ? "pause-fill" : "play-fill"}`}
            width="24"
            height="24"
            color="white"
          />
        </TouchableOpacity>

        <TouchableOpacity className="p-3">
          <Icon color="white" icon="fe:fast-forward" width="24" height="24" />
        </TouchableOpacity>

        <TouchableOpacity className="p-3">
          <Icon icon="mingcute:volume-mute-line" width="24" height="24" color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MusicPlayer;
