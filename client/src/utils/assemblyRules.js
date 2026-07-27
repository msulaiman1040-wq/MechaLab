export const ASSEMBLY_SEQUENCE = [
  { id: "brake-fl", name: "Front Left Brake & Caliper", prerequisites: [] },
  { id: "brake-fr", name: "Front Right Brake & Caliper", prerequisites: [] },
  { id: "brake-rl", name: "Rear Left Brake & Caliper", prerequisites: [] },
  { id: "brake-rr", name: "Rear Right Brake & Caliper", prerequisites: [] },
  { id: "front-left-wheel", name: "Front Left Tire", prerequisites: ["brake-fl"] },
  { id: "front-right-wheel", name: "Front Right Tire", prerequisites: ["brake-fr"] },
  { id: "rear-left-wheel", name: "Rear Left Tire", prerequisites: ["brake-rl"] },
  { id: "rear-right-wheel", name: "Rear Right Tire", prerequisites: ["brake-rr"] },
  { id: "body", name: "Vehicle Body", prerequisites: ["brake-fl", "brake-fr", "brake-rl", "brake-rr", "front-left-wheel", "front-right-wheel", "rear-left-wheel", "rear-right-wheel"] },
  { id: "engine", name: "Engine & Transmission System", prerequisites: [] },
  { id: "gear-box", name: "Gear Box", prerequisites: ["engine"] },
  { id: "exhaust-pipe", name: "Exhaust Pipe", prerequisites: ["engine"] },
  { id: "radiator", name: "Radiator", prerequisites: ["engine"] },
  { id: "fuel-tank", name: "Fuel Tank", prerequisites: [] },
  { id: "battery", name: "Battery", prerequisites: [] },
  { id: "steering-wheel", name: "Steering Components", prerequisites: ["body"] },
  { id: "pedals", name: "Accelerator & Brake Pedals", prerequisites: ["body"] },
  { id: "left-seat", name: "Left Seat", prerequisites: ["body"] },
  { id: "right-seat", name: "Right Seat", prerequisites: ["body"] },
  { id: "rear-seat", name: "Rear Seat", prerequisites: ["body"] },
  { id: "left-fender", name: "Left Fender", prerequisites: ["body", "front-left-wheel"] },
  { id: "right-fender", name: "Right Fender", prerequisites: ["body", "front-right-wheel"] }
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