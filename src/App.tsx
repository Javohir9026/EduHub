import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/Landing/LandingPage";
import SignInForm from "./pages/Landing/auth/SignInForm";
import RegisterForm from "./pages/Landing/auth/RegisterForm";
import Dashboard from "./pages/dashboard/Dashboard";
import GuestRoute from "./routes/GuestRoute";
import PublicLayout from "./pages/Landing/layout/PublicLayout";
import InfoUsers from "./pages/Landing/pages/InfoUsers";
import ContactUs from "./pages/Landing/pages/contactUs";
import AboutUs from "./pages/Landing/pages/aboutUs";
import ScrollToTop from "./components/common/ScroolToTop";
import StudentsPage from "./pages/students/StudentsPage";
import TeachersPage from "./pages/Teachers/TeachersPage";
import Groups from "./pages/Groups/Groups";
import CalendarPage from "./pages/Calendar/CalendarPage";
import UserProfile from "./pages/UserProfile/userProfile";
import AppLayoutWithProvider from "./layout/AppLayoutWithProvider";
import StudentInfoPage from "./pages/students/StudentInfoPage";
import TeacherInfoPage from "./pages/Teachers/TeacherInfoPage";
import { GroupInfo } from "./pages/Groups/GorupInfo";
import LearningCenterRoute from "./routes/LearningProtectedRoute";
import AuthRoute from "./routes/AuthRoute";
import TeacherRoute from "./routes/TeacherProtectedRoute";
import MyGroups from "./pages/MyGroups/MyGroups";
import AttendancesPage from "./pages/Davomat/Attendances";

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
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
        <Route element={<AppLayoutWithProvider />}>
          <Route
            path="/dashboard"
            element={
              <AuthRoute>
                <Dashboard />
              </AuthRoute>
            }
          />
          <Route
            path="/students"
            element={
              <LearningCenterRoute>
                <StudentsPage />
              </LearningCenterRoute>
            }
          />
          <Route
            path="/teachers"
            element={
              <LearningCenterRoute>
                <TeachersPage />
              </LearningCenterRoute>
            }
          />
          <Route
            path="/groups"
            element={
              <LearningCenterRoute>
                <Groups />
              </LearningCenterRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <LearningCenterRoute>
                <CalendarPage />
              </LearningCenterRoute>
            }
          />
          <Route
            path="/user-profile"
            element={
              <LearningCenterRoute>
                <UserProfile />
              </LearningCenterRoute>
            }
          />
          <Route
            path="/student-info/:id"
            element={
              <LearningCenterRoute>
                <StudentInfoPage />
              </LearningCenterRoute>
            }
          />
          <Route
            path="/teacher-info/:id"
            element={
              <LearningCenterRoute>
                <TeacherInfoPage />
              </LearningCenterRoute>
            }
          />
          <Route
            path="/group-info/:id"
            element={
              <AuthRoute>
                <GroupInfo />
              </AuthRoute>
            }
          />
          <Route
            path="/my-groups"
            element={
              <TeacherRoute>
                <MyGroups />
              </TeacherRoute>
            }
          />
          <Route
            path="/attendances"
            element={
              <TeacherRoute>
                <AttendancesPage />
              </TeacherRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
