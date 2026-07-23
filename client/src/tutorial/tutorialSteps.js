export const tutorialSteps = [

{
    title: "Welcome",

    description:
        "Welcome to MechaLab.",

    target: null,

    allow: {

        next: true,

        previous: false,

        leave: true

    }

},

{
    title: "Save Button",

    description:
        "This button saves your vehicle configuration.",

    target: "save-button",

    allow: {

        save: true,

        next: true,

        previous: true,

        leave: true

    }

},

{
    title: "Stop Building",

    description:
        "This exits Build Mode.",

    target: "stop-button",

    allow: {

        stopDemo: true,

        next: true,

        previous: true,

        leave: true

    }

}

];