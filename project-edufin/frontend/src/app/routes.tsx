import { createBrowserRouter } from "react-router";
import { AppLayout } from "./components/shared/AppLayout";
import { ErrorPage, NotFoundPage } from "./components/shared/ErrorPage";
import { OnboardingPage } from "./components/auth/OnboardingPage";
import { LoginPage } from "./components/auth/LoginPage";
import { RegisterPage } from "./components/auth/RegisterPage";
import { StudentDashboard } from "./components/student/StudentDashboard";
import { PaySPP } from "./components/student/PaySPP";
import { LoanPage } from "./components/student/LoanPage";
import { FundraisingPage } from "./components/student/FundraisingPage";
import { HistoryPage } from "./components/student/HistoryPage";
import { StudentProfile } from "./components/student/StudentProfile";
import { SchoolDashboard } from "./components/school/SchoolDashboard";
import { SchoolBillsPage } from "./components/school/SchoolBillsPage";
import { SchoolReportPage } from "./components/school/SchoolReportPage";
import { SchoolProfilePage } from "./components/school/SchoolProfilePage";
import { SchoolHistoryPage } from "./components/school/SchoolHistoryPage";
import { DonorDashboard } from "./components/donor/DonorDashboard";
import { CampaignDetail } from "./components/donor/CampaignDetail";
import { DonorCampaignsPage } from "./components/donor/DonorCampaignsPage";
import { DonorHistoryPage } from "./components/donor/DonorHistoryPage";
import { DonorProfilePage } from "./components/donor/DonorProfilePage";
import WireframeViewer from "./components/wireframes/WireframeViewer";

export const router = createBrowserRouter([
  // Documentation Routes (No Layout)
  { path: "/wireframes", Component: WireframeViewer },

  // Main App Routes (With Layout)
  {
    Component: AppLayout,
    ErrorBoundary: ErrorPage,
    children: [
      { path: "/", Component: OnboardingPage },
      { path: "/login", Component: LoginPage },
      { path: "/register", Component: RegisterPage },

      // Student routes
      { path: "/student", Component: StudentDashboard },
      { path: "/student/spp", Component: PaySPP },
      { path: "/student/loan", Component: LoanPage },
      { path: "/student/fundraising", Component: FundraisingPage },
      { path: "/student/history", Component: HistoryPage },
      { path: "/student/profile", Component: StudentProfile },

      // School routes
      { path: "/school", Component: SchoolDashboard },
      { path: "/school/bills", Component: SchoolBillsPage },
      { path: "/school/report", Component: SchoolReportPage },
      { path: "/school/history", Component: SchoolHistoryPage },
      { path: "/school/profile", Component: SchoolProfilePage },

      // Donor routes
      { path: "/donor", Component: DonorDashboard },
      { path: "/donor/campaigns", Component: DonorCampaignsPage },
      { path: "/donor/history", Component: DonorHistoryPage },
      { path: "/donor/profile", Component: DonorProfilePage },
      { path: "/donor/campaign/:id", Component: CampaignDetail },

      // 404 catch-all
      { path: "*", Component: NotFoundPage },
    ],
  },
]);