import { useState } from 'react';
import PizzaPreview from '@/components/PizzaPreview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';

const sizes = [
  { id: 'small', name: 'Small 10"', price: 10.99 },
  { id: 'medium', name: 'Medium 12"', price: 13.99 },
  { id: 'large', name: 'Large 14"', price: 16.99 },
  { id: 'xlarge', name: 'X-Large 16"', price: 19.99 },
];

const crusts = [
  { id: 'regular', name: 'Regular Crust', price: 0 },
  { id: 'thin', name: 'Thin Crust', price: 0 },
  { id: 'thick', name: 'Thick Crust', price: 1.99 },
  { id: 'stuffed', name: 'Stuffed Crust', price: 2.99 },
];

const sauces = [
  { id: 'marinara', name: 'Marinara Sauce' },
  { id: 'white', name: 'White Sauce' },
  { id: 'bbq', name: 'BBQ Sauce' },
  { id: 'pesto', name: 'Pesto Sauce' },
  { id: 'none', name: 'No Sauce' },
];

const cheeses = [
  { id: 'regular', name: 'Regular Cheese' },
  { id: 'extra', name: 'Extra Cheese', price: 2.00 },
  { id: 'light', name: 'Light Cheese' },
  { id: 'none', name: 'No Cheese' },
];

const toppings = [
  { id: 'pepperoni', name: 'Halal Pepperoni', price: 1.50, category: 'meat' },
  { id: 'beef', name: 'Halal Beef', price: 1.50, category: 'meat' },
  { id: 'chicken', name: 'Halal Chicken', price: 1.50, category: 'meat' },
  { id: 'sausage', name: 'Halal Sausage', price: 1.50, category: 'meat' },
  { id: 'bacon', name: 'Halal Beef Bacon', price: 1.50, category: 'meat' },
  { id: 'mushrooms', name: 'Mushrooms', price: 1.00, category: 'veggie' },
  { id: 'onions', name: 'Onions', price: 1.00, category: 'veggie' },
  { id: 'peppers', name: 'Bell Peppers', price: 1.00, category: 'veggie' },
  { id: 'olives', name: 'Black Olives', price: 1.00, category: 'veggie' },
  { id: 'tomatoes', name: 'Fresh Tomatoes', price: 1.00, category: 'veggie' },
  { id: 'jalapenos', name: 'Jalapeños', price: 1.00, category: 'veggie' },
  { id: 'pineapple', name: 'Pineapple', price: 1.00, category: 'veggie' },
];

