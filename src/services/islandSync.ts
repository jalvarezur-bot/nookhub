import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { IslandPassport, ResidentState, GalleryPhoto } from '../types';

export interface FullIslandData {
  passport: IslandPassport;
  residents: ResidentState[];
  critters: { caught: string[]; donated: string[] };
  photos: GalleryPhoto[];
  dailyTasks: { id: string; label: string; done: boolean; icon: string }[];
  projectKCompleted?: string[];
  hasCompletedOnboarding: boolean;
  version: number;
}

export async function fetchUserIslandData(userId: string): Promise<FullIslandData | null> {
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) {
      return null;
    }
    const data = snap.data();
    if (data.islandData) {
      return JSON.parse(data.islandData) as FullIslandData;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function saveUserIslandData(
  userId: string,
  email: string,
  displayName: string | null,
  photoURL: string | null,
  data: FullIslandData,
  isInitialCreate = false
): Promise<void> {
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    const serializedData = JSON.stringify(data);

    if (isInitialCreate) {
      await setDoc(userDocRef, {
        userId,
        email: email || 'user@example.com',
        displayName: displayName || 'Isleño',
        photoURL: photoURL || '',
        islandData: serializedData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(
        userDocRef,
        {
          userId,
          email: email || 'user@example.com',
          displayName: displayName || 'Isleño',
          photoURL: photoURL || '',
          islandData: serializedData,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
