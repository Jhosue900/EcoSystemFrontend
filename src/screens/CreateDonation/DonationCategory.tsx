import { Shirt, Soup, Tag, ToyBrick } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppShell, PageContainer } from "../../components/AppShell";
import { DonationStepLayout, ChoiceCard } from "./DonationStepLayout";
import { useDonation } from "./DonationContext";

const categories = [
  [Soup, "Food"],
  [Shirt, "Clothing"],
  [Tag, "Household"],
  [ToyBrick, "Kids & Toys"],
];

export const DonationCategory = (): JSX.Element => {
  const navigate = useNavigate();
  const { draft, updateDraft } = useDonation();

  return (
    <AppShell>
      <PageContainer>
        <DonationStepLayout
          step={2}
          title="Choose a Category"
          nextDisabled={!draft.category}
          onNext={() => navigate("/create-donation/details")}
        >
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {categories.map(([Icon, label]) => (
              <ChoiceCard
                key={label as string}
                icon={Icon as typeof Soup}
                label={label as string}
                selected={draft.category === (label as string)}
                onClick={() => updateDraft({ category: label as string })}
              />
            ))}
          </div>
        </DonationStepLayout>
      </PageContainer>
    </AppShell>
  );
};