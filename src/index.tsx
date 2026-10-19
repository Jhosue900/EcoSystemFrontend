import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
//import { CharityProfile } from "./screens/CharityProfile/CharityProfile";
//import { CreateCharityProfile } from "./screens/CharityProfile/CreateCharityProfile";
import { CreateAccount } from "./screens/LoginForms/createAccount";
import { Login } from "./screens/LoginForms/loginForm";
import { CreateDonation } from "./screens/CreateDonation/CreateDonation";
import { DonationCategory } from "./screens/CreateDonation/DonationCategory";
import { DonationDetailsForm } from "./screens/CreateDonation/DonationDetails";
import { DonationReview } from "./screens/CreateDonation/DonationReview";
import { DonationFlow } from "./screens/CreateDonation/DonationContext";
import { Dashboard } from "./screens/Dashboard/Dashboard";
import { DonationDetails } from "./screens/DonationDetails/DonationDetails";
import { DonationHistory } from "./screens/DonationHistory/DonationHistory";
import { LandingPage } from "./screens/LandingPage/LandingPage";
import { DonationMarketplace } from "./screens/DonationMarketplace/DonationMarketplace";
import { CreateCollectionPoint } from "./screens/CollectionPoint/CreateCollectionPoint";
import { CollectionPoints } from "./screens/CollectionPoint/CollectionPoints";
import { MyCollectionPoints } from "./screens/CollectionPoint/MyCollectionPoints";
import { VolunteerMarketplace } from "./screens/VolunteerMarketplace/VolunteerMarketplace";
import { Profile } from "./screens/Profile/Profile";
import { CreateVolunteerPost } from "./screens/VolunteerMarketplace/CreateVolunteerPost";
import { MyVolunteerPosts } from "./screens/VolunteerMarketplace/MyVolunteerPosts";
import { VolunteerHistory } from "./screens/VolunteerHistory/VolunteerHistory";
import { DonorHistory } from "./screens/DonationHistory/DonorHistory";
import { MyDonations } from "./screens/DonationHistory/MyDonations";
import { BeneficiaryHistory } from "./screens/BeneficiaryHistory/BeneficiaryHistory";
import { Terms } from "./screens/Legal/Terms";
import { Privacy } from "./screens/Legal/Privacy";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/marketplace" element={<DonationMarketplace />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route element={<DonationFlow />}>
          <Route path="/create-donation" element={<CreateDonation />} />
          <Route
            path="/create-donation/category"
            element={<DonationCategory />}
          />
          <Route
            path="/create-donation/details"
            element={<DonationDetailsForm />}
          />
          <Route path="/create-donation/review" element={<DonationReview />} />
        </Route>

        <Route path="/collection-points" element={<CollectionPoints />} />
        <Route
          path="/collection-points/new"
          element={<CreateCollectionPoint />}
        />
        <Route path="/my-collection-points" element={<MyCollectionPoints />} />

        <Route path="/register" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="/history" element={<DonationHistory />} />
        <Route path="/donation-details" element={<DonationDetails />} />
        <Route path="*" element={<LandingPage />} />

        <Route path="/profile" element={<Profile />} />

        <Route
          path="/volunteer-marketplace"
          element={<VolunteerMarketplace />}
        />
        <Route path="/volunteer-posts/new" element={<CreateVolunteerPost />} />

        <Route path="/my-volunteer-posts" element={<MyVolunteerPosts />} />

        <Route path="/volunteer-history" element={<VolunteerHistory />} />

        <Route path="/donor-history" element={<DonorHistory />} />

        <Route path="/my-donations" element={<MyDonations />} />

        <Route path="/beneficiary-history" element={<BeneficiaryHistory />} />

        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
