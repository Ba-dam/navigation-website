import React from "react";
import { Plus, Minus } from "lucide-react";

import { useMap } from "../../context/map-context";
import { Button } from "../ui/button";

export default function MapControls() {
  const { map } = useMap();

  const zoomIn = () => {
    map?.zoomIn();
  };

  const zoomOut = () => {
    map?.zoomOut();
  };

  return (
    <aside className="absolute bottom-8 right-4 z-10 bg-white p-2 rounded-lg shadow-lg flex flex-col gap-2">
      <Button variant="ghost" size="icon" onClick={zoomIn}>
        <Plus className="w-5 h-5" />
        <span className="sr-only">Zoom in</span>
      </Button>
      <Button variant="ghost" size="icon" onClick={zoomOut}>
        <Minus className="w-5 h-5" />
        <span className="sr-only">Zoom out</span>
      </Button>
    </aside>
  );
}