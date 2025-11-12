import PizzaCard from "@/components/PizzaCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import chickenPizza from '@assets/generated_images/Halal_Chicken_Special_Pizza_e83ceb00.png';
import veggiePizza from '@assets/generated_images/Veggie_Lovers_Pizza_35627115.png';
import bbqPizza from '@assets/generated_images/BBQ_Chicken_Pizza_bfbf1bea.png';
import meatPizza from '@assets/generated_images/Halal_Meat_Lovers_Pizza_55e310b8.png';
import donairPizza from '@assets/generated_images/Donair_Pizza_Special_6cebee8a.png';
import { useQuery } from "@tanstack/react-query";
import type { SquareProductsResponse, Product } from "@shared/schema";
import houseSpecial from '@assets/generated_images/House_Special_Pizza_e0ab3d75.png';

export default function Menu() {
  // TODO: Remove mock data - replace with API calls
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'specialty' | 'donairs' | 'sides' | 'salads' | 'drinks' | 'desserts'>('all');
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToOrder = (item: { id: string; name: string; description: string; price: number; image: string }) => {
    addItem({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image,
    });
    
    toast({
      title: 'Added to cart',
      description: `${item.name} has been added to your cart`,
    });
  };
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
      return response.json();
    }
  });

  const products = productsData?.products || [];
  
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return Array.from(cats);
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return products;
    }
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  const getCategorySlug = (category: string): string => {
    return category.toLowerCase().replace(/\s+/g, '-');
  };

  const productsByCategory = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    products.forEach(product => {
      if (!grouped[product.category]) {
        grouped[product.category] = [];
      }
      grouped[product.category].push(product);
    });
    return grouped;
  }, [products]);

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
          <Button size="lg" data-testid="button-build-custom">
            Build Your Own Pizza
          </Button>
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
              <div>
                <h2 className="text-3xl font-bold mb-8">Specialty Pizzas</h2>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {specialtyPizzas.map((pizza, index) => (
                    <motion.div
                      key={pizza.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <PizzaCard {...pizza} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-8">Donairs</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {donairs.map((item) => (
                    <Card key={item.id} className="hover-elevate h-full overflow-hidden">
                      <div className="aspect-video overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <CardHeader>
                        <CardTitle>{item.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-primary">${item.price}</span>
                          <Button onClick={() => handleAddToOrder(item)} data-testid={`button-add-${item.id}`}>Add to Order</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-8">Sides & Appetizers</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {sides.map((item) => (
                    <Card key={item.id} className="hover-elevate overflow-hidden">
                      <div className="aspect-video overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <CardHeader>
                        <CardTitle>{item.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-primary">${item.price}</span>
                          <Button onClick={() => handleAddToOrder(item)}>Add to Order</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-8">Salads</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {salads.map((item) => (
                    <Card key={item.id} className="hover-elevate h-full overflow-hidden">
                      <div className="aspect-video overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <CardHeader>
                        <CardTitle>{item.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-primary">${item.price}</span>
                          <Button onClick={() => handleAddToOrder(item)} data-testid={`button-add-${item.id}`}>Add to Order</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-8">Drinks</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {drinks.map((item) => (
                    <Card key={item.id} className="hover-elevate h-full overflow-hidden">
                      <div className="aspect-video overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-primary">${item.price.toFixed(2)}</span>
                          <Button size="sm" onClick={() => handleAddToOrder(item)}>Add</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-8">Desserts</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {desserts.map((item) => (
                    <Card key={item.id} className="hover-elevate h-full overflow-hidden">
                      <div className="aspect-video overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-primary">${item.price.toFixed(2)}</span>
                          <Button size="sm" onClick={() => handleAddToOrder(item)}>Add</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedCategory === 'specialty' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredItems.map((pizza, index) => (
                <motion.div
                  key={pizza.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <PizzaCard {...pizza} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {selectedCategory === 'sides' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {sides.map((side, index) => (
                <motion.div
                  key={side.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="hover-elevate overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <img src={side.image} alt={side.name} className="w-full h-full object-cover" />
                    </div>
                    <CardHeader>
                      <CardTitle>{side.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{side.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">${side.price}</span>
                        <Button onClick={() => handleAddToOrder(side)}>
                          Add to Order
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {selectedCategory === 'drinks' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {drinks.map((drink, index) => (
                <motion.div
                  key={drink.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="hover-elevate h-full overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <img src={drink.image} alt={drink.name} className="w-full h-full object-cover" />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{drink.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{drink.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-primary">${drink.price.toFixed(2)}</span>
                        <Button size="sm" onClick={() => handleAddToOrder(drink)}>
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {selectedCategory === 'donairs' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {donairs.map((donair, index) => (
                <motion.div
                  key={donair.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="hover-elevate h-full overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <img src={donair.image} alt={donair.name} className="w-full h-full object-cover" />
                    </div>
                    <CardHeader>
                      <CardTitle>{donair.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{donair.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">${donair.price}</span>
                        <Button onClick={() => handleAddToOrder(donair)} data-testid={`button-add-${donair.id}`}>
                          Add to Order
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {selectedCategory === 'salads' && (
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
                          id={product.id}
                          name={product.name}
                          description={product.description}
                          price={product.variations[0]?.price || 0}
                          image={product.image || houseSpecial}
                          isHalal={true}
                          onAddToOrder={(id) => console.log('Added to order:', id)}
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
                
                
                
              {salads.map((salad, index) => (
                <motion.div
                  key={salad.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="hover-elevate h-full overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <img src={salad.image} alt={salad.name} className="w-full h-full object-cover" />
                    </div>
                    <CardHeader>
                      <CardTitle>{salad.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{salad.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">${salad.price}</span>
                        <Button onClick={() => handleAddToOrder(salad)} data-testid={`button-add-${salad.id}`}>
                          Add to Order
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {selectedCategory === 'desserts' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {desserts.map((dessert, index) => (
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="hover-elevate h-full overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <img src={dessert.image} alt={dessert.name} className="w-full h-full object-cover" />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{dessert.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{dessert.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-primary">${dessert.price.toFixed(2)}</span>
                        <Button size="sm" onClick={() => handleAddToOrder(dessert)}>
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  <PizzaCard
                    id={product.id}
                    name={product.name}
                    description={product.description}
                    price={product.variations[0]?.price || 0}
                    image={product.image || houseSpecial}
                    isHalal={true}
                    onAddToOrder={(id) => console.log('Added to order:', id)}
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
