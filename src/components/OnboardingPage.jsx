import React from "react";
import { motion } from "framer-motion";
import Button from "./ui/Button";
import HeroBackground from "./HeroBackground";
import {
  onboardingFeatures,
  ANIMATION_DELAYS,
} from "../types/onboarding.types";

// Компонент для карточки фичи
const FeatureCard = ({ feature, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    className="text-center p-4 glassmorphism rounded-2xl border border-white/10"
  >
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      className="text-3xl mb-2"
    >
      {feature.icon}
    </motion.div>
    <h3 className="text-white font-semibold text-sm mb-1">{feature.title}</h3>
    <p className="text-gray-400 text-xs">{feature.description}</p>
  </motion.div>
);

const OnboardingPage = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      <div className="max-w-mobile mx-auto min-h-screen relative">
        {/* Background Pattern */}
        <HeroBackground>
          <div className="min-h-screen flex flex-col">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: ANIMATION_DELAYS.LOGO }}
              className="flex justify-center pt-16 pb-8"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-20 h-20 bg-gradient-to-br from-neon-green to-purple-500 rounded-3xl flex items-center justify-center shadow-lg shadow-neon-green/25"
                >
                  <span className="text-2xl font-bold text-black">AI</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center px-8 pb-20">
              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: ANIMATION_DELAYS.TITLE }}
                className="text-center mb-6"
              >
                <h1 className="text-5xl font-black mb-4">
                  <span className="bg-gradient-to-r from-white via-neon-green to-purple-400 bg-clip-text text-transparent">
                    TryOn AI
                  </span>
                </h1>
                <motion.div
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="h-1 bg-gradient-to-r from-neon-green via-purple-500 to-blue-500 bg-[length:200%_100%] rounded-full mx-auto"
                  style={{ width: "60%" }}
                />
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: ANIMATION_DELAYS.DESCRIPTION,
                }}
                className="text-xl text-gray-300 text-center mb-12 leading-relaxed"
              >
                Transform your style with AI magic.{" "}
                <span className="text-neon-green font-semibold">
                  Try on clothes instantly
                </span>{" "}
                using cutting-edge technology.
              </motion.p>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: ANIMATION_DELAYS.FEATURES }}
                className="grid grid-cols-3 gap-6 mb-12"
              >
                {onboardingFeatures.map((feature, index) => (
                  <FeatureCard
                    key={feature.id}
                    feature={feature}
                    index={index}
                  />
                ))}
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: ANIMATION_DELAYS.CTA }}
                className="text-center"
              >
                <Button
                  onClick={onGetStarted}
                  variant="primary"
                  size="large"
                  className="w-full max-w-xs mx-auto"
                >
                  Try It Now
                </Button>

                {/* Trust indicators */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.6 }}
                  className="flex items-center justify-center space-x-4 mt-6 text-sm text-gray-400"
                >
                  <div className="flex items-center space-x-1">
                    <span className="text-neon-green">✓</span>
                    <span>Free to try</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-neon-green">✓</span>
                    <span>No signup</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-neon-green">✓</span>
                    <span>Instant results</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Floating Action Hint */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-white text-sm">Swipe up to start</span>
              </div>
            </motion.div>
          </div>
        </HeroBackground>
      </div>
    </div>
  );
};

export default OnboardingPage;
