// App.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function App() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);

  // Request camera permission on mount
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Handler when a QR code is scanned
  const handleBarCodeScanned = ({ type, data }: { type: string; data: string; }) => {
    setScanned(true);
    setScannedData(data);
    console.log(`Scanned QR code with type ${type} and data ${data}`);
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>QR Code Scanner</Text>
      <View style={styles.scannerContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
      {scannedData && (
        <Text style={styles.dataText}>Scanned Data: {scannedData}</Text>
      )}
      {scanned && (
        <Button title={'Tap to Scan Again'} onPress={() => { setScanned(false); setScannedData(null); }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    fontSize: 22,
    marginBottom: 20,
  },
  scannerContainer: {
    width: '100%',
    height: 300,
    overflow: 'hidden',
    borderRadius: 10,
    backgroundColor: 'black',
    marginBottom: 20,
  },
  dataText: {
    fontSize: 18,
    marginBottom: 10,
  },
});
