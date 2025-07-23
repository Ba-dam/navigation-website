import React, { useState } from "react";
import { Map, Satellite, Moon, Sun, Building, Navigation } from "lucide-react";

import { useMap } from "../../context/map-context";
import { Button } from "../ui/button";

const mapStyles = [
  {
    id: "streets",
    name: "Streets",
    icon: Map,
    style: "mapbox://styles/mapbox/streets-v12"
  },
  {
    id: "standard",
    name: "Standard Light",
    icon: Sun,
    style: "mapbox://styles/mapbox/standard"
  },
  {
    id: "satellite",
    name: "Satellite",
    icon: Satellite,
    style: "mapbox://styles/mapbox/satellite-v9"
  },
  {
    id: "satellite-streets",
    name: "Satellite Streets",
    icon: Building,
    style: "mapbox://styles/mapbox/satellite-streets-v12"
  },
  {
    id: "standard-dark",
    name: "Standard Dark",
    icon: Moon,
    style: "mapbox://styles/mapbox/dark-v11"
  }
];

export default function MapStyles() {
  const { map } = useMap();
  const [activeStyle, setActiveStyle] = useState("streets");
  const [isOpen, setIsOpen] = useState(false);

  const handleStyleChange = (styleId, styleUrl) => {
    if (map && styleId !== activeStyle) {
      map.setStyle(styleUrl);
      setActiveStyle(styleId);
      setIsOpen(false);
    }
  };

  return (
    <div className="absolute bottom-8 right-20 z-10">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="p-2"
        >
          <Map className="w-5 h-5" />
        </Button>

        {/* Style Options */}
        {isOpen && (
          <div className="absolute bottom-full mb-1 right-0 bg-white rounded-lg shadow-lg border border-gray-200 min-w-48 py-2">
            {mapStyles.map((style) => {
              const IconComponent = style.icon;
              const isActive = activeStyle === style.id;
              
              return (
                <button
                  key={style.id}
                  onClick={() => handleStyleChange(style.id, style.style)}
                  className={`w-full flex items-center px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 mr-3 ${
                    isActive ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                  <span className="font-medium">{style.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[-1]" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}