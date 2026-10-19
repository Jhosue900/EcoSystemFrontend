import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppShell, PageContainer } from "../../components/AppShell";

export const Terms = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <AppShell>
      <PageContainer>
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-sm font-bold text-[#087532] hover:underline">
          <ArrowLeft size={16} /> Back
        </button>
        
        <div className="mx-auto max-w-3xl rounded-[28px] bg-white p-6 shadow-[0_20px_50px_rgba(43,91,58,.08)] sm:p-10">
          <h1 className="text-3xl font-extrabold text-[#142018] sm:text-4xl">Terms and Conditions</h1>
          <p className="mt-2 text-sm text-[#718077]">Last updated: October 2026</p>

          <div className="mt-8 space-y-6 text-sm leading-7 text-[#526158] sm:text-base">
            <section>
              <h2 className="text-xl font-extrabold text-[#142018] mb-3">1. Acceptance of Terms</h2>
              <p>
                By creating an account and using EcoSystem, you agree to these Terms and Conditions. If you do not agree, please do not use our platform. EcoSystem provides a platform to connect donors, beneficiaries, and volunteers to extend the lifecycle of usable goods.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#142018] mb-3">2. User Roles and Responsibilities</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Donors:</strong> Must ensure that items donated are in usable condition, clean, and safe. You are responsible for coordinating the handoff of the donation.</li>
                <li><strong>Beneficiaries:</strong> Must use the marketplace respectfully and coordinate pickups promptly.</li>
                <li><strong>Volunteers:</strong> Act independently and must prioritize their own safety during any logistics or delivery tasks.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#142018] mb-3">3. Prohibited Items</h2>
              <p>
                You may not list hazardous materials, weapons, illegal substances, expired food, or any items that violate local laws. EcoSystem reserves the right to remove any listing that violates these rules.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#142018] mb-3">4. Safety and Interactions</h2>
              <p>
                EcoSystem is not responsible for the safety of the items or the physical safety of users during handoffs. Users must exercise caution when sharing contact information and coordinating drop-offs. We recommend meeting in public places or designated collection points.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#142018] mb-3">5. Limitation of Liability</h2>
              <p>
                EcoSystem is provided "as is". We are not liable for any damages, losses, or injuries resulting from the use of the platform or the items exchanged.
              </p>
            </section>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  );
};