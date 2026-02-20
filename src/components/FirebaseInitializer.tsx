import { useEffect } from 'react';
import { PropertyService } from '@/services/propertyService';

interface FirebaseInitializerProps {
  children: React.ReactNode;
}

export const FirebaseInitializer = ({ children }: FirebaseInitializerProps) => {
  useEffect(() => {
    // Simple Firebase connection check
    const checkFirebaseConnection = async () => {
      try {
        console.log('🔥 Checking Firebase connection...');
        const properties = await PropertyService.getAllProperties();
        console.log(`📊 Connected to Firebase! Found ${properties.length} properties`);
      } catch (error) {
        console.error('❌ Firebase connection failed:', error);
      }
    };

    checkFirebaseConnection();
  }, []);

  return <>{children}</>;
};
