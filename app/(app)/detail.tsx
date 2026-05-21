import { FIRESTORE_DB } from '@/FirebaseConfig';
import { useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

type Libro = {
  id: string;
  Libro: string;
  Editorial: string;
  Materia: string;
  'Oferta Educativa': string;
  'Alumnado con libro': string;
  ISBN: string;
};

export default function DetailScreen() {
  const { result } = useLocalSearchParams<{ result?: string }>();
  const [libro, setLibro] = useState<Libro | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLibro = async () => {
      try {
        if (!result) {
          setError('No se ha recibido ningún identificador');
          setLoading(false);
          return;
        }

        const ref = doc(FIRESTORE_DB, 'libros', result as string);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setError('No se ha encontrado ningún libro con ese identificador');
        } else {
          const data = snap.data() as Omit<Libro, 'id'>;
          setLibro({ id: snap.id, ...data });
        }
      } catch (err) {
        console.error('Error obteniendo libro:', err);
        setError('Error obteniendo el libro');
      } finally {
        setLoading(false);
      }
    };

    fetchLibro();
  }, [result]);

  if (loading) {
    return (
      <View style={styles.containerCenter}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Cargando libro...</Text>
      </View>
    );
  }

  if (error || !libro) {
    return (
      <View style={styles.containerCenter}>
        <Text style={styles.errorText}>{error ?? 'Libro no encontrado'}</Text>
        <Text style={styles.hintText}>ID recibido: {result ?? 'N/A'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: `https://pacopul.github.io/bancaza/assets/portadas/${libro.ISBN}.jpg` }}
            style={styles.imagenFull}
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.titulo}>{libro.Libro}</Text>
          <Text style={styles.subtitulo}>{libro.Editorial}</Text>
          <Text style={styles.detalle}>Materia: {libro.Materia}</Text>
          <Text style={styles.detalle}>Curso: {libro['Oferta Educativa']}</Text>
          <Text style={styles.detalle}>Id: {libro.id}</Text>
          <Text style={styles.alumno}>{libro['Alumnado con libro']}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#fefefe',
    justifyContent: 'flex-start',
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
  },
  containerCenter: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  loadingText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    color: '#ffdddd',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  hintText: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
  },
  coverContainer: {
    width: '100%',
    height: 420,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f3f3f3',
  },
  imagenFull: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  infoContainer: {
    backgroundColor: '#d7f1fb',
    padding: 16,
    borderRadius: 24,
    marginTop: 10,
  },
  titulo: {
    color: '#781010',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },    
  alumno: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#5f1414',
  },
  subtitulo: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  detalle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
});
