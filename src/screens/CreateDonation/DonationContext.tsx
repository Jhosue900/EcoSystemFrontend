import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Outlet } from "react-router-dom";

export type DonationDraft = {
  images: File[];
  category: string;
  title: string;
  location: string;
  availability: string;
  time_limit: string;
};

const emptyDraft: DonationDraft = {
  images: [],
  category: "",
  title: "",
  location: "",
  availability: "",
  time_limit: "",
};

type DonationContextValue = {
  draft: DonationDraft;
  updateDraft: (patch: Partial<DonationDraft>) => void;
  resetDraft: () => void;
};

const DonationContext = createContext<DonationContextValue | null>(null);

export const DonationProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [draft, setDraft] = useState<DonationDraft>(emptyDraft);

  const updateDraft = useCallback(
    (patch: Partial<DonationDraft>) =>
      setDraft((prev) => ({ ...prev, ...patch })),
    [],
  );
  const resetDraft = useCallback(() => setDraft(emptyDraft), []);

  const value = useMemo(
    () => ({ draft, updateDraft, resetDraft }),
    [draft, updateDraft, resetDraft],
  );

  return (
    <DonationContext.Provider value={value}>
      {children}
    </DonationContext.Provider>
  );
};

/**
 * Úsalo como "layout route" para que los 5 pasos compartan el mismo estado:
 *   <Route element={<DonationFlow />}> ...rutas de create-donation... </Route>
 */
export const DonationFlow = (): JSX.Element => (
  <DonationProvider>
    <Outlet />
  </DonationProvider>
);

export const useDonation = (): DonationContextValue => {
  const ctx = useContext(DonationContext);
  if (!ctx) {
    throw new Error("useDonation must be used inside <DonationProvider>");
  }
  return ctx;
};