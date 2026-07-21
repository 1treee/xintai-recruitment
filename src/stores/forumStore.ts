import { create } from 'zustand';
import { ForumCategory, ForumPost, ForumComment } from '../types';

interface ForumStore {
  categories: ForumCategory[];
  posts: ForumPost[];
  comments: Record<string, ForumComment[]>;
  loading: boolean;
  setCategories: (categories: ForumCategory[]) => void;
  setPosts: (posts: ForumPost[]) => void;
  setComments: (postId: string, comments: ForumComment[]) => void;
  addPost: (post: ForumPost) => void;
  addComment: (postId: string, comment: ForumComment) => void;
  likePost: (postId: string) => void;
  setLoading: (loading: boolean) => void;
}

const useForumStore = create<ForumStore>((set) => ({
  categories: [],
  posts: [],
  comments: {},
  loading: false,
  
  setCategories: (categories) => set({ categories }),
  setPosts: (posts) => set({ posts }),
  setComments: (postId, comments) => set((state) => ({
    comments: { ...state.comments, [postId]: comments },
  })),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  addComment: (postId, comment) => set((state) => ({
    comments: {
      ...state.comments,
      [postId]: [...(state.comments[postId] || []), comment],
    },
  })),
  likePost: (postId) => set((state) => ({
    posts: state.posts.map((p) =>
      p.id === postId ? { ...p, likes: p.likes + 1 } : p
    ),
  })),
  setLoading: (loading) => set({ loading }),
}));

export default useForumStore;