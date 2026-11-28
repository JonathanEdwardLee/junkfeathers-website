import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  runTransaction,
} from "firebase/firestore";

export function connectAccount(
  config: object,
  changeOwner: (uid: string) => void,
  refresh: (rows: Map<string, string>) => void,
) {
  const app = initializeApp(config);
  const auth = getAuth(app),
    db = getFirestore(app);
  const login = document.querySelector<HTMLButtonElement>("#gdm-login")!;
  const importGuest = document.querySelector<HTMLButtonElement>("#gdm-import")!;
  const status = document.querySelector<HTMLElement>("#sync-state")!;
  const retry = document.querySelector<HTMLButtonElement>("#gdm-retry")!;
  let unsubscribe = () => {};
  let owner = "";
  let generation = 0;
  let remote = new Map<string, string>();
  let queue = Promise.resolve();
  function localRows(prefix: string) {
    const rows = new Map<string, string>();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(prefix))
        rows.set(key.slice(prefix.length), localStorage.getItem(key)!);
    }
    return rows;
  }
  function enqueue(importing = false) {
    const uid = owner,
      epoch = generation;
    queue = queue
      .then(async () => {
        if (!uid || owner !== uid || epoch !== generation) return;
        const rows = localRows("gdm." + uid + ".session.");
        if (importing)
          for (const [id, value] of localRows("gdc.session."))
            rows.set(id, value);
        for (const [id, value] of rows) {
          if (owner !== uid || epoch !== generation) return;
          const data = JSON.parse(value);
          if (
            !(data.seconds > 0) ||
            id.includes("/") ||
            remote.get(id) === value
          )
            continue;
          const ref = doc(db, "gdmPlayers", uid, "sessions", id);
          await runTransaction(db, async (tx) => {
            const existing = await tx.get(ref);
            if (!existing.exists() || existing.data().seconds < data.seconds)
              tx.set(ref, { seconds: data.seconds, record: value });
          });
        }
        if (owner === uid && epoch === generation)
          status.textContent = "Practice history synced";
      })
      .catch(() => {
        if (owner === uid && epoch === generation)
          status.textContent = "Sync paused · retry when online";
      });
  }
  login.onclick = async () => {
    login.disabled = true;
    try {
      if (auth.currentUser) await signOut(auth);
      else await signInWithPopup(auth, new GoogleAuthProvider());
    } catch {
      status.textContent = "Sign-in did not finish. Try again.";
    } finally {
      login.disabled = false;
    }
  };
  importGuest.onclick = () => enqueue(true);
  retry.onclick = () => enqueue();
  window.addEventListener("online", () => enqueue());
  window.addEventListener("gdm-session-finished", () => enqueue());
  onAuthStateChanged(auth, (user) => {
    unsubscribe();
    generation++;
    changeOwner(user?.uid || "");
    owner = user?.uid || "";
    remote = new Map();
    refresh(remote);
    login.disabled = false;
    login.textContent = user ? "Sign out" : "Sign in with Google";
    importGuest.hidden = retry.hidden = !user;
    status.textContent = user
      ? "Loading private practice history…"
      : "Guest · saved in this browser";
    if (!user) return;
    const epoch = generation;
    unsubscribe = onSnapshot(
      collection(db, "gdmPlayers", owner, "sessions"),
      (snapshot) => {
        if (epoch !== generation) return;
        remote = new Map(
          snapshot.docs.map((d) => [d.id, d.data().record as string]),
        );
        refresh(remote);
        status.textContent = snapshot.metadata.fromCache
          ? "Offline · showing available history"
          : "Private history connected";
      },
      () => {
        if (epoch === generation)
          status.textContent =
            "Cloud history unavailable · reload to reconnect";
      },
    );
    enqueue();
  });
}
