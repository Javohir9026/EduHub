import Header from "./sections/Header";
import Footer from "./sections/Footer";
import Hero from "./sections/Hero";
import { useEffect } from "react";

const LandingPage = () => {
  useEffect(() => {
    localStorage.setItem("theme", "light");
    document.documentElement.classList.remove("dark");
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Header />
      <Hero />
      <Footer />
    </div>
  );
};

export default LandingPage;
