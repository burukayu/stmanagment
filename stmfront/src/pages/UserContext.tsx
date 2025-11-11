import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: number;
  name: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user on mount
  useEffect(() => {debugger
    const stored = localStorage.getItem("user");
    if (stored && stored !== "{}") setUser(JSON.parse(stored));
  }, []);

  // Keep state and localStorage in sync
  const handleSetUser = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem("user", JSON.stringify(u));
    else localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, setUser: handleSetUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
};
