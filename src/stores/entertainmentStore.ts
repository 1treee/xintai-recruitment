import { create } from 'zustand';
import { ShortVideo, Poll } from '../types';

interface EntertainmentStore {
  videos: ShortVideo[];
  polls: Poll[];
  loading: boolean;
  setVideos: (videos: ShortVideo[]) => void;
  setPolls: (polls: Poll[]) => void;
  addVideo: (video: ShortVideo) => void;
  addPoll: (poll: Poll) => void;
  setLoading: (loading: boolean) => void;
}

const useEntertainmentStore = create<EntertainmentStore>((set) => ({
  videos: [],
  polls: [],
  loading: false,
  
  setVideos: (videos) => set({ videos }),
  setPolls: (polls) => set({ polls }),
  addVideo: (video) => set((state) => ({ videos: [video, ...state.videos] })),
  addPoll: (poll) => set((state) => ({ polls: [poll, ...state.polls] })),
  setLoading: (loading) => set({ loading }),
}));

export default useEntertainmentStore;