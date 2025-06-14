import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import crimeData from './crimeData.json';

const LiveLocationMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ lat: number; lng: number }>({
    lat: 28.53632,
    lng: 77.2492,
  });
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [showOnlyDanger, setShowOnlyDanger] = useState(false);
  const [crimeMarkers, setCrimeMarkers] = useState<L.CircleMarker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView([position.lat, position.lng], 13);
    setMapInstance(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const marker = L.marker([position.lat, position.lng]).addTo(map);

    const updatePosition = (lat: number, lng: number) => {
      setPosition({ lat, lng });
      marker.setLatLng([lat, lng]);
      map.setView([lat, lng]);
    };

    const getLiveLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            updatePosition(latitude, longitude);
          },
          (error) => {
            console.error('Error fetching location:', error);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    };

    getLiveLocation();

    return () => {
      map.remove();
    };
  }, []);

  const renderCrimeMarkers = () => {
    if (!mapInstance) return;

    // Clear old markers
    crimeMarkers.forEach((marker) => mapInstance.removeLayer(marker));

    const newMarkers: L.CircleMarker[] = [];

    crimeData.forEach((zone) => {
      const total = zone.totalcrime;

      if (showOnlyDanger && total <= 500) return; // Skip safe and medium if filtering danger

      let color = 'green';
      if (total > 500) {
        color = 'red';
      } else if (total > 200) {
        color = 'orange';
      }

      const circle = L.circleMarker([zone.lat, zone.long], {
        radius: 12,
        color,
        fillColor: color,
        fillOpacity: 0.7,
      })
        .bindPopup(
          `<b>${zone.nm_pol}</b><br/>Total Crimes: ${total}`
        )
        .addTo(mapInstance);

      newMarkers.push(circle);
    });

    setCrimeMarkers(newMarkers);
  };

  useEffect(() => {
    renderCrimeMarkers();
  }, [mapInstance, showOnlyDanger]);

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <button
          onClick={() => setShowOnlyDanger(!showOnlyDanger)}
          style={{
            padding: '8px 16px',
            backgroundColor: showOnlyDanger ? '#ff4d4d' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {showOnlyDanger ? 'Show All Zones' : 'Show Only Danger Zones'}
        </button>
      </div>
      <div ref={mapRef} style={{ height: '500px', width: '100%' }} />
    </div>
  );
};

export default LiveLocationMap;
