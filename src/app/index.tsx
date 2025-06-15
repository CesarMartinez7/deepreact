import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Platform, PermissionsAndroid } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';

export default function MusicPlayer() {
  const [songs, setSongs] = useState([]);
  const [currentSound, setCurrentSound] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // 1. Solicitar permisos correctamente
  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Permiso de almacenamiento',
            message: 'La app necesita acceso a tus archivos de audio',
            buttonPositive: 'Aceptar'
          }
        );
        setPermissionGranted(granted === PermissionsAndroid.RESULTS.GRANTED);
      } else {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        setPermissionGranted(status === 'granted');
      }
    };

    requestPermissions();
  }, []);

  // 2. Cargar música solo con permisos
  useEffect(() => {
    if (permissionGranted) {
      loadMusic();
    }
    return () => {
      if (currentSound) {
        currentSound.unloadAsync();
      }
    };
  }, [permissionGranted]);

  const loadMusic = async () => {
    try {
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: 'audio',
        first: 100, // Limitar resultados para mejor performance
      });
      setSongs(media.assets);
    } catch (error) {
      console.error('Error cargando música:', error);
    }
  };

  const playSong = async (uri) => {
    try {
      if (currentSound) {
        await currentSound.unloadAsync();
      }
      
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );
      setCurrentSound(sound);
      
      // Configurar para reproducción en segundo plano
      await Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
      });
    } catch (error) {
      console.error('Error reproduciendo:', error);
    }
  };

  // 3. Manejar estado de permisos
  if (!permissionGranted) {
    return (
      <View className='text-center text-white m-auto'>
        <Text className='text-center text-white'>Se necesitan permisos para acceder a la música</Text>
      </View>
    );
  }

  // 4. Renderizado principal
  return (
    <View style={{ flex: 1, padding: 20 }}>
      {songs.length === 0 ? (
        <Text>No se encontraron canciones</Text>
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => playSong(item.uri)}
              style={{ 
                padding: 15, 
                borderBottomWidth: 1,
                borderBottomColor: '#ddd',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <Text style={{ flex: 1 }} numberOfLines={1}>
                {item.filename.replace('.mp3', '').replace('.wav', '')}
              </Text>
              <Text style={{ color: 'gray' }}>
                {Math.floor(item.duration / 1000)}s
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}