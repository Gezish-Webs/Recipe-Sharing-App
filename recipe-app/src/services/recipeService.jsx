import { db, storage } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Collection reference
const recipesCollection = collection(db, "recipes");

// Get all recipes
export const getAllRecipes = async () => {
  const q = query(recipesCollection, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Get a single recipe by ID
export const getRecipe = async (id) => {
  const docRef = doc(db, "recipes", id);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  } else {
    throw new Error("Recipe not found");
  }
};

// Create a new recipe
export const createRecipe = async (recipeData, userId) => {
  const data = {
    ...recipeData,
    createdBy: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(recipesCollection, data);
  return docRef.id;
};

// Update a recipe
export const updateRecipe = async (id, recipeData) => {
  const docRef = doc(db, "recipes", id);
  const data = {
    ...recipeData,
    updatedAt: serverTimestamp(),
  };
  await updateDoc(docRef, data);
};

// Delete a recipe
export const deleteRecipe = async (id) => {
  const docRef = doc(db, "recipes", id);
  await deleteDoc(docRef);
};

// Get recipes by user ID
export const getRecipesByUser = async (userId) => {
  const q = query(
    recipesCollection,
    where("createdBy", "==", userId),
    orderBy("createdAt", "desc"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Upload recipe image to Firebase Storage
export const uploadRecipeImage = async (file, recipeId) => {
  const storageRef = ref(storage, `recipe-images/${recipeId}/${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

import { writeBatch } from "firebase/firestore";

// ... existing imports and functions ...

export const createMultipleRecipes = async (recipesArray, userId) => {
  const batch = writeBatch(db);
  recipesArray.forEach((recipeData) => {
    const docRef = doc(recipesCollection); // auto-generate ID
    const data = {
      ...recipeData,
      createdBy: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    batch.set(docRef, data);
  });
  await batch.commit();
};