import { motion } from "framer-motion";

const SplashScreen = () => (
  <motion.div
    className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.35, ease: "easeOut" }}
  >
    <div className="flex flex-col items-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="flex h-28 w-28 items-center justify-center border border-border bg-card p-4 shadow-sm"
      >
        <img src="/images/logo.png" alt="SLIA Logo" className="h-full w-full object-contain" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.35 }}
        className="mt-6 text-xs font-bold uppercase tracking-[0.32em] text-primary"
      >
        Sri Lanka Institute of Architects
      </motion.p>

      <div className="mt-6 h-px w-56 overflow-hidden bg-border">
        <motion.div
          className="h-full bg-primary"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.1, ease: "easeInOut", repeat: Infinity }}
        />
      </div>
    </div>
  </motion.div>
);

export default SplashScreen;
