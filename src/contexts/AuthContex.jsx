import React, { useContext, createContext, useEffect, useMemo, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, getDocs, doc, getDoc, where } from "firebase/firestore";

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
    return data?.rol || "admin";
  };

  const cacheDelegadosToSession = async () => {
    const snap = await getDocs(collection(db, "delegados"));

    const delegates = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
      };
    });

    sessionStorage.setItem("delegados", JSON.stringify(delegates));
    return delegates;
  };

  const login = async (email, password) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();

    const cred = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);

    const role = await checkRoleByUid(cred.user.uid);

    if (!role) {
      await signOut(auth);
      clearSession();
      throw new Error("No tienes permiso para ingresar.");
    }

    const token = await cred.user.getIdToken();
    setSession(token, cred.user.uid, cleanEmail, role);

    setUser(cred.user);
    setRol(role);
    setIsAuthenticated(true);

    let delegates = [];
    if (role === "admin") {
      delegates = await cacheDelegadosToSession();
    }

    return { user: cred.user, rol: role, delegates };
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setRol("");
    setIsAuthenticated(false);
    clearSession();
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
          setAuthLoading(false);
          return;
        }

        const email = (firebaseUser.email || "").trim().toLowerCase();
        if (!email) {
          await signOut(auth);
          setUser(null);
          setRol("");
          setIsAuthenticated(false);
          clearSession();
          setAuthLoading(false);
          return;
        }

        const role = await checkRoleByEmail(email);

        if (!role) {
          await signOut(auth);
          setUser(null);
          setRol("");
          setIsAuthenticated(false);
          clearSession();
          setAuthLoading(false);
          return;
        }

        const token = await firebaseUser.getIdToken();
        setSession(token, firebaseUser.uid, email, role);

        setUser(firebaseUser);
        setRol(role);
        setIsAuthenticated(true);
      } catch (e) {
        console.error("AuthProvider error:", e);
        await signOut(auth);
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