export default function BuildYourOwn() {
  const [selectedSize, setSelectedSize] = useState(sizes[1].id);
  const [selectedCrust, setSelectedCrust] = useState(crusts[0].id);
  const [selectedSauce, setSelectedSauce] = useState(sauces[0].id);
  const [selectedCheese, setSelectedCheese] = useState(cheeses[0].id);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const { addItem } = useCart();
  const { toast } = useToast();

  const toggleTopping = (toppingId: string) => {
    setSelectedToppings(prev => 
      prev.includes(toppingId) 
        ? prev.filter(id => id !== toppingId)
        : [...prev, toppingId]
    );
  };

  const calculateTotal = () => {
    const sizePrice = sizes.find(s => s.id === selectedSize)?.price || 0;
    const crustPrice = crusts.find(c => c.id === selectedCrust)?.price || 0;
    const cheesePrice = cheeses.find(c => c.id === selectedCheese)?.price || 0;
    const toppingsPrice = selectedToppings.reduce((total, toppingId) => {
      const topping = toppings.find(t => t.id === toppingId);
      return total + (topping?.price || 0);
    }, 0);
    
    return sizePrice + crustPrice + cheesePrice + toppingsPrice;
  };

  const handleAddToCart = () => {
    const selectedSizeObj = sizes.find(s => s.id === selectedSize);
    const selectedCrustObj = crusts.find(c => c.id === selectedCrust);
    const selectedSauceObj = sauces.find(s => s.id === selectedSauce);
    const selectedCheeseObj = cheeses.find(c => c.id === selectedCheese);
    const selectedToppingsObjs = selectedToppings.map(id => toppings.find(t => t.id === id)?.name).filter(Boolean);

    addItem({
      id: `custom-${Date.now()}`,
      name: 'Custom Pizza',
      price: calculateTotal(),
      size: selectedSizeObj?.name,
      customizations: {
        crust: selectedCrustObj?.name,
        sauce: selectedSauceObj?.name,
        cheese: selectedCheeseObj?.name,
        toppings: selectedToppingsObjs as string[],
      },
    });

    toast({
      title: 'Added to cart',
      description: 'Your custom pizza has been added to your cart.',
    });
  };

  const meatToppings = toppings.filter(t => t.category === 'meat');
  const veggieToppings = toppings.filter(t => t.category === 'veggie');

  return (
    <div className="min-h-screen bg-background">
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Badge variant="secondary" className="mb-4">
                Customize
              </Badge>
            </motion.div>
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Build Your Own Pizza
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Create your perfect pizza exactly how you want it. Choose from our premium halal ingredients.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Size Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>1. Choose Your Size</CardTitle>
                  <CardDescription>Select your pizza size</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {sizes.map(size => (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSize(size.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedSize === size.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        data-testid={`button-size-${size.id}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-foreground">{size.name}</span>
                          {selectedSize === size.id && <Check className="w-5 h-5 text-primary" />}
                        </div>
                        <span className="text-sm text-muted-foreground">${size.price.toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Crust Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>2. Choose Your Crust</CardTitle>
                  <CardDescription>Select your preferred crust style</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {crusts.map(crust => (
                      <button
                        key={crust.id}
                        onClick={() => setSelectedCrust(crust.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedCrust === crust.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        data-testid={`button-crust-${crust.id}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-left">
                            <div className="font-semibold text-foreground">{crust.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {crust.price > 0 ? `+$${crust.price.toFixed(2)}` : 'Included'}
                            </div>
                          </div>
                          {selectedCrust === crust.id && <Check className="w-5 h-5 text-primary" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sauce Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>3. Choose Your Sauce</CardTitle>
                  <CardDescription>Pick your favorite sauce</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {sauces.map(sauce => (
                      <button
                        key={sauce.id}
                        onClick={() => setSelectedSauce(sauce.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedSauce === sauce.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        data-testid={`button-sauce-${sauce.id}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-foreground">{sauce.name}</span>
                          {selectedSauce === sauce.id && <Check className="w-5 h-5 text-primary" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Cheese Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>4. Choose Your Cheese</CardTitle>
                  <CardDescription>Select cheese amount</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {cheeses.map(cheese => (
                      <button
                        key={cheese.id}
                        onClick={() => setSelectedCheese(cheese.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedCheese === cheese.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        data-testid={`button-cheese-${cheese.id}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-foreground">{cheese.name}</span>
                          {selectedCheese === cheese.id && <Check className="w-5 h-5 text-primary" />}
                        </div>
                        {cheese.price && (
                          <span className="text-sm text-muted-foreground">+${cheese.price.toFixed(2)}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Toppings Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>5. Add Your Toppings</CardTitle>
                  <CardDescription>Select as many toppings as you like</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Halal Meat Toppings</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {meatToppings.map(topping => (
                        <button
                          key={topping.id}
                          onClick={() => toggleTopping(topping.id)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            selectedToppings.includes(topping.id)
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                          data-testid={`button-topping-${topping.id}`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                              selectedToppings.includes(topping.id)
                                ? 'border-primary bg-primary'
                                : 'border-border'
                            }`}>
                              {selectedToppings.includes(topping.id) && (
                                <Check className="w-4 h-4 text-primary-foreground" />
                              )}
                            </div>
                            <div className="flex-1 text-left">
                              <div className="text-sm font-medium text-foreground">{topping.name}</div>
                              <div className="text-xs text-muted-foreground">+${topping.price.toFixed(2)}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Veggie Toppings</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {veggieToppings.map(topping => (
                        <button
                          key={topping.id}
                          onClick={() => toggleTopping(topping.id)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            selectedToppings.includes(topping.id)
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                          data-testid={`button-topping-${topping.id}`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                              selectedToppings.includes(topping.id)
                                ? 'border-primary bg-primary'
                                : 'border-border'
                            }`}>
                              {selectedToppings.includes(topping.id) && (
                                <Check className="w-4 h-4 text-primary-foreground" />
                              )}
                            </div>
                            <div className="flex-1 text-left">
                              <div className="text-sm font-medium text-foreground">{topping.name}</div>
                              <div className="text-xs text-muted-foreground">+${topping.price.toFixed(2)}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
                {/* Animated Pizza Preview */}
                <Card className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-center">Pizza Preview</CardTitle>
                    <CardDescription className="text-center">Watch your pizza come to life!</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <PizzaPreview 
                      size={selectedSize}
                      crust={selectedCrust}
                      sauce={selectedSauce}
                      cheese={selectedCheese}
                      toppings={selectedToppings}
                    />
                  </CardContent>
                </Card>

                {/* Order Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Pizza</CardTitle>
                    <CardDescription>Order Summary</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span className="font-medium text-foreground" data-testid="text-summary-size">
                        {sizes.find(s => s.id === selectedSize)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Crust:</span>
                      <span className="font-medium text-foreground" data-testid="text-summary-crust">
                        {crusts.find(c => c.id === selectedCrust)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sauce:</span>
                      <span className="font-medium text-foreground" data-testid="text-summary-sauce">
                        {sauces.find(s => s.id === selectedSauce)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cheese:</span>
                      <span className="font-medium text-foreground" data-testid="text-summary-cheese">
                        {cheeses.find(c => c.id === selectedCheese)?.name}
                      </span>
                    </div>
                    </div>

                    {selectedToppings.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <div className="font-medium text-foreground" data-testid="text-summary-toppings-count">
                          Toppings ({selectedToppings.length})
                        </div>
                        <div className="space-y-1 text-sm">
                          {selectedToppings.map(toppingId => {
                            const topping = toppings.find(t => t.id === toppingId);
                            return (
                              <div 
                                key={toppingId} 
                                className="flex justify-between text-muted-foreground"
                                data-testid={`text-summary-topping-${toppingId}`}
                              >
                                <span>{topping?.name}</span>
                                <span>+${topping?.price.toFixed(2)}</span>
                              </div>
                            );
                          })}
                        </div>
                        </div>
                      </>
                    )}

                    <Separator />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-foreground">Total:</span>
                      <span className="text-primary" data-testid="text-total-price">${calculateTotal().toFixed(2)}</span>
                    </div>

                    <Button 
                      className="w-full text-lg py-6 h-auto"
                      size="lg"
                      onClick={handleAddToCart}
                      data-testid="button-add-to-cart"
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
