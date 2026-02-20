import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PropertyService } from '@/services/propertyService';
import { Property, CreateProperty, UpdateProperty } from '@/lib/firebase/schema';
import { useAuth } from '@/contexts/AuthContext';

// Query keys
export const propertyKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...propertyKeys.lists(), filters] as const,
  details: () => [...propertyKeys.all, 'detail'] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
  featured: () => [...propertyKeys.all, 'featured'] as const,
  search: (query: string) => [...propertyKeys.all, 'search', query] as const,
  user: () => [...propertyKeys.all, 'user'] as const,
};

// Hooks
export const useProperties = (filters?: Record<string, unknown>) => {
  return useQuery({
    queryKey: propertyKeys.list(filters || {}),
    queryFn: () => PropertyService.filterProperties(filters || {}),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: () => PropertyService.getPropertyById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useFeaturedProperties = () => {
  return useQuery({
    queryKey: propertyKeys.featured(),
    queryFn: PropertyService.getFeaturedProperties,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSearchProperties = (query: string) => {
  return useQuery({
    queryKey: propertyKeys.search(query),
    queryFn: () => PropertyService.searchProperties(query),
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUserProperties = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: propertyKeys.user(),
    queryFn: () => PropertyService.getUserProperties(),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (property: CreateProperty) => PropertyService.createProperty(property),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: propertyKeys.user() });
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProperty }) => 
      PropertyService.updateProperty(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: propertyKeys.user() });
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => PropertyService.deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: propertyKeys.user() });
    },
  });
};

export const useIncrementViews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => PropertyService.incrementViews(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
    },
  });
};

export const useIncrementInquiries = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => PropertyService.incrementInquiries(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
    },
  });
};
