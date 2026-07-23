import "./ContextMenu.css";

export default function ContextMenu({
  visible,
  x,
  y,
  onYes,
  onNo,
}) {

  if (!visible) return null;

  return (
    <div
      className="contextOverlay"
      onClick={onNo}
    >
      <div
        className="contextMenu"
        style={{
          left: x,
          top: y,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="contextTitle">
          ⚠ Cancel Part
        </div>

        <div className="contextText">
          Return this part to the tray?
        </div>

        <div className="contextButtons">

          <button
            className="yesBtn"
            onClick={onYes}
          >
            YES
          </button>

          <button
            className="noBtn"
            onClick={onNo}
          >
            NO
          </button>

        </div>
      </div>
    </div>
  );
}