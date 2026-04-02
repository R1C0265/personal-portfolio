import { create } from "zustand";

// This store tracks which nav section is currently active.
// Zustand is used here instead of useState because this state needs to be
// shared between the Navbar (to highlight the active link) and the page
// scroll listener — without prop drilling.
interface PortfolioStore {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  activeSection: "home",
  setActiveSection: (section) => set({ activeSection: section }),
}));
