import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Libro } from '../types';

// Definimos el tipo Props para el componente que recibe el Parque
type Props = {
    item: Libro;
};

// Recibe un props con item dentro. 
// Podriamos poner any en vez de Props para evitar definir el tipo 
// pero es mejor definirlo para tener autocompletado y evitar errores.

const LibroCard = ({ item }: Props) => {
    const handlePress = () => {
        router.push({
            pathname: '/detail',
            params: { result: item.id as string },
        });
    };

    return (
        <Pressable style={styles.card} onPress={handlePress}>
            <Image
                source={{ uri: `https://appiesazarquiel.github.io/bancaza/assets/portadas/${item.ISBN}.jpg` }}
                style={styles.imagen}
            />
            <View style={styles.cardContent}>
                <Text style={styles.titulo}>{item.Libro}</Text>
                <Text style={styles.subtitulo}>{item.Editorial}</Text>
                <Text style={styles.detalle}>Materia: {item.Materia}</Text>
                <Text style={styles.detalle}>Curso: {item['Oferta Educativa']}</Text>
                <Text style={styles.detalle}>Id: {item.id}</Text>
                <Text style={styles.alumno}>{item['Alumnado con libro']}</Text>
            </View>
        </Pressable>
    );
};

export default LibroCard;

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        elevation: 4, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 8, // blur
        borderRadius: 30,
    },
    imagen: {
        flex: 1, // 1/4 del espacio aproximadamente
        height: 120,
        resizeMode: 'contain',
        borderRadius: 10,
        marginRight: 12,
    },
    cardContent: {
        flex: 3, // 3/4 del espacio
        flexDirection: 'column',
        justifyContent: 'center',
    },
    titulo: {
        color: '#781010',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    alumno: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        color: '#781010',
    },
    subtitulo: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    detalle: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
});
