// Step 1: Convert a car into a semantic search document
export const buildCarDocument = (car) => {
  const transmissionMap = {
    MT: "Manual",
    AT: "Automatic",
    CVT: "Continuously Variable Transmission",
    DCT: "Dual Clutch Transmission",
    AMT: "Automated Manual Transmission",
    IMT: "Intelligent Manual Transmission",
    "E-CVT": "Electronic Continuously Variable Transmission",
    "SINGLE-SPEED": "Single Speed",
    OTHERS: "Other",
  };

  const ownerMap = {
    1: "First Owner",
    2: "Second Owner",
    3: "Third Owner",
    4: "Fourth Owner",
  };

  const lines = [];

  // Step 2: Add basic information
  lines.push(`Title: ${car.title}`);
  lines.push(`Brand: ${car.brand?.name ?? "Unknown"}`);
  lines.push(`Variant: ${car.variant}`);
  lines.push(`Manufacturing Year: ${car.year}`);

  // Step 3: Add specifications
  lines.push(`Price: ₹${Number(car.price).toLocaleString("en-IN")}`);
  lines.push(`Fuel Type: ${car.fuelType}`);
  lines.push(
    `Transmission: ${
      transmissionMap[car.transmission] ?? car.transmission ?? "Unknown"
    }`
  );
  lines.push(`Drive Type: ${car.driveType ?? "Unknown"}`);
  lines.push(`Number of Gears: ${car.gears ?? "Unknown"}`);

  // Step 4: Add ownership and usage
  lines.push(
    `Ownership: ${ownerMap[car.ownerCount] ?? `${car.ownerCount} Owners`}`
  );
  lines.push(
    `Kilometers Driven: ${Number(car.kmDriven).toLocaleString("en-IN")} km`
  );

  // Step 5: Add location
  lines.push(`City: ${car.location?.city ?? "Unknown"}`);
  lines.push(`State: ${car.location?.state ?? "Unknown"}`);

  // Step 6: Add vehicle features
  if (Array.isArray(car.features) && car.features.length > 0) {
    lines.push("Features:");
    car.features.forEach((feature) => {
      lines.push(`- ${feature}`);
    });
  }

  // Step 7: Add availability
  lines.push(`Availability Status: ${car.lifecycleStatus}`);

  // Step 8: Return the semantic document
  return lines.join("\n");
};