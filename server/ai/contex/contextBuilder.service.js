// Step 1: Build the LLM context from retrieved cars
export const buildContext = (cars = []) => {
  if (!cars.length) {
    return "No matching cars were found.";
  }

  // Step 2: Convert every car into a readable block
  return cars
    .map((car, index) => {
      return `
Car ${index + 1}

ID: ${car._id}

Title: ${car.title}

Brand: ${car.brand?.name ?? "Unknown"}

Variant: ${car.variant}

Manufacturing Year: ${car.year}

Price: ₹${Number(car.price).toLocaleString("en-IN")}

Fuel Type: ${car.fuelType}

Transmission: ${car.transmission}

Drive Type: ${car.driveType}

Number of Gears: ${car.gears}

Owner Count: ${car.ownerCount}

Kilometers Driven: ${Number(car.kmDriven).toLocaleString("en-IN")} km

Location:
City: ${car.location?.city}
State: ${car.location?.state}

Status: ${car.lifecycleStatus}

Features:
${
  car.features?.length
    ? car.features.map((feature) => `- ${feature}`).join("\n")
    : "None"
}
`;
    })
    .join("\n------------------------------------------\n");
};