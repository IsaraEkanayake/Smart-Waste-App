import AsyncStorage from '@react-native-async-storage/async-storage';
const QUEUE_KEY = 'offlineQueue_v1';
export async function enqueue(op) {
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  const queue = raw ? JSON.parse(raw) : [];
  queue.push({ ...op, retries: 0 });
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}
export async function getPending() {
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  return raw ? JSON.parse(raw) : [];
}
export async function flush(api, token) {
  let queue = await getPending();
  const newQueue = [];
  for (const op of queue) {
    try {
      await api[op.endpoint](op.body, token); // your api abstraction supports dynamic calls
    } catch (err) {
      op.retries = (op.retries || 0) + 1;
      if (op.retries < 3) newQueue.push(op);
    }
  }
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(newQueue));
}
