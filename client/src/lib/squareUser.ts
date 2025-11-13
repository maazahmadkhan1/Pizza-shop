import { apiRequest } from '@/lib/queryClient';

interface CreateSquareUserPayload {
  uid: string;
  name: string;
  email: string;
}

interface CreateSquareUserResponse {
  customerId: string;
  success: boolean;
}

export async function createSquareUser(uid: string, name: string, email: string): Promise<string> {
  try {
    const payload: CreateSquareUserPayload = {
      uid,
      name,
      email,
    };

    const response = await fetch(
      'https://us-central1-pizza-shop-3afe9.cloudfunctions.net/createSquareUser',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create Square user: ${response.statusText}`);
    }

    const data: CreateSquareUserResponse = await response.json();
    
    if (!data.success || !data.customerId) {
      throw new Error('Square user creation failed');
    }

    return data.customerId;
  } catch (error) {
    console.error('Error creating Square user:', error);
    throw error;
  }
}

export async function saveSquareCustomer(
  firebaseUid: string,
  squareCustomerId: string,
  email: string,
  name: string
): Promise<void> {
  try {
    const response = await apiRequest('POST', '/api/square-customer', {
      firebaseUid,
      squareCustomerId,
      email,
      name,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to save Square customer: ${response.status} ${errorText}`);
    }
    
    await response.json();
  } catch (error) {
    console.error('Error saving Square customer:', error);
    throw error;
  }
}

export async function getSquareCustomer(firebaseUid: string) {
  try {
    const response = await fetch(`/api/square-customer/${firebaseUid}`);
    
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch Square customer: ${response.status} ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Square customer:', error);
    throw error;
  }
}
