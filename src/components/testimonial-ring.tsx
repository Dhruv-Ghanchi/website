"use client";

import { useEffect, useId, useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Star } from 'lucide-react';
import { useReducedMotion } from '@/components/ui';
import type { Testimonial } from '@/lib/content';
import type { SiteSettings } from '@/lib/strapi';

const ROTATE_INTERVAL_MS = 4000;
const RADIUS = 205;
const CENTER_Y = 320;
const ANGLE_STEP = 42; // degrees between avatar slots

function AvatarImage({
  image,
  name,
  focalX,
  focalY,
}: {
  image?: string;
  name: string;
  focalX?: number;
  focalY?: number;
}) {
  const [hasError, setHasError] = useState(false);

  const initials = (name || 'GI')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase() || 'GI';

  if (!image || hasError) {
    return (
      <span className="review-initials" aria-hidden="true">
        {initials}
      </span>
    );
  }

  return (
    <img
      src={image}
      alt={name}
      loading="lazy"
      onError={() => setHasError(true)}
      style={{
        objectPosition: `${focalX ?? 50}% ${focalY ?? 50}%`,
      }}
    />
  );
}

export function TestimonialRing({
  testimonials,
  rating,
}: {
  testimonials: Testimonial[];
  rating: SiteSettings['rating'];
}) {
  const reduced = useReducedMotion();
  const id = useId();
  const [active, setActive] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const count = testimonials.length;
  const safeActive = count > 0 ? ((active % count) + count) % count : 0;
  const current = testimonials[safeActive] || testimonials[0];

  useEffect(() => {
    // Enable transitions only after initial load and paint have settled
    setIsMounted(true);
  }, []);

  // Clockwise rotation: the item at top (-42 deg) rotates down into the center (0 deg)
  const advanceClockwise = useCallback(() => {
    setActive(prev => (prev + 1) % count);
  }, [count]);

  const advanceCounterClockwise = useCallback(() => {
    setActive(prev => (prev - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (reduced || isHovered || count < 2) return;
    const timer = setInterval(advanceClockwise, ROTATE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [reduced, isHovered, count, advanceClockwise]);

  if (!count || !current) return null;

  // We compute positions for visible items along the semicircle
  // Semicircle geometry:
  // Center is at x = 0 (the exact left page border), y = CENTER_Y (320).
  // Radius is RADIUS (280).
  // Apex is at x = 280, y = 320 (angle = 0 deg).
  const visibleItems = testimonials.map((item, i) => {
    let offset = (i - safeActive + count) % count;
    if (offset > count / 2) offset -= count;

    // In clockwise motion:
    // The next item is at the top (-ANGLE_STEP), rotating down into center (0)
    // The previous item is at bottom (+ANGLE_STEP)
    const angleDeg = offset * ANGLE_STEP;
    const rad = (angleDeg * Math.PI) / 180;
    const x = RADIUS * Math.cos(rad);
    const y = CENTER_Y + RADIUS * Math.sin(rad);

    const isActive = offset === 0;
    const isVisible = Math.abs(offset) <= 1;
    const isTransitioning = Math.abs(offset) <= 2;

    return {
      item,
      index: i,
      offset,
      x,
      y,
      isActive,
      isVisible,
      isTransitioning,
    };
  }).filter(slot => slot.isTransitioning);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      advanceClockwise();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      advanceCounterClockwise();
    }
  };

  return (
    <div
      ref={containerRef}
      className="testimonial-showcase-container"
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Testimonials Showcase"
    >
      <div className="testimonial-main-grid">
        {/* Left: Half-semicircular ring sticked to the left page border */}
        <div
          className="testimonial-semicircle-stage"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          role="group"
          aria-label="Client review selector"
        >
          {/* Half-circle SVG: diameter against left border at x=0, radius=205, cy=320 */}
          <svg
            className="semicircle-ring-svg"
            width="560"
            height="640"
            viewBox="0 0 560 640"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Main half-circle arc: starts at (0, 115), curves to apex (205, 320), ends at (0, 525) */}
            <path
              d="M 0 115 A 205 205 0 0 1 0 525"
              className="ring-base-path"
              strokeWidth="2"
            />
            {/* Luminous accent arc highlighting the active center zone */}
            <path
              d="M 152.34 182.83 A 205 205 0 0 1 152.34 457.17"
              className="ring-active-path"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>

          {/* Avatars moving physically along the ring line */}
          <div className="semicircle-avatars-wrap">
            {visibleItems.map(({ item, index, x, y, isActive, isVisible }) => (
              <motion.button
                key={item.id}
                type="button"
                className={`review-avatar ${isActive ? 'is-active' : ''}`}
                style={{
                  transform: `translate3d(${x}px, ${y}px, 0) scale(${isActive ? 1 : 0.72})`,
                  opacity: isVisible ? 1 : 0,
                }}
                animate={{
                  x,
                  y,
                  opacity: isVisible ? 1 : 0,
                  scale: isActive ? 1 : 0.72,
                  pointerEvents: isVisible ? 'auto' : 'none',
                }}
                initial={false}
                transition={
                  !isMounted || reduced
                    ? { duration: 0 }
                    : { duration: 0.65, ease: [0.22, 1, 0.36, 1] }
                }
                onClick={() => setActive(index)}
                aria-pressed={isActive}
                aria-hidden={!isVisible}
                tabIndex={isVisible ? 0 : -1}
                aria-label={`Show testimonial from ${item.name}`}
                aria-controls={`${id}-quote`}
              >
                <span className="review-avatar-frame">
                  <AvatarImage
                    image={item.image}
                    name={item.name}
                    focalX={item.focalX}
                    focalY={item.focalY}
                  />
                </span>

                <div className="review-avatar-info">
                  <strong className="review-avatar-name">{item.name}</strong>
                  <span className="review-avatar-rating">
                    <Star size={13} fill="currentColor" className="review-star-icon" aria-hidden="true" />
                    <span>{rating?.value ? `${rating.value.toFixed(1)}/5` : '5.0/5'}</span>
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right: Enlarged Editorial Quote with synchronized fade-out and fade-in */}
        <div
          className="review-quote"
          id={`${id}-quote`}
          aria-live="polite"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.figure
              key={current.id}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={
                !isMounted || reduced
                  ? { duration: 0 }
                  : {
                      opacity: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
                      y: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
                    }
              }
            >
              <div className="review-quote-body">
                <span className="review-quote-mark" aria-hidden="true">“</span>
                <blockquote className="review-quote-text">{current.quote}</blockquote>
              </div>

              <figcaption className="review-quote-caption">
                <div className="review-quote-author">
                  <span className="review-quote-role">{current.role}</span>
                </div>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
