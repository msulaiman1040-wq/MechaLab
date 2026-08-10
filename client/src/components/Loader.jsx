import "./Loader.css";

export default function Loader({
    progress = 0,
    status = "INITIALIZING MECHALAB SYSTEM..."
}) {
    return (
        <div className="loader-overlay">
            <div className="loader-container">
                <div className="cyber-ring">
                    <div className="ring ring1"></div>
                    <div className="ring ring2"></div>
                    <div className="loader-core"></div>
                </div>

                <div className="loader-content">
                    <span className="loader-tag">
                         MECHALAB BOOT SEQUENCE 
                    </span>

                    <h2 className="loader-title">
                        <span className="mecha">MECHA</span>
                        <span className="laaab">LAB</span> 
                    </h2>

                    <p className="loader-status">
                        {status}
                    </p>
                </div>
            </div>
        </div>
    );
}