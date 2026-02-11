import { useState, useCallback } from 'react';

interface SensorData {
  ph: number;
  tds: number;
  turbidity: number;
  temperature: number;
}

export function useESP32() {
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [characteristic, setCharacteristic] = useState<BluetoothRemoteGATTCharacteristic | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const parseESP32Data = (value: string): SensorData | null => {
    try {
      // Expected format: "ph,tds,turb,temp"
      const parts = value.split(',').map(p => parseFloat(p.trim()));
      
      if (parts.length !== 4 || parts.some(isNaN)) {
        return null;
      }

      return {
        ph: parts[0],
        tds: parts[1],
        turbidity: parts[2],
        temperature: parts[3]
      };
    } catch (error) {
      console.error('Error parsing ESP32 data:', error);
      return null;
    }
  };

  const connect = useCallback(async (onDataReceived: (data: SensorData) => void) => {
    try {
      setConnectionError(null);

      // Check if Web Bluetooth is available
      if (!navigator.bluetooth) {
        setConnectionError('Web Bluetooth is not supported in this browser');
        return;
      }

      // Request device
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { namePrefix: 'ESP32' },
          { namePrefix: 'AquaSens' }
        ],
        optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb'] // Common ESP32 BLE service
      });

      setDevice(device);

      // Connect to GATT server
      const server = await device.gatt?.connect();
      if (!server) {
        throw new Error('Failed to connect to GATT server');
      }

      // Get service
      const service = await server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb');
      
      // Get characteristic
      const char = await service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb');
      setCharacteristic(char);

      // Start notifications
      await char.startNotifications();
      
      char.addEventListener('characteristicvaluechanged', (event: Event) => {
        const target = event.target as unknown as BluetoothRemoteGATTCharacteristic;
        const value = new TextDecoder().decode(target.value);
        const parsedData = parseESP32Data(value);
        
        if (parsedData) {
          onDataReceived(parsedData);
        }
      });

      setIsConnected(true);

      // Handle disconnection
      device.addEventListener('gattserverdisconnected', () => {
        setIsConnected(false);
        setDevice(null);
        setCharacteristic(null);
      });

    } catch (error) {
      console.error('Connection error:', error);
      setConnectionError(error instanceof Error ? error.message : 'Failed to connect to ESP32');
      setIsConnected(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      if (characteristic) {
        await characteristic.stopNotifications();
      }
      
      if (device?.gatt?.connected) {
        device.gatt.disconnect();
      }
      
      setIsConnected(false);
      setDevice(null);
      setCharacteristic(null);
      setConnectionError(null);
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  }, [device, characteristic]);

  return {
    isConnected,
    connectionError,
    connect,
    disconnect,
    deviceName: device?.name || null
  };
}
