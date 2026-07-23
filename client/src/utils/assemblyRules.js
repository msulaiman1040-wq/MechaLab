export const ASSEMBLY_SEQUENCE = [

  { id: "brake-disc-caliper", name: "Brake Systems (Discs & Calipers)", prerequisites: [] },

  { id: "tire", name: "Tires", prerequisites: ["brake-disc-caliper"] },

  { id: "body", name: "Vehicle Body", prerequisites: ["brake-disc-caliper", "tire"] },

  { id: "engine", name: "Engine & Transmission System", prerequisites: ["body"] },

  { id: "gear-box", name: "Gear Box", prerequisites: ["engine"] },

  { id: "exhaust-pipe", name: "Exhaust Pipe", prerequisites: ["engine"] },

  { id: "radiator", name: "Radiator", prerequisites: ["engine"] },

  { id: "fuel-tank", name: "Fuel Tank", prerequisites: ["body"] },

  { id: "battery", name: "Battery", prerequisites: ["body"] },

  { id: "steering-wheel", name: "Steering Components", prerequisites: ["body"] },

  { id: "pedals", name: "Accelerator & Brake Pedals", prerequisites: ["body"] },

  { id: "front-seat", name: "Seats (Front)", prerequisites: ["body"] },

  { id: "rear-seat", name: "Seats (Rear)", prerequisites: ["body"] },

  { id: "fender", name: "Fenders", prerequisites: ["body", "tire"] }

];

export function validatePartPlacement(
  partId,
  installedParts,
  visited = new Set()
) {

  const rule = ASSEMBLY_SEQUENCE.find(p => p.id === partId);

  if (!rule)
    return { valid: true };

  if (visited.has(partId))
    return { valid: true };

  visited.add(partId);

  for (const prerequisite of rule.prerequisites) {

    // Check count instead of array
    if ((installedParts[prerequisite] || 0) <= 0) {

      const prerequisiteRule = ASSEMBLY_SEQUENCE.find(
        p => p.id === prerequisite
      );

      return {

        valid: false,

        explanation: `You should install the ${
          prerequisiteRule?.name || prerequisite
        } first.`

      };

    }

    const prerequisiteValidation = validatePartPlacement(

      prerequisite,

      installedParts,

      visited

    );

    if (!prerequisiteValidation.valid) {

      return {

        valid: false,

        explanation: prerequisiteValidation.explanation

      };

    }

  }

  return {

    valid: true

  };

}