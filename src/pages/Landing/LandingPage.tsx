import Header from "./sections/Header";
import Footer from "./sections/Footer";
import Hero from "./sections/Hero";
import { useTheme } from "@/components/common/ThemeProvider";
import { useEffect } from "react";

const LandingPage = () => {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme("light");
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
