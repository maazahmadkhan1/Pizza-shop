import { apiRequest } from '@/lib/queryClient';

export async function createSquareUser(uid: string, name: string, email: string): Promise<string> {
  try {
    const response = await apiRequest('POST', '/api/square-customer', {
      firebaseUid: uid,
      email,
      name,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create Square customer: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    return data.squareCustomerId;
  } catch (error) {
    console.error('Error creating Square user:', error);
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
