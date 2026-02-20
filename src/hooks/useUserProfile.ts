import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService, UserProfile } from '@/services/userService';
import { useAuth } from '@/contexts/AuthContext';

// Query keys
export const userProfileKeys = {
  all: ['userProfile'] as const,
  profile: (uid: string) => [...userProfileKeys.all, uid] as const,
  stats: (uid: string) => [...userProfileKeys.all, uid, 'stats'] as const,
  properties: (uid: string) => [...userProfileKeys.all, uid, 'properties'] as const,
};

// Hooks
export const useUserProfile = (uid?: string) => {
  const { user } = useAuth();
  const profileUid = uid || user?.uid;

  return useQuery({
    queryKey: userProfileKeys.profile(profileUid || ''),
    queryFn: () => {
      if (!profileUid) throw new Error('User ID is required');
      return UserService.getProfile(profileUid);
    },
    enabled: !!profileUid,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUserStats = (uid?: string) => {
  const { user } = useAuth();
  const profileUid = uid || user?.uid;

  return useQuery({
    queryKey: userProfileKeys.stats(profileUid || ''),
    queryFn: () => {
      if (!profileUid) throw new Error('User ID is required');
      return UserService.getUserStats(profileUid);
    },
    enabled: !!profileUid,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUserProperties = (uid?: string) => {
  const { user } = useAuth();
  const profileUid = uid || user?.uid;

  return useQuery({
    queryKey: userProfileKeys.properties(profileUid || ''),
    queryFn: () => {
      if (!profileUid) throw new Error('User ID is required');
      return UserService.getUserProperties(profileUid);
    },
    enabled: !!profileUid,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutations
export const useCreateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (firebaseUser: any) => UserService.createProfile(firebaseUser),
    onSuccess: (profile) => {
      queryClient.setQueryData(userProfileKeys.profile(profile.uid), profile);
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: (updates: Partial<UserProfile>) => {
      if (!user?.uid) throw new Error('User not authenticated');
      return UserService.updateProfile(user.uid, updates);
    },
    onSuccess: (_, variables) => {
      if (user?.uid) {
        queryClient.invalidateQueries({ queryKey: userProfileKeys.profile(user.uid) });
      }
    },
  });
};

export const useUploadProfilePhoto = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: (file: File) => {
      if (!user?.uid) throw new Error('User not authenticated');
      return UserService.uploadProfilePhoto(user.uid, file);
    },
    onSuccess: (photoURL) => {
      if (user?.uid) {
        queryClient.setQueryData(userProfileKeys.profile(user.uid), (old: any) => ({
          ...old,
          photoURL
        }));
      }
    },
  });
};

export const useDeleteProfilePhoto = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: () => {
      if (!user?.uid) throw new Error('User not authenticated');
      return UserService.deleteProfilePhoto(user.uid);
    },
    onSuccess: () => {
      if (user?.uid) {
        queryClient.setQueryData(userProfileKeys.profile(user.uid), (old: any) => ({
          ...old,
          photoURL: ''
        }));
      }
    },
  });
};

export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: (preferences: Partial<UserProfile['preferences']>) => {
      if (!user?.uid) throw new Error('User not authenticated');
      return UserService.updatePreferences(user.uid, preferences);
    },
    onSuccess: (_, variables) => {
      if (user?.uid) {
        queryClient.setQueryData(userProfileKeys.profile(user.uid), (old: any) => ({
          ...old,
          preferences: {
            ...old?.preferences,
            ...variables
          }
        }));
      }
    },
  });
};

// Utility hook for initializing user profile
export const useInitializeProfile = () => {
  const { user } = useAuth();
  const createProfileMutation = useCreateProfile();
  
  const initializeProfile = async () => {
    if (user && !createProfileMutation.data) {
      try {
        await createProfileMutation.mutateAsync(user);
      } catch (error) {
        console.error('Failed to initialize user profile:', error);
      }
    }
  };

  return { initializeProfile, isLoading: createProfileMutation.isPending };
};
