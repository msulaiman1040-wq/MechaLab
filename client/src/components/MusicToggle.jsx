import { motion } from "framer-motion";

const MusicToggle = ({ isPlaying, onToggle }) => {
  return (
    <motion.div
      onClick={onToggle}
      initial={false}
      style={{
        width: 60,
        height: 30,
        borderRadius: 15,
        backgroundColor: isPlaying ? "#0047ab" : "#71717a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        marginTop: "10px",
        position: "relative",
        padding: "5px"
      }}
    >
      <motion.svg 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={isPlaying ? "playing" : "muted"} // key triggers the animation
      >
        {isPlaying ? (
          // Music Note Icon
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        ) : (
          // Muted Music Note (Icon + Strikethrough)
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6zM3.27 2L2 3.27l18.73 18.73L22 20.73 3.27 2z" />
        )}
      </motion.svg>
    </motion.div>
  );
};

export default MusicToggle;