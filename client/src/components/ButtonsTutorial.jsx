import React, { useState, useEffect } from "react";
import "./ButtonsTutorial.css";

const buttonSteps = [
  {
    title: "1. Save Button",
    description: "This button saves your current vehicle configuration progress, you may click or tap the button named 'Open COnfiguration to view saved files.",
    targetSelector: "#save-button",
  },
  {
    title: "2. Stop Building Button",
    description: "This button takes you back to the workshop home screen.",
    targetSelector: "#stop-button",
  },
  {
    title: "3. Manage Parts Button",
    description:
      "This button opens the installed parts manager. Installed parts can be removed from chassis by clicking or tapping the name on the list and returned to the Parts Tray.",
    targetSelector: "#manage-button",
  },
  {
    title: "4. Help (?) Button",
    description:
      "Opens the Assembly Diagnostic  drawer which explains mistakes in your vehicle assembly.",
    targetSelector: "#help-button",
  },
  {
    title: "5. Engine Ignition",
    description:
      "Starts or stops the engine simulation once the required parts have been assembled.",
    targetSelector: "#engine-toggle-btn",
  },
  {
    title: "6. Gas Pedal",
    description:
      "Accelerates the simulated vehicle once the engine has been started.",
    targetSelector: "#gas-pedal",
  },
  {
    title: "7. Transmission",
    description:
      "Changes between Park, Reverse, Neutral and Drive.",
    targetSelector: "#transmission-bar",
  },
  {
    title: "8. Brake Pedal",
    description:
      "Slows or completely stops the vehicle simulation.",
    targetSelector: "#brake-pedal",
  },
  {
    title: "9. Parts Tray",
    description:
      "This is a tray that contains every component required to build the vehicle user may may scroll across the tray and choose a part then double click or double tap to bring part out of tray onto the workbench for dragging and installment and if user decides to return part to tray user should right click ortap and hold for context menu.",
    targetSelector: "#carocaro",
  },
];

export default function ButtonsTutorial({
    onComplete,
    onLeave
}) {

    const [step,setStep] = useState(0);
    const [rect,setRect] = useState(null);

    const current = buttonSteps[step];

    useEffect(()=>{

        const update=()=>{

            const el=document.querySelector(current.targetSelector);

            if(!el){

                setRect(null);
                return;

            }

            const r=el.getBoundingClientRect();

            setRect(r);

        };

        update();

        window.addEventListener("resize",update);
        window.addEventListener("scroll",update,true);

        return ()=>{

            window.removeEventListener("resize",update);
            window.removeEventListener("scroll",update,true);

        }

    },[step]);

    const next=()=>{

        if(step===buttonSteps.length-1){

            onComplete();
            return;

        }

        setStep(step+1);

    };

    const back=()=>{

        if(step===0) return;

        setStep(step-1);

    };

    const getCardPosition=()=>{

        if(!rect){

            return{
                bottom:30,
                left:30
            }

        }

        const topHalf=rect.top<window.innerHeight/2;
        const leftHalf=rect.left<window.innerWidth/2;

        let style={};

        if(topHalf){

            style.bottom=30;

        }else{

            style.top=30;

        }

        if(leftHalf){

            style.right=30;

        }else{

            style.left=30;

        }

        return style;

    };

    return(

        <div className="tutorial-root" style={{ pointerEvents: "auto", position: "fixed", inset: 0, zIndex: 99999 }}>

            {/* SVG Spotlight Overlay */}

            {rect && (

                <svg
                    className="tutorial-overlay"
                    width="100%"
                    height="100%"
                >

                    <defs>

                        <mask id="spotlight-mask">

                            <rect
                                width="100%"
                                height="100%"
                                fill="white"
                            />

                            <rect
                                x={rect.left-8}
                                y={rect.top-8}
                                width={rect.width+16}
                                height={rect.height+16}
                                rx="12"
                                fill="black"
                            />

                        </mask>

                    </defs>

                    <rect
                        width="100%"
                        height="100%"
                        className="tutorial-darkness"
                        mask="url(#spotlight-mask)"
                    />

                    <rect
                        x={rect.left-6}
                        y={rect.top-6}
                        width={rect.width+12}
                        height={rect.height+12}
                        rx="12"
                        className="tutorial-glow"
                    />

                </svg>

            )}

            <div
                className="tutorial-card-container"
                style={getCardPosition()}
            >

                <div className="gateway-card tutorial-card">

                    <div className="tutorial-header-badge">

                        BUTTONS TUTORIAL

                        <span className="tutorial-counter">

                            {step+1} / {buttonSteps.length}

                        </span>

                    </div>

                    <h2>{current.title}</h2>

                    <p>{current.description}</p>

                    <div className="tutorial-actions">

                        <button
                            className="tutorial-btn-secondary"
                            onClick={onLeave}
                        >
                            Leave Tutorial
                        </button>

                        <div className="tutorial-nav-group">

                            {step>0 && (

                                <button
                                    className="tutorial-btn-secondary"
                                    onClick={back}
                                >
                                    Back
                                </button>

                            )}

                            <button
                                className="tutorial-btn-primary"
                                onClick={next}
                            >

                                {step===buttonSteps.length-1
                                    ? "Finish"
                                    : "Next"}

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}