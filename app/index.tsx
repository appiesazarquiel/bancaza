import { Ionicons } from "@expo/vector-icons";
import { useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIRESTORE_DB } from '../FirebaseConfig';
import LibroCard from "./components/LibroCard";
import Search from "./components/Search";
export default function Index() {
  const [libros, setLibros] = useState<any[]>([]);
  const [filteredLibros, setFilteredLibros] = useState<any[]>([]);
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);
    useEffect(() => {
      const fetchLibros = async () => {
        try {
          const librosRef = collection(FIRESTORE_DB, 'libros');
          const q = query(librosRef, orderBy('Alumnado con libro'));
          const snapshot = await getDocs(q);
          const librosData: any[] = [];

          snapshot.docs.forEach((doc) => {
            librosData.push({
              id: doc.id,
              ...doc.data(),
            });
          });

          setLibros(librosData);
          setFilteredLibros(librosData);
          //console.log(librosData);
        } catch (error) {
          console.error('Error obteniendo libros:', error);
        }
      };
      fetchLibros();
    }, []);
   // función se pasa a Search para recibir query y filtrar
 const handleSearch = (query: string) => {
   if (!query) {
     setFilteredLibros(libros);
   } else {
     setFilteredLibros(
       libros.filter(libro =>
         libro["Alumnado con libro"].toLowerCase().includes(
           query.toLowerCase()) || libro.id.toLowerCase().includes(
           query.toLowerCase())
       )
     );
   }
 };

  return (
    <SafeAreaView style={styles.container}>
      <Search onSearch={handleSearch} />
                {filteredLibros.length > 0 && (
                <FlatList
                    data={filteredLibros}
                    renderItem={({ item }) => <LibroCard item={item} />}
                    keyExtractor={(libro) => libro.id} 
                    showsVerticalScrollIndicator={true}
                    scrollEnabled={true}
                    bounces={true}
                    contentContainerStyle={styles.listContent}
                />
            )}
      {isPermissionGranted && (
        <View
          style={{
            position: "absolute",
            bottom: 32,
            right: 32,
          }}
        >
          <TouchableOpacity
            onPress={() => router.push("/qrScan")}
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: "#007AFF",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="qr-code-outline"
              size={32}
              color="white"
            />
          </TouchableOpacity>
        </View>
      )}

      {!isPermissionGranted && (
        <SafeAreaView
          style={{
            position: "absolute",
            bottom: 32,
            left: 32,
          }}
        >
          <TouchableOpacity
            onPress={requestPermission}
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: "#007AFF",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="camera-outline"
              size={32}
              color="white"
            />
            </TouchableOpacity>
        </SafeAreaView>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    listContent: {
        padding: 10,
    }
});