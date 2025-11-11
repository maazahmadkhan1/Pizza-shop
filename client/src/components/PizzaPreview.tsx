import { motion } from "framer-motion";
import { useMemo } from "react";

interface PizzaPreviewProps {
  size: string;
  crust: string;
  sauce: string;
  cheese: string;
  toppings: string[];
}

const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const ToppingDot = ({ type, style }: { type: string; style: React.CSSProperties }) => {
  const getToppingStyle = () => {
    if (type.includes("pepperoni")) return { background: "radial-gradient(circle at 30% 30%, #E74C3C, #C0392B)", border: "2px solid #A93226" };
    if (type.includes("chicken")) return { background: "radial-gradient(circle at 30% 30%, #F4D03F, #D4AC0D)", border: "2px solid #B8860B" };
    if (type.includes("beef") || type.includes("sausage")) return { background: "radial-gradient(circle at 30% 30%, #8B4513, #654321)", border: "2px solid #5D4037" };
    if (type.includes("bacon")) return { background: "linear-gradient(45deg, #D35400 25%, #E67E22 25%, #E67E22 50%, #D35400 50%, #D35400 75%, #E67E22 75%)", border: "2px solid #CA6F1E" };
    if (type.includes("mushroom")) return { background: "radial-gradient(circle at 30% 30%, #D7CCC8, #A1887F)", border: "2px solid #8D6E63" };
    if (type.includes("pepper")) return { background: "radial-gradient(circle at 30% 30%, #7CB342, #558B2F)", border: "2px solid #33691E" };
    if (type.includes("olive")) return { background: "radial-gradient(circle at 30% 30%, #424242, #212121)", border: "2px solid #000" };
    if (type.includes("tomato")) return { background: "radial-gradient(circle at 30% 30%, #FF6B6B, #EE5A6F)", border: "2px solid #C0392B" };
    if (type.includes("onion")) return { background: "radial-gradient(circle at 30% 30%, #E8D5E8, #D8BFD8)", border: "2px solid #BA68C8" };
    if (type.includes("jalapeno")) return { background: "radial-gradient(circle at 30% 30%, #9CCC65, #7CB342)", border: "2px solid #689F38" };
    if (type.includes("pineapple")) return { background: "radial-gradient(circle at 30% 30%, #FFF59D, #FFF176)", border: "2px solid #F9A825" };
    return { background: "radial-gradient(circle at 30% 30%, #FF6B6B, #EE5A6F)", border: "2px solid #C0392B" };
  };

  return (
    <div
      className="absolute rounded-full shadow-lg"
      style={{
        ...getToppingStyle(),
        ...style,
      }}
    />
  );
};

