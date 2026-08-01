import { useEffect } from "react";
import { useMotionValue, useSpring } from "framer-motion";

/**
 * Retorna valores animados (spring) da posição relativa do mouse
 * dentro de um container, normalizados entre -0.5 e 0.5.
 * Usado para criar efeitos de parallax premium no Hero.
 */
export function useMousePosition() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 60, damping: 20, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 60, damping: 20, mass: 0.6 });

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      const relX = e.clientX / window.innerWidth - 0.5;
      const relY = e.clientY / window.innerHeight - 0.5;
      x.set(relX);
      y.set(relY);
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [x, y]);

  return { x: springX, y: springY };
}
