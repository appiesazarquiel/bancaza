import { FIRESTORE_DB } from '@/FirebaseConfig';
import LibroCard from '@/app/components/LibroCard';
import Search from '@/app/components/Search';
import { useAuth } from '@/app/context/AuthContext';
import { Ionicons } from "@expo/vector-icons";
import { useCameraPermissions } from "expo-camera";
import * as Print from 'expo-print';
import { router } from "expo-router";
import * as Sharing from 'expo-sharing';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const chunkItems = <T,>(items: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

export default function Index() {
  const [libros, setLibros] = useState<any[]>([]);
  const [filteredLibros, setFilteredLibros] = useState<any[]>([]);
  const [permission, requestPermission] = useCameraPermissions();
  const { logout } = useAuth();
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
      } catch (error) {
        console.error('Error obteniendo libros:', error);
      }
    };
    fetchLibros();
  }, []);

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredLibros(libros);
    } else {
      setFilteredLibros(
        libros.filter(libro =>
          libro["Alumnado con libro"].toLowerCase().includes(
            query.toLowerCase())
        )
      );
    }
  };

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro de que quieres cerrar sesión?', [
      {
        text: 'Cancelar',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Cerrar sesión',
        onPress: async () => {
          try {
            await logout();
            router.replace('/auth/login');
          } catch (error) {
            console.error('Error al cerrar sesión:', error);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const handleExportPdf = async () => {
    try {
      const itemsPerPage = 24;
      const pages = chunkItems(filteredLibros, itemsPerPage);
      const totalPages = Math.max(1, pages.length);

      const pagesHtml =
        filteredLibros.length === 0
          ? `
            <section class="page">
              <h1>Listado de Libros</h1>
              <p class="summary">Total elementos mostrados: 0</p>
              <p>No hay resultados para exportar.</p>
            </section>
          `
          : pages
              .map((pageItems, pageIndex) => {
                const baseIndex = pageIndex * itemsPerPage;
                const listItems = pageItems
                  .map(
                    (libro, itemIndex) => `
                      <li>
                        <div class="line1">${baseIndex + itemIndex + 1}. ${escapeHtml(libro['Alumnado con libro'])} <span class="bookId">(${escapeHtml(libro.id)})</span></div>
                        <div class="line2">${escapeHtml(libro.Libro)}</div>
                        <div class="meta">Editorial: ${escapeHtml(libro.Editorial)} | Materia: ${escapeHtml(libro.Materia)} | Curso: ${escapeHtml(libro['Oferta Educativa'])}</div>
                      </li>
                    `
                  )
                  .join('');

                return `
                  <section class="page ${pageIndex < totalPages - 1 ? 'pageBreak' : ''}">
                    <h1>Listado de Libros</h1>
                    <p class="summary">Total elementos mostrados: ${filteredLibros.length}</p>
                    <ul class="listado">
                      ${listItems}
                    </ul>
                  </section>
                `;
              })
              .join('');

      const html = `
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              @page { size: A4; margin: 14mm; }
              body { font-family: Arial, sans-serif; color: #222; margin: 0; }
              .page { position: relative; min-height: 260mm; }
              .pageBreak { break-after: page; page-break-after: always; }
              h1 { margin: 0 0 6px 0; font-size: 18px; }
              .summary { margin: 0 0 10px 0; color: #555; font-size: 12px; }
              .listado { margin: 0; padding-left: 0; list-style: none; }
              .listado li { margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid #ececec; }
              .line1 { font-size: 12px; color: #222; font-weight: 600; margin-bottom: 2px; }
              .line2 { font-size: 12px; color: #1f2937; margin-bottom: 2px; }
              .bookId { color: #6b7280; white-space: nowrap; }
              .meta { font-size: 10px; color: #666; }
            </style>
          </head>
          <body>
            ${pagesHtml}
          </body>
        </html>
      `;

      if (Platform.OS === 'web') {
        const webWindow = (globalThis as any)?.window;
        const webDocument = webWindow?.document;

        if (!webDocument?.body) {
          Alert.alert('Error', 'No se pudo preparar la impresión en web.');
          return;
        }

        const iframe = webDocument.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.setAttribute('aria-hidden', 'true');
        iframe.srcdoc = html;

        iframe.onload = () => {
          const frameWindow = iframe.contentWindow;
          if (!frameWindow) {
            iframe.remove();
            Alert.alert('Error', 'No se pudo abrir la vista de impresión.');
            return;
          }

          frameWindow.focus();
          frameWindow.print();
          setTimeout(() => iframe.remove(), 1500);
        };

        webDocument.body.appendChild(iframe);
        return;
      }

      const { uri } = await Print.printToFileAsync({ html });
      const canShare = await Sharing.isAvailableAsync();

      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Compartir PDF',
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert('PDF generado', `Se ha creado en: ${uri}`);
      }
    } catch (error) {
      console.error('Error generando PDF:', error);
      Alert.alert('Error', 'No se pudo generar el PDF.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Search onSearch={handleSearch} />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#e74c3c" />
        </TouchableOpacity>
      </View>

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

      <View style={styles.pdfFabContainer}>
        <TouchableOpacity onPress={handleExportPdf} style={styles.pdfFabButton}>
          <Ionicons name="document-text-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {isPermissionGranted && (
        <View
          style={{
            position: "absolute",
            bottom: 4,
            right: 4,
          }}
        >
          <TouchableOpacity
            onPress={() => router.push("/qrScan")}
            style={{
              width: 42,
              height: 42,
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
            bottom: 4,
            left: 4,
          }}
        >
          <TouchableOpacity
            onPress={requestPermission}
            style={{
              width: 42,
              height: 42,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: 'space-between',
  },
  listContent: {
    padding: 10,
    paddingBottom: 110,
  },
  logoutButton: {
    padding: 10,
  },
  pdfFabContainer: {
    position: 'absolute',
    top: 15,
    right: 4
  },
  pdfFabButton: {
    width: 42,
    height: 42,
    borderRadius: 32,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
