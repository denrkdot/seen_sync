'use client';

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const EMOJIS = ['😊', '😐', '😤', '😴', '🔥'];

interface EmojiItem {
  id: number;
  emoji: string;
  left: number; // percentage
  size: number; // px
  duration: number; // seconds
  delay: number; // seconds
  drift: number; // px
  opacity: number;
  rotateDirection: number; // -1 or 1
}

export function FallingEmojis() {
  const [emojis, setEmojis] = useState<EmojiItem[]>([]);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    // Generate random values on the client to avoid hydration mismatch
    const items: EmojiItem[] = Array.from({ length: 14 }).map((_, index) => {
      const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      return {
        id: index,
        emoji,
        left: Math.random() * 90 + 5, // 5% to 95%
        size: Math.floor(Math.random() * 12) + 16, // 16px to 28px
        duration: Math.random() * 4 + 6, // 6s to 10s (natural, not too slow/dreamy)
        delay: Math.random() * -12, // Negative delay so emojis are already falling when page loads
        drift: Math.random() * 30 + 15, // 15px to 45px gentle horizontal drift
        opacity: Math.random() * 0.15 + 0.15, // 0.15 to 0.30 (mellow/transparent but visible)
        rotateDirection: Math.random() > 0.5 ? 1 : -1,
      };
    });
    setEmojis(items);
  }, []);

  if (prefersReduced || emojis.length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {emojis.map((item) => (
        <motion.div
          key={item.id}
          className="absolute text-center leading-none"
          style={{
            left: `${item.left}%`,
            fontSize: `${item.size}px`,
            opacity: item.opacity,
            top: '-40px', // start completely offscreen above the card
          }}
          animate={{
            // y goes from 0px (offscreen at top: -40px) to 380px (well below bottom edge of the card)
            // ensuring it sinks fully out of view
            y: ['0px', '380px'],
            x: [0, item.drift, -item.drift, 0], // drift side-to-side
            rotate: [0, 45 * item.rotateDirection, -45 * item.rotateDirection, 0],
          }}
          transition={{
            y: {
              duration: item.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: item.delay,
            },
            x: {
              duration: item.duration * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: item.delay,
            },
            rotate: {
              duration: item.duration * 0.75,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: item.delay,
            },
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
}
