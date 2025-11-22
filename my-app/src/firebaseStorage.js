import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export const uploadPhoto = async (file) => {
  if (!file) return null;
  const imageRef = ref(storage, `photos/${file.name}-${Date.now()}`);
  await uploadBytes(imageRef, file);
  const url = await getDownloadURL(imageRef);
  return url;
};
