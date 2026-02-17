import Joi from "joi";

// export const createSchema = Joi.object({
//   title: Joi.string().trim().required(),
//   brand: Joi.string().hex().length(24).required(),
//   varients: Joi.string().required(),
//   year: Joi.number().required(),
//   price: Joi.number().required(),
//   kmDriven: Joi.number().required(),
//   fuelType: Joi.string().valid("Petrol", "Diesel", "Electric", "Hybrid", "CNG", "LPG", "Other").required(),
//   transmission: Joi.string().valid("MT", "AT", "CVT", "DCT", "AMT", "IMT", "E-CVT", "SINGLE-SPEED", "OTHERS").required(),
//   gears: Joi.number(),
//   driveType: Joi.string().valid("FWD", "RWD", "AWD", "4WD"),
//   ownerCount: Joi.number().integer().min(1).max(10),
//   location: Joi.object({
//     city: Joi.string(),
//     state: Joi.string()
//   }),
//   features: Joi.array().items(Joi.string())
// });

export const querySchema = Joi.object({
  title: Joi.string().trim(),

  brand: Joi.string().hex().length(24),

  fuelType: Joi.alternatives().try(
    Joi.string(),
    Joi.array().items(
      Joi.string().valid(
        "Petrol","Diesel","Electric","Hybrid","CNG","LPG","Other"
      )
    )
  ),

  transmission: Joi.alternatives().try(
    Joi.string(),
    Joi.array().items(
      Joi.string().valid(
        "MT","AT","CVT","DCT","AMT","IMT","E-CVT","SINGLE-SPEED","OTHERS"
      )
    )
  ),

  varient: Joi.string(),

  ownerCount: Joi.number().integer().min(1).max(10),

  minYear: Joi.number().min(1950),
  maxYear: Joi.number().max(new Date().getFullYear()),

  minKm: Joi.number().min(0),
  maxKm: Joi.number().min(0),

  priceBucket: Joi.string().valid(
    "0-5",
    "5-10",
    "10-15",
    "15-20",
    "20+"
  ),

  sortBy: Joi.string().valid(
    "price","year","kmDriven","createdAt"
  ).default("createdAt"),

  order: Joi.string().valid("asc","desc").default("desc"),

  page: Joi.number().integer().min(1).default(1),

  limit: Joi.number().integer().min(1).max(50).default(12)
});

export const createSchema = Joi.object({
  title: Joi.string().required(),
  varient: Joi.string().required(),
  brand: Joi.string().hex().length(24).required(),
  year: Joi.number().min(1950).required(),
  price: Joi.number().min(0).required(),
  kmDriven: Joi.number().min(0).required(),
  fuelType: Joi.string().valid(
    "Petrol","Diesel","Electric","Hybrid","CNG","LPG","Other"
  ).required(),
  transmission: Joi.string().valid(
    "MT","AT","CVT","DCT","AMT","IMT","E-CVT","SINGLE-SPEED","OTHERS"
  ).required(),
  ownerCount: Joi.number().min(1).max(10),
  driveType: Joi.string().valid("FWD","RWD","AWD","4WD"),
  location: Joi.object({
    city: Joi.string(),
    state: Joi.string()
  })
});
  
  export const updateSchema = createSchema.fork(
    Object.keys(createSchema.describe().keys),
    (field) => field.optional()
  );