import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

interface PizzaCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isHalal?: boolean;
  onAddToOrder?: (id: string) => void;
}

export default function PizzaCard({
  id,
  name,
  description,
  price,
  image,
  isHalal = true,
  onAddToOrder
}: PizzaCardProps) {
  const { addItem, openCart } = useCart();
  const { toast } = useToast();

  const handleAddToOrder = () => {
    addItem({
      id,
      name,
      description,
      price,
      image,
    });
    
    toast({
      title: 'Added to cart',
      description: `${name} has been added to your cart`,
    });

    if (onAddToOrder) {
      onAddToOrder(id);
    }
  };

  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-300" data-testid={`card-pizza-${id}`}>
      <div className="aspect-square overflow-hidden">
        <motion.img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
        />
      </div>
      <CardHeader className="gap-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl">{name}</CardTitle>
          {isHalal && (
            <Badge variant="secondary" className="shrink-0">100% Halal</Badge>
          )}
        </div>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex items-center justify-between gap-4">
        <span className="text-2xl font-bold text-primary" data-testid={`text-price-${id}`}>
          ${price}
        </span>
        <Button 
          onClick={handleAddToOrder}
          data-testid={`button-add-order-${id}`}
        >
          Add to Order
        </Button>
      </CardFooter>
    </Card>
  );
}
