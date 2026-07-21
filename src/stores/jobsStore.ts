import { create } from 'zustand';
import { Job, Company } from '../types';

interface JobsStore {
  jobs: Job[];
  companies: Company[];
  recommendedJobs: Job[];
  loading: boolean;
  setJobs: (jobs: Job[]) => void;
  setCompanies: (companies: Company[]) => void;
  setRecommendedJobs: (jobs: Job[]) => void;
  addJob: (job: Job) => void;
  addCompany: (company: Company) => void;
  setLoading: (loading: boolean) => void;
}

const useJobsStore = create<JobsStore>((set) => ({
  jobs: [],
  companies: [],
  recommendedJobs: [],
  loading: false,
  
  setJobs: (jobs) => set({ jobs }),
  setCompanies: (companies) => set({ companies }),
  setRecommendedJobs: (jobs) => set({ recommendedJobs: jobs }),
  addJob: (job) => set((state) => ({ jobs: [job, ...state.jobs] })),
  addCompany: (company) => set((state) => ({ companies: [company, ...state.companies] })),
  setLoading: (loading) => set({ loading }),
}));

export default useJobsStore;