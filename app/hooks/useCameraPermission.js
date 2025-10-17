import { useEffect, useState } from 'react';
import { Camera } from 'expo-camera'; // if using expo; if not, use react-native-permissions
export default function useCameraPermission() {
  const [status, setStatus] = useState(null); // 'granted' | 'denied' | 'undetermined' | 'requesting'
  useEffect(() => {
    (async () => {
      setStatus('requesting');
      const { status } = await Camera.requestPermissionsAsync();
      setStatus(status === 'granted' ? 'granted' : 'denied');
    })();
  }, []);
  const request = async () => {
    setStatus('requesting');
    const { status } = await Camera.requestPermissionsAsync();
    setStatus(status === 'granted' ? 'granted' : 'denied');
    return status;
  };
  return { status, request };
}
