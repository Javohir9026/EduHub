import Header from "./sections/Header";
import Footer from "./sections/Footer";
import Hero from "./sections/Hero";
import { useEffect } from "react";

const LandingPage = () => {
  useEffect(() => {
    localStorage.setItem("theme", "light");
  }, []);
  return (
    <div>
      <Header />
      <div>
        <Hero />
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
