import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/Landing/LandingPage";
import SignInForm from "./pages/Landing/auth/SignInForm";
import RegisterForm from "./pages/Landing/auth/RegisterForm";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./pages/dashboard/Dashboard";
import GuestRoute from "./routes/GuestRoute";
import PublicLayout from "./pages/Landing/layout/PublicLayout";
import InfoUsers from "./pages/Landing/pages/InfoUsers";

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
        </Route>
        <Route path="/info-users" element={<InfoUsers />} />
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