export default function PizzaPreview({ size, crust, sauce, cheese, toppings }: PizzaPreviewProps) {
  const getPizzaSize = () => {
    switch (size) {
      case "small": return 180;
      case "medium": return 220;
      case "large": return 260;
      case "xlarge": return 300;
      default: return 220;
    }
  };

  const getCrustThickness = () => {
    switch (crust) {
      case "thin": return 0.88;
      case "thick": return 0.78;
      case "stuffed": return 0.75;
      default: return 0.82;
    }
  };

  const pizzaSize = getPizzaSize();
  const crustThickness = getCrustThickness();

  // ✅ FIXED: ensures toppings stay within the visible pizza circle
  const toppingPositions = useMemo(() => {
    const positions: Array<{ x: number; y: number; sizeVar: number; rotation: number }> = [];
    const radiusLimit = (pizzaSize * crustThickness) / 2 * 0.9; // inside cheese area
    const minSpacing = 20;

    for (let i = 0; i < toppings.length; i++) {
      const toppingId = toppings[i];
      const seed = toppingId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) + i;
      const sizeVar = 16 + seededRandom(seed * 5) * 12;
      let position = { x: 0, y: 0, sizeVar, rotation: 0 };
      let attempts = 0;

      while (attempts < 50) {
        const angle = seededRandom(seed * 3 + attempts * 7) * Math.PI * 2;
        const radius = seededRandom(seed * 7 + attempts * 13) * radiusLimit;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        // ensure no overlap
        let tooClose = false;
        for (const existing of positions) {
          const d = Math.sqrt((x - existing.x) ** 2 + (y - existing.y) ** 2);
          if (d < minSpacing) {
            tooClose = true;
            break;
          }
        }

        if (!tooClose) {
          position = {
            x,
            y,
            sizeVar,
            rotation: seededRandom(seed * 11) * 360,
          };
          break;
        }
        attempts++;
      }

      positions.push(position);
    }

    return positions;
  }, [toppings, pizzaSize, crustThickness]);

  return (
    <div className="bg-gradient-to-br from-card to-muted rounded-lg flex flex-col items-center justify-center p-6 min-h-[400px]">
      <motion.div
        key={size}
        className="rounded-full relative shadow-2xl flex items-center justify-center"
        style={{
          width: pizzaSize,
          height: pizzaSize,
          background: "radial-gradient(circle at 40% 35%, #E8C7A0, #D4A574 30%, #C19A6B 55%, #A8875A 80%, #8B7043)",
        }}
      >
        {/* Sauce layer - conditionally visible */}
        {sauce !== "none" && (
          <motion.div
            key={`sauce-${sauce}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
            className="absolute rounded-full"
            style={{
              width: `${crustThickness * 100}%`,
              height: `${crustThickness * 100}%`,
              background: sauce === "marinara"
                ? "radial-gradient(circle at 45% 40%, #E74C3C, #C0392B 60%, #A93226 85%)"
                : sauce === "bbq"
                ? "radial-gradient(circle at 45% 40%, #8B4513, #654321 60%, #4A2511 85%)"
                : sauce === "white"
                ? "radial-gradient(circle at 45% 40%, #F5F5DC, #E8E0C8 60%, #D4CDB0 85%)"
                : sauce === "pesto"
                ? "radial-gradient(circle at 45% 40%, #6B8E23, #556B2F 60%, #3D4F1F 85%)"
                : "radial-gradient(circle at 45% 40%, #E74C3C, #C0392B 60%, #A93226 85%)",
            }}
          />
        )}

        {/* Cheese layer - conditionally visible */}
        {cheese !== "none" && (
          <motion.div
            key={`cheese-${cheese}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.6 }}
            className="absolute rounded-full"
            style={{
              width: `${crustThickness * 100}%`,
              height: `${crustThickness * 100}%`,
              background: cheese === "regular"
                ? "radial-gradient(circle at 45% 40%, rgba(255, 250, 230, 0.9), rgba(255, 245, 215, 0.85) 40%, rgba(255, 235, 190, 0.8) 75%)"
                : cheese === "extra"
                ? "radial-gradient(circle at 45% 40%, rgba(255, 250, 230, 0.95), rgba(255, 245, 215, 0.92) 40%, rgba(255, 235, 190, 0.9) 75%)"
                : cheese === "light"
                ? "radial-gradient(circle at 45% 40%, rgba(255, 250, 230, 0.7), rgba(255, 245, 215, 0.65) 40%, rgba(255, 235, 190, 0.6) 75%)"
                : "radial-gradient(circle at 45% 40%, rgba(255, 250, 230, 0.9), rgba(255, 245, 215, 0.85) 40%, rgba(255, 235, 190, 0.8) 75%)",
            }}
          />
        )}

        {/* Toppings */}
        {toppings.map((toppingId, index) => {
          const pos = toppingPositions[index];
          return (
            <motion.div
              key={`${toppingId}-${index}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, x: pos.x, y: pos.y, rotate: pos.rotation }}
              transition={{ type: "spring", stiffness: 180, damping: 14, delay: 1 + index * 0.05 }}
            >
              <ToppingDot
                type={toppingId}
                style={{
                  width: `${pos.sizeVar}px`,
                  height: `${pos.sizeVar}px`,
                }}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {toppings.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-lg font-semibold text-foreground"
        >
          {toppings.length} {toppings.length === 1 ? "topping" : "toppings"} added
        </motion.p>
      )}
    </div>
  );
}
