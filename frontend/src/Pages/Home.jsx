import Dashboard from "./Dashboard";
import Hero from "../Components/Hero";
import NearlyExpiryItems from "../Components/NearlyExpiryItems";
import AboutUs from "../Components/AboutUs";
import ExpiredFoodItems from "../Components/ExpiredFoodItems";
import CountUpFood from "../Components/CountUpFood";
import { FaqFaqSection } from "../Components/FaqSection";

const Home = () => (
  <>
    <Hero />

    <Dashboard />

    <NearlyExpiryItems />
    <ExpiredFoodItems />
    <CountUpFood />
    <AboutUs />
    <FaqFaqSection />
  </>
);

export default Home;