import React, { useContext, createContext, useEffect, useMemo, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

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

  const checkRoleByEmail = async (email) => {
    const q = query(collection(db, "admin"), where("email", "==", email));
    const snap = await getDocs(q);

    if (snap.empty) return null;

    const adminData = snap.docs[0].data();
    return adminData?.rol || "admin";
  };

  // ✅ Login (correo + contraseña)
  const login = async (email, password) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();

    // 1) Login en Auth
    const cred = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);

    // 2) Verificar permiso en Firestore
    const role = await checkRoleByEmail(cleanEmail);

    if (!role) {
      // no autorizado
      await signOut(auth);
      clearSession();
      throw new Error("No tienes permiso para ingresar.");
    }

    // 3) Guardar sesión
    const token = await cred.user.getIdToken();
    setSession(token, cred.user.uid, cleanEmail, role);

    // 4) Actualizar estado
    setUser(cred.user);
    setRol(role);
    setIsAuthenticated(true);

    return { user: cred.user, rol: role };
  };

  // ✅ Logout
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setRol("");
    setIsAuthenticated(false);
    clearSession();
  };

  // ✅ Mantener sesión viva (por si recargas la página)
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

        // verificar rol
        const role = await checkRoleByEmail(email);

        if (!role) {
          // usuario logueado pero sin permiso
          await signOut(auth);
          setUser(null);
          setRol("");
          setIsAuthenticated(false);
          clearSession();
          setAuthLoading(false);
          return;
        }

        // refrescar token y guardar
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
