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

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/marketplace" element={<DonationMarketplace />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route element={<DonationFlow />}>
          <Route path="/create-donation" element={<CreateDonation />} />
          <Route path="/create-donation/category" element={<DonationCategory />} />
          <Route path="/create-donation/details" element={<DonationDetailsForm />} />
          <Route path="/create-donation/review" element={<DonationReview />} />
        </Route>

        <Route path="/register" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="/history" element={<DonationHistory />} />
        <Route path="/donation-details" element={<DonationDetails />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);