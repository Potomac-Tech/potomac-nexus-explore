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
import lunarMapImage from './LunarMap.png';

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
  // Surveyor Mission Data Points
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
  // Chang'e Mission Data Points
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

const LunarMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);
  const [searchLat, setSearchLat] = useState('');
  const [searchLng, setSearchLng] = useState('');
  const [showLayers, setShowLayers] = useState(false);
  const [psrLayerVisible, setPsrLayerVisible] = useState(false);
  const [spectrographLayerVisible, setSpectrographLayerVisible] = useState(false);
  const searchMarker = useRef<mapboxgl.Marker | null>(null);
  const usingFallback = useRef(false);

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
              'https://s3.amazonaws.com/opmbuilder/301_moon/tiles/w/hillshaded-albedo/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            minzoom: 0,
            maxzoom: 10,
            attribution: 'Imagery: OPM Moon Hillshaded Albedo — OpenPlanetaryMap'
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

    // Add error logging
    map.current.on('error', (e) => {
      const err: any = (e as any)?.error || e;
      const msg = String(err?.message || '');
      // Surface tile/CORS/projection issues in console
      console.error('Mapbox error:', err);
      // Auto-switch to NASA Trek fallback if primary WMS tiles fail
      if (!usingFallback.current && /(opmbuilder|hillshaded-albedo|wms\.im-ldi\.com|GetMap|CORS|NetworkError)/i.test(msg)) {
        try {
          if (map.current?.getLayer('moon-surface-fallback')) {
            map.current.setLayoutProperty('moon-surface', 'visibility', 'none');
            map.current.setLayoutProperty('moon-surface-fallback', 'visibility', 'visible');
            usingFallback.current = true;
            console.warn('Primary tiles failed; switched to NASA Trek fallback.');
          }
        } catch (err2) {
          console.warn('Fallback switch error:', err2);
        }
      }
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
          features: lunarMissionData.map(point => ({
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
            ['==', ['get', 'type'], 'soil_analysis'], '#eab308', // Yellow for soil analysis
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

      // Add PSR layer (Permanently Shadowed Regions)
      map.current.addSource('psr-layer', {
        type: 'raster',
        tiles: [
          'https://trek.nasa.gov/tiles/Moon/EQ/LRO_LOLA_Shade_Global_256ppd/1.0.0/default/default028mm/{z}/{y}/{x}.jpg'
        ],
        tileSize: 256,
        scheme: 'tms'
      });

      map.current.addLayer({
        id: 'psr-overlay',
        type: 'raster',
        source: 'psr-layer',
        paint: {
          'raster-opacity': 0.6
        },
        layout: {
          visibility: 'none'
        }
      });

      // Add Spectrograph layer (M3 data from LRO)
      map.current.addSource('spectrograph-layer', {
        type: 'raster',
        tiles: [
          'https://trek.nasa.gov/tiles/Moon/EQ/LRO_LOLA_ClrShade_Global_128ppd_v04/1.0.0/default/default028mm/{z}/{y}/{x}.jpg'
        ],
        tileSize: 256,
        scheme: 'tms'
      });

      map.current.addLayer({
        id: 'spectrograph-overlay',
        type: 'raster',
        source: 'spectrograph-layer',
        paint: {
          'raster-opacity': 0.7
        },
        layout: {
          visibility: 'none'
        }
      });

      // Add fallback NASA Trek WAC base (used if OPM fails)
      map.current.addSource('moon-tiles-fallback', {
        type: 'raster',
        tiles: [
          'https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd/1.0.0/default/default028mm/{z}/{y}/{x}.jpg'
        ],
        tileSize: 256,
        minzoom: 0,
        maxzoom: 8
      });
      map.current.addLayer({
        id: 'moon-surface-fallback',
        type: 'raster',
        source: 'moon-tiles-fallback',
        paint: { 'raster-opacity': 1 },
        layout: { visibility: 'none' }
      }, 'lunar-data-circles');
      
    });

    return () => {
      searchMarker.current?.remove();
      map.current?.remove();
    };
  }, []);

  // Handle PSR layer visibility
  useEffect(() => {
    if (map.current && map.current.getLayer('psr-overlay')) {
      map.current.setLayoutProperty(
        'psr-overlay',
        'visibility',
        psrLayerVisible ? 'visible' : 'none'
      );
    }
  }, [psrLayerVisible]);

  // Handle Spectrograph layer visibility
  useEffect(() => {
    if (map.current && map.current.getLayer('spectrograph-overlay')) {
      map.current.setLayoutProperty(
        'spectrograph-overlay',
        'visibility',
        spectrographLayerVisible ? 'visible' : 'none'
      );
    }
  }, [spectrographLayerVisible]);

  const handleCoordinateSearch = () => {
    const lat = parseFloat(searchLat);
    const lng = parseFloat(searchLng);

    if (isNaN(lat) || isNaN(lng)) {
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return;
    }

    if (map.current) {
      // Remove previous marker if exists
      searchMarker.current?.remove();

      // Add new marker
      searchMarker.current = new mapboxgl.Marker({ color: '#22c55e' })
        .setLngLat([lng, lat])
        .addTo(map.current);

      // Fly to location
      map.current.flyTo({
        center: [lng, lat],
        zoom: 6,
        duration: 2000
      });
    }
  };

  const getDataTypeColor = (type: string) => {
    switch (type) {
      case 'mass_spectrometry': return 'bg-red-500';
      case 'photographic': return 'bg-blue-500';
      case 'thermal_analysis': return 'bg-amber-500';
      case 'seismic_data': return 'bg-purple-500';
      case 'gravimeter_data': return 'bg-cyan-500';
      case 'dust_analysis': return 'bg-green-500';
      case 'soil_analysis': return 'bg-yellow-500';
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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
    {/* <div className="relative w-full h-screen"> */}
      {/* <div ref={mapContainer} className="absolute inset-0" /> */}
      <Label style={{ fontSize: '24px', padding: '10px' }}>Lunar Map Example Design:</Label>
      <img src={lunarMapImage} alt="Application Logo" style={{ height: '90%', width: '90%'}}/>
      
      {/* Coordinate Search Panel */}
      {/* <Card className="absolute top-4 left-4 w-80 z-10">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search by Coordinates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="lat" className="text-xs">Latitude</Label>
              <Input
                id="lat"
                type="number"
                placeholder="-90 to 90"
                value={searchLat}
                onChange={(e) => setSearchLat(e.target.value)}
                className="h-8"
              />
            </div>
            <div>
              <Label htmlFor="lng" className="text-xs">Longitude</Label>
              <Input
                id="lng"
                type="number"
                placeholder="-180 to 180"
                value={searchLng}
                onChange={(e) => setSearchLng(e.target.value)}
                className="h-8"
              />
            </div>
          </div>
          <Button 
            onClick={handleCoordinateSearch} 
            className="w-full h-8"
            size="sm"
          >
            Search Location
          </Button>
        </CardContent>
      </Card> */}

      {/* Layers Control Panel */}
      {/* <Card className="absolute top-4 right-4 w-72 z-10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Map Layers
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLayers(!showLayers)}
              className="h-6 px-2"
            >
              {showLayers ? '−' : '+'}
            </Button>
          </div>
        </CardHeader>
        {showLayers && (
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="psr-layer" className="text-sm">
                Permanently Shadowed Regions
              </Label>
              <Switch
                id="psr-layer"
                checked={psrLayerVisible}
                onCheckedChange={setPsrLayerVisible}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="spectrograph-layer" className="text-sm">
                Orbital Spectrograph Maps
              </Label>
              <Switch
                id="spectrograph-layer"
                checked={spectrographLayerVisible}
                onCheckedChange={setSpectrographLayerVisible}
              />
            </div>
          </CardContent>
        )}
      </Card> */}
      
      {/* Data Point Details Panel */}
      {/* {selectedPoint && (
        <Card className="absolute top-56 left-4 w-80 z-10">
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
      )} */}

      {/* Legend */}
      {/* <Card className="absolute bottom-4 right-4 z-10">
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
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span className="text-sm">Soil Analysis</span>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default LunarMap;