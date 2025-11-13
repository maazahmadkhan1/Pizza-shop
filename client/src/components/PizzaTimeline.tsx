import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ChefHat, Flame, Pizza, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import doughImage from '@assets/generated_images/Artisan_dough_hand_stretching_92df2769.png';
import toppingsImage from '@assets/generated_images/Fresh_premium_pizza_toppings_59941fed.png';
import assemblyImage from '@assets/generated_images/Chef_assembling_gourmet_pizza_c044e14f.png';
import ovenImage from '@assets/stock_images/pizza_stone_oven_fir_043c9b9e.jpg';

interface TimelineStep {
  icon: typeof ChefHat;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

const timelineSteps: TimelineStep[] = [
  {
    icon: ChefHat,
    title: "Fresh Dough Preparation",
    description: "We start with our signature dough recipe, made fresh daily and hand-stretched to perfection.",
    image: doughImage,
    imageAlt: "Artisan chef hand-stretching fresh halal pizza dough"
  },
  {
    icon: Sparkles,
    title: "Premium Toppings",
    description: "Only the finest halal ingredients and fresh vegetables are carefully selected and prepared.",
    image: toppingsImage,
    imageAlt: "Fresh premium halal pizza ingredients and toppings"
  },
  {
    icon: Pizza,
    title: "Expert Assembly",
    description: "Our skilled chefs artfully combine sauce, cheese, and toppings with decades of expertise.",
    image: assemblyImage,
    imageAlt: "Expert chef assembling gourmet halal pizza"
  },
  {
    icon: Flame,
    title: "Stone Oven Baking",
    description: "Baked to perfection in our traditional stone oven at optimal temperature for the ideal crisp.",
    image: ovenImage,
    imageAlt: "Traditional stone oven baking halal pizza"
  }
];

export default function PizzaTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  return (
    <section className="py-20 bg-background" ref={containerRef}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The Art of <span className="text-primary">PIZZA MAKING</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Every pizza is crafted with passion, precision, and the finest halal ingredients
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/20 via-primary/50 to-primary/20 transform -translate-x-1/2 hidden md:block" />

          {timelineSteps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -50 : 50 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative mb-12 md:mb-24 last:mb-0"
              >
                <div className={`flex flex-col md:flex-row items-center gap-6 md:gap-8 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 ${isEven ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 + 0.2 }}
                    >
                      <Card className="overflow-hidden hover-elevate group">
                        <motion.div 
                          className="relative aspect-video overflow-hidden"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                          <img 
                            src={step.image}
                            alt={step.imageAlt}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            data-testid={`img-timeline-${index}`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 opacity-90 group-hover:opacity-70 transition-opacity duration-300" />
                          <motion.div 
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            initial={false}
                          >
                            <div className="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                              <Icon className="w-8 h-8 text-primary-foreground" />
                            </div>
                          </motion.div>
                        </motion.div>
                        <div className="p-6">
                          <h3 className="text-2xl font-bold mb-3 flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-sm md:hidden">
                              <Icon className="w-6 h-6 text-primary" />
                            </div>
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </Card>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.2 + 0.1,
                      type: "spring",
                      stiffness: 200
                    }}
                    className="hidden md:flex w-16 h-16 rounded-full bg-primary shadow-lg items-center justify-center z-10 relative ring-4 ring-background"
                  >
                    <Icon className="w-8 h-8 text-primary-foreground" />
                  </motion.div>

                  <div className="flex-1 hidden md:block" />
                </div>

                {index < timelineSteps.length - 1 && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.2 + 0.3 }}
                    className="absolute left-1/2 top-16 h-24 w-1 bg-gradient-to-b from-primary to-transparent transform -translate-x-1/2 origin-top hidden md:block"
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.6, delay: timelineSteps.length * 0.2 }}
          className="text-center mt-16"
        >
          <div className="inline-block bg-primary/10 rounded-full px-8 py-4">
            <p className="text-lg font-semibold text-primary flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Ready to Serve Hot & Fresh!
              <Sparkles className="w-5 h-5" />
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
