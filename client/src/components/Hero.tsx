import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImages?: string[];
  height?: string;
}

export default function Hero({
  title,
  subtitle,
  ctaText = "Order Now",
  ctaLink = "/menu",
  backgroundImages = [],
  height = "85vh"
}: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = backgroundImages.length > 0 ? backgroundImages : [undefined];

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section 
      className="relative w-full flex items-center justify-center overflow-hidden"
      style={{ height }}
    >
      <AnimatePresence mode="wait">
        {images[currentIndex] && (
          <motion.div 
            key={currentIndex}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${images[currentIndex]})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
          </motion.div>
        )}
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <Button
            size="icon"
            variant="outline"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/10 backdrop-blur-sm border-white/20 text-white hover:bg-background/20"
            onClick={goToPrevious}
            data-testid="button-hero-prev"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            size="icon"
            variant="outline"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/10 backdrop-blur-sm border-white/20 text-white hover:bg-background/20"
            onClick={goToNext}
            data-testid="button-hero-next"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-md transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-primary w-8'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                data-testid={`button-hero-slide-${index}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6"
        >
          {title.split(' ').map((word, index) => {
            const isOrange = word.toLowerCase().includes('menu') || 
                           word.toLowerCase().includes('pizza') || 
                           word.toLowerCase().includes('donair');
            return (
              <motion.span 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="inline-block mr-2 md:mr-3"
              >
                {isOrange ? (
                  <span className="text-primary">{word}</span>
                ) : (
                  word
                )}
              </motion.span>
            );
          })}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto"
        >
          {subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link href={ctaLink}>
            <Button size="lg" className="text-lg px-8" data-testid="button-hero-cta">
              {ctaText}
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
