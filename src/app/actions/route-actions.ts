'use server';

export async function getOptimizedRoute(
  origin: { lat: number; lng: number },
  stops: { lat: number; lng: number }[]
) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Format waypoints for Google API
  const waypoints = stops.map((s) => `${s.lat},${s.lng}`).join('|');
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${origin.lat},${origin.lng}&waypoints=optimize:true|${waypoints}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      return {
        polyline: data.routes[0].overview_polyline.points,
        optimizedOrder: data.routes[0].waypoint_order, // Index of stops in best order
        distance: data.routes[0].legs.reduce(
          (acc: number, leg: any) => acc + leg.distance.value,
          0
        ),
        duration: data.routes[0].legs.reduce(
          (acc: number, leg: any) => acc + leg.duration.value,
          0
        ),
      };
    }
    return null;
  } catch (error) {
    console.error('Routing Error:', error);
    return null;
  }
}
