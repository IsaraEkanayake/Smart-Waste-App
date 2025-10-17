import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

export const AuthService = {
  async login(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    return { user: userCredential.user, userData: userDoc.data() };
  },

  async register(userData) {
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
    await setDoc(doc(db, "users", userCredential.user.uid), {
      uid: userCredential.user.uid,
      ...userData,
      createdAt: new Date().toISOString(),
    });
    return userCredential.user;
  },

  async updateProfile(userId, profileData) {
    await updateDoc(doc(db, "users", userId), {
      ...profileData,
      updatedAt: new Date().toISOString(),
    });
  }
};