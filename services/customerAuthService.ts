import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  signInWithEmailLink,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  User,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const auth = getAuth();

// Customer Profile Type
export interface CustomerProfile {
  uid: string;
  email?: string;
  phoneNumber?: string;
  displayName?: string;
  address?: string;
  city?: string;
  profileCompleted: boolean;
  createdAt?: any;
  updatedAt?: any;
}

// Clear existing reCAPTCHA
export const clearRecaptcha = () => {
  if (typeof window !== 'undefined' && (window as any).recaptchaVerifier) {
    try {
      (window as any).recaptchaVerifier.clear();
    } catch (error) {
      console.log('Error clearing reCAPTCHA:', error);
    }
    (window as any).recaptchaVerifier = null;
  }
};

// Initialize invisible reCAPTCHA
export const initRecaptcha = (containerId: string = 'recaptcha-container'): RecaptchaVerifier => {
  // Clear any existing reCAPTCHA first
  clearRecaptcha();

  if (typeof window !== 'undefined') {
    (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        console.log('reCAPTCHA solved');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired - reinitializing');
        clearRecaptcha();
      }
    });
  }
  return (window as any).recaptchaVerifier;
};

// Phone Authentication - Send OTP
export const sendPhoneOTP = async (phoneNumber: string): Promise<ConfirmationResult> => {
  try {
    // Ensure phone number is in E.164 format (+91XXXXXXXXXX)
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;

    const recaptchaVerifier = initRecaptcha();

    // Set a timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timeout. Please try again.'));
      }, 60000); // 60 seconds timeout
    });

    // Race between phone sign-in and timeout
    const confirmationResult = await Promise.race([
      signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier),
      timeoutPromise
    ]);

    return confirmationResult;
  } catch (error: any) {
    console.error('Error sending phone OTP:', error);

    // Clear reCAPTCHA on error so it can be retried
    clearRecaptcha();

    // Handle specific error cases
    if (error.code === 'auth/timeout' || error.message?.includes('timeout')) {
      throw new Error('Request timed out. Please check your connection and try again.');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many attempts. Please try again later.');
    } else if (error.code === 'auth/invalid-phone-number') {
      throw new Error('Invalid phone number format.');
    } else {
      throw new Error(error.message || 'Failed to send OTP. Please try again.');
    }
  }
};

// Phone Authentication - Verify OTP
export const verifyPhoneOTP = async (
  confirmationResult: ConfirmationResult,
  otp: string
): Promise<User> => {
  try {
    // Set a timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Verification timeout. Please try again.'));
      }, 30000); // 30 seconds timeout
    });

    // Race between OTP verification and timeout
    const result = await Promise.race([
      confirmationResult.confirm(otp),
      timeoutPromise
    ]);

    return result.user;
  } catch (error: any) {
    console.error('Error verifying phone OTP:', error);

    // Handle specific error cases
    if (error.code === 'auth/invalid-verification-code') {
      throw new Error('Invalid OTP. Please check and try again.');
    } else if (error.code === 'auth/code-expired') {
      throw new Error('OTP has expired. Please request a new one.');
    } else if (error.message?.includes('timeout')) {
      throw new Error('Verification timed out. Please try again.');
    } else {
      throw new Error(error.message || 'Invalid OTP. Please try again.');
    }
  }
};

// Email Authentication - Send OTP Link
export const sendEmailOTP = async (email: string): Promise<void> => {
  try {
    const actionCodeSettings = {
      url: `${window.location.origin}/customer/dashboard?email=${email}`,
      handleCodeInApp: true,
    };

    await sendSignInLinkToEmail(auth, email, actionCodeSettings);

    // Save email to localStorage for verification
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('emailForSignIn', email);
    }
  } catch (error: any) {
    console.error('Error sending email OTP:', error);
    throw new Error(error.message || 'Failed to send email OTP');
  }
};

// Email Authentication - Verify Email Link
export const verifyEmailLink = async (emailLink?: string): Promise<User | null> => {
  try {
    const link = emailLink || window.location.href;

    if (isSignInWithEmailLink(auth, link)) {
      let email = window.localStorage.getItem('emailForSignIn');

      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }

      if (!email) {
        throw new Error('Email is required for verification');
      }

      const result = await signInWithEmailLink(auth, email, link);

      // Clear email from storage
      window.localStorage.removeItem('emailForSignIn');

      return result.user;
    }

    return null;
  } catch (error: any) {
    console.error('Error verifying email link:', error);
    throw new Error(error.message || 'Failed to verify email');
  }
};

// Get or Create Customer Profile
export const getCustomerProfile = async (uid: string): Promise<CustomerProfile | null> => {
  try {
    const customerRef = doc(db, 'customers', uid);
    const customerDoc = await getDoc(customerRef);

    if (customerDoc.exists()) {
      return customerDoc.data() as CustomerProfile;
    }

    return null;
  } catch (error) {
    console.error('Error getting customer profile:', error);
    return null;
  }
};

// Create/Update Customer Profile
export const saveCustomerProfile = async (
  uid: string,
  profileData: Partial<CustomerProfile>
): Promise<void> => {
  try {
    const customerRef = doc(db, 'customers', uid);
    const existingProfile = await getDoc(customerRef);

    // Remove undefined values from profileData
    const cleanedData: any = {};
    Object.entries(profileData).forEach(([key, value]) => {
      if (value !== undefined) {
        cleanedData[key] = value;
      }
    });

    const dataToSave = {
      ...cleanedData,
      uid,
      updatedAt: Timestamp.now(),
      ...(existingProfile.exists() ? {} : { createdAt: Timestamp.now() })
    };

    await setDoc(customerRef, dataToSave, { merge: true });
  } catch (error) {
    console.error('Error saving customer profile:', error);
    throw new Error('Failed to save profile');
  }
};

// Auth State Listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Logout
export const logoutCustomer = async (): Promise<void> => {
  try {
    await signOut(auth);

    // Clear any stored data
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('emailForSignIn');
    }
  } catch (error) {
    console.error('Error logging out:', error);
    throw new Error('Failed to logout');
  }
};

// Get Current User
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
