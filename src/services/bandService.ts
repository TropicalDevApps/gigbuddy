import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
  setDoc,
  getDoc,
  getDocs,
  where,
  deleteDoc,
} from "firebase/firestore";
import { db, auth, handleFirestoreError, OperationType } from "./firebase";
import {
  Song,
  BandSession,
  SetlistItem,
  UserProfile,
  Band,
  SyncTask,
} from "../types";

let syncQueue: SyncTask[] =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("gigbuddy_sync_queue") || "[]")
    : [];

const saveQueue = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem("gigbuddy_sync_queue", JSON.stringify(syncQueue));
  }
};

export const bandService = {
  // Sync Status
  getPendingSyncCount: () => syncQueue.length,

  // Background reconciler
  processSyncQueue: async () => {
    if (
      typeof navigator === "undefined" ||
      !navigator.onLine ||
      syncQueue.length === 0
    )
      return;

    console.log(`[Sync] Processing ${syncQueue.length} pending tasks...`);
    const tasks = [...syncQueue];

    for (const task of tasks) {
      if (task.bandId?.startsWith("local-")) continue; // skip local bands

      try {
        if (task.type === "song_save") {
          await bandService._performSongSave(task.bandId!, task.payload);
        } else if (task.type === "profile_update") {
          const profileUid =
            task.uid || task.payload.uid || auth.currentUser?.uid;
          if (!profileUid) {
            console.warn(`[Sync] Skipping task ${task.id}: missing uid`);
          } else {
            await bandService._performProfileUpdate(profileUid, task.payload);
          }
        } else if (task.type === "band_update") {
          await bandService._performBandUpdate(task.bandId!, task.payload);
        } else if (task.type === "session_update") {
          const typedTask = task as any;
          await bandService._performSessionUpdate(
            typedTask.context,
            typedTask.bandId,
            typedTask.payload,
          );
        }

        // Remove from local queue if successful
        syncQueue = syncQueue.filter((t) => t.id !== task.id);
        saveQueue();
      } catch (err) {
        console.error(`[Sync] Failed task ${task.id}`, err);
        // Stop processing loop on error to avoid sequence break
        break;
      }
    }
  },
  // Ensure band document exists
  ensureBandExists: async (bandId: string, name: string) => {
    if (bandId.startsWith("local-")) return;
    const user = auth.currentUser;
    if (!user) return;

    const bandRef = doc(db, "bands", bandId);
    const bandSnap = await getDoc(bandRef);

    if (!bandSnap.exists()) {
      await setDoc(bandRef, {
        name: name,
        ownerId: user.uid,
        members: [user.uid],
        createdAt: serverTimestamp(),
      });

      // Also initialize session
      await setDoc(doc(db, "bands", bandId, "sessions", "active"), {
        bandId: bandId,
        activeSongId: null,
        activeSectionIndex: 0,
        updatedAt: serverTimestamp(),
      });
    } else {
      // Add user to members if not already there (for demo/group use)
      const data = bandSnap.data();
      if (!data.members.includes(user.uid)) {
        await updateDoc(bandRef, {
          members: [...data.members, user.uid],
        });
      }
    }
  },

  // Real-time session sync (Handles both bands and gigs)
  subscribeToSession: (
    context: "bands" | "gigs",
    id: string,
    onUpdate: (session: BandSession) => void,
  ) => {
    if (id.startsWith("local-")) return () => {};
    return onSnapshot(
      doc(db, context, id, "sessions", "active"),
      (doc) => {
        if (doc.exists()) {
          onUpdate(doc.data() as BandSession);
        }
      },
      (error) => {
        handleFirestoreError(
          error,
          OperationType.GET,
          `${context}/${id}/sessions/active`,
        );
      },
    );
  },

  // Update active song for the whole band/gig
  updateActiveSong: async (
    context: "bands" | "gigs",
    id: string,
    songId: string | null,
  ) => {
    if (id.startsWith("local-")) return;
    if (!navigator.onLine) {
      syncQueue.push({
        id: `active_song-${Date.now()}`,
        type: "session_update",
        bandId: id,
        context,
        payload: { activeSongId: songId },
        timestamp: Date.now(),
      } as any);
      saveQueue();
      return;
    }
    await bandService._performSessionUpdate(context, id, {
      activeSongId: songId,
    });
  },

  // Update setlist for the whole band/gig
  updateSetlist: async (
    context: "bands" | "gigs",
    id: string,
    setlist: SetlistItem[],
  ) => {
    if (id.startsWith("local-")) return;
    if (!navigator.onLine) {
      syncQueue.push({
        id: `setlist-${Date.now()}`,
        type: "session_update",
        bandId: id,
        context,
        payload: { setlist },
        timestamp: Date.now(),
      } as any);
      saveQueue();
      return;
    }
    await bandService._performSessionUpdate(context, id, { setlist });
  },

  // Helper for session updates
  _performSessionUpdate: async (
    context: "bands" | "gigs",
    id: string,
    data: any,
  ) => {
    const sessionRef = doc(db, context, id, "sessions", "active");
    await setDoc(
      sessionRef,
      {
        ...data,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  },

  // Update session notes for the whole band/gig
  updateSessionNotes: async (
    context: "bands" | "gigs",
    id: string,
    notes: string,
  ) => {
    if (id.startsWith("local-")) return;
    if (!navigator.onLine) {
      syncQueue.push({
        id: `notes-${Date.now()}`,
        type: "session_update",
        bandId: id,
        context,
        payload: { sessionNotes: notes },
        timestamp: Date.now(),
      } as any);
      saveQueue();
      return;
    }
    await bandService._performSessionUpdate(context, id, {
      sessionNotes: notes,
    });
  },

  // Create a new Gig session
  createPerformance: async (name: string, bandId?: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Auth required");

    const idChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const gigBytes = new Uint8Array(6);
    crypto.getRandomValues(gigBytes);
    const gigSuffix = Array.from(gigBytes, (b) => idChars[b % idChars.length]).join("");
    const gigId = `gig-${gigSuffix}`;
    const gigRef = doc(db, "gigs", gigId);

    await setDoc(gigRef, {
      name,
      creatorId: user.uid,
      bandId: bandId || null,
      createdAt: serverTimestamp(),
    });

    // Initialize the gig's active session
    await setDoc(doc(db, "gigs", gigId, "sessions", "active"), {
      gigId,
      activeSongId: null,
      activeSectionIndex: 0,
      setlist: [],
      sessionNotes: "",
      updatedAt: serverTimestamp(),
    });

    return gigId;
  },

  // Join a permanent Band
  joinBand: async (bandId: string) => {
    if (bandId.startsWith("local-")) return "Local Band";
    const user = auth.currentUser;
    if (!user) throw new Error("Auth required");

    const bandRef = doc(db, "bands", bandId);
    const bandSnap = await getDoc(bandRef);

    if (!bandSnap.exists()) throw new Error("Band not found");

    const data = bandSnap.data();
    if (!data.members.includes(user.uid)) {
      await updateDoc(bandRef, {
        members: [...data.members, user.uid],
      });
    }
    return data.name;
  },

  // Get User's Bands
  getUserBands: async () => {
    const user = auth.currentUser;
    if (!user) return [];
    const bandsRef = collection(db, "bands");
    const q = query(bandsRef, where("members", "array-contains", user.uid));
    const snap = await getDocs(q);
    return snap.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as import("../types").Band,
    );
  },

  // Create a new Band
  createBand: async (name: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Auth required");

    const idChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const bandBytes = new Uint8Array(6);
    crypto.getRandomValues(bandBytes);
    const bandSuffix = Array.from(bandBytes, (b) => idChars[b % idChars.length]).join("");
    const bandId = `band-${bandSuffix}`;
    const bandRef = doc(db, "bands", bandId);

    await setDoc(bandRef, {
      name,
      ownerId: user.uid,
      members: [user.uid],
      createdAt: serverTimestamp(),
    });

    await setDoc(doc(db, "bands", bandId, "sessions", "active"), {
      bandId,
      activeSongId: null,
      activeSectionIndex: 0,
      setlist: [],
      sessionNotes: "",
      updatedAt: serverTimestamp(),
    });

    return bandId;
  },

  // Update Band Metadata (Owner Only enforced by rules)
  updateBand: async (bandId: string, data: Partial<Band>) => {
    if (bandId.startsWith("local-") || !navigator.onLine) {
      syncQueue.push({
        id: `band-${bandId}-${Date.now()}`,
        type: "band_update",
        bandId,
        payload: data,
        timestamp: Date.now(),
      });
      saveQueue();
      return;
    }
    await bandService._performBandUpdate(bandId, data);
  },

  _performBandUpdate: async (bandId: string, data: Partial<Band>) => {
    const bandRef = doc(db, "bands", bandId);
    await setDoc(
      bandRef,
      {
        ...data,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  },

  deleteBand: async (bandId: string) => {
    if (bandId.startsWith("local-")) return;
    const bandRef = doc(db, "bands", bandId);
    await deleteDoc(doc(db, "bands", bandId, "sessions", "active"));
    await deleteDoc(bandRef);
  },

  // Leave a band
  leaveBand: async (bandId: string) => {
    const user = auth.currentUser;
    if (!user) return;
    await bandService.removeMember(bandId, user.uid);
  },

  // Remove a member from a band
  removeMember: async (bandId: string, memberUid: string) => {
    if (bandId.startsWith("local-")) return;
    const bandRef = doc(db, "bands", bandId);
    const bandSnap = await getDoc(bandRef);
    if (!bandSnap.exists()) return;

    const members = bandSnap
      .data()
      .members.filter((m: string) => m !== memberUid);
    await updateDoc(bandRef, { members });
  },

  // User Profile
  updateProfile: async (uid: string, profile: Partial<UserProfile>) => {
    if (uid.startsWith("local-") || !navigator.onLine) {
      syncQueue.push({
        id: `task-${Date.now()}`,
        type: "profile_update",
        uid,
        payload: profile,
        timestamp: Date.now(),
      });
      saveQueue();
      return;
    }
    await bandService._performProfileUpdate(uid, profile);
  },

  _performProfileUpdate: async (uid: string, profile: Partial<UserProfile>) => {
    const profileRef = doc(db, "users", uid);
    await setDoc(
      profileRef,
      {
        ...profile,
        uid,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  },

  getProfile: async (uid: string) => {
    if (uid.startsWith("local-")) return null;
    const profileRef = doc(db, "users", uid);
    const snap = await getDoc(profileRef);
    return snap.exists() ? (snap.data() as UserProfile) : null;
  },

  getBand: async (bandId: string) => {
    if (bandId.startsWith("local-")) return null;
    const bandRef = doc(db, "bands", bandId);
    const snap = await getDoc(bandRef);
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as Band) : null;
  },

  // Subscribe to band songs
  subscribeToSongs: (bandId: string, onUpdate: (songs: Song[]) => void) => {
    if (bandId.startsWith("local-")) return () => {};
    const songsRef = collection(db, "bands", bandId, "songs");
    return onSnapshot(
      songsRef,
      (snapshot) => {
        const songs = snapshot.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id }) as Song,
        );
        onUpdate(songs);
      },
      (error) => {
        handleFirestoreError(
          error,
          OperationType.LIST,
          `bands/${bandId}/songs`,
        );
      },
    );
  },

  // Add or update a song
  saveSong: async (bandId: string, song: Partial<Song>) => {
    const user = auth.currentUser;
    if (!user && !bandId.startsWith("local-")) throw new Error("Auth required");

    if (bandId.startsWith("local-") || !navigator.onLine) {
      const songId =
        song.id || `temp-${Math.random().toString(36).substr(2, 9)}`;
      const task: SyncTask = {
        id: `sync-${songId}`,
        type: "song_save",
        bandId,
        payload: {
          ...song,
          id: songId,
          authorId: (song as any).authorId || "local-guest",
        },
        timestamp: Date.now(),
      };

      // Update queue
      syncQueue = syncQueue.filter((t) => t.id !== task.id); // Deduplicate
      syncQueue.push(task);
      saveQueue();
      return songId;
    }

    return await bandService._performSongSave(bandId, song);
  },

  _performSongSave: async (bandId: string, song: Partial<Song>) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Auth required");

    const songId =
      song.id && !song.id.startsWith("temp-")
        ? song.id
        : doc(collection(db, "bands", bandId, "songs")).id;

    const songRef = doc(db, "bands", bandId, "songs", songId);

    // Clean temp props if any
    const { ...cleanSong } = song;

    const songData = {
      ...cleanSong,
      id: songId,
      bandId: bandId,
      authorId: user.uid,
      updatedAt: serverTimestamp(),
    };

    if (!song.id || song.id.startsWith("temp-")) {
      (songData as any).createdAt = serverTimestamp();
    }

    const cleanedData = Object.fromEntries(
      Object.entries(songData).filter(([, v]) => v !== undefined),
    );

    await setDoc(songRef, cleanedData, { merge: true });
    return songId;
  },

  // Delete a song
  deleteSong: async (bandId: string, songId: string) => {
    if (bandId.startsWith("local-")) return;
    const songRef = doc(db, "bands", bandId, "songs", songId);
    await deleteDoc(songRef);
  },

  // Setlist Library Management
  saveSetlistToLibrary: async (
    bandId: string,
    title: string,
    songs: Song[],
  ) => {
    if (bandId.startsWith("local-")) return `local-setlist-${Date.now()}`;
    const user = auth.currentUser;
    if (!user) throw new Error("Auth required");

    const setlistId = doc(collection(db, "bands", bandId, "saved_setlists")).id;
    const setlistRef = doc(db, "bands", bandId, "saved_setlists", setlistId);

    await setDoc(setlistRef, {
      id: setlistId,
      title,
      songs,
      bandId,
      authorId: user.uid,
      createdAt: serverTimestamp(),
    });

    return setlistId;
  },

  subscribeToSavedSetlists: (
    bandId: string,
    onUpdate: (setlists: import("../types").SavedSetlist[]) => void,
  ) => {
    if (bandId.startsWith("local-")) return () => {};
    const setlistsRef = collection(db, "bands", bandId, "saved_setlists");
    const q = query(setlistsRef, orderBy("createdAt", "desc"));
    return onSnapshot(
      q,
      (snapshot) => {
        const setlists = snapshot.docs.map(
          (doc) =>
            ({ ...doc.data(), id: doc.id }) as import("../types").SavedSetlist,
        );
        onUpdate(setlists);
      },
      (error) => {
        handleFirestoreError(
          error,
          OperationType.LIST,
          `bands/${bandId}/saved_setlists`,
        );
      },
    );
  },

  deleteSavedSetlist: async (bandId: string, setlistId: string) => {
    if (bandId.startsWith("local-")) return;
    const setlistRef = doc(db, "bands", bandId, "saved_setlists", setlistId);
    await deleteDoc(setlistRef);
  },
};

// Auto-trigger sync when coming back online
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    bandService.processSyncQueue();
  });

  // Periodic check
  setInterval(() => {
    bandService.processSyncQueue();
  }, 30000); // Every 30s
}
