import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { Trash2, Check, ArrowLeft, Pentagon } from "lucide-react";

import MapProvider from "../lib/mapbox/provider";
import MapSearch from "../components/map/map-search";
import MapControls from "../components/map/map-controls";
import MapStyles from "../components/map/map-styles";
import { Button } from "../components/ui/button";
import { getBoundingBoxFromPolygon, formatCoordinates } from "../lib/mapbox/utils";

export default function SiteLocationSelector() {
  const navigate = useNavigate();
  const mapContainerRef = useRef(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [drawInstance, setDrawInstance] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [areaInfo, setAreaInfo] = useState(null);

  // Calculate polygon area using Shoelace formula (returns area in km²)
  const calculatePolygonArea = (coordinates) => {
    if (!coordinates || !coordinates[0] || coordinates[0].length < 3) return 0;
    
    const ring = coordinates[0]; // Get outer ring
    let area = 0;
    
    // Shoelace formula for geographic coordinates
    for (let i = 0; i < ring.length - 1; i++) {
      const [x1, y1] = ring[i];
      const [x2, y2] = ring[i + 1];
      area += (x1 * y2) - (x2 * y1);
    }
    
    area = Math.abs(area) / 2;
    
    // Convert from degrees squared to km²
    // Rough approximation: 1 degree ≈ 111 km
    const kmSquared = area * (111 * 111);
    
    return kmSquared.toFixed(4);
  };

  const handleMapLoad = (map) => {
    if (!map) return;

    // Initialize Mapbox Draw
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {},
      styles: [
        // Polygon fill
        {
          id: "gl-draw-polygon-fill-inactive",
          type: "fill",
          filter: ["all", ["==", "active", "false"], ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
          paint: {
            "fill-color": "#3b82f6",
            "fill-outline-color": "#3b82f6",
            "fill-opacity": 0.1,
          },
        },
        // Polygon stroke
        {
          id: "gl-draw-polygon-stroke-inactive",
          type: "line",
          filter: ["all", ["==", "active", "false"], ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
          layout: {
            "line-cap": "round",
            "line-join": "round",
          },
          paint: {
            "line-color": "#3b82f6",
            "line-width": 3,
          },
        },
        // Active polygon fill
        {
          id: "gl-draw-polygon-fill-active",
          type: "fill",
          filter: ["all", ["==", "active", "true"], ["==", "$type", "Polygon"]],
          paint: {
            "fill-color": "#059669",
            "fill-outline-color": "#059669",
            "fill-opacity": 0.1,
          },
        },
        // Active polygon stroke
        {
          id: "gl-draw-polygon-stroke-active",
          type: "line",
          filter: ["all", ["==", "active", "true"], ["==", "$type", "Polygon"]],
          layout: {
            "line-cap": "round",
            "line-join": "round",
          },
          paint: {
            "line-color": "#059669",
            "line-width": 3,
          },
        },
        // Vertices
        {
          id: "gl-draw-polygon-and-line-vertex-halo-active",
          type: "circle",
          filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
          paint: {
            "circle-radius": 6,
            "circle-color": "#FFF",
          },
        },
        {
          id: "gl-draw-polygon-and-line-vertex-active",
          type: "circle",
          filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
          paint: {
            "circle-radius": 3,
            "circle-color": "#059669",
          },
        },
      ],
    });

    map.addControl(draw);
    setDrawInstance(draw);

    // Listen for draw events
    map.on("draw.create", (e) => {
      const feature = e.features[0];
      handleAreaSelection(feature, draw);
    });

    map.on("draw.update", (e) => {
      const feature = e.features[0];
      handleAreaSelection(feature, draw);
    });

    map.on("draw.delete", () => {
      setSelectedArea(null);
      setCoordinates(null);
      setAreaInfo(null);
    });
  };

  const handleAreaSelection = (feature, draw) => {
    if (feature && feature.geometry) {
      setSelectedArea(feature);
      
      const coords = feature.geometry.coordinates;
      setCoordinates(coords);
      
      // Console logging for coordinate validation
      console.log("🎯 SELECTED AREA COORDINATES:");
      console.log("Raw coordinates:", coords);
      console.log("Geometry type:", feature.geometry.type);
      console.log("Feature ID:", feature.id);
      
      // Format coordinates as JSON with point numbering
      const polygonPoints = coords[0]; // Get outer ring coordinates
      const formattedPoints = {};
      
      polygonPoints.forEach((point, index) => {
        // Skip the last point if it's the same as the first (closing point)
        if (index === polygonPoints.length - 1 && 
            point[0] === polygonPoints[0][0] && 
            point[1] === polygonPoints[0][1]) {
          return;
        }
        
        formattedPoints[`point-${index + 1}`] = {
          longitude: point[0],
          latitude: point[1],
          coordinates: [point[0], point[1]]
        };
      });
      
      // Calculate area before creating JSON
      const calculatedArea = calculatePolygonArea(coords);
      
      const polygonJSON = {
        polygon_info: {
          total_points: Object.keys(formattedPoints).length,
          geometry_type: feature.geometry.type,
          area_km2: calculatedArea,
          created_at: new Date().toISOString()
        },
        points: formattedPoints
      };
      
      console.log("📋 POLYGON COORDINATES IN JSON FORMAT:");
      console.log(JSON.stringify(polygonJSON, null, 2));
      
      console.log("📐 POLYGON AREA:", `${calculatedArea} km²`);
      
      // Calculate bounding box and area info
      const boundingBox = getBoundingBoxFromPolygon(coords);
      if (boundingBox) {
        console.log("📍 BOUNDING BOX CALCULATED:");
        console.log("Southwest corner:", boundingBox.southwest);
        console.log("Northeast corner:", boundingBox.northeast);
        console.log("Center point:", boundingBox.center);
        console.log("Bounding box dimensions:", {
          width: boundingBox.northeast[0] - boundingBox.southwest[0],
          height: boundingBox.northeast[1] - boundingBox.southwest[1]
        });
        
        setAreaInfo({
          boundingBox,
          center: boundingBox.center,
          coordinates: coords,
          type: feature.geometry.type,
          polygonJSON: polygonJSON, // Store the formatted JSON
          area: calculatedArea // Store the calculated area
        });
      }
    }
  };


  const startPolygonDrawing = () => {
    if (drawInstance) {
      drawInstance.deleteAll();
      drawInstance.changeMode("draw_polygon");
    }
  };

  const clearDrawing = () => {
    if (drawInstance) {
      drawInstance.deleteAll();
      setSelectedArea(null);
      setCoordinates(null);
      setAreaInfo(null);
    }
  };

  const proceedToDetailEditor = () => {
    if (areaInfo) {
      console.log("🚀 PROCEEDING TO DETAILED MAP EDITOR:");
      console.log("Site coordinates being passed:", areaInfo.coordinates);
      console.log("Bounding box being passed:", areaInfo.boundingBox);
      console.log("Center being passed:", areaInfo.center);
      console.log("Geometry type being passed:", areaInfo.type);
      console.log("Complete navigation state:", {
        siteCoordinates: areaInfo.coordinates,
        boundingBox: areaInfo.boundingBox,
        center: areaInfo.center,
        type: areaInfo.type
      });
      
      // Navigate to detailed map editor with coordinates
      navigate("/detailed-map-editor", {
        state: {
          siteCoordinates: areaInfo.coordinates,
          boundingBox: areaInfo.boundingBox,
          center: areaInfo.center,
          type: areaInfo.type
        }
      });
    }
  };


  return (
    <div className="w-screen h-screen relative">
      {/* Map Container */}
      <div
        id="map-container"
        ref={mapContainerRef}
        className="absolute inset-0 h-full w-full"
      />

      <MapProvider
        mapContainerRef={mapContainerRef}
        initialViewState={{
          longitude: 77.2090, // Delhi, India
          latitude: 28.6139,
          zoom: 12,
        }}
        onMapLoad={handleMapLoad}
      >
        <MapSearch />
        <MapControls />
        <MapStyles />
      </MapProvider>

      {/* Back Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/create-map")}
        className="absolute top-4 right-4 z-10 bg-white shadow-lg"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* Drawing Tools */}
      <div className="absolute top-20 right-4 z-10 bg-white rounded-lg shadow-lg p-3 space-y-2">
        <div className="text-xs font-medium text-gray-600 mb-2">Drawing Tools</div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={startPolygonDrawing}
          className="w-full justify-start"
        >
          <Pentagon className="w-4 h-4 mr-2" />
          Draw Polygon
        </Button>
        
        {selectedArea && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearDrawing}
            className="w-full justify-start text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-20 left-4 z-10 bg-white rounded-lg shadow-lg p-4 max-w-md">
        <h3 className="font-semibold text-gray-900 mb-2">Select Factory Area</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>1. Search for your factory location</p>
          <p>2. Use drawing tools to outline the factory area</p>
          <p>3. Click "Proceed" to start mapping internal details</p>
        </div>
      </div>

      {/* Area Information Panel */}
      {areaInfo && (
        <div className="absolute bottom-4 right-4 z-10 bg-white rounded-lg shadow-lg p-4 min-w-72">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Selected Area</h3>
            <Button
              size="sm"
              onClick={proceedToDetailEditor}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="w-4 h-4 mr-2" />
              Proceed
            </Button>
          </div>
          
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-600">Points: </span>
              <span className="text-gray-900">{areaInfo.polygonJSON?.polygon_info.total_points || 0}</span>
            </div>
            
            <div>
              <span className="font-medium text-gray-600">Area: </span>
              <span className="text-gray-900">{areaInfo.area ? `${areaInfo.area} km²` : 'Calculating...'}</span>
            </div>
            
            <div>
              <span className="font-medium text-gray-600">Shape: </span>
              <span className="text-gray-900 capitalize">{areaInfo.type}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}