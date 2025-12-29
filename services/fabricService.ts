import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Fabric, FabricColor } from "@/lib/fabricData";

// Add a new fabric
export const createFabric = async (fabricData: Omit<Fabric, "id">): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "fabrics"), {
      ...fabricData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating fabric:", error);
    throw error;
  }
};

// Get all fabrics
export const getAllFabrics = async (): Promise<Fabric[]> => {
  try {
    const q = query(collection(db, "fabrics"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const fabricsList: Fabric[] = [];
    querySnapshot.forEach((doc) => {
      fabricsList.push({
        id: doc.id,
        ...doc.data(),
      } as Fabric);
    });

    return fabricsList;
  } catch (error) {
    console.error("Error fetching fabrics:", error);
    throw error;
  }
};

// Get single fabric by ID
export const getFabricById = async (fabricId: string): Promise<Fabric | null> => {
  try {
    const docRef = doc(db, "fabrics", fabricId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Fabric;
    }

    return null;
  } catch (error) {
    console.error("Error fetching fabric:", error);
    throw error;
  }
};

// Update fabric
export const updateFabric = async (
  fabricId: string,
  fabricData: Partial<Fabric>
): Promise<void> => {
  try {
    const fabricRef = doc(db, "fabrics", fabricId);
    await updateDoc(fabricRef, {
      ...fabricData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating fabric:", error);
    throw error;
  }
};

// Delete fabric
export const deleteFabric = async (fabricId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "fabrics", fabricId));
  } catch (error) {
    console.error("Error deleting fabric:", error);
    throw error;
  }
};

// Get fabrics by category
export const getFabricsByCategory = async (category: string): Promise<Fabric[]> => {
  try {
    const allFabrics = await getAllFabrics();
    return allFabrics.filter((fabric) => fabric.category === category);
  } catch (error) {
    console.error("Error fetching fabrics by category:", error);
    throw error;
  }
};
