interface CreateSquareInvoicePayload {
  orderNumber: string;
  timestamp: string;
  paymentMethod: string;
  deliveryMethod: string;
  customer: {
    name: string;
    email: string;
    uid: string;
    squareCustomerId: string;
  };
  deliveryAddress: {
    street: string;
    city: string;
    zip: string;
    phone: string;
  };
  items: Array<{
    id: string;
    name: string;
    description: string;
    image: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export async function createSquareInvoice(payload: CreateSquareInvoicePayload): Promise<any> {
  const createOrderUrl = import.meta.env.VITE_CREATE_SQUARE_ORDER_URL || 'https://createsquareorder-wuv7qzdnyq-uc.a.run.app';
  
  console.log('📄 Creating Square Invoice/Order:', {
    url: createOrderUrl,
    orderNumber: payload.orderNumber,
    total: payload.total,
    deliveryMethod: payload.deliveryMethod,
    paymentMethod: payload.paymentMethod
  });

  const response = await fetch(createOrderUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Failed to create Square invoice:', errorText);
    throw new Error(`Failed to create Square invoice: ${errorText}`);
  }

  const data = await response.json();
  console.log('✅ Square Invoice/Order Created:', data);
  return data;
}
