import { CameraView } from "expo-camera";
import { useRouter } from 'expo-router';
import { useState } from "react";
import { Platform, StatusBar, StyleSheet, Text, View } from "react-native";

export default function QrScan() {
  const [scanned, setScanned] = useState(false);
  const router = useRouter();
  const [scanningResult, setScanningResult] = useState("");

  if (scanned) {
    // En cuanto haya resultado escaneado, redirigimos a la pantalla detail
    router.push({
      pathname: '/detail',
      params: { result: scanningResult },
    });
    return null;
  }
  return (
    <View style={styles.container}>
      {/* Vista de la cámara ocupando toda la pantalla */}
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['qr',
            'pdf417',
            'ean13',
            'ean8',
            'upc_a',
            'upc_e',
            'code39',
            'code93',
            'code128',
            'codabar',
            'itf14',
            'aztec',]
        }}
        onBarcodeScanned={({ data }) => {
          setScanningResult(data);
          setScanned(true);
        }}
      />

      {/* Overlay para mejor UX */}
      <View style={styles.overlay}>
        {/* Marco para el área de escaneo */}
        <View style={styles.scanFrame}>
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />
        </View>
        
        {/* Instrucciones */}
        <Text style={styles.instructions}>
          Apunta al código QR para escanear
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight ?? 0) + 10,
    left: 16,
    zIndex: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    gap: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  scanFrame: {
    width: 250,
    height: 250,
    marginBottom: 40,
    position: 'relative',
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#dbdbdbff',
    opacity: 0.8,
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#dbdbdbff',
    opacity: 0.8,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#dbdbdbff',
    opacity: 0.8,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#dbdbdbff',
    opacity: 0.8,
  },
  instructions: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
  },
});
