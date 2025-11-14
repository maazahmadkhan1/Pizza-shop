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
  
  console.log('📄 Creating Square Invoice/Order:');
  console.log('URL:', createOrderUrl);
  console.log('Full Payload:', JSON.stringify(payload, null, 2));
  console.log('Customer Details:', {
    name: payload.customer.name,
    email: payload.customer.email,
    uid: payload.customer.uid,
    squareCustomerId: payload.customer.squareCustomerId
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
  console.log('✅ Square Invoice/Order Response:', data);
  
  // Check if invoice was actually created
  if (data.invoiceId === null || data.invoiceId === undefined) {
    console.warn('⚠️ WARNING: Invoice was not created! Only order was created.');
    console.warn('Invoice ID is null. Check Firebase function logs for errors.');
    console.warn('Possible issues:');
    console.warn('- Customer email might be missing or invalid');
    console.warn('- Square Customer ID might be missing');
    console.warn('- Firebase function might have an error creating the invoice');
  }
  
  return data;
}
