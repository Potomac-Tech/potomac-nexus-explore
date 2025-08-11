import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Set Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiamFjb2ItbWF0dGhld3MiLCJhIjoiY21kZ3FkbjJwMHB4bjJsbzhxN2N6cGpiNCJ9.5TBF1McUmSJcFRAs62qAVw';

interface SeabedDataPoint {
  id: string;
  name: string;
  coordinates: [number, number];
  type: 'video_mapping' | 'bathymetry' | 'ecosystem_survey';
  tier: 'public' | 'premium' | 'developer';
  description: string;
  depth: number;
}

const sampleSeabedData: SeabedDataPoint[] = [
  {
    id: '1',
    name: 'Mariana Trench - Challenger Deep',
    coordinates: [142.2, 11.373],
    type: 'video_mapping',
    tier: 'premium',
    description: 'Deep-sea video mapping of the world\'s deepest ocean trench',
    depth: -10994
  },
  {
    id: '2',
    name: 'Great Barrier Reef Survey Zone',
    coordinates: [145.7781, -16.2839],
    type: 'ecosystem_survey',
    tier: 'public',
    description: 'Coral reef ecosystem monitoring and biodiversity mapping',
    depth: -25
  },
  {
    id: '3',
    name: 'Mid-Atlantic Ridge',
    coordinates: [-29.0, 45.0],
    type: 'bathymetry',
    tier: 'developer',
    description: 'High-resolution bathymetric mapping of tectonic features',
    depth: -2500
  },
  {
    id: '4',
    name: 'Monterey Canyon',
    coordinates: [-121.9, 36.7],
    type: 'video_mapping',
    tier: 'public',
    description: 'Submarine canyon ecosystem documentation',
    depth: -1200
  }
];

const SeabedMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<SeabedDataPoint | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map with GEBCO bathymetric style focusing on ocean floor
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'gebco-bathymetry': {
            type: 'raster',
            tiles: [
              'https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?request=GetMap&service=WMS&version=1.3.0&layers=GEBCO_LATEST&styles=&format=image/png&crs=EPSG:4326&bbox={bbox-epsg-4326}&width=256&height=256'
            ],
            tileSize: 256,
            minzoom: 0,
            maxzoom: 8
          },
          'ocean-background': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}'
            ],
            tileSize: 256
          },
          'natural-earth': {
            type: 'vector',
            url: 'mapbox://mapbox.natural-earth-shaded-relief'
          }
        },
        layers: [
          {
            id: 'ocean-background-layer',
            type: 'raster',
            source: 'ocean-background',
            paint: {
              'raster-opacity': 0.8
            }
          },
          {
            id: 'bathymetry-layer',
            type: 'raster',
            source: 'gebco-bathymetry',
            paint: {
              'raster-opacity': 0.7
            }
          },
          {
            id: 'land-fill',
            type: 'fill',
            source: 'natural-earth',
            'source-layer': 'landcover',
            paint: {
              'fill-color': '#d4af89',
              'fill-opacity': 1
            }
          }
        ]
      },
      projection: 'globe',
      zoom: 1.5,
      center: [0, 0],
    });

    // Add atmosphere and fog effects
    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(18, 54, 85)',
        'high-color': 'rgb(36, 92, 144)',
        'horizon-blend': 0.4,
        'space-color': 'rgb(11, 11, 25)',
        'star-intensity': 0.8
      });
    });

    // Globe rotation settings (disabled)
    const secondsPerRevolution = 240;
    const maxSpinZoom = 5;
    const slowSpinZoom = 3;
    let userInteracting = false;
    let spinEnabled = false; // Disabled auto-spinning

    // Spin globe function
    function spinGlobe() {
      if (!map.current) return;
      
      const zoom = map.current.getZoom();
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
        const center = map.current.getCenter();
        center.lng -= distancePerSecond;
        map.current.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    }

    // Event listeners for interaction
    map.current.on('mousedown', () => {
      userInteracting = true;
    });
    
    map.current.on('dragstart', () => {
      userInteracting = true;
    });
    
    map.current.on('mouseup', () => {
      userInteracting = false;
      spinGlobe();
    });
    
    map.current.on('touchend', () => {
      userInteracting = false;
      spinGlobe();
    });

    map.current.on('moveend', () => {
      spinGlobe();
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right');

    // Globe spinning disabled - no auto-start

    // Add data points
    map.current.on('load', () => {
      if (!map.current) return;

      // Add data source
      map.current.addSource('seabed-data', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: sampleSeabedData.map(point => ({
            type: 'Feature',
            properties: {
              id: point.id,
              name: point.name,
              type: point.type,
              tier: point.tier,
              description: point.description,
              depth: point.depth
            },
            geometry: {
              type: 'Point',
              coordinates: point.coordinates
            }
          }))
        }
      });

      // Add circles for data points
      map.current.addLayer({
        id: 'seabed-data-circles',
        type: 'circle',
        source: 'seabed-data',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['abs', ['get', 'depth']],
            0, 6,
            1000, 8,
            5000, 10,
            10000, 12
          ],
          'circle-color': [
            'case',
            ['==', ['get', 'tier'], 'public'], '#0ea5e9',
            ['==', ['get', 'tier'], 'premium'], '#8b5cf6',
            '#06b6d4' // developer
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.8
        }
      });

      // Add click handler
      map.current.on('click', 'seabed-data-circles', (e) => {
        if (e.features && e.features[0]) {
          const feature = e.features[0];
          const point = sampleSeabedData.find(p => p.id === feature.properties?.id);
          if (point) {
            setSelectedPoint(point);
          }
        }
      });

      // Change cursor on hover
      map.current.on('mouseenter', 'seabed-data-circles', () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = 'pointer';
        }
      });

      map.current.on('mouseleave', 'seabed-data-circles', () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = '';
        }
      });
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'public': return 'bg-sky-500';
      case 'premium': return 'bg-violet-500';
      case 'developer': return 'bg-cyan-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDepth = (depth: number) => {
    return `${Math.abs(depth).toLocaleString()}m below surface`;
  };

  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Data Point Details Panel */}
      {selectedPoint && (
        <Card className="absolute top-4 left-4 w-80 z-10">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{selectedPoint.name}</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedPoint(null)}
              >
                ×
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge className={`${getTierColor(selectedPoint.tier)} text-white`}>
                {selectedPoint.tier.toUpperCase()}
              </Badge>
              <Badge variant="outline">
                {selectedPoint.type.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge variant="secondary">
                {formatDepth(selectedPoint.depth)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {selectedPoint.description}
            </p>
            <Button 
              className="w-full"
              onClick={() => {
                if (selectedPoint.id === '4' && selectedPoint.tier === 'public') {
                  window.open('https://cmgds.marine.usgs.gov/data/csmp/MontereyCanyon/data_catalog_MontereyCanyon.html', '_blank');
                }
              }}
            >
              {selectedPoint.tier === 'public' ? 'View Data' : 
               selectedPoint.tier === 'premium' ? 'Upgrade to Access' : 
               'Developer API Access'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card className="absolute bottom-4 right-4 z-10">
        <CardHeader>
          <CardTitle className="text-sm">Ocean Data Access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-sky-500"></div>
            <span className="text-sm">Public - Open Ocean</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-violet-500"></div>
            <span className="text-sm">Premium - Deep Sea</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-cyan-500"></div>
            <span className="text-sm">Developer - Research</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeabedMap;