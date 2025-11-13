import PizzaCard from "@/components/PizzaCard";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import type { SquareProductsResponse } from "@shared/schema";
import houseSpecial from '@assets/generated_images/House_Special_Pizza_e0ab3d75.png';
import { Link } from "wouter";

const FIREBASE_PRODUCTS_URL = 'https://us-central1-pizza-shop-3afe9.cloudfunctions.net/getSquareProducts';

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const { data: productsData, isLoading } = useQuery<SquareProductsResponse>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch(FIREBASE_PRODUCTS_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      console.log('Firebase function response (Menu):', data);
      return data;
    }
  });

  const products = productsData?.products || [];
  
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return Array.from(cats);
  }, [products]);

  const getCategorySlug = (category: string): string => {
    if (!category) return 'uncategorized';
    return category.toLowerCase().replace(/\s+/g, '-');
  };

  const productsByCategory = useMemo(() => {
    const grouped: Record<string, typeof products> = {};
    products.forEach(product => {
      const category = product.category || 'Uncategorized';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(product);
    });
    return grouped;
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return products;
    }
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-xl text-muted-foreground">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-20 bg-card/30"
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            OUR <span className="text-primary">MENU</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            100% Halal - We have the best combination and our specialty pizzas are the most selling pizzas.
            Try once and you will fall in love.
          </p>
          <Link href="/build">
            <Button size="lg" data-testid="button-build-custom">
              Build Your Own Pizza
            </Button>
          </Link>
        </div>
      </motion.section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 mb-8">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              data-testid="button-category-all"
            >
              All Menu
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                data-testid={`button-category-${getCategorySlug(category)}`}
              >
                {category}
              </Button>
            ))}
          </div>

          {selectedCategory === 'all' ? (
            <div className="space-y-16">
              {categories.map((category) => (
                <div key={category}>
                  <h2 className="text-3xl font-bold mb-8">{category}</h2>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                  >
                    {productsByCategory[category]?.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <PizzaCard
                          id={product.variations[0]?.id || product.id}
                          name={product.name}
                          description={product.description}
                          price={product.variations[0]?.price || 0}
                          image={product.image || houseSpecial}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <PizzaCard
                    id={product.variations[0]?.id || product.id}
                    name={product.name}
                    description={product.description}
                    price={product.variations[0]?.price || 0}
                    image={product.image || houseSpecial}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
