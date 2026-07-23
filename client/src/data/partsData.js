//partData.js
// Import all 14 part images
import engineImg from "../assets/parts/engine.png";
import bodyImg from "../assets/parts/body.png";
import batteryImg from "../assets/parts/battery.png";
import radiatorImg from "../assets/parts/radiator.png";
import fuelTankImg from "../assets/parts/fuel-tank.png";
import gearBoxImg from "../assets/parts/gear-box.png";
import steeringWheelImg from "../assets/parts/steering-wheel.png";
import pedalsImg from "../assets/parts/pedals.png";
import frontSeatImg from "../assets/parts/front-seat.png";
import rearSeatImg from "../assets/parts/rear-seat.png";
import fenderImg from "../assets/parts/fender.png";
import exhaustPipeImg from "../assets/parts/exhaust-pipe.png";
import tireImg from "../assets/parts/tire.png";
import brakeImg from "../assets/parts/brake-disc-caliper.png";

// ... the rest of your file remains exactly the same
export const partsData = [
  {
    id: "engine",
    title: "V8 Engine & Transmission System",
    subtitle: "Understanding the powertrain, internal combustion engine dynamics, and multi-ratio transmission power delivery.",
    image: engineImg,
    sections: [
      {
        title: "Overview",
        content: `The engine and transmission together form what automotive engineers call the powertrain. These two systems work as one cohesive unit to convert the chemical energy stored in fuel into useful mechanical energy that moves a vehicle. Inside MechaLab, the model combines both the V8 engine and its transmission because in a real vehicle these assemblies are bolted together before being installed onto the chassis. The V8 configuration consists of eight cylinders arranged in two banks of four forming the letter "V", providing smooth operation, excellent power delivery, and a distinctive exhaust note.`
      },
      {
        title: "History and Development",
        content: `In 1876, German engineer Nikolaus Otto developed the famous four-stroke engine cycle, which remains the foundation of most petrol engines today. The V8 engine itself became famous after Cadillac introduced one of the first mass-produced V8 passenger cars in 1914. Meanwhile, automatic transmissions entered large-scale production in 1939 through General Motors' Hydra-Matic transmission, later evolving into intelligent electronic systems capable of selecting optimal gear ratios in milliseconds.`
      },
      {
        title: "Major Components of the Engine",
        content: `Although this model appears as one assembly, it contains many individual mechanical systems. The engine includes the Cylinder Block, Cylinder Heads, Pistons, Connecting Rods, Crankshaft, Camshaft, Intake Manifold, Exhaust Manifold, Valves, Spark Plugs, Fuel Injection System, Lubrication System, and Cooling Passages.`
      },
      {
        title: "The Engine Block",
        content: `The engine block is often described as the backbone of the engine. It houses the cylinders where combustion takes place and provides mounting locations for nearly every major engine component. Modern engine blocks are commonly manufactured from cast iron or aluminium alloys to balance durability and weight reduction.`
      },
      {
        title: "Pistons and Connecting Rods",
        content: `Pistons are cylindrical components that move up and down inside the engine's cylinders, converting the force created during combustion into mechanical motion. Each piston connects to the crankshaft via a connecting rod, transferring explosive force into rotational energy.`
      },
      {
        title: "The Crankshaft",
        content: `The crankshaft converts the pistons' vertical motion into continuous rotational motion, which ultimately powers the transmission and the vehicle's drive wheels. Forged from extremely strong steel, it withstands enormous torsional forces while rotating thousands of times every minute.`
      },
      {
        title: "Camshaft and Valve Train",
        content: `The camshaft controls the opening and closing of the engine's intake and exhaust valves via a timing chain or belt. Accurate valve timing is essential; even a slight timing error can reduce engine performance or cause severe internal engine damage.`
      },
      {
        title: "Air Intake and Exhaust Systems",
        content: `An internal combustion engine requires a continuous supply of clean air. Air passes through a filter into the intake manifold, mixes with fuel, and undergoes combustion. Exhaust gases then travel through catalytic converters and mufflers to reduce harmful emissions and noise.`
      },
      {
        title: "Cooling System",
        content: `Combustion temperatures inside an engine can exceed 2000°C. The radiator, water pump, coolant passages, and thermostat work together to remove excess heat, preventing catastrophic thermal failure and maintaining optimal operating temperatures.`
      },
      {
        title: "Lubrication System",
        content: `Pressurised engine oil circulates through internal oil galleries to lubricate bearings, connecting rods, camshafts, and pistons. Beyond reducing friction, oil helps cool internal components and removes microscopic contaminants.`
      },
      {
        title: "The Transmission System",
        content: `The transmission is responsible for transferring the engine's power to the wheels while providing the correct gear ratio for different driving conditions. An engine produces its best power within a relatively small speed range. If the wheels were connected directly to the engine without a transmission, the vehicle would struggle to start moving and would quickly overwork the engine. The transmission solves this by using different gear ratios: lower gears multiply torque for starting or climbing hills, while higher gears reduce engine speed during cruising to improve fuel economy. Modern automatic transmissions use hydraulic systems, planetary gear sets, electronic sensors, and computer-controlled actuators to select the most suitable gear automatically.`
      },
      {
        title: "How the Engine and Transmission Work Together",
        content: `Although they perform different functions, the engine and transmission operate as one complete powertrain. The engine creates rotational force by burning fuel inside its cylinders, rotating the crankshaft which transfers power into the transmission. The transmission selects the appropriate gear ratio before sending power through the driveshaft, differential, and finally to the wheels. Whenever the driver accelerates, the transmission adjusts gear ratios to keep the engine operating within its most efficient speed range.`
      },
      {
        title: "Maintenance",
        content: `Proper maintenance includes replacing engine oil and filters at recommended intervals, maintaining correct coolant levels, replacing worn spark plugs, inspecting accessory belts, checking transmission fluid condition and level, and monitoring for leaks.`
      },
      {
        title: "Common Problems",
        content: `Common engine issues include overheating, worn piston rings, coolant leaks, damaged head gaskets, and timing chain wear. Common transmission faults include slipping gears, delayed gear engagement, low transmission fluid, overheating, worn clutch packs, and electronic control failures.`
      },
      {
        title: "Fun Facts",
        content: `• Formula One engines can exceed 15,000 revolutions per minute.\n• Some modern automatic transmissions contain ten forward gears.\n• During its lifetime, an average passenger car engine may rotate its crankshaft more than two billion times.\n• General Motors introduced the first fully automatic mass-production transmission (Hydra-Matic) in 1939.`
      },
      {
        title: "References",
        content: `Heywood, J. B. (2018). Internal Combustion Engine Fundamentals (2nd Edition).\nBosch Automotive Handbook (10th Edition).\nSociety of Automotive Engineers (SAE International).\nGeneral Motors Hydra-Matic Historical Engineering Archives.`
      }
    ]
  },
  {
    id: "battery",
    title: "Automotive Battery",
    subtitle: "The primary electrical energy storage device in a vehicle.",
    image: batteryImg,
    sections: [
      {
        title: "Overview",
        content: `The automotive battery supplies electrical current to power the starter motor, ignition system, and all electronic accessories when the engine is not running. It also acts as a voltage stabilizer for the entire electrical network, smoothing out spikes generated by the alternator.`
      },
      {
        title: "History and Development",
        content: `The history of rechargeable batteries traces back to Gaston Planté's lead-acid battery invented in 1859, which remains the fundamental design used in automobiles today due to its ability to deliver high surge currents required to crank heavy internal combustion engines.`
      },
      {
        title: "How It Works",
        content: `A lead-acid battery consists of positive and negative lead plates immersed in an electrolyte solution of sulfuric acid and water. A chemical reaction between the active materials and the acid converts chemical energy into electrical energy during discharge, and reverses the process during charging.`
      },
      {
        title: "Maintenance",
        content: `Keep battery terminals clean and free of white or blue corrosion deposits. Regularly check electrolyte levels (in serviceable batteries), ensure secure mounting to prevent vibration damage, and test voltage output to ensure reliable starting performance.`
      },
      {
        title: "Common Problems",
        content: `Common battery failures include sulfation due to low charge states, internal short circuits, terminal corrosion, electrolyte dry-out from extreme heat, and physical plate damage from excessive vehicle vibration.`
      },
      {
        title: "Fun Facts",
        content: `• A standard car battery delivers hundreds of amperes of electrical current in just a few seconds to start an engine.\n• Lead-acid batteries are among the most highly recycled consumer products in the world, with recovery rates exceeding 99%.`
      },
      {
        title: "References",
        content: `Denton, T. (2017). Automobile Electrical and Electronic Systems (5th Edition).\nBattery Council International (BCI) Technical Standards.`
      }
    ]
  },
  {
    id: "body",
    title: "Vehicle Body & Chassis Frame",
    subtitle: "The structural skeleton and aerodynamic outer shell of the automobile.",
    image: bodyImg,
    sections: [
      {
        title: "Overview",
        content: `The body and chassis frame form the structural backbone and aerodynamic enclosure of the vehicle. The chassis supports the engine, suspension, and drivetrain, while the body shell protects occupants from environmental elements and collision impacts.`
      },
      {
        title: "History and Development",
        content: `Early automobiles inherited wooden carriage frames. In the 1920s and 1930s, manufacturers shifted to heavy steel ladder frames. The development of unibody (monocoque) construction by companies like Lancia and Citroën integrated the body and frame into a single lightweight, rigid structure.`
      },
      {
        title: "Construction Materials",
        content: `Modern vehicle bodies use advanced high-strength steels (AHSS), aluminium alloys, magnesium, and carbon fiber composites to maximize structural crash safety while minimizing overall vehicle weight for better fuel efficiency.`
      },
      {
        title: "Maintenance",
        content: `Inspect the body for rust, paint chipping, and structural damage after accidents. Ensure drain plugs in doors and rocker panels remain clear to prevent moisture retention and internal corrosion.`
      },
      {
        title: "References",
        content: `Gilles, T. (2020). Automotive Service: Inspection, Maintenance, Repair.\nSociety of Automotive Engineers (SAE) Body Engineering Standards.`
      }
    ]
  },
  {
    id: "radiator",
    title: "Cooling Radiator",
    subtitle: "Thermal management system to dissipate excessive engine heat.",
    image: radiatorImg,
    sections: [
      {
        title: "Overview",
        content: `The radiator is a specialized heat exchanger used to cool internal combustion engines. It transfers thermal energy from the hot engine coolant passing through its core to the ambient air flowing through the vehicle grille.`
      },
      {
        title: "History and Development",
        content: `Mercedes-Benz engineer Wilhelm Maybach designed the first honeycomb radiator in 1900, which dramatically improved cooling efficiency over old-style serpentine pipe systems and allowed engines to produce sustained high power outputs.`
      },
      {
        title: "How It Works",
        content: `Hot coolant from the engine enters the radiator's upper tank and flows downward through thin aluminum tubes surrounded by fine metal fins. As air passes over the fins, heat is radiated into the atmosphere before the cooled liquid returns to the engine.`
      },
      {
        title: "Maintenance",
        content: `Flush coolant and replace fluid at manufacturer-recommended intervals to prevent scale buildup. Inspect exterior fins for bent metal, bugs, or debris that restrict airflow, and check hoses for cracking or leaks.`
      },
      {
        title: "References",
        content: `Eroglu, H. (2015). Automotive Cooling Systems Design and Analysis.\nAutomotive Engine Management Systems Manual.`
      }
    ]
  },
  {
    id: "fuel-tank",
    title: "Fuel Tank & Supply System",
    subtitle: "Safe onboard containment and delivery of liquid fuel.",
    image: fuelTankImg,
    sections: [
      {
        title: "Overview",
        content: `The fuel tank securely stores liquid petroleum or diesel fuel under strict safety regulations. Working alongside fuel pumps, lines, and filters, it delivers a clean, pressurized supply of fuel to the engine's injection system.`
      },
      {
        title: "History and Development",
        content: `Early fuel systems relied on gravity feed from dash-mounted tanks. The invention of mechanical fuel pumps and later electric in-tank fuel pumps allowed tanks to be safely relocated to the rear of the vehicle away from engine heat and passenger areas.`
      },
      {
        title: "Maintenance",
        content: `Avoid running the fuel tank completely dry, as this can overheat and damage the electric fuel pump. Replace fuel filters regularly to prevent injector clogging and ensure proper fuel pressure.`
      },
      {
        title: "References",
        content: `Hollembeak, B. (2018). Today's Technician: Automotive Engine Performance.`
      }
    ]
  },
  {
    id: "gear-box",
    title: "Gearbox & Differential",
    subtitle: "Multi-ratio torque converter and final drive axle distribution.",
    image: gearBoxImg,
    sections: [
      {
        title: "Overview",
        content: `The gearbox and differential work together to alter speed and torque ratios while splitting power to the drive wheels. The differential also allows left and right wheels to rotate at different speeds when cornering.`
      },
      {
        title: "History and Development",
        content: `Louis Renault patented the direct-drive gearbox in 1899, revolutionizing power transmission. The invention of limited-slip and locking differentials vastly improved vehicle traction on slippery surfaces.`
      },
      {
        title: "Maintenance",
        content: `Change differential and transmission gear oil periodically to remove metal wear particles and maintain high-pressure lubrication on gear teeth.`
      },
      {
        title: "References",
        content: `Heisler, H. (2002). Advanced Vehicle Technology (2nd Edition).`
      }
    ]
  },
  {
    id: "steering-wheel",
    title: "Steering Column & Wheel",
    subtitle: "Directional control interface linking driver inputs to front wheels.",
    image: steeringWheelImg,
    sections: [
      {
        title: "Overview",
        content: `The steering wheel and column translate rotational driver input into directional angle changes at the front wheels through rack-and-pinion or steering box mechanisms, augmented by hydraulic or electric power assistance.`
      },
      {
        title: "History and Development",
        content: `Early cars used tiller bars for steering. Steering wheels were introduced around 1894 to give drivers finer, more mechanical leverage when navigating heavy front-end weights.`
      },
      {
        title: "Maintenance",
        content: `Inspect power steering fluid levels or electric assist connections. Check steering linkage joints, tie rods, and ball joints for excessive play or boot tears.`
      },
      {
        title: "References",
        content: `Crouse, W. H., & Anglin, D. L. (2007). Automotive Mechanics.`
      }
    ]
  },
  {
    id: "pedals",
    title: "Pedal Box Assembly",
    subtitle: "Precision foot-operated controls for acceleration, braking, and clutching.",
    image: pedalsImg,
    sections: [
      {
        title: "Overview",
        content: `The pedal box houses the accelerator, brake, and clutch pedals. Each pedal uses mechanical linkage or electronic sensors to translate driver foot force into throttle response, hydraulic brake pressure, or clutch disengagement.`
      },
      {
        title: "Maintenance",
        content: `Ensure pedal rubber pads are intact to prevent foot slipping. Inspect pivot points and return springs for smooth movement and proper resistance.`
      },
      {
        title: "References",
        content: `Nadal, J. (2016). Vehicle Dynamics and Control Systems.`
      }
    ]
  },
  {
    id: "front-seat",
    title: "Front Cockpit Seating",
    subtitle: "Ergonomic operator and passenger seating with structural safety integration.",
    image: frontSeatImg,
    sections: [
      {
        title: "Overview",
        content: `Front seats provide ergonomic support, comfort, and precise positioning for the driver and front passenger. Modern seats integrate active headrests, side-impact airbags, and seatbelt anchorages to protect occupants during collisions.`
      },
      {
        title: "Maintenance",
        content: `Lubricate seat adjustment tracks periodically and inspect upholstery stitching and seatbelt latch mechanisms for secure locking performance.`
      },
      {
        title: "References",
        content: `Panero, J., & Zelnik, M. (1979). Human Dimension and Interior Space.`
      }
    ]
  },
  {
    id: "rear-seat",
    title: "Rear Passenger Seating",
    subtitle: "Optimized passenger comfort and modular cabin configuration.",
    image: rearSeatImg,
    sections: [
      {
        title: "Overview",
        content: `Rear seating accommodates additional passengers while offering folding configurations to expand cargo utility. They incorporate ISOFIX child safety seat anchorages and impact-absorbing foam padding.`
      },
      {
        title: "Maintenance",
        content: `Keep seat folding latches clear of debris and inspect child safety anchor points for structural integrity.`
      },
      {
        title: "References",
        content: `Federal Motor Vehicle Safety Standards (FMVSS) - Seat Assembly Requirements.`
      }
    ]
  },
  {
    id: "fender",
    title: "Body Fenders & Wheel Arches",
    subtitle: "Protective body panels framing wheel wells and deflecting road debris.",
    image: fenderImg,
    sections: [
      {
        title: "Overview",
        content: `Fenders curve over the wheel wells to prevent sand, mud, stones, liquids, and road spray from being thrown into the air by rotating tires. They also contribute to vehicle aerodynamics and styling.`
      },
      {
        title: "Maintenance",
        content: `Wash inner fender wells regularly to remove accumulated salt and mud that can trap moisture and cause premature rust formation.`
      },
      {
        title: "References",
        content: `Automotive Sheet Metal Corrosion Protection Guidelines (SAE Technical Paper).`
      }
    ]
  },
  {
    id: "exhaust-pipe",
    title: "Exhaust Pipe & Catalytic System",
    subtitle: "Emission reduction, acoustic dampening, and gas evacuation pathway.",
    image: exhaustPipeImg,
    sections: [
      {
        title: "Overview",
        content: `The exhaust system collects high-pressure gases from the engine cylinders, routes them through catalytic converters and resonators to neutralize toxic pollutants, and expels them quietly through the tailpipe.`
      },
      {
        title: "History and Development",
        content: `The introduction of the Clean Air Act in the 1970s forced the invention of the catalytic converter, which uses precious metal catalysts (platinum, palladium, rhodium) to convert harmful carbon monoxide and hydrocarbons into harmless water vapor and carbon dioxide.`
      },
      {
        title: "Maintenance",
        content: `Inspect exhaust hangers, gaskets, and pipes regularly for cracks, rust holes, or leaks that could allow dangerous carbon monoxide fumes to enter the passenger cabin.`
      },
      {
        title: "References",
        content: `Kukkonen, C. A. (1982). Automotive Emissions and Catalytic Converters.`
      }
    ]
  },
  {
    id: "tire",
    title: "Pneumatic Tire & Wheel Rim",
    subtitle: "The sole mechanical contact patch between the vehicle and the road surface.",
    image: tireImg,
    sections: [
      {
        title: "Overview",
        content: `Pneumatic tires support vehicle weight, absorb high-frequency road shocks, and provide traction for acceleration, cornering, and braking through a contact patch roughly the size of a postcard.`
      },
      {
        title: "History and Development",
        content: `John Boyd Dunlop patented the pneumatic (air-filled) rubber tire in 1888, superseding harsh solid rubber wheels and enabling higher vehicle speeds and riding comfort.`
      },
      {
        title: "Maintenance",
        content: `Check tire inflation pressure monthly, inspect tread depth indicators for legal wear limits, and rotate tires every 10,000 kilometers to promote even tread wear.`
      },
      {
        title: "References",
        content: `Gent, A. N., & Walter, J. D. (2005). The Pneumatic Tire (NHTSA Technical Report).`
      }
    ]
  },
  {
    id: "brake",
    title: "Brake Disc & Caliper Assembly",
    subtitle: "High-friction hydraulic deceleration and kinetic energy conversion system.",
    image: brakeImg,
    sections: [
      {
        title: "Overview",
        content: `The disc braking system uses hydraulic pressure to squeeze high-friction brake pads against a spinning metal rotor attached to the wheel. This converts kinetic vehicle energy into thermal energy through friction, safely bringing the vehicle to a stop.`
      },
      {
        title: "History and Development",
        content: `Though experimented with early in aviation and racing, Dunlop disc brakes achieved widespread automotive fame after winning the 1953 24 Hours of Le Mans on Jaguar racing cars due to their superior fade resistance over drum brakes.`
      },
      {
        title: "Maintenance",
        content: `Inspect brake pad thickness regularly, check brake rotors for scoring or warping, and flush hydraulic brake fluid every two years to prevent moisture absorption and spongy pedal feel.`
      },
      {
        title: "References",
        content: `Limpert, R. (2011). Brake Design and Safety (3rd Edition).`
      }
    ]
  }
];