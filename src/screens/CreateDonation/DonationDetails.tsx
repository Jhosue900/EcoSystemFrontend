import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell, PageContainer } from "../../components/AppShell";
import { Input } from "../../components/ui/input";
import { DonationStepLayout } from "./DonationStepLayout";
import { useDonation } from "./DonationContext";

type DetailKey = "title" | "location" | "availability" | "time_limit";

const fields: { key: DetailKey; label: string; placeholder: string }[] = [
  { key: "title", label: "Title", placeholder: "Assorted Organic Produce" },
  { key: "location", label: "Location", placeholder: "Greenwich Village, NY" },
  {
    key: "availability",
    label: "Availability",
    placeholder: "4 bundles left",
  },
  { key: "time_limit", label: "Time limit", placeholder: "2h left" },
];

export const DonationDetailsForm = (): JSX.Element => {
  const navigate = useNavigate();
  const { draft, updateDraft } = useDonation();

  // Si se recarga la página el estado se pierde: volver a elegir categoría
  useEffect(() => {
    if (!draft.category) {
      navigate("/create-donation/category", { replace: true });
    }
  }, [draft.category, navigate]);

  const isComplete = fields.every(({ key }) => draft[key].trim() !== "");

  return (
    <AppShell>
      <PageContainer>
        <DonationStepLayout
          step={3}
          title="Item Details"
          nextDisabled={!isComplete}
          onNext={() => navigate("/create-donation/review")}
        >
          <div className="mt-6 space-y-5 text-left">
            {fields.map(({ key, label, placeholder }) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="mb-2 block text-sm font-bold text-[#526158]"
                >
                  {label}
                </label>
                <Input
                  id={key}
                  value={draft[key]}
                  onChange={(e) => updateDraft({ [key]: e.target.value })}
                  placeholder={placeholder}
                  className="h-11 rounded-xl border-[#cfe6d6] bg-[#f7fcf6] text-sm focus-visible:ring-[#27bb5c]"
                />
              </div>
            ))}
          </div>
        </DonationStepLayout>
      </PageContainer>
    </AppShell>
  );
};