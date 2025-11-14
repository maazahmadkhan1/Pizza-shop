# Square Invoice Integration for Cash Orders

## Overview
This application automatically creates Square invoices and orders when customers place cash orders (Cash on Delivery or Cash at Pickup).

## Implementation Details

### 1. Firebase Cloud Function Endpoint
- **URL**: `https://createsquareorder-wuv7qzdnyq-uc.a.run.app`
- **Method**: POST
- **Environment Variable**: `VITE_CREATE_SQUARE_ORDER_URL` (optional override)

### 2. When It Triggers
The Square invoice creation is automatically triggered when:
- Payment method is set to **"cash"**
- User completes the checkout process
- Works for both **pickup** and **delivery** orders

### 3. Payload Structure
The following payload is sent to the Firebase Cloud Function:

```json
{
  "orderNumber": "CP1871339706CJ",
  "timestamp": "Fri Nov 14 2025 16:11:53 GMT+0500 (Pakistan Standard Time)",
  "paymentMethod": "cash",
  "deliveryMethod": "pickup" | "delivery",
  "customer": {
    "name": "Customer Name",
    "email": "customer@example.com",
    "uid": "firebase-user-id",
    "squareCustomerId": "SQUARE_CUSTOMER_ID"
  },
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "Toronto",
    "zip": "M5H 2N2",
    "phone": "(416) 555-0100"
  },
  "items": [
    {
      "id": "VARIATION_ID",
      "name": "Product Name",
      "description": "Product description",
      "image": "https://example.com/image.png",
      "price": 10.00,
      "quantity": 1
    }
  ],
  "subtotal": 10.00,
  "deliveryFee": 5.99,
  "total": 15.99
}
```

### 4. Delivery Fee Logic
- **Pickup orders**: `deliveryFee = 0`
- **Delivery orders**: `deliveryFee = 5.99`

This is automatically calculated in the Checkout component (line 100):
```typescript
const deliveryFee = deliveryMethod === 'delivery' ? 5.99 : 0;
```

### 5. Implementation Files

#### `/client/src/lib/squareInvoice.ts`
Utility function that handles the API call to create Square invoices:
- Accepts a structured payload
- Calls the Firebase Cloud Function
- Handles errors gracefully
- Logs success/failure for debugging

#### `/client/src/pages/Checkout.tsx`
Main checkout page that:
1. Collects order information
2. Validates customer data
3. Creates the invoice payload
4. Calls `createSquareInvoice()` for cash orders
5. Shows success/error notifications

### 6. Error Handling
If the Square invoice creation fails:
- The order is still placed locally
- User sees a warning notification
- Error is logged to console for debugging
- User is advised to contact support

### 7. Customer Flow

#### For Cash Orders:
1. User adds items to cart
2. User selects payment method: "Cash"
3. User selects delivery method: "Pickup" or "Delivery"
4. User fills in required information
5. User clicks "Place Order"
6. System creates Square invoice/order automatically
7. User receives confirmation

#### For Card Orders:
1-5. Same as above (but selecting "Card" payment)
6. User completes Square payment form
7. Payment is processed via Square Web Payments SDK
8. Square automatically creates the order
9. User receives confirmation

### 8. Testing
To test the Square invoice creation:
1. Add items to cart
2. Go to checkout
3. Select "Cash on Delivery" or "Cash at Pickup"
4. Fill in all required fields
5. Submit the order
6. Check console logs for:
   - `📄 Creating Square Invoice/Order:` (request)
   - `✅ Square Invoice/Order Created:` (success)
   - `❌ Failed to create Square invoice:` (error)

### 9. Environment Configuration
Optional environment variable to override the default URL:
```bash
VITE_CREATE_SQUARE_ORDER_URL=https://your-custom-url.com
```

If not set, defaults to:
```
https://createsquareorder-wuv7qzdnyq-uc.a.run.app
```

### 10. Security Considerations
- Customer sensitive data (Firebase UID, Square Customer ID) is transmitted securely
- All API calls use HTTPS
- Firebase Cloud Function handles Square API authentication
- No Square credentials are exposed on the client side

## Code Location Summary
- **Utility Function**: `/client/src/lib/squareInvoice.ts`
- **Checkout Implementation**: `/client/src/pages/Checkout.tsx` (lines 182-226)
- **Type Definitions**: `/shared/schema.ts`
- **Environment Config**: `.env` (optional)

## Features
✅ Automatic Square invoice creation for cash orders  
✅ $0 delivery fee for pickup orders  
✅ $5.99 delivery fee for delivery orders  
✅ Comprehensive error handling  
✅ User-friendly notifications  
✅ Detailed console logging  
✅ Clean, maintainable code structure
