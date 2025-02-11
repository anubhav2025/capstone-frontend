import React from "react";
import { Typography, Button } from "antd";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Lottie from "lottie-react";
import animationData from "../assets/404NotFound.json"; // Update this path if necessary

const { Title, Paragraph } = Typography;

const PageNotFound = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        // Enhanced Dark Gradient Background
        background: "linear-gradient(135deg, #1a1a1a 0%, #333333 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#ffffff",
        padding: 24,
        position: "relative", // For positioning decorative elements
        overflow: "hidden", // To contain decorative elements
      }}
    >
      {/* Decorative Gradient Overlays */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "-20%",
          width: "150%",
          height: "150%",
          background:
            "radial-gradient(circle at top left, rgba(255, 255, 255, 0.05), transparent 70%)",
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          right: "-20%",
          width: "150%",
          height: "150%",
          background:
            "radial-gradient(circle at bottom right, rgba(255, 255, 255, 0.05), transparent 70%)",
          zIndex: 1,
        }}
      />

      {/* Animated Header */}
      <motion.div
        initial={{ y: -150, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 60, delay: 0.2 }}
        style={{ zIndex: 2 }}
      >
        <Title
          level={1}
          style={{
            fontWeight: "bold",
            marginBottom: "2rem",
            // Gradient Text Effect
            background: "linear-gradient(45deg, #FF6B6B, #FFD93D)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
          }}
        >
          404
        </Title>
      </motion.div>

      {/* Interactive Tilt Animation */}
      <Tilt
        tiltMaxAngleX={15}
        tiltMaxAngleY={15}
        perspective={1000}
        scale={1.05}
        transitionSpeed={1000}
        gyroscope={true}
        style={{
          width: "300px",
          height: "300px",
          marginBottom: "2rem",
          zIndex: 2,
        }}
      >
        <Lottie animationData={animationData} loop={true} />
      </Tilt>

      {/* Animated Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        style={{ zIndex: 2, maxWidth: "600px" }}
      >
        <Paragraph style={{ marginTop: "1rem", marginBottom: "2rem", color: "#fff" }}>
          Oops! The page you're looking for doesn't exist. It might have been moved
          or deleted.
        </Paragraph>
      </motion.div>

      {/* Animated Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{ zIndex: 2 }}
      >
        <Button
          href="/dashboard"
          type="primary"
          style={{
            padding: "0.75rem 2rem",
            borderRadius: "30px",
            background: "linear-gradient(45deg, #6A11CB, #2575FC)",
            border: "none",
            boxShadow: "0px 4px 15px rgba(0,0,0,0.3)",
            fontWeight: "bold",
          }}
        >
          Dashboard
        </Button>
      </motion.div>

      {/* Floating Decorative Elements */}
      <div
        style={{
          position: "absolute",
          top: "25%",
          left: "5%",
          width: "60px",
          height: "60px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          animation: "float 6s ease-in-out infinite",
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          right: "10%",
          width: "80px",
          height: "80px",
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          borderRadius: "50%",
          animation: "float 8s ease-in-out infinite reverse",
          zIndex: 1,
        }}
      />

      {/* Keyframes for Floating Animation */}
      <style>
        {`
          @keyframes float {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
            100% {
              transform: translateY(0px);
            }
          }
        `}
      </style>
    </div>
  );
};

export default PageNotFound;
