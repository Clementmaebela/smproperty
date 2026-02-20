import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

export class FirebaseStorage {
  static async uploadImage(file: File, path: string): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  static async deleteImage(path: string): Promise<void> {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  static getImageUrl(path: string): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      return getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error getting image URL:', error);
      throw error;
    }
  }
}
