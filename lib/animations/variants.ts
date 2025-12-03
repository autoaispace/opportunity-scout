import { Variants } from 'framer-motion'

export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1], // Custom cubic-bezier
    }
  },
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

export const scaleOnHover: Variants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.02,
    boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)',
    transition: { duration: 0.3 }
  },
}

export const blurLock: Variants = {
  locked: {
    filter: 'blur(8px)',
    transition: { duration: 0.3 }
  },
  unlocked: {
    filter: 'blur(0px)',
    transition: { duration: 0.3 }
  },
}

// For Pro badge breathe effect
export const breatheGlow: Variants = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(255, 215, 0, 0.2)',
      '0 0 30px rgba(255, 215, 0, 0.4)',
      '0 0 20px rgba(255, 215, 0, 0.2)',
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

