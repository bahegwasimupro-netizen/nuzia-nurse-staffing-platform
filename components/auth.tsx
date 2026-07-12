import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  User as FirebaseUser
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: "client" | "nurse" | "admin";
  phone?: string;
  location?: string;
  locationCoords?: string;
  specialty?: string;
  experience?: string;
  hourlyRate?: number;
  available?: boolean;
  avatar?: string;
  createdAt: string;
}

interface AuthContextType {
  user: FirebaseUser | { uid: string; email: string } | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isMock: boolean;
  signIn: (email: string, password: string) => Promise<UserProfile>;
  signUp: (email: string, password: string, name: string, role: "client" | "nurse" | "admin", phone?: string, specialty?: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage fallback state helper
const LOCAL_STORAGE_KEY = "nuzia_mock_users";
const SESSION_USER_KEY = "nuzia_current_user";

const getMockUsers = (): UserProfile[] => {
  const users = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!users) {
    // Initial mock database
    const initialUsers: UserProfile[] = [
      {
        uid: "admin-mock-id",
        email: "admin@nuzia.com",
        name: "Director Tanzanite",
        role: "admin",
        phone: "+255 712 345 678",
        createdAt: new Date().toISOString()
      },
      {
        uid: "nurse-mock-1",
        email: "fatuma@nuzia.com",
        name: "Fatuma Mwalimu, RN",
        role: "nurse",
        phone: "+255 754 987 654",
        specialty: "Huduma za Nyumbani",
        experience: "Miaka 8",
        hourlyRate: 45000,
        available: true,
        location: "Upanga, Dar es Salaam",
        locationCoords: "-6.8150, 39.2780",
        avatar: "https://images.unsplash.com/photo-1676552055618-22ec8cde399a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXJzZSUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsJTIwaGVhbHRoY2FyZXxlbnwxfHx8fDE3NTU0MjkwMjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
        createdAt: new Date().toISOString()
      },
      {
        uid: "nurse-mock-2",
        email: "john@nuzia.com",
        name: "John Massawe, RN",
        role: "nurse",
        phone: "+255 768 111 222",
        specialty: "ICU Specialist",
        experience: "Miaka 6",
        hourlyRate: 75000,
        available: true,
        location: "Oysterbay, Dar es Salaam",
        locationCoords: "-6.7925, 39.2880",
        avatar: "https://images.unsplash.com/photo-1753487050317-919a2b26a6ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBudXJzZSUyMG1lZGljYWwlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzU1MzM5MTUzfDA&ixlib=rb-4.1.0&q=80&w=1080",
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialUsers));
    return initialUsers;
  }
  return JSON.parse(users);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);

  // Monitor Auth State
  useEffect(() => {
    let unsubscribe = () => {};
    
    try {
      unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          setUser(fbUser);
          try {
            // Get profile from Firestore
            const docRef = doc(db, "users", fbUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setUserProfile(docSnap.data() as UserProfile);
              setIsMock(false);
            } else {
              // Fallback if auth exists but firestore profile missing
              const fallbackProfile: UserProfile = {
                uid: fbUser.uid,
                email: fbUser.email || "",
                name: fbUser.displayName || "User",
                role: "client",
                createdAt: new Date().toISOString()
              };
              setUserProfile(fallbackProfile);
            }
          } catch (e) {
            console.warn("Firestore error, falling back to mock profile:", e);
            // Fallback to mock session if Firestore fails
            const mockSession = sessionStorage.getItem(SESSION_USER_KEY);
            if (mockSession) {
              setUserProfile(JSON.parse(mockSession));
            } else {
              setUserProfile({
                uid: fbUser.uid,
                email: fbUser.email || "",
                name: "Client Test",
                role: "client",
                createdAt: new Date().toISOString()
              });
            }
          }
        } else {
          // Check if mock user session exists
          const mockSession = sessionStorage.getItem(SESSION_USER_KEY);
          if (mockSession) {
            const profile = JSON.parse(mockSession);
            setUser({ uid: profile.uid, email: profile.email });
            setUserProfile(profile);
            setIsMock(true);
          } else {
            setUser(null);
            setUserProfile(null);
          }
        }
        setLoading(false);
      });
    } catch (e) {
      console.warn("Firebase Auth failed to initialize, using Mock Mode:", e);
      setIsMock(true);
      const mockSession = sessionStorage.getItem(SESSION_USER_KEY);
      if (mockSession) {
        const profile = JSON.parse(mockSession);
        setUser({ uid: profile.uid, email: profile.email });
        setUserProfile(profile);
      }
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  // Sign In
  const signIn = async (email: string, password: string): Promise<UserProfile> => {
    setLoading(true);
    try {
      if (isMock) throw new Error("Mock Mode enabled");
      
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const docRef = doc(db, "users", credential.user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const profile = docSnap.data() as UserProfile;
        setUserProfile(profile);
        setLoading(false);
        return profile;
      } else {
        throw new Error("No Firestore profile exists");
      }
    } catch (error) {
      console.warn("Firebase Signin failed, trying Mock Auth:", error);
      // Try Mock Database
      const mockUsers = getMockUsers();
      const matched = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (matched) {
        // Password mock (any password works for ease of testing!)
        setUser({ uid: matched.uid, email: matched.email });
        setUserProfile(matched);
        sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(matched));
        setIsMock(true);
        setLoading(false);
        return matched;
      } else {
        // Create a quick mock client if unknown for testing convenience
        const newMockClient: UserProfile = {
          uid: "mock-uid-" + Math.random().toString(36).substr(2, 9),
          email,
          name: email.split("@")[0].toUpperCase(),
          role: email.includes("nurse") ? "nurse" : email.includes("admin") ? "admin" : "client",
          phone: "+255 700 000 000",
          createdAt: new Date().toISOString()
        };
        const users = getMockUsers();
        users.push(newMockClient);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users));
        
        setUser({ uid: newMockClient.uid, email: newMockClient.email });
        setUserProfile(newMockClient);
        sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(newMockClient));
        setIsMock(true);
        setLoading(false);
        return newMockClient;
      }
    }
  };

  // Sign Up
  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: "client" | "nurse" | "admin",
    phone?: string,
    specialty?: string
  ): Promise<UserProfile> => {
    setLoading(true);
    const profileData: UserProfile = {
      uid: "",
      email,
      name,
      role,
      phone: phone || "",
      createdAt: new Date().toISOString(),
      ...(role === "nurse" && {
        specialty: specialty || "Huduma za Jumla",
        experience: "Miaka 2",
        hourlyRate: specialty === "ICU Specialist" ? 75000 : specialty === "Huduma za Moyo" ? 65000 : 45000,
        available: true,
        avatar: "https://images.unsplash.com/photo-1676552055618-22ec8cde399a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXJzZSUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsJTIwaGVhbHRoY2FyZXxlbnwxfHx8fDE3NTU0MjkwMjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      })
    };

    try {
      if (isMock) throw new Error("Mock Mode enabled");
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      profileData.uid = credential.user.uid;
      
      // Save profile to Firestore
      await setDoc(doc(db, "users", credential.user.uid), profileData);
      
      // Send email verification
      try { await sendEmailVerification(credential.user); } catch (_) { /* non-critical */ }
      
      setUser(credential.user);
      setUserProfile(profileData);
      setLoading(false);
      return profileData;
    } catch (error) {
      console.warn("Firebase Signup failed, running Mock Signup:", error);
      // Mock signup
      profileData.uid = "mock-uid-" + Math.random().toString(36).substr(2, 9);
      
      const mockUsers = getMockUsers();
      mockUsers.push(profileData);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockUsers));
      
      setUser({ uid: profileData.uid, email: profileData.email });
      setUserProfile(profileData);
      sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(profileData));
      setIsMock(true);
      setLoading(false);
      return profileData;
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      if (!isMock) {
        await fbSignOut(auth);
      }
    } catch (e) {
      console.error("Firebase logout error:", e);
    }
    
    setUser(null);
    setUserProfile(null);
    sessionStorage.removeItem(SESSION_USER_KEY);
    setLoading(false);
  };

  // Update Profile
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!userProfile) return;
    
    const updated = { ...userProfile, ...data };
    setUserProfile(updated);
    
    if (isMock) {
      sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(updated));
      const mockUsers = getMockUsers();
      const idx = mockUsers.findIndex(u => u.uid === userProfile.uid);
      if (idx !== -1) {
        mockUsers[idx] = updated as UserProfile;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockUsers));
      }
    } else {
      try {
        await setDoc(doc(db, "users", userProfile.uid), updated, { merge: true });
      } catch (e) {
        console.error("Firestore update failed, editing local state only:", e);
      }
    }
  };

  // Reset Password
  const resetPassword = async (email: string) => {
    if (isMock) {
      // In mock mode, just show success
      return;
    }
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, isMock, signIn, signUp, logout, updateProfile, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
export { getMockUsers };
