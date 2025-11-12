import PizzaCard from "@/components/PizzaCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import chickenPizza from '@assets/generated_images/Halal_Chicken_Special_Pizza_e83ceb00.png';
import veggiePizza from '@assets/generated_images/Veggie_Lovers_Pizza_35627115.png';
import bbqPizza from '@assets/generated_images/BBQ_Chicken_Pizza_bfbf1bea.png';
import meatPizza from '@assets/generated_images/Halal_Meat_Lovers_Pizza_55e310b8.png';
import donairPizza from '@assets/generated_images/Donair_Pizza_Special_6cebee8a.png';
import houseSpecial from '@assets/generated_images/House_Special_Pizza_e0ab3d75.png';
import chickenDonair from '@assets/generated_images/Halal_chicken_donair_wrap_daa43c92.png';
import donairPlate from '@assets/generated_images/Beef_donair_plate_meal_4f868c30.png';
import chickenWings from '@assets/generated_images/Honey_garlic_chicken_wings_124a3e9d.png';
import greekSalad from '@assets/generated_images/Fresh_Greek_salad_bowl_d1265c16.png';
import samosas from '@assets/generated_images/Crispy_vegetable_samosas_d24b923a.png';
import poutine from '@assets/generated_images/Classic_Canadian_poutine_6fe965a0.png';
import cinnamonSticks from '@assets/generated_images/Sweet_cinnamon_dessert_sticks_69382a6b.png';
import sodaDrinks from '@assets/generated_images/Assorted_soda_drink_selection_e8e3dc26.png';

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

  const specialtyPizzas = [
    {
      id: 'house-special',
      name: 'House Special',
      description: 'Pepperoni, Ham, Onions, Mushrooms, Green Peppers, Italian Sausages, Black Olives & Mozzarella Cheese',
      price: 18,
      image: houseSpecial
    },
    {
      id: 'meat-lovers',
      name: 'Meat Lovers',
      description: 'Pepperoni, Ham, Bacon, Italian Sausages & Mozzarella Cheese',
      price: 19,
      image: meatPizza
    },
    {
      id: 'hawaiian',
      name: 'Hawaiian',
      description: 'Ham and Pineapple topped with Mozzarella Cheese',
      price: 16,
      image: houseSpecial
    },
    {
      id: 'canadian-classic',
      name: 'Canadian Classic',
      description: 'Pepperoni, Bacon, Mushrooms & Mozzarella Cheese',
      price: 17,
      image: chickenPizza
    },
    {
      id: 'cosmic-special',
      name: 'Cosmic Special',
      description: 'Ground Beef, Onions, Green Peppers, Black Olives, Banana Peppers & Mozzarella Cheese',
      price: 17,
      image: meatPizza
    },
    {
      id: 'three-cheese',
      name: 'Three Cheese',
      description: 'Parmesan, Cheddar Cheese & Mozzarella Cheese',
      price: 15,
      image: veggiePizza
    },
    {
      id: 'veggie-lovers',
      name: 'Veggie Lovers',
      description: 'Onions, Mushrooms, Green Peppers, Cooked Tomatoes & Mozzarella Cheese',
      price: 15,
      image: veggiePizza
    },
    {
      id: 'paneer-tikka',
      name: 'Paneer Tikka Pizza',
      description: 'Onions, Green Peppers, Cooked Tomatoes, Fresh Ginger, Minced Garlic, Green Chilies, Cilantro & Mozzarella Cheese (Spicy)',
      price: 17,
      image: veggiePizza
    },
    {
      id: 'greek-feast',
      name: 'Greek Feast',
      description: 'Pizza Sauce, Roasted Red Pepper, Spinach, Onion, Mushroom, Tomatoes, Black Olives, Feta Cheese & Garlic Herb Seasoning',
      price: 17,
      image: veggiePizza
    },
    {
      id: 'chicken-special',
      name: 'Chicken Special',
      description: 'Grilled halal chicken, mushrooms, onions, and green peppers with our signature sauce',
      price: 17,
      image: chickenPizza
    },
    {
      id: 'bbq-chicken',
      name: 'BBQ Chicken',
      description: 'Halal chicken with BBQ sauce, red onions, and mozzarella',
      price: 17,
      image: bbqPizza
    },
    {
      id: 'donair-pizza',
      name: 'Donair Pizza',
      description: 'Donair meat, lettuce, tomatoes, red onions, sweet sauce & mozzarella cheese',
      price: 18,
      image: donairPizza
    }
  ];

  const donairs = [
    { id: 'chicken-donair', name: 'Chicken Donair', description: 'Halal chicken donair with lettuce, tomatoes, red onions, sweet sauce & garlic sauce', price: 10, image: chickenDonair },
    { id: 'beef-donair', name: 'Beef Donair', description: 'Seasoned beef donair with lettuce, tomatoes, red onions, sweet sauce & garlic sauce', price: 11, image: chickenDonair },
    { id: 'mix-donair', name: 'Mix Donair', description: 'Chicken & beef combo with lettuce, tomatoes, red onions, sweet sauce & garlic sauce', price: 11, image: chickenDonair },
    { id: 'chicken-plate', name: 'Chicken Donair Plate', description: 'Served with seasoned rice, hummus, tzatziki, fresh salad & pita bread', price: 14, image: donairPlate },
    { id: 'beef-plate', name: 'Beef Donair Plate', description: 'Served with seasoned rice, hummus, tzatziki, fresh salad & pita bread', price: 15, image: donairPlate },
    { id: 'mix-plate', name: 'Mix Donair Plate', description: 'Chicken & beef combo served with seasoned rice, hummus, tzatziki, fresh salad & pita bread', price: 15, image: donairPlate }
  ];

  const salads = [
    { id: 'greek-salad', name: 'Greek Salad', description: 'Fresh lettuce, tomatoes, cucumbers, red onions, feta cheese, black olives with Greek dressing', price: 8, image: greekSalad },
    { id: 'caesar-salad', name: 'Caesar Salad', description: 'Romaine lettuce, parmesan cheese, croutons, Caesar dressing', price: 8, image: greekSalad },
    { id: 'garden-salad', name: 'Garden Salad', description: 'Fresh mixed greens, tomatoes, cucumbers, carrots with your choice of dressing', price: 7, image: greekSalad }
  ];

  const sides = [
    { id: 'wings', name: 'Halal Chicken Wings', description: 'Hot, Mild, Salt & Pepper, Honey Garlic, Teriyaki, BBQ, Lemon Pepper & Honey Hot (10 pieces)', price: 12, image: chickenWings },
    { id: 'boneless-wings', name: 'Boneless Wings', description: 'Tender boneless chicken bites in your choice of sauce (12 pieces)', price: 13, image: chickenWings },
    { id: 'samosas', name: 'Samosas', description: 'Fried pastry filled with spiced potatoes and peas (4 pieces)', price: 6, image: samosas },
    { id: 'cheesy-bread', name: 'Cheesy Bread', description: '8 Pieces – Loaded with mozzarella, served with marinara sauce', price: 8, image: samosas },
    { id: 'garlic-sticks', name: 'Garlic Bread Sticks', description: '8 Pieces – Brushed with garlic butter, served with marinara sauce', price: 7, image: samosas },
    { id: 'poutine', name: 'Poutine', description: 'Regular, Donair, Deluxe & Mix Poutine with cheese curds and gravy', price: 10, image: poutine },
    { id: 'chicken-strips', name: 'Halal Chicken Strips', description: 'Juicy from inside & tender from outside (5 pieces)', price: 11, image: chickenWings },
    { id: 'onion-rings', name: 'Onion Rings', description: 'Crispy beer-battered onion rings – eat them hot', price: 6, image: poutine },
    { id: 'mozzarella-sticks', name: 'Mozzarella Sticks', description: 'Breaded mozzarella sticks with marinara sauce (6 pieces)', price: 8, image: samosas },
    { id: 'fries', name: 'French Fries', description: 'Crispy golden fries with your choice of seasoning', price: 5, image: poutine },
    { id: 'loaded-fries', name: 'Loaded Fries', description: 'Fries topped with cheese, bacon, and green onions', price: 9, image: poutine },
    { id: 'nachos', name: 'Nachos Supreme', description: 'Tortilla chips loaded with cheese, jalapeños, tomatoes, and sour cream', price: 10, image: poutine },
    { id: 'jalapeno-poppers', name: 'Jalapeño Poppers', description: 'Cream cheese filled jalapeños, breaded and fried (6 pieces)', price: 8, image: samosas }
  ];

  const drinks = [
    { id: 'coke', name: 'Coca-Cola', description: 'Classic Coke (Can or Bottle)', price: 2, image: sodaDrinks },
    { id: 'diet-coke', name: 'Diet Coke', description: 'Zero sugar classic taste', price: 2, image: sodaDrinks },
    { id: 'sprite', name: 'Sprite', description: 'Lemon-lime refreshment', price: 2, image: sodaDrinks },
    { id: 'pepsi', name: 'Pepsi', description: 'Classic Pepsi (Can or Bottle)', price: 2, image: sodaDrinks },
    { id: 'mountain-dew', name: 'Mountain Dew', description: 'Citrus blast energy', price: 2, image: sodaDrinks },
    { id: 'iced-tea', name: 'Iced Tea', description: 'Refreshing brewed iced tea', price: 2.5, image: sodaDrinks },
    { id: 'lemonade', name: 'Fresh Lemonade', description: 'House-made fresh lemonade', price: 3, image: sodaDrinks },
    { id: 'water', name: 'Bottled Water', description: 'Pure spring water', price: 1.5, image: sodaDrinks },
    { id: '2-liter', name: '2-Liter Soda', description: 'Choose from Coke, Pepsi, Sprite, or Mountain Dew', price: 4, image: sodaDrinks }
  ];

  const desserts = [
    { id: 'cinnamon-sticks', name: 'Cinnamon Sticks', description: 'Sweet cinnamon sugar bread sticks with icing (8 pieces)', price: 6, image: cinnamonSticks },
    { id: 'brownie', name: 'Chocolate Brownie', description: 'Rich, fudgy chocolate brownie', price: 5, image: cinnamonSticks },
    { id: 'cheesecake', name: 'New York Cheesecake', description: 'Creamy classic cheesecake slice', price: 6, image: cinnamonSticks },
    { id: 'cookie', name: 'Chocolate Chip Cookie', description: 'Warm, gooey chocolate chip cookie', price: 3, image: cinnamonSticks }
  ];

  const filteredItems = selectedCategory === 'specialty' ? specialtyPizzas : [];

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
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              data-testid="button-category-all"
            >
              All Menu
            </Button>
            <Button
              variant={selectedCategory === 'specialty' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('specialty')}
              data-testid="button-category-specialty"
            >
              Specialty Pizzas
            </Button>
            <Button
              variant={selectedCategory === 'donairs' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('donairs')}
              data-testid="button-category-donairs"
            >
              Donairs
            </Button>
            <Button
              variant={selectedCategory === 'sides' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('sides')}
              data-testid="button-category-sides"
            >
              Sides & Appetizers
            </Button>
            <Button
              variant={selectedCategory === 'salads' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('salads')}
              data-testid="button-category-salads"
            >
              Salads
            </Button>
            <Button
              variant={selectedCategory === 'drinks' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('drinks')}
              data-testid="button-category-drinks"
            >
              Drinks
            </Button>
            <Button
              variant={selectedCategory === 'desserts' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('desserts')}
              data-testid="button-category-desserts"
            >
              Desserts
            </Button>
          </div>

          {selectedCategory === 'all' && (
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
                <motion.div
                  key={dessert.id}
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
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
