import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Set Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiamFjb2ItbWF0dGhld3MiLCJhIjoiY21kZ3FkbjJwMHB4bjJsbzhxN2N6cGpiNCJ9.5TBF1McUmSJcFRAs62qAVw';

interface DataPoint {
  id: string;
  name: string;
  coordinates: [number, number];
  type: 'mass_spectrometry' | 'photographic' | 'thermal_analysis' | 'seismic_data' | 'gravimeter_data' | 'dust_analysis';
  tier: 'public' | 'premium' | 'developer';
  description: string;
  mission?: string;
  dataUrl?: string;
}

const apolloLunarData: DataPoint[] = [
  {
    id: '1',
    name: 'Apollo 11 Landing Site - Sea of Tranquility',
    coordinates: [23.473, 0.674],
    type: 'seismic_data',
    tier: 'public',
    description: 'First lunar landing site with Early Apollo Scientific Experiment Package (EASEP) including passive seismic experiment',
    mission: 'Apollo 11',
    dataUrl: 'https://pds.nasa.gov/ds-view/pds/viewBundle.jsp?identifier=urn%3Anasa%3Apds%3Aapollo_seismic_event_catalog'
  },
  {
    id: '2', 
    name: 'Apollo 12 Landing Site - Ocean of Storms',
    coordinates: [-23.42, -3.01],
    type: 'seismic_data',
    tier: 'public',
    description: 'Apollo Lunar Surface Experiments Package (ALSEP) with passive seismic experiment, solar wind spectrometer, and suprathermal ion detector',
    mission: 'Apollo 12'
  },
  {
    id: '3',
    name: 'Apollo 14 Landing Site - Fra Mauro',
    coordinates: [-17.48, -3.64],
    type: 'seismic_data', 
    tier: 'public',
    description: 'ALSEP passive seismic experiment and cold cathode ion gauge experiment at Fra Mauro formation',
    mission: 'Apollo 14'
  },
  {
    id: '4',
    name: 'Apollo 15 Heat Flow Experiment',
    coordinates: [3.66, 26.08],
    type: 'thermal_analysis',
    tier: 'public',
    description: 'Heat Flow Experiment measuring subsurface thermal properties with gradient bridge temperature sensors',
    mission: 'Apollo 15',
    dataUrl: 'https://pds.nasa.gov/ds-view/pds/viewBundle.jsp?identifier=urn%3Anasa%3Apds%3Aa15hfe_calibrated_arcsav'
  },
  {
    id: '5',
    name: 'Apollo 15 Orbital Photography',
    coordinates: [3.66, 26.08],
    type: 'photographic',
    tier: 'premium',
    description: 'Metric (mapping) and panoramic camera images from Command and Service Module orbital observations',
    mission: 'Apollo 15',
    dataUrl: 'https://pds.nasa.gov/ds-view/pds/viewBundle.jsp?identifier=urn%3Anasa%3Apds%3Aa15photosupportdata'
  },
  {
    id: '6',
    name: 'Apollo 15 Mass Spectrometer',
    coordinates: [3.66, 26.08],
    type: 'mass_spectrometry',
    tier: 'developer',
    description: 'Orbital Mass Spectrometer Experiment measuring lunar atmospheric composition',
    mission: 'Apollo 15'
  },
  {
    id: '7',
    name: 'Apollo 16 Descartes Highlands',
    coordinates: [15.50, -8.60],
    type: 'photographic',
    tier: 'premium', 
    description: 'Metric and panoramic camera photography of lunar highlands with photographic ephemeris support data',
    mission: 'Apollo 16',
    dataUrl: 'https://pds.nasa.gov/ds-view/pds/viewBundle.jsp?identifier=urn%3Anasa%3Apds%3Aa16photosupportdata'
  },
  {
    id: '8',
    name: 'Apollo 16 Mass Spectrometer',
    coordinates: [15.50, -8.60], 
    type: 'mass_spectrometry',
    tier: 'developer',
    description: 'Orbital Mass Spectrometer Experiment data from Command and Service Module',
    mission: 'Apollo 16'
  },
  {
    id: '9',
    name: 'Apollo 17 Heat Flow Experiment',
    coordinates: [30.77, 20.19],
    type: 'thermal_analysis',
    tier: 'public',
    description: 'Heat Flow Experiment with calibrated gradient bridge temperature data from Taurus-Littrow valley',
    mission: 'Apollo 17',
    dataUrl: 'https://pds.nasa.gov/ds-view/pds/viewBundle.jsp?identifier=urn%3Anasa%3Apds%3Aa17hfe_calibrated_arcsav'
  },
  {
    id: '10',
    name: 'Apollo 17 Lunar Ejecta and Meteorites Experiment',
    coordinates: [30.77, 20.19],
    type: 'dust_analysis',
    tier: 'public',
    description: 'LEAM experiment measuring lunar dust and meteorite impact particles',
    mission: 'Apollo 17',
    dataUrl: 'https://pds.nasa.gov/ds-view/pds/viewBundle.jsp?identifier=urn%3Anasa%3Apds%3Aa17leam_raw_worktape'
  },
  {
    id: '11', 
    name: 'Apollo 17 Lunar Surface Gravimeter',
    coordinates: [30.77, 20.19],
    type: 'gravimeter_data',
    tier: 'premium',
    description: 'Lunar Surface Gravimeter measuring local gravitational variations and seismic activity',
    mission: 'Apollo 17',
    dataUrl: 'https://pds.nasa.gov/ds-view/pds/viewBundle.jsp?identifier=urn%3Anasa%3Apds%3Aa17lsg_raw_arcsav'
  },
  {
    id: '12',
    name: 'Apollo 17 Orbital Photography', 
    coordinates: [30.77, 20.19],
    type: 'photographic',
    tier: 'premium',
    description: 'Comprehensive photographic mapping from Metric and Panoramic cameras with ephemeris support data',
    mission: 'Apollo 17',
    dataUrl: 'https://pds.nasa.gov/ds-view/pds/viewBundle.jsp?identifier=urn%3Anasa%3Apds%3Aa17photosupportdata'
  }
];

const LunarMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map with NASA Moon tiles
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'moon-tiles': {
            type: 'raster',
            tiles: [
              'https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd/1.0.0/default/default028mm/{z}/{y}/{x}.jpg'
            ],
            tileSize: 256,
            minzoom: 0,
            maxzoom: 8
          }
        },
        layers: [
          {
            id: 'moon-background',
            type: 'background',
            paint: {
              'background-color': '#000000'
            }
          },
          {
            id: 'moon-surface',
            type: 'raster',
            source: 'moon-tiles',
            paint: {
              'raster-opacity': 1
            }
          }
        ]
      },
      projection: 'globe',
      zoom: 2,
      center: [0, 0],
      pitch: 0,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add data points
    map.current.on('load', () => {
      if (!map.current) return;

      // Add data source
      map.current.addSource('lunar-data', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: apolloLunarData.map(point => ({
            type: 'Feature',
            properties: {
              id: point.id,
              name: point.name,
              type: point.type,
              tier: point.tier,
              description: point.description
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
        id: 'lunar-data-circles',
        type: 'circle',
        source: 'lunar-data',
        paint: {
          'circle-radius': [
            'case',
            ['==', ['get', 'tier'], 'public'], 8,
            ['==', ['get', 'tier'], 'premium'], 10,
            12 // developer
          ],
          'circle-color': [
            'case',
            ['==', ['get', 'type'], 'mass_spectrometry'], '#ef4444', // Red for spectrometry
            ['==', ['get', 'type'], 'photographic'], '#3b82f6', // Blue for photography
            ['==', ['get', 'type'], 'thermal_analysis'], '#f59e0b', // Orange for thermal
            ['==', ['get', 'type'], 'seismic_data'], '#8b5cf6', // Purple for seismic
            ['==', ['get', 'type'], 'gravimeter_data'], '#06b6d4', // Cyan for gravimeter
            ['==', ['get', 'type'], 'dust_analysis'], '#22c55e', // Green for dust analysis
            '#6b7280' // Gray for unknown
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });

      // Add click handler
      map.current.on('click', 'lunar-data-circles', (e) => {
        if (e.features && e.features[0]) {
          const feature = e.features[0];
          const point = apolloLunarData.find(p => p.id === feature.properties?.id);
          if (point) {
            setSelectedPoint(point);
          }
        }
      });

      // Change cursor on hover
      map.current.on('mouseenter', 'lunar-data-circles', () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = 'pointer';
        }
      });

      map.current.on('mouseleave', 'lunar-data-circles', () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = '';
        }
      });
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  const getDataTypeColor = (type: string) => {
    switch (type) {
      case 'mass_spectrometry': return 'bg-red-500';
      case 'photographic': return 'bg-blue-500';
      case 'thermal_analysis': return 'bg-amber-500';
      case 'seismic_data': return 'bg-purple-500';
      case 'gravimeter_data': return 'bg-cyan-500';
      case 'dust_analysis': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'public': return 'bg-emerald-100 text-emerald-800';
      case 'premium': return 'bg-violet-100 text-violet-800';
      case 'developer': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
            <div className="flex gap-2">
              <Badge className={`${getDataTypeColor(selectedPoint.type)} text-white`}>
                {selectedPoint.type.replace(/_/g, ' ').toUpperCase()}
              </Badge>
              <Badge className={getTierColor(selectedPoint.tier)}>
                {selectedPoint.tier.toUpperCase()}
              </Badge>
              {selectedPoint.mission && (
                <Badge variant="outline">
                  {selectedPoint.mission}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {selectedPoint.description}
            </p>
            <Button 
              className="w-full"
              onClick={() => {
                if (selectedPoint.dataUrl) {
                  window.open(selectedPoint.dataUrl, '_blank');
                } else if (selectedPoint.tier === 'public') {
                  // Fallback to NASA PDS search for the mission
                  window.open(`https://pds.nasa.gov/datasearch/data-search/?mission=${selectedPoint.mission?.replace(' ', '%20')}`, '_blank');
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
          <CardTitle className="text-sm">Data Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-sm">Mass Spectrometry</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-sm">Photography/Imaging</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500"></div>
            <span className="text-sm">Thermal Analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-purple-500"></div>
            <span className="text-sm">Seismic Data</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-cyan-500"></div>
            <span className="text-sm">Gravimeter Data</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-sm">Dust Analysis</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LunarMap;