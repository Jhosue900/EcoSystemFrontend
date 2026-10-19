import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppShell, PageContainer } from "../../components/AppShell";

export const Privacy = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <AppShell>
      <PageContainer>
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-sm font-bold text-[#087532] hover:underline">
          <ArrowLeft size={16} /> Back
        </button>
        
        <div className="mx-auto max-w-3xl rounded-[28px] bg-white p-6 shadow-[0_20px_50px_rgba(43,91,58,.08)] sm:p-10">
          <h1 className="text-3xl font-extrabold text-[#142018] sm:text-4xl">Privacy Policy</h1>
          <p className="mt-2 text-sm text-[#718077]">Last updated: October 2026</p>

          <div className="mt-8 space-y-6 text-sm leading-7 text-[#526158] sm:text-base">
            <section>
              <h2 className="text-xl font-extrabold text-[#142018] mb-3">1. Information We Collect</h2>
              <p>
                When you register, we collect personal information such as your name, email address, age, city, and country. If you post donations, volunteer requests, or collection points, we also collect the contact information (phone/WhatsApp) you choose to provide.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#142018] mb-3">2. How We Use Your Information</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>To create and manage your account.</li>
                <li>To allow donors and beneficiaries to coordinate item pickups.</li>
                <li>To display collection points and volunteer opportunities.</li>
                <li>To ensure the safety and security of our community.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#142018] mb-3">3. Sharing of Information</h2>
              <p>
                Your contact information (phone and email) is only shared with users who are interacting with your specific listings (e.g., reserving a donation or viewing your volunteer request). Your password is securely encrypted using bcrypt and is never shared.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#142018] mb-3">4. Data Security</h2>
              <p>
                We use industry-standard security measures to protect your data. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-extrabold text-[#142018] mb-3">5. Your Rights</h2>
              <p>
                You have the right to access, update, or delete your personal information at any time. You can do this by managing your profile or by contacting our support team.
              </p>
            </section>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  );
};