export function getVehicleParts(scene) {

  const parts = {

    chassis: scene.getObjectByName("chassis_and_suspension001"),

    engine: scene.getObjectByName("engine_and_transmission_system001"),

    body: scene.getObjectByName("body001"),

    battery: scene.getObjectByName("battery001"),

    radiator: scene.getObjectByName("radiator001"),

    fuelTank: scene.getObjectByName("fuel_tank001"),

    gearBox: scene.getObjectByName("gear_box001"),

    steering: scene.getObjectByName("steering_wheel001"),

    pedals: scene.getObjectByName("brake_and_accelerator_pedals001"),

    frontLeftWheel: scene.getObjectByName("front_left_tire003"),

    frontRightWheel: scene.getObjectByName("front_right_tire001"),

    rearLeftWheel: scene.getObjectByName("reer_right_tire004"),

    rearRightWheel: scene.getObjectByName("reer_right_tire002"),

    leftSeat: scene.getObjectByName("left_seat001"),

    rightSeat: scene.getObjectByName("right_seat001"),

    rearSeat: scene.getObjectByName("reer_seat001"),

    leftFender: scene.getObjectByName("left_fender001"),

    rightFender: scene.getObjectByName("right_fender001"),

    exhaust: scene.getObjectByName("exhaust_pipe001"),

    brakeFL: scene.getObjectByName("brakedisk_and_calliper_front_left001"),

    brakeFR: scene.getObjectByName("brakedisk_and_calliper_front_right001"),

    brakeRL: scene.getObjectByName("brakedisk_and_calliper_reer_left001"),

    brakeRR: scene.getObjectByName("brakedisk_and_calliper_reer_right001"),

  };


  // ---------- Assign Raycaster IDs ----------

  if (parts.engine) parts.engine.userData.partId = "engine";

  if (parts.body) parts.body.userData.partId = "body";

  if (parts.battery) parts.battery.userData.partId = "battery";

  if (parts.radiator) parts.radiator.userData.partId = "radiator";

  if (parts.fuelTank) parts.fuelTank.userData.partId = "fuel-tank";

  if (parts.gearBox) parts.gearBox.userData.partId = "gear-box";

  if (parts.steering) parts.steering.userData.partId = "steering-wheel";

  if (parts.pedals) parts.pedals.userData.partId = "pedals";

  if (parts.leftSeat) parts.leftSeat.userData.partId = "front-seat";

  if (parts.rightSeat) parts.rightSeat.userData.partId = "front-seat";

  if (parts.rearSeat) parts.rearSeat.userData.partId = "rear-seat";

  if (parts.leftFender) parts.leftFender.userData.partId = "fender";

  if (parts.rightFender) parts.rightFender.userData.partId = "fender";

  if (parts.exhaust) parts.exhaust.userData.partId = "exhaust-pipe";

  if (parts.frontLeftWheel) parts.frontLeftWheel.userData.partId = "tire";

  if (parts.frontRightWheel) parts.frontRightWheel.userData.partId = "tire";

  if (parts.rearLeftWheel) parts.rearLeftWheel.userData.partId = "tire";

  if (parts.rearRightWheel) parts.rearRightWheel.userData.partId = "tire";

  if (parts.brakeFL) parts.brakeFL.userData.partId = "brake-disc-caliper";

  if (parts.brakeFR) parts.brakeFR.userData.partId = "brake-disc-caliper";

  if (parts.brakeRL) parts.brakeRL.userData.partId = "brake-disc-caliper";

  if (parts.brakeRR) parts.brakeRR.userData.partId = "brake-disc-caliper";


  return parts;

}