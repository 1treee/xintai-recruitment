import { create } from 'zustand';
import { Resume } from '../types';

interface TalentStore {
  resumes: Resume[];
  urgentResumes: Resume[];
  loading: boolean;
  setResumes: (resumes: Resume[]) => void;
  setUrgentResumes: (resumes: Resume[]) => void;
  addResume: (resume: Resume) => void;
  updateResume: (id: string, resume: Partial<Resume>) => void;
  removeResume: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

const useTalentStore = create<TalentStore>((set) => ({
  resumes: [],
  urgentResumes: [],
  loading: false,
  
  setResumes: (resumes) => set({ resumes }),
  setUrgentResumes: (resumes) => set({ urgentResumes: resumes }),
  addResume: (resume) => set((state) => ({ resumes: [resume, ...state.resumes] })),
  updateResume: (id, updated) => set((state) => ({
    resumes: state.resumes.map((r) => (r.id === id ? { ...r, ...updated } : r)),
  })),
  removeResume: (id) => set((state) => ({
    resumes: state.resumes.filter((r) => r.id !== id),
  })),
  setLoading: (loading) => set({ loading }),
}));

export default useTalentStore;