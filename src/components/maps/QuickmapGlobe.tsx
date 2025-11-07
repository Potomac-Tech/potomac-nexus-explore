import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Search, Layers, Box } from 'lucide-react';

// Set Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiamFjb2ItbWF0dGhld3MiLCJhIjoiY21kZ3FkbjJwMHB4bjJsbzhxN2N6cGpiNCJ9.5TBF1McUmSJcFRAs62qAVw';

interface DataPoint {
  id: string;
  name: string;
  coordinates: [number, number];
  type: 'mass_spectrometry' | 'photographic' | 'thermal_analysis' | 'seismic_data' | 'gravimeter_data' | 'dust_analysis' | 'soil_analysis';
  tier: 'public' | 'premium' | 'developer';
  description: string;
  mission?: string;
  dataUrl?: string;
}

const lunarMissionData: DataPoint[] = [
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
  },
  {
    id: '13',
    name: 'Surveyor 1 Landing Site - Ocean of Storms',
    coordinates: [316.661, -2.474],
    type: 'photographic',
    tier: 'public',
    description: 'First successful U.S. soft lunar landing. Transmitted over 11,000 images of the lunar surface and conducted engineering tests',
    mission: 'Surveyor 1'
  },
  {
    id: '14',
    name: 'Surveyor 3 Landing Site - Ocean of Storms',
    coordinates: [336.582, -3.015],
    type: 'soil_analysis',
    tier: 'public',
    description: 'Soft landing with soil mechanics surface sampler. Later visited by Apollo 12 crew who retrieved parts for Earth analysis',
    mission: 'Surveyor 3'
  },
  {
    id: '15',
    name: 'Surveyor 5 Landing Site - Mare Tranquillitatis',
    coordinates: [23.195, 1.461],
    type: 'soil_analysis',
    tier: 'premium',
    description: 'First chemical analysis of lunar soil using alpha particle scattering instrument. Analyzed elemental composition of lunar regolith',
    mission: 'Surveyor 5'
  },
  {
    id: '16',
    name: 'Surveyor 6 Landing Site - Sinus Successus',
    coordinates: [358.573, 0.473],
    type: 'photographic',
    tier: 'public',
    description: 'Soft landing with comprehensive photographic survey and soil analysis. Demonstrated vernier engine restart capability',
    mission: 'Surveyor 6'
  },
  {
    id: '17',
    name: 'Surveyor 7 Landing Site - Tycho Crater Rim',
    coordinates: [348.491, -40.980],
    type: 'soil_analysis',
    tier: 'premium',
    description: 'Only Surveyor mission to lunar highlands. Analyzed highland material near Tycho crater rim with alpha particle scattering',
    mission: 'Surveyor 7'
  },
  {
    id: '18',
    name: 'Chang\'e 3 Landing Site - Mare Imbrium',
    coordinates: [-19.51, 44.12],
    type: 'soil_analysis',
    tier: 'public',
    description: 'First Chinese lunar lander with Yutu rover. Conducted geological surveys and soil analysis on basaltic plains of Mare Imbrium',
    mission: 'Chang\'e 3'
  },
  {
    id: '19',
    name: 'Chang\'e 4 Landing Site - Von Kármán Crater',
    coordinates: [177.5991, -45.4446],
    type: 'photographic',
    tier: 'public',
    description: 'First successful landing on lunar far side within Von Kármán crater in South Pole-Aitken basin. Yutu-2 rover conducting ongoing exploration',
    mission: 'Chang\'e 4'
  },
  {
    id: '20',
    name: 'Chang\'e 5 Landing Site - Oceanus Procellarum',
    coordinates: [-51.92, 43.06],
    type: 'soil_analysis',
    tier: 'premium',
    description: 'Sample return mission in Oceanus Procellarum near Mons Rümker. Collected 1.73 kg of lunar samples from young basaltic region',
    mission: 'Chang\'e 5'
  },
  {
    id: '21',
    name: 'Chang\'e 6 Landing Site - Apollo Basin',
    coordinates: [-153.9852, -41.6385],
    type: 'soil_analysis',
    tier: 'premium',
    description: 'First sample return mission from lunar far side. Landed in Apollo basin within South Pole-Aitken basin for unique geological sampling',
    mission: 'Chang\'e 6'
  }
];

