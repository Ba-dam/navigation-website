import React from "react";
import { useMap } from "../../context/map-context";
import MapStylesDetailed from "./map-styles-detailed";

export default function MapStylesWrapper({ currentStyle, onStyleChange }) {
  const { map } = useMap();
  
  return (
    <MapStylesDetailed 
      currentStyle={currentStyle}
      onStyleChange={onStyleChange}
      map={map}
    />
  );
}