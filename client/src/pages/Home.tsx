import Hero from "@/components/Hero";
import FeatureSection from "@/components/FeatureSection";
import PizzaTimeline from "@/components/PizzaTimeline";
import { Award, Leaf, Pizza } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import PizzaCard from "@/components/PizzaCard";
import { motion } from "framer-motion";
import chickenPizza from '@assets/image_1762844821511.png';
import veggiePizza from '@assets/image_1762844897590.png';
import bbqPizza from '@assets/image_1762845157826.png';
import margheritaPizza from '@assets/image_1762844795851.png';
import buildPizzaImage from '@assets/generated_images/Premium_pizza_assembly_scene_5d570890.png';
import heroImage1 from '@assets/stock_images/delicious_fresh_hala_853e16eb.jpg';
import heroImage2 from '@assets/stock_images/delicious_fresh_hala_9ee11a8e.jpg';
import heroImage3 from '@assets/stock_images/delicious_fresh_hala_d48f153c.jpg';
import heroImage4 from '@assets/stock_images/delicious_fresh_hala_113229da.jpg';

export default function Home() {
  // TODO: Remove mock data - replace with API calls
  const featuredPizzas = [
    {
      id: 'margherita',
      name: 'Margherita Classic',
      description: 'Fresh mozzarella, tomato sauce, and basil. Simple yet perfect traditional Italian pizza.',
      price: 14,
      image: margheritaPizza
    },
    {
      id: 'cheese-stretch',
      name: 'Ultimate Cheese',
      description: 'Loaded with premium mozzarella and cheddar. Experience the ultimate cheese pull!',
      price: 16,
      image: chickenPizza
    },
    {
      id: 'mushroom-olive',
      name: 'Mushroom & Olive',
      description: 'Fresh mushrooms and black olives on our signature sauce. A savory vegetarian favorite.',
      price: 15,
      image: veggiePizza
    },
    {
      id: 'bbq-pineapple',
      name: 'BBQ Hawaiian',
      description: 'Halal chicken with BBQ sauce and pineapple. Sweet and tangy perfection.',
      price: 17,
      image: bbqPizza
    }
  ];

  const features = [
    {
      icon: Award,
      title: '100% Halal',
      description: 'All our ingredients are certified halal, ensuring quality and trust in every bite.'
    },
    {
      icon: Leaf,
      title: 'Fresh Ingredients',
      description: 'We use only the freshest, highest quality ingredients prepared daily.'
    },
    {
      icon: Pizza,
      title: '20+ Specialties',
      description: 'From house specials to custom creations, we offer endless delicious options.'
    }
  ];

  return (
    <div>
      <Hero
        title="Canada's Best Halal PIZZA & Donair"
        subtitle="100% Halal - We have the best combination and our specialty pizzas are the most selling pizzas. Try once and you will fall in love."
        ctaText="See Menu"
        ctaLink="/menu"
        backgroundImages={[heroImage1, heroImage2, heroImage3, heroImage4]}
      />

      <FeatureSection features={features} />

      <PizzaTimeline />

      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              FRESH FROM PIZZA <span className="text-primary">MENU</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              100% Halal - We have the best combination and our specialty pizzas are the most selling pizzas.
              Try once and you will fall in love.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {featuredPizzas.map((pizza, index) => (
              <motion.div
                key={pizza.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <PizzaCard {...pizza} />
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/menu">
              <Button size="lg" data-testid="button-view-full-menu">
                View Full Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Build Your Own <span className="text-primary">PIZZA</span>
              </h2>
              <p className="text-xl text-muted-foreground mb-6">
                Create a perfect blend you like and admire with any number of toppings!
              </p>
              <p className="text-muted-foreground mb-8">
                With any number of toppings available, multiple crust options and sauces, you can create your
                own favorite halal pizza. With option of half and half pizza you can enjoy two different tastes
                on a single pizza.
              </p>
              <Link href="/build">
                <Button size="lg" data-testid="button-build-your-own">
                  Start Building
                </Button>
              </Link>
            </motion.div>
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative aspect-square rounded-lg overflow-hidden shadow-2xl">
                <motion.img
                  src={buildPizzaImage}
                  alt="Artisan pizza being crafted"
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "We Cater All Events",
                description: "Weddings, corporate gatherings, special occasions. We've got you covered.",
                buttonText: "Learn More",
                testId: "button-learn-catering"
              },
              {
                title: "Franchising",
                description: "Be part of Cosmic. We cannot wait to see you joining our dynamic team.",
                buttonText: "Connect Now",
                testId: "button-franchise-info"
              },
              {
                title: "Find Your Location",
                description: "Find your favorite store close by and enjoy fresh, hot pizza.",
                buttonText: "Find Location",
                testId: "button-find-location",
                link: "/contact"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="hover-elevate h-full">
                  <CardHeader>
                    <CardTitle className="text-2xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {item.description}
                    </p>
                    {item.link ? (
                      <Link href={item.link}>
                        <Button variant="outline" data-testid={item.testId}>
                          {item.buttonText}
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" data-testid={item.testId}>
                        {item.buttonText}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
