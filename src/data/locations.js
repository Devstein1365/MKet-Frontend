// ===================================
// MKET LOCATION DATA
// ===================================
// Hierarchical location structure for FUTMINNA marketplace
// Users first select campus area, then specific location

export const locationAreas = [
  {
    id: "off-campus",
    name: "Off-Campus",
    description: "Outside the main campus area",
  },
  {
    id: "inside-campus",
    name: "Inside Campus",
    description: "Within the main campus premises",
  },
  {
    id: "bosso",
    name: "Bosso",
    description: "Bosso area (far from main campus)",
    isDistant: true, // Mark as distant location
  },
];

export const specificLocations = {
  "off-campus": [
    { id: "perfect-touch", name: "Perfect Touch" },
    { id: "talba-junction", name: "Talba Junction" },
    { id: "mm-castle", name: "MM Castle" },
    { id: "comedy-store", name: "Comedy Store" },
    { id: "front-of-school-gate", name: "Front of School Gate" },
    { id: "kff", name: "KFF" },
  ],
  "inside-campus": [
    { id: "convo-square", name: "Convo Square" },
    { id: "bus-park", name: "Bus Park" },
    { id: "school-field", name: "School Field" },
    { id: "post-office", name: "Post Office" },
    { id: "library", name: "Library" },
    { id: "ultra-modern-market", name: "Ultra Modern Market" },
    { id: "lt2", name: "LT2" },
    { id: "school-clinic", name: "School Clinic" },
    { id: "common-room", name: "Common Room (Engine Complex)" },
  ],
  bosso: [
    { id: "bosso-main", name: "Bosso Main Area" },
    { id: "bosso-campus", name: "Bosso Campus" },
  ],
};

// Helper function to get all locations as flat array (for backward compatibility)
export const getAllLocationsFlat = () => {
  const allLocations = [];
  Object.keys(specificLocations).forEach((area) => {
    specificLocations[area].forEach((location) => {
      allLocations.push({
        ...location,
        area,
        fullName: `${location.name} (${locationAreas.find((a) => a.id === area)?.name})`,
      });
    });
  });
  return allLocations;
};

// Helper function to get location display name from IDs
export const getLocationDisplayName = (areaId, locationId) => {
  const area = locationAreas.find((a) => a.id === areaId);
  const location = specificLocations[areaId]?.find((l) => l.id === locationId);

  if (!area || !location) return "Location not specified";

  return `${location.name}, ${area.name}`;
};

// Helper to parse old location format (for migration)
export const migrateOldLocation = (oldLocation) => {
  // Map old location strings to new format
  const locationMapping = {
    "Bosso Campus": { area: "bosso", location: "bosso-campus" },
    "Gidan Kwano": { area: "off-campus", location: "mm-castle" }, // Closest match
    "Main Campus": { area: "inside-campus", location: "convo-square" }, // Default to central location
    Tunga: { area: "off-campus", location: "talba-junction" },
    "Minna Town": { area: "off-campus", location: "mm-castle" },
    Other: { area: "inside-campus", location: "post-office" },
  };

  return (
    locationMapping[oldLocation] || {
      area: "inside-campus",
      location: "convo-square",
    }
  );
};
