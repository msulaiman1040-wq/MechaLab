import engine from "../assets/images/parts/engine.png";
import body from "../assets/images/parts/body.png";
import battery from "../assets/images/parts/battery.png";
import radiator from "../assets/images/parts/radiator.png";
import fuelTank from "../assets/images/parts/fuel-tank.png";
import gearBox from "../assets/images/parts/gear-box.png";
import steeringWheel from "../assets/images/parts/steering-wheel.png";
import pedals from "../assets/images/parts/pedals.png";
import frontSeat from "../assets/images/parts/front-seat.png";
import rearSeat from "../assets/images/parts/rear-seat.png";
import fender from "../assets/images/parts/fender.png";
import exhaustPipe from "../assets/images/parts/exhaust-pipe.png";
import tire from "../assets/images/parts/tire.png";
import brake from "../assets/images/parts/brake-disc-caliper.png";
const vehicleParts = [

{
id:"engine_and_transmission_system001",
name:"Engine & Transmission",
image:engine,
quantity:1,
installed:0
},

{
id:"body001",
name:"Body",
image:body,
quantity:1,
installed:0
},

{
id:"battery001",
name:"Battery",
image:battery,
quantity:1,
installed:0
},

{
id:"radiator001",
name:"Radiator",
image:radiator,
quantity:1,
installed:0
},

{
id:"fuel_tank001",
name:"Fuel Tank",
image:fuelTank,
quantity:1,
installed:0
},

{
id:"gear_box001",
name:"Gear Box",
image:gearBox,
quantity:1,
installed:0
},

{
id:"steering_wheel001",
name:"Steering Wheel",
image:steeringWheel,
quantity:1,
installed:0
},

{
id:"brake_and_accelerator_pedals001",
name:"Pedals",
image:pedals,
quantity:1,
installed:0
},

{
id:"front_seat",
name:"Front Seat",
image:frontSeat,
quantity:2,
installed:0,

objects:[
"left_seat001",
"right_seat001"
]

},

{
id:"rear_seat",
name:"Rear Seat",
image:rearSeat,
quantity:1,
installed:0,

objects:[
"reer_seat001"
]

},

{
id:"fender",
name:"Fender",
image:fender,
quantity:2,
installed:0,

objects:[
"left_fender001",
"right_fender001"
]

},

{
id:"exhaust_pipe001",
name:"Exhaust Pipe",
image:exhaustPipe,
quantity:1,
installed:0
},

{
id:"tire",
name:"Tire",
image:tire,
quantity:4,
installed:0,

objects:[
"front_left_tire003",
"front_right_tire001",
"reer_right_tire004",
"reer_right_tire002"
]

},

{
id:"brake",
name:"Brake Disc & Caliper",
image:brake,
quantity:4,
installed:0,

objects:[
"brakedisk_and_calliper_front_left001",
"brakedisk_and_calliper_front_right001",
"brakedisk_and_calliper_reer_left001",
"brakedisk_and_calliper_reer_right001"
]

}

];

export default vehicleParts;