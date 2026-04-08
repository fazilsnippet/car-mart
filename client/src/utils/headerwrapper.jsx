import { useEffect, useState } from "react";

export default function HeaderWrapper({ children }) {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const threshold = 10; // 👈 ADD HERE

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 🛑 Always show at top
      if (currentScrollY <= 0) {
        setShowHeader(true);
        setLastScrollY(0);
        return;
      }

      // 🛑 Ignore tiny scrolls (prevents jitter)
      if (Math.abs(currentScrollY - lastScrollY) < threshold) {
        return;
      }

      if (currentScrollY > lastScrollY) {
        // 🔽 scrolling DOWN → hide
        setShowHeader(false);
      } else {
        // 🔼 scrolling UP → show
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {children}
    </div>
  );
}