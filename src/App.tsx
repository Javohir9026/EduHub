import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/Landing/LandingPage";
import SignInForm from "./pages/Landing/auth/SignInForm";
import RegisterForm from "./pages/Landing/auth/RegisterForm";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<SignInForm />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
