export default function LoadingScreen({ progress }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#0B1220",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        color: "white",
        zIndex: 1000,
      }}
    >
      <h1 style={{ fontSize: "42px", marginBottom: "20px" }}>
        MVCISS
      </h1>

      <h3>Preparing Workshop...</h3>

      <div
        style={{
          width: "350px",
          height: "15px",
          background: "#333",
          borderRadius: "10px",
          overflow: "hidden",
          marginTop: "25px",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "#00BFFF",
            transition: "0.3s",
          }}
        />
      </div>

      <p style={{ marginTop: "15px" }}>
        {Math.floor(progress)}%
      </p>
    </div>
  );
}