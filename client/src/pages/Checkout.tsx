import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/contexts/AuthContext';
import { getSquareCustomer } from '@/lib/squareUser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { MapPin, CreditCard, Wallet, Store, Truck, Package } from 'lucide-react';
import { useLocation } from 'wouter';
import type { DeliveryMethod, PaymentMethod, Location } from '@shared/schema';
import SquarePaymentForm from '@/components/SquarePaymentForm';

const storeLocations: Location[] = [
  {
    id: '1',
    name: 'Downtown Toronto',
    address: '123 King Street West',
    city: 'Toronto',
    phone: '(416) 555-0100',
    hours: '11:00 AM - 11:00 PM',
  },
  {
    id: '2',
    name: 'North York',
    address: '456 Yonge Street',
    city: 'North York',
    phone: '(416) 555-0200',
    hours: '11:00 AM - 12:00 AM',
  },
  {
    id: '3',
    name: 'Mississauga',
    address: '789 Dundas Street',
    city: 'Mississauga',
    phone: '(905) 555-0300',
    hours: '10:00 AM - 11:00 PM',
  },
];

export default function Checkout() {
  const { items, subtotal, clearCart, setLastOrder } = useCart();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [squareCustomerId, setSquareCustomerId] = useState<string | null>(null);
  
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    zip: '',
    phone: '',
  });

  const [cardNumber, setCardNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  // Fetch Square customer ID when component mounts
  useEffect(() => {
    async function fetchSquareCustomer() {
      if (currentUser?.uid) {
        try {
          const customerData = await getSquareCustomer(currentUser.uid);
          if (customerData?.squareCustomerId) {
            setSquareCustomerId(customerData.squareCustomerId);
          }
        } catch (error) {
          console.error('Error fetching Square customer:', error);
        }
      }
    }
    fetchSquareCustomer();
  }, [currentUser]);

  const deliveryFee = deliveryMethod === 'delivery' ? 5.99 : 0;
  const total = subtotal + deliveryFee;

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `CP${timestamp}${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (deliveryMethod === 'pickup' && !selectedLocation) {
      toast({
        title: 'Error',
        description: 'Please select a pickup location',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    if (deliveryMethod === 'delivery') {
      if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.zip || !deliveryAddress.phone) {
        toast({
          title: 'Error',
          description: 'Please fill in all delivery address fields',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }
    }

    if (paymentMethod === 'card' && !paymentId) {
      toast({
        title: 'Error',
        description: 'Please complete the payment to continue',
        variant: 'destructive',
        });
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      // Customer information
      const customerInfo = {
        uid: currentUser?.uid || null,
        name: currentUser?.displayName || null,
        email: currentUser?.email || null,
        squareCustomerId: squareCustomerId || null,
      };

      const orderData = {
        orderNumber: generateOrderNumber(),
        customer: customerInfo,
        items: [...items],
        subtotal,
        deliveryFee,
        total,
        deliveryMethod,
        paymentMethod,
        timestamp: new Date(),
        ...(deliveryMethod === 'delivery' 
          ? { deliveryAddress: { ...deliveryAddress } }
          : { 
              pickupLocation: storeLocations.find(loc => loc.id === selectedLocation) 
                ? {
                    id: selectedLocation,
                    name: storeLocations.find(loc => loc.id === selectedLocation)!.name,
                    address: storeLocations.find(loc => loc.id === selectedLocation)!.address,
                  }
                : undefined
            }
        ),
      };
      
      // Log cash orders (without payment) for Firebase function development
      if (paymentMethod === 'cash') {
        console.log('💰 CASH ORDER DATA (For Firebase Function):', {
          ...orderData,
          orderType: deliveryMethod === 'delivery' ? 'Cash on Delivery' : 'Cash at Pickup',
          itemDetails: orderData.items.map(item => ({
            id: item.id,
            name: item.name,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity
          })),
          pricing: {
            subtotal: orderData.subtotal,
            deliveryFee: orderData.deliveryFee,
            total: orderData.total
          }
        });
      }
      
      console.log('✅ Order Data Being Submitted:', orderData);
      
      setLastOrder(orderData);
      clearCart();
      setIsSubmitting(false);
      setLocation('/order-confirmation');
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto text-center"
        >
          <Package className="h-24 w-24 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Add some items to your cart before checking out
          </p>
          <Button onClick={() => setLocation('/menu')} data-testid="button-go-to-menu">
            Browse Menu
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Delivery Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={deliveryMethod}
                    onValueChange={(value) => {
                      console.log('🚚 Delivery Method Changed:', value);
                      setDeliveryMethod(value as DeliveryMethod);
                    }}
                  >
                    <div className="flex items-start space-x-3 p-4 rounded-md border hover-elevate">
                      <RadioGroupItem value="pickup" id="pickup" data-testid="radio-pickup" />
                      <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2 mb-1">
                          <Store className="h-4 w-4" />
                          <span className="font-semibold">Pickup</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Pick up your order from our store
                        </p>
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3 p-4 rounded-md border hover-elevate">
                      <RadioGroupItem value="delivery" id="delivery" data-testid="radio-delivery" />
                      <Label htmlFor="delivery" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2 mb-1">
                          <Truck className="h-4 w-4" />
                          <span className="font-semibold">Delivery</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Delivery fee: ${deliveryFee.toFixed(2)}
                        </p>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {deliveryMethod === 'pickup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Select Pickup Location
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Select 
                        value={selectedLocation} 
                        onValueChange={(value) => {
                          console.log('📍 Pickup Location Selected:', {
                            locationId: value,
                            locationDetails: storeLocations.find(loc => loc.id === value)
                          });
                          setSelectedLocation(value);
                        }}
                      >
                        <SelectTrigger data-testid="select-location">
                          <SelectValue placeholder="Choose a location" />
                        </SelectTrigger>
                        <SelectContent>
                          {storeLocations.map((location) => (
                            <SelectItem key={location.id} value={location.id}>
                              {location.name} - {location.address}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {selectedLocation && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 p-4 rounded-md bg-muted"
                        >
                          {storeLocations
                            .filter((loc) => loc.id === selectedLocation)
                            .map((location) => (
                              <div key={location.id}>
                                <p className="font-semibold">{location.name}</p>
                                <p className="text-sm text-muted-foreground">{location.address}</p>
                                <p className="text-sm text-muted-foreground">{location.city}</p>
                                <p className="text-sm text-muted-foreground mt-2">
                                  <strong>Hours:</strong> {location.hours}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  <strong>Phone:</strong> {location.phone}
                                </p>
                              </div>
                            ))}
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {deliveryMethod === 'delivery' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Delivery Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="street">Street Address</Label>
                        <Input
                          id="street"
                          placeholder="123 Main Street"
                          value={deliveryAddress.street}
                          onChange={(e) => {
                            const updatedAddress = { ...deliveryAddress, street: e.target.value };
                            console.log('📦 Delivery Address Updated:', updatedAddress);
                            setDeliveryAddress(updatedAddress);
                          }}
                          data-testid="input-street"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            placeholder="Toronto"
                            value={deliveryAddress.city}
                            onChange={(e) => {
                              const updatedAddress = { ...deliveryAddress, city: e.target.value };
                              console.log('📦 Delivery Address Updated:', updatedAddress);
                              setDeliveryAddress(updatedAddress);
                            }}
                            data-testid="input-city"
                          />
                        </div>
                        <div>
                          <Label htmlFor="zip">Postal Code</Label>
                          <Input
                            id="zip"
                            placeholder="M5H 2N2"
                            value={deliveryAddress.zip}
                            onChange={(e) => {
                              const updatedAddress = { ...deliveryAddress, zip: e.target.value };
                              console.log('📦 Delivery Address Updated:', updatedAddress);
                              setDeliveryAddress(updatedAddress);
                            }}
                            data-testid="input-zip"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="(416) 555-0100"
                          value={deliveryAddress.phone}
                          onChange={(e) => {
                            const updatedAddress = { ...deliveryAddress, phone: e.target.value };
                            console.log('📦 Delivery Address Updated:', updatedAddress);
                            setDeliveryAddress(updatedAddress);
                          }}
                          data-testid="input-phone"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                  >
                    <div className="flex items-start space-x-3 p-4 rounded-md border hover-elevate">
                      <RadioGroupItem value="cash" id="cash" data-testid="radio-cash" />
                      <Label htmlFor="cash" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2 mb-1">
                          <Wallet className="h-4 w-4" />
                          <span className="font-semibold">
                            {deliveryMethod === 'delivery' ? 'Cash on Delivery' : 'Cash at Pickup'}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {deliveryMethod === 'delivery' 
                            ? 'Pay with cash when your order arrives'
                            : 'Pay with cash when you pick up your order'
                          }
                        </p>
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3 p-4 rounded-md border hover-elevate">
                      <RadioGroupItem value="card" id="card" data-testid="radio-card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2 mb-1">
                          <CreditCard className="h-4 w-4" />
                          <span className="font-semibold">Credit/Debit Card</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Pay securely with your card
                        </p>
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === 'card' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-6"
                    >
                      <SquarePaymentForm
                        amount={total}
                        items={items}
                        deliveryMethod={deliveryMethod}
                        onPaymentSuccess={(id) => {
                          setPaymentId(id);
                          toast({
                            title: 'Payment Successful',
                            description: 'Redirecting to order confirmation...',
                          });
                          
                          // Automatically complete order after successful payment
                          setTimeout(() => {
                            // Customer information
                            const customerInfo = {
                              uid: currentUser?.uid || null,
                              name: currentUser?.displayName || null,
                              email: currentUser?.email || null,
                              squareCustomerId: squareCustomerId || null,
                            };

                            const orderData = {
                              orderNumber: generateOrderNumber(),
                              customer: customerInfo,
                              items: [...items],
                              subtotal,
                              deliveryFee,
                              total,
                              deliveryMethod,
                              paymentMethod: 'card' as PaymentMethod,
                              timestamp: new Date(),
                              ...(deliveryMethod === 'delivery' 
                                ? { deliveryAddress: { ...deliveryAddress } }
                                : { 
                                    pickupLocation: storeLocations.find(loc => loc.id === selectedLocation) 
                                      ? {
                                          id: selectedLocation,
                                          name: storeLocations.find(loc => loc.id === selectedLocation)!.name,
                                          address: storeLocations.find(loc => loc.id === selectedLocation)!.address,
                                        }
                                      : undefined
                                  }
                              ),
                            };
                            
                            console.log('💳 CARD ORDER DATA (After Payment):', orderData);
                            
                            setLastOrder(orderData);
                            clearCart();
                            setLocation('/order-confirmation');
                          }, 1000);
                        }}
                        onPaymentError={(error) => {
                          setPaymentId(null);
                          toast({
                            title: 'Payment Failed',
                            description: error,
                            variant: 'destructive',
                          });
                        }}
                      />
                      {paymentId && (
                        <p className="text-sm text-green-600 mt-2">
                          ✓ Payment completed successfully
                        </p>
                      )}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {items.map((item) => (
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

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span data-testid="text-checkout-subtotal">${subtotal.toFixed(2)}</span>
                    </div>
                    {deliveryFee > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Delivery Fee</span>
                        <span data-testid="text-delivery-fee">${deliveryFee.toFixed(2)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-primary" data-testid="text-checkout-total">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting || (paymentMethod === 'card' && !paymentId)}
                    data-testid="button-confirm-order"
                  >
                    {isSubmitting ? 'Processing...' : paymentMethod === 'card' && !paymentId ? 'Complete Payment First' : 'Confirm Order'}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By placing this order, you agree to our terms and conditions
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
