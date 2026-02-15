import React, {
  useContext,
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { auth, db } from "../firebase/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [rol, setRol] = useState("");

  const clearSession = () => {
    sessionStorage.removeItem("idToken");
    sessionStorage.removeItem("uid");
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("rol");
    sessionStorage.removeItem("delegados");
  };

  const setSession = (token, uid, email, role) => {
    sessionStorage.setItem("idToken", token);
    sessionStorage.setItem("uid", uid);
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("rol", role);
  };

  const checkRoleByUid = async (uid) => {
    const ref = doc(db, "admin", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const data = snap.data();
    return {
      rol: data?.rol || "admin",
      name: data?.name || "admin",
    };
  };

  const cacheDelegadosToSession = async () => {
    const snap = await getDocs(collection(db, "delegados"));
    const delegates = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    sessionStorage.setItem("delegados", JSON.stringify(delegates));
    return delegates;
  };

  const login = async (email, password) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();

    setAuthLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);

      const profile = await checkRoleByUid(cred.user.uid);

      console.log(profile);
      
      if (!profile) {
        await signOut(auth);
        clearSession();
        throw new Error("No tienes permiso para ingresar.");
      }

      const token = await cred.user.getIdToken();
      setSession(token, cred.user.uid, cleanEmail, profile.rol);

      const minimalUser = {
        uid: cred.user.uid,
        email: cleanEmail,
        name: profile.name,
        rol: profile.rol,
      };

      setUser(minimalUser);
      setRol(profile.rol);
      setIsAuthenticated(true);

      let delegates = [];
      if (profile.rol === "admin" || profile.rol === "super_admin") {
        delegates = await cacheDelegadosToSession();
      }

      return { user: minimalUser, rol: profile.rol, delegates };
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    setAuthLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setRol("");
      setIsAuthenticated(false);
      clearSession();
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthLoading(true);

      try {
        if (!firebaseUser) {
          setUser(null);
          setRol("");
          setIsAuthenticated(false);
          clearSession();
          return;
        }

        const profile = await checkRoleByUid(firebaseUser.uid);
        if (!profile) {
          await signOut(auth);
          setUser(null);
          setRol("");
          setIsAuthenticated(false);
          clearSession();
          return;
        }

        const email = (firebaseUser.email || "").trim().toLowerCase();
        const token = await firebaseUser.getIdToken();

        setSession(token, firebaseUser.uid, email, profile.rol);

        const minimalUser = {
          uid: firebaseUser.uid,
          email,
          name: profile.name,
          rol: profile.rol,
        };

        setUser(minimalUser);
        setRol(profile.rol);
        setIsAuthenticated(true);

        if (profile.rol === "admin" && !sessionStorage.getItem("delegados")) {
          await cacheDelegadosToSession();
        }
      } catch (e) {
        console.error("AuthProvider error:", e);
        try {
          await signOut(auth);
        } catch {}
        setUser(null);
        setRol("");
        setIsAuthenticated(false);
        clearSession();
      } finally {
        setAuthLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      authLoading,
      user,
      rol,
      login,
      logout,
    }),
    [isAuthenticated, authLoading, user, rol]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};
