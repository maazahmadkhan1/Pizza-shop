import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk';
import { useAuth } from '@/contexts/AuthContext';
import type { TokenResult, ChargeVerifyBuyerDetails } from '@square/web-payments-sdk-types';
import type { CartItem, DeliveryMethod } from '@shared/schema';

interface SquarePaymentFormProps {
  amount: number;
  items: CartItem[];
  deliveryMethod: DeliveryMethod;
  onPaymentSuccess: (paymentId: string) => void;
  onPaymentError: (error: string) => void;
}

export default function SquarePaymentForm({
  amount,
  items,
  deliveryMethod,
  onPaymentSuccess,
  onPaymentError,
}: SquarePaymentFormProps) {
  const { currentUser } = useAuth();

  const applicationId = import.meta.env.VITE_SQUARE_APPLICATION_ID;
  const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID;

  if (!applicationId || !locationId) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded-md">
        Square payment credentials are not configured. Please contact support.
      </div>
    );
  }

  const handleCardTokenizeResponse = async (token: TokenResult) => {
    try {
      const response = await fetch('/api/square-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceId: token.token,
          items: items.map(item => ({
            id: item.id,
            quantity: item.quantity,
          })),
          deliveryMethod,
          firebaseUid: currentUser?.uid,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Payment failed');
      }

      const result = await response.json();
      onPaymentSuccess(result.paymentId);
    } catch (error: any) {
      console.error('Payment error:', error);
      onPaymentError(error.message || 'Payment processing failed');
    }
  };

  const createVerificationDetails = (): ChargeVerifyBuyerDetails => {
    return {
      amount: amount.toFixed(2),
      currencyCode: 'USD',
      intent: 'CHARGE',
      billingContact: {
        givenName: currentUser?.displayName?.split(' ')[0] || 'Customer',
        familyName: currentUser?.displayName?.split(' ').slice(1).join(' ') || '',
        email: currentUser?.email || '',
      },
    };
  };

  return (
    <div className="space-y-4">
      <PaymentForm
        applicationId={applicationId}
        locationId={locationId}
        cardTokenizeResponseReceived={handleCardTokenizeResponse}
        createVerificationDetails={createVerificationDetails}
      >
        <CreditCard
          style={{
            input: {
              fontSize: '14px',
              color: 'hsl(var(--foreground))',
              fontFamily: 'inherit',
            },
            'input::placeholder': {
              color: 'hsl(var(--muted-foreground))',
            },
            '.error': {
              color: 'hsl(var(--destructive))',
            },
          }}
        />
      </PaymentForm>
    </div>
  );
}
