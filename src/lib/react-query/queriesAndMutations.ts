import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createPost, createUserAccount, deletePost, deleteSavedPost, getCurrentUser, getInfinitePosts, getLikedPosts, getPostById, getRecentPosts, getSavedPosts, getUser, getUsers, getUsersPosts, likePost, savePost, searchPosts, signInAccount, signOutAccount, updatePost, updateUser } from "../firebase/api"
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types"
import { QUERY_KEYS } from "./queryKeys"
import { DocumentData } from "firebase/firestore"

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user)
  })
}

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string, password: string }) => signInAccount(user)
  })
}

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount
  })
}

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
    select: (data) => data || {}
  })
}

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser
  })
}

export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
    }
  })
}

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts
  })
}

export const useLikePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, likesArray }: { postId: string, likesArray: string[] }) => likePost(postId, likesArray),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
      })
    }
  })
}

export const useSavePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, userId, currentUser }: { postId: string, userId: string, currentUser: string }) => savePost(postId, userId, currentUser),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
      })
    }
  })
}

export const useGetSavedPosts = (userId: string) => {
  return useQuery({
    queryKey: ['getSavedPosts'],
    queryFn: () => getSavedPosts(userId)
  })
}

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, userId }: { postId: string, userId: string }) => deleteSavedPost(postId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
      })
    }
  })
}

export const useGetPostById = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId
  })
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID]
      })
    }
  })
}

export const useDeletePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ postId, imagePath }: { postId: string, imagePath: string }) => deletePost(postId, imagePath),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
    }
  })
}

export const useGetPosts = () => {
  return useInfiniteQuery<DocumentData[], Error>({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinitePosts,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length === 0) {
        return null;
      }
      const lastDoc = lastPage[lastPage.length - 1];
      return lastDoc.createdAt;

    },
  });
};

export const useSearchPosts = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm
  })
}

export const useGetUsers = (limit?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => getUsers(limit)
  })
}

export const useGetUserPosts = (userId: string | '') => {
  return useQuery({
    queryKey: ['getUserPosts', userId],
    queryFn: () => getUsersPosts(userId),
    enabled: !!userId
  })
}

export const useGetLikedPosts = (userId: string | '') => {
  return useQuery({
    queryKey: ['getLikedPosts'],
    queryFn: () => getLikedPosts(userId)
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (user: IUpdateUser) => updateUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID]
      })
    }
  })
}