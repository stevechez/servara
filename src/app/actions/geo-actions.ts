'use server';

import { createClient } from '@/lib/supabase/server';

export async function geocodeCustomerAddress(customerId: string, address: string) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const encodedAddress = encodeURIComponent(address);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      const { lat, lng } = data.results[0].geometry.location;

      const supabase = await createClient();
      await supabase
        .from('customers')
        .update({ latitude: lat, longitude: lng })
        .eq('id', customerId);

      return { lat, lng };
    }
    throw new Error('Geocoding failed');
  } catch (error) {
    console.error('Geo Error:', error);
    return null;
  }
}
