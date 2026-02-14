import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/Landing/LandingPage";
import SignInForm from "./pages/Landing/auth/SignInForm";
import RegisterForm from "./pages/Landing/auth/RegisterForm";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./pages/dashboard/Dashboard";
import GuestRoute from "./routes/GuestRoute";
import PublicLayout from "./pages/Landing/layout/PublicLayout";
import InfoUsers from "./pages/Landing/pages/InfoUsers";
import ContactUs from "./pages/Landing/pages/contactUs";
import AboutUs from "./pages/Landing/pages/aboutUs";
import ScrollToTop from "./components/common/ScroolToTop";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          index
          path="/"
          element={
            <GuestRoute>
              <LandingPage />
            </GuestRoute>
          }
        />
        <Route element={<PublicLayout />}>
          <Route
            path="/sign-in"
            element={
              <GuestRoute>
                <SignInForm />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <RegisterForm />
              </GuestRoute>
            }
          />
          <Route
            path="info-users"
            element={
              <GuestRoute>
                <ScrollToTop />
                <InfoUsers />
              </GuestRoute>
            }
          />
          <Route
            path="contact-us"
            element={
              <GuestRoute>
                <ScrollToTop />
                <ContactUs />
              </GuestRoute>
            }
          />
          <Route
            path="about-us"
            element={
              <GuestRoute>
                <ScrollToTop />
                <AboutUs />
              </GuestRoute>
            }
          />
        </Route>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
