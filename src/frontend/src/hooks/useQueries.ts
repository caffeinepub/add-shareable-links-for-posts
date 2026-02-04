import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Post, Cave, UserProfile, Message } from '../backend';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';

// Profile queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetUserProfile(principal: string) {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['userProfile', principal],
    queryFn: async () => {
      if (!actor) return null;
      const { Principal } = await import('@dfinity/principal');
      return actor.getUserProfile(Principal.fromText(principal));
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
}

// Feed queries
export function useGetFeed() {
  const { actor, isFetching } = useActor();

  return useQuery<Post[]>({
    queryKey: ['feed'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeed();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, media }: { content: string; media: ExternalBlob | null }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createPost(content, media);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      toast.success('Post created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create post');
    },
  });
}

// Cave queries
export function useGetCaves() {
  const { actor, isFetching } = useActor();

  return useQuery<Cave[]>({
    queryKey: ['caves'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCaves();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000, // Poll every 5 seconds
  });
}

export function useGetCave(caveId: string) {
  const { data: caves } = useGetCaves();
  return caves?.find((cave) => cave.id === caveId);
}

export function useCreateCave() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createCave(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caves'] });
      toast.success('Cave created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create cave');
    },
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ caveId, content }: { caveId: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.sendMessage(caveId, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caves'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send message');
    },
  });
}

// Invite queries
export function useCreateInvite() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ caveId, token }: { caveId: string; token: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createInvite(caveId, token, null);
    },
    onSuccess: () => {
      toast.success('Invite created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create invite');
    },
  });
}

export function useJoinCave() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (token: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.joinCave(token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caves'] });
      toast.success('Successfully joined cave');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to join cave');
    },
  });
}

export function useRevokeInvite() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (token: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.revokeInvite(token);
    },
    onSuccess: () => {
      toast.success('Invite revoked successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to revoke invite');
    },
  });
}