const QuickmapGlobe: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);
  const [searchLat, setSearchLat] = useState('');
  const [searchLng, setSearchLng] = useState('');
  const [showLayers, setShowLayers] = useState(false);
  const [lrocWacVisible, setLrocWacVisible] = useState(true);
  const [lrocNacVisible, setLrocNacVisible] = useState(false);
  const searchMarker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map with LROC WAC Global Mosaic
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'lroc-wac': {
            type: 'raster',
            tiles: [
              'https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd/1.0.0/default/default028mm/{z}/{y}/{x}.jpg'
            ],
            tileSize: 256,
            scheme: 'tms',
            minzoom: 0,
            maxzoom: 8,
            attribution: 'Imagery: LROC WAC Global Mosaic — NASA/GSFC/Arizona State University'
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
            id: 'lroc-wac-layer',
            type: 'raster',
            source: 'lroc-wac',
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

    // Add data points and layers
    map.current.on('load', () => {
      if (!map.current) return;

      // Add LROC NAC High-Resolution layer
      map.current.addSource('lroc-nac', {
        type: 'raster',
        tiles: [
          'https://trek.nasa.gov/tiles/Moon/EQ/LRO_NAC_Mosaic_Global/1.0.0/default/default028mm/{z}/{y}/{x}.jpg'
        ],
        tileSize: 256,
        scheme: 'tms',
        minzoom: 0,
        maxzoom: 12
      });

      map.current.addLayer({
        id: 'lroc-nac-layer',
        type: 'raster',
        source: 'lroc-nac',
        paint: {
          'raster-opacity': 0.8
        },
        layout: {
          visibility: 'none'
        }
      });

      // Add PDS mission data source
      map.current.addSource('lunar-data', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: lunarMissionData.map(point => ({
            type: 'Feature',
            properties: {
              id: point.id,
              name: point.name,
              type: point.type,
              tier: point.tier,
              description: point.description,
              mission: point.mission
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
            12
          ],
          'circle-color': [
            'case',
            ['==', ['get', 'type'], 'mass_spectrometry'], '#ef4444',
            ['==', ['get', 'type'], 'photographic'], '#3b82f6',
            ['==', ['get', 'type'], 'thermal_analysis'], '#f59e0b',
            ['==', ['get', 'type'], 'seismic_data'], '#8b5cf6',
            ['==', ['get', 'type'], 'gravimeter_data'], '#06b6d4',
            ['==', ['get', 'type'], 'dust_analysis'], '#22c55e',
            ['==', ['get', 'type'], 'soil_analysis'], '#eab308',
            '#6b7280'
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });

      // Add click handler
      map.current.on('click', 'lunar-data-circles', (e) => {
        if (e.features && e.features[0]) {
          const feature = e.features[0];
          const point = lunarMissionData.find(p => p.id === feature.properties?.id);
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
      searchMarker.current?.remove();
      map.current?.remove();
    };
  }, []);

  // Handle LROC NAC layer visibility
  useEffect(() => {
    if (map.current && map.current.getLayer('lroc-nac-layer')) {
      map.current.setLayoutProperty(
        'lroc-nac-layer',
        'visibility',
        lrocNacVisible ? 'visible' : 'none'
      );
    }
  }, [lrocNacVisible]);

  const handleCoordinateSearch = () => {
    const lat = parseFloat(searchLat);
    const lng = parseFloat(searchLng);

    if (isNaN(lat) || isNaN(lng)) return;
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return;

    if (map.current) {
      searchMarker.current?.remove();
      searchMarker.current = new mapboxgl.Marker({ color: '#22c55e' })
        .setLngLat([lng, lat])
        .addTo(map.current);

      map.current.flyTo({
        center: [lng, lat],
        zoom: 6,
        duration: 2000
      });
    }
  };

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Controls Panel */}
      <Card className="absolute top-4 left-4 w-80 bg-background/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Box className="h-5 w-5" />
            LROC Quickmap Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Coordinate Search */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Coordinate Search</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Latitude"
                value={searchLat}
                onChange={(e) => setSearchLat(e.target.value)}
                className="h-8"
              />
              <Input
                placeholder="Longitude"
                value={searchLng}
                onChange={(e) => setSearchLng(e.target.value)}
                className="h-8"
              />
            </div>
            <Button onClick={handleCoordinateSearch} size="sm" className="w-full">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>

          {/* Layer Controls */}
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => setShowLayers(!showLayers)}
            >
              <Layers className="mr-2 h-4 w-4" />
              Data Layers
            </Button>
            
            {showLayers && (
              <div className="space-y-2 pl-2 border-l-2 border-primary/20">
                <div className="flex items-center justify-between">
                  <Label htmlFor="lroc-wac" className="text-xs">LROC WAC Global</Label>
                  <Switch
                    id="lroc-wac"
                    checked={lrocWacVisible}
                    onCheckedChange={setLrocWacVisible}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="lroc-nac" className="text-xs">LROC NAC High-Res</Label>
                  <Switch
                    id="lroc-nac"
                    checked={lrocNacVisible}
                    onCheckedChange={setLrocNacVisible}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">PDS Mission Data</Label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                <span>Spectrometry</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#3b82f6]" />
                <span>Photography</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                <span>Thermal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#8b5cf6]" />
                <span>Seismic</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#06b6d4]" />
                <span>Gravimeter</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
                <span>Dust</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#eab308]" />
                <span>Soil</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Point Info */}
      {selectedPoint && (
        <Card className="absolute bottom-4 right-4 w-96 bg-background/95 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">{selectedPoint.name}</CardTitle>
                {selectedPoint.mission && (
                  <Badge variant="outline" className="mt-1">
                    {selectedPoint.mission}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPoint(null)}
              >
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              {selectedPoint.description}
            </p>
            <div className="flex gap-2">
              <Badge>{selectedPoint.type.replace('_', ' ')}</Badge>
              <Badge variant="secondary">{selectedPoint.tier}</Badge>
            </div>
            {selectedPoint.dataUrl && (
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-3"
                onClick={() => window.open(selectedPoint.dataUrl, '_blank')}
              >
                View PDS Data
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuickmapGlobe;
