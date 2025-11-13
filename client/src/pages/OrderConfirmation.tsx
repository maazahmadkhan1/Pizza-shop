import { useEffect } from 'react';
import { useCart } from '@/hooks/use-cart';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, MapPin, CreditCard, Truck, Store } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderConfirmation() {
  const { lastOrder } = useCart();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!lastOrder) {
      setLocation('/menu');
    }
  }, [lastOrder, setLocation]);

  if (!lastOrder) {
    return null;
  }

  const getPaymentMethodLabel = () => {
    if (lastOrder.paymentMethod === 'cash') {
      return lastOrder.deliveryMethod === 'delivery' ? 'Cash on Delivery' : 'Cash at Pickup';
    }
    return 'Credit/Debit Card';
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4"
            >
              <CheckCircle2 className="w-12 h-12 text-primary" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-2">Thank You!</h1>
            <p className="text-xl text-muted-foreground">Your order has been confirmed</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-muted rounded-md">
                <div>
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="text-2xl font-bold text-primary" data-testid="text-order-number">{lastOrder.orderNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Order Time</p>
                  <p className="font-medium">{lastOrder.timestamp.toLocaleTimeString()}</p>
                  <p className="text-sm text-muted-foreground">{lastOrder.timestamp.toLocaleDateString()}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Items Ordered</h3>
                <div className="space-y-2">
                  {lastOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-medium">
                          {item.name} {item.size && `(${item.size})`}
                        </p>
                        <p className="text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${lastOrder.subtotal.toFixed(2)}</span>
                </div>
                {lastOrder.deliveryFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>${lastOrder.deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">${lastOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {lastOrder.deliveryMethod === 'delivery' ? (
                    <Truck className="h-5 w-5" />
                  ) : (
                    <Store className="h-5 w-5" />
                  )}
                  {lastOrder.deliveryMethod === 'delivery' ? 'Delivery' : 'Pickup'} Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                {lastOrder.deliveryMethod === 'delivery' && lastOrder.deliveryAddress ? (
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{lastOrder.deliveryAddress.street}</p>
                    <p className="text-muted-foreground">
                      {lastOrder.deliveryAddress.city}, {lastOrder.deliveryAddress.zip}
                    </p>
                    <p className="text-muted-foreground">{lastOrder.deliveryAddress.phone}</p>
                  </div>
                ) : lastOrder.pickupLocation ? (
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{lastOrder.pickupLocation.name}</p>
                    <p className="text-muted-foreground">{lastOrder.pickupLocation.address}</p>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{getPaymentMethodLabel()}</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-muted p-6 rounded-md mb-6">
            <p className="text-center text-sm text-muted-foreground mb-2">
              {lastOrder.deliveryMethod === 'delivery'
                ? 'Your delicious pizza will be delivered to your door soon!'
                : 'We will notify you when your order is ready for pickup.'}
            </p>
            <p className="text-center text-sm text-muted-foreground">
              Expected time: 25-35 minutes
            </p>
          </div>

          <div className="flex gap-4">
            <Button onClick={() => setLocation('/')} variant="outline" className="flex-1" data-testid="button-home">
              Back to Home
            </Button>
            <Button onClick={() => setLocation('/menu')} className="flex-1" data-testid="button-menu">
              Order Again
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
