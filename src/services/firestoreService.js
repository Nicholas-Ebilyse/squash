import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  deleteDoc
} from "firebase/firestore";
import { firebaseConfig, isLiveFirebaseConfigured } from "./firebaseConfig";
import { INITIAL_USERS, INITIAL_CLUB_CONFIG } from "../data/initialData";

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);

/**
 * Real-time synchronization service for Cloud Firestore
 */

// 1. Subscribe to Users collection
export function subscribeUsers(onUpdate) {
  if (!isLiveFirebaseConfigured()) return () => {};

  const usersCol = collection(db, "users");
  return onSnapshot(
    usersCol,
    (snapshot) => {
      if (snapshot.empty) {
        // If Firestore is empty, check if there are customized users in localStorage first!
        let usersToSeed = INITIAL_USERS;
        try {
          const saved = localStorage.getItem("squash_users");
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              usersToSeed = parsed;
            }
          }
        } catch (e) {
          console.warn("Could not read local users for seeding:", e);
        }

        console.log("Firestore users collection is empty. Seeding with:", usersToSeed);
        usersToSeed.forEach((u) => {
          setDoc(doc(db, "users", u.id), u);
        });
        onUpdate(usersToSeed);
      } else {
        const usersList = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        onUpdate(usersList);
      }
    },
    (err) => {
      console.warn("Firestore onSnapshot error, falling back to local storage:", err);
    }
  );
}

// 2. Save or update a single user in Firestore
export async function saveUserToFirestore(user) {
  try {
    const userRef = doc(db, "users", user.id);
    await setDoc(userRef, user, { merge: true });
  } catch (err) {
    console.error("Error saving user to Firestore:", err);
  }
}

// 3. Delete a user from Firestore
export async function deleteUserFromFirestore(userId) {
  try {
    await deleteDoc(doc(db, "users", userId));
  } catch (err) {
    console.error("Error deleting user from Firestore:", err);
  }
}

// 4. Subscribe to Club Configuration
export function subscribeClubConfig(onUpdate) {
  if (!isLiveFirebaseConfigured()) return () => {};

  const configRef = doc(db, "club_config", "default");
  return onSnapshot(
    configRef,
    (docSnap) => {
      if (docSnap.exists()) {
        onUpdate(docSnap.data());
      } else {
        let configToSeed = INITIAL_CLUB_CONFIG;
        try {
          const saved = localStorage.getItem("squash_club_config");
          if (saved) configToSeed = JSON.parse(saved);
        } catch (e) {}
        setDoc(configRef, configToSeed);
        onUpdate(configToSeed);
      }
    },
    (err) => {
      console.warn("Firestore config listener error:", err);
    }
  );
}

// 5. Save Club Configuration
export async function saveClubConfigToFirestore(config) {
  try {
    const configRef = doc(db, "club_config", "default");
    await setDoc(configRef, config, { merge: true });
  } catch (err) {
    console.error("Error saving club config to Firestore:", err);
  }
}

// 6. Subscribe to Slots & Bookings
export function subscribeSlots(onUpdate) {
  if (!isLiveFirebaseConfigured()) return () => {};

  const slotsCol = collection(db, "slots");
  return onSnapshot(
    slotsCol,
    (snapshot) => {
      if (!snapshot.empty) {
        const slotsData = {};
        snapshot.docs.forEach((docSnap) => {
          slotsData[docSnap.id] = docSnap.data();
        });
        onUpdate(slotsData);
      } else {
        try {
          const saved = localStorage.getItem("squash_slots_state");
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && Object.keys(parsed).length > 0) {
              Object.entries(parsed).forEach(([slotId, slotData]) => {
                setDoc(doc(db, "slots", slotId), slotData);
              });
              onUpdate(parsed);
            }
          }
        } catch (e) {}
      }
    },
    (err) => {
      console.warn("Firestore slots listener error:", err);
    }
  );
}

// 7. Save a slot's availability & bookings
export async function saveSlotToFirestore(slotId, slotState) {
  try {
    const slotRef = doc(db, "slots", slotId);
    await setDoc(slotRef, slotState, { merge: true });
  } catch (err) {
    console.error("Error saving slot to Firestore:", err);
  }
}
