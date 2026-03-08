'use client';

import { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '12px'
};

const center = { lat: 36.9741, lng: -122.0308 };

// 🟢 NEW: Accept jobs as a prop
export default function RouteMap({ jobs }: { jobs: any[] }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  useEffect(() => {
    if (!isLoaded || !jobs) return;
console.log("📍 RAW JOBS DATA:", jobs);

    console.log("📍 RAW JOBS DATA IN MAP:", jobs);
    // 1. Extract addresses from your active jobs
    // (Adjust 'job.address' below if your database uses a different column name like 'location')
    const activeJobs = jobs.filter(j => j.status !== 'completed' && j.status !== 'invoiced');
    const validAddresses = activeJobs.map(job => job.address).filter(Boolean);

    // 2. Crash-Proof Fallback: If you haven't added addresses to your DB yet, use test data
    const stopsToRoute = validAddresses.length >= 2 ? validAddresses : [
      "Santa Cruz Boardwalk, Santa Cruz, CA",
      "Capitola Wharf, Capitola, CA",
      "UC Santa Cruz, Santa Cruz, CA"
    ];

    const directionsService = new window.google.maps.DirectionsService();

    // 3. Set up the route (First stop is start, last stop is end, everything else is a waypoint)
    const origin = stopsToRoute[0];
    const destination = stopsToRoute[stopsToRoute.length - 1];
    const waypoints = stopsToRoute.slice(1, -1).map(addr => ({
      location: addr,
      stopover: true
    }));

    // 4. Ask Google for the most efficient route
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        optimizeWaypoints: true, // 🟢 Automatically sorts the stops to save gas!
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
        } else {
          console.error(`Error fetching directions: ${status}`);
        }
      }
    );
  }, [isLoaded, jobs]);

  if (!isLoaded) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm animate-pulse mt-8">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-[500px] bg-gray-100 rounded-xl w-full flex items-center justify-center text-gray-400 font-medium">
          Loading Map Engine...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mt-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">Daily Route Optimizer</h2>
        <p className="text-gray-500 text-sm">Automatically sorting active jobs for the shortest drive time.</p>
      </div>
      
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-inner">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
          }}
        >
          {directions && (
            <DirectionsRenderer 
              directions={directions} 
              options={{
                polylineOptions: {
                  strokeColor: '#2563eb', // Next.js Blue
                  strokeWeight: 5,
                }
              }}
            />
          )}
        </GoogleMap>
      </div>
    </div>
  );
}