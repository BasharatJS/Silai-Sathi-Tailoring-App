"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import {
  onAuthStateChange,
  getCustomerProfile,
  saveCustomerProfile,
  logoutCustomer,
  CustomerProfile,
} from "@/services/customerAuthService";
import { enableFirestorePersistence } from "@/lib/firebase";

interface CustomerAuthContextType {
  user: User | null;
  profile: CustomerProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  updateProfile: (profileData: Partial<CustomerProfile>) => Promise<void>;
  logout: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(
  undefined
);

export const CustomerAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Enable Firestore offline persistence
    enableFirestorePersistence();

    // Check for email link sign-in on mount
    const checkEmailLink = async () => {
      if (typeof window !== 'undefined') {
        const { verifyEmailLink } = await import('@/services/customerAuthService');
        try {
          const user = await verifyEmailLink();
          if (user) {
            console.log('Email link verified successfully');
          }
        } catch (error) {
          console.error('Email link verification error:', error);
        }
      }
    };

    checkEmailLink();

    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Check if this user exists in customers collection
          try {
            const customerProfile = await getCustomerProfile(firebaseUser.uid);

            if (customerProfile) {
              // User exists in customers collection - they are a customer
              setUser(firebaseUser);
              setProfile(customerProfile);
            } else {
              // User is logged in Firebase but NOT in customers collection
              // This means they are likely an admin or not a customer
              // Don't set user or profile - treat as unauthenticated
              console.log('User logged in but not found in customers collection');
              setUser(null);
              setProfile(null);
            }
          } catch (error: any) {
            // Handle offline errors gracefully
            if (error?.code === 'unavailable' || error?.message?.includes('offline')) {
              console.log('Operating in offline mode - using cached data');
              // In offline mode, create temporary profile
              const offlineProfile: Partial<CustomerProfile> = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || undefined,
                phoneNumber: firebaseUser.phoneNumber || undefined,
                displayName: firebaseUser.displayName || undefined,
                profileCompleted: false,
              };
              setUser(firebaseUser);
              setProfile(offlineProfile as CustomerProfile);
            } else {
              console.error("Error fetching profile:", error);
              // On error, don't authenticate
              setUser(null);
              setProfile(null);
            }
          }
        } else {
          // No Firebase user - not authenticated
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateProfile = async (profileData: Partial<CustomerProfile>) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    await saveCustomerProfile(user.uid, profileData);

    // Refresh profile
    const updatedProfile = await getCustomerProfile(user.uid);
    setProfile(updatedProfile);
  };

  const logout = async () => {
    await logoutCustomer();
    setUser(null);
    setProfile(null);
  };

  const value: CustomerAuthContextType = {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    updateProfile,
    logout,
  };

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (context === undefined) {
    throw new Error(
      "useCustomerAuth must be used within CustomerAuthProvider"
    );
  }
  return context;
};
