import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader } from "./components/Loader/Loader";
import { Header } from "./components/Header/Header";
import { Hero } from "./components/Hero/Hero";
import { TrustBar } from "./components/TrustBar/TrustBar";
import { Footer } from "./components/Footer/Footer";
import { ServicesTeaser } from "./sections/Services/ServicesTeaser";
import { useLenis } from "./hooks/useLenis";

export default function App() {
  const [loading, setLoading] = useState(true);

  useLenis();

  return (
    <>
      <Loader onFinish={() => setLoading(false)} />

      <AnimatePresence>
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative min-h-screen w-full bg-ink-900"
          >
            <Header />

            <main>
              <Hero />
              <TrustBar />
              <ServicesTeaser />
            </main>

            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
