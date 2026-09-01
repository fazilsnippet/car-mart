// Step 1: Build normalized metadata for Chroma filtering
export const buildCarMetadata = (car) => ({
  mongoId: car._id.toString(),

  brand: car.brand?.name?.trim().toLowerCase() ?? "",

  year: car.year,

  fuelType: car.fuelType?.trim().toLowerCase() ?? "",

  transmission: car.transmission?.trim().toLowerCase() ?? "",

  driveType: car.driveType?.trim().toLowerCase() ?? "",

  city: car.location?.city?.trim().toLowerCase() ?? "",

  state: car.location?.state?.trim().toLowerCase() ?? "",

  lifecycleStatus: car.lifecycleStatus?.trim().toLowerCase() ?? "",

  ownerCount: car.ownerCount,

  price: car.price,
});