"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";

interface DBUser {
  id: number;
  name: string;
  email: string;
  picture: string;
  credits: number;
  organization: string;
  created_at: string;
}

interface UserDataContextType {
  users: DBUser[] | null;
  setUsers: React.Dispatch<React.SetStateAction<DBUser[] | null>>;
  loading: boolean;
  isNewUser: boolean;
  constCreateNewUser: () => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(
  undefined
);

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<DBUser[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);

  useEffect(() => {
    constCreateNewUser();
  }, []);
  const constCreateNewUser = async () => {
    setLoading(true);
    supabase.auth
      .getUser()
      .then(async ({ data: { user }}) => {
       

        if (!user) {
          console.log(" No user found from Supabase auth");
          setLoading(false);
          return;
        }

        console.log("✅ Authenticated user:", user.email);

        const { data: users, error: fetchError } = await supabase
          .from("users")
          .select("*")
          .eq("email", user.email);

        if (fetchError) {
          console.error(
            " Error fetching user from 'users' table:",
            fetchError.message
          );
          setLoading(false);
          return;
        }

        if (!users || users.length === 0) {
          console.log(" No user found in DB, inserting new one...");

          const { data: insertedData, error: insertError } = await supabase
            .from("users")
            .insert([
              {
                name: user.user_metadata?.name,
                email: user.email,
                picture: user.user_metadata?.picture,
                organization: "no organization",
              },
            ])
            .select();

          if (insertError) {
            console.log("❌ Error inserting new user:", insertError.message);
          } else {
            console.log(" New user inserted:", insertedData);
            setUsers(insertedData);
            setIsNewUser(true);
            console.log("🟢 isNewUser set to TRUE");
          }
        } else {
         
          setUsers(users);
          setIsNewUser(false);
       
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error during auth check:", err);
        setLoading(false);
      });
  };

  return (
    <UserDataContext.Provider
      value={{ users, setUsers, loading, isNewUser, constCreateNewUser }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
}
