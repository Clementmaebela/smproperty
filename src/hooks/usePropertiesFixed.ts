import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PropertyServiceFixed } from '@/services/propertyServiceFixed';
import { Property, CreateProperty, UpdateProperty } from '@/lib/firebase/schema';
import { useAuth } from '@/contexts/AuthContext';

// Query keys
export const propertyKeysFixed = {
  all: ['properties'] as const,
  lists: () => [...propertyKeysFixed.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...propertyKeysFixed.lists(), filters] as const,
  details: () => [...propertyKeysFixed.all, 'detail'] as const,
  detail: (id: string) => [...propertyKeysFixed.details(), id] as const,
  featured: () => [...propertyKeysFixed.all, 'featured'] as const,
  search: (query: string) => [...propertyKeysFixed.all, 'search', query] as const,
  user: () => [...propertyKeysFixed.all, 'user'] as const,
};

// Hooks
export const useProperties = (filters?: Record<string, unknown>) => {
  return useQuery({
    queryKey: propertyKeysFixed.list(filters || {}),
    queryFn: () => PropertyServiceFixed.filterProperties(filters || {}),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on certain errors
      if (error instanceof Error && error.message.includes('permission')) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    }
  });
};

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: propertyKeysFixed.detail(id),
    queryFn: () => PropertyServiceFixed.getPropertyById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2
  });
};

export const useFeaturedProperties = () => {
  return useQuery({
    queryKey: propertyKeysFixed.featured(),
    queryFn: () => PropertyServiceFixed.getFeaturedProperties(),
    staleTime: 15 * 60 * 1000, // 15 minutes
    retry: 2
  });
};

export const useUserProperties = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: propertyKeysFixed.user(),
    queryFn: () => PropertyServiceFixed.getUserProperties(),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
};

export const useSearchProperties = (query: string) => {
  return useQuery({
    queryKey: propertyKeysFixed.search(query),
    queryFn: () => PropertyServiceFixed.searchProperties(query),
    enabled: !!query && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1
  });
};

// Mutations
export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (property: CreateProperty) => PropertyServiceFixed.createProperty(property),
    onSuccess: (newProperty) => {
      console.log('✅ Property created successfully:', newProperty.id);
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: propertyKeysFixed.all });
      queryClient.invalidateQueries({ queryKey: propertyKeysFixed.user() });
    },
    onError: (error) => {
      console.error('❌ Create property mutation error:', error);
    }
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateProperty }) => 
      PropertyServiceFixed.updateProperty(id, updates),
    onSuccess: (updatedProperty, variables) => {
      console.log('✅ Property updated successfully:', variables.id);
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: propertyKeysFixed.all });
      queryClient.invalidateQueries({ queryKey: propertyKeysFixed.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: propertyKeysFixed.user() });
    },
    onError: (error, variables) => {
      console.error(`❌ Update property ${variables.id} mutation error:`, error);
    }
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => PropertyServiceFixed.deleteProperty(id),
    onSuccess: (_, id) => {
      console.log('✅ Property deleted successfully:', id);
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: propertyKeysFixed.all });
      queryClient.invalidateQueries({ queryKey: propertyKeysFixed.detail(id) });
      queryClient.invalidateQueries({ queryKey: propertyKeysFixed.user() });
    },
    onError: (error, id) => {
      console.error(`❌ Delete property ${id} mutation error:`, error);
    }
  });
};
