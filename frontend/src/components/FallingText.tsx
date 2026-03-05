import { useRef, useState, useEffect } from 'react';

interface FallingTextProps {
  text?: string;
  highlightWords?: string[];
  trigger?: 'auto' | 'scroll' | 'click' | 'hover';
  backgroundColor?: string;
  wireframes?: boolean;
  gravity?: number;
  mouseConstraintStiffness?: number;
  fontSize?: string;
}

type WordBody = {
  elem: HTMLSpanElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  angle: number;
  va: number;
};

const FallingText: React.FC<FallingTextProps> = ({
  text = '',
  highlightWords = [],
  trigger = 'auto',
  backgroundColor = 'transparent',
  wireframes = false,
  gravity = 1,
  mouseConstraintStiffness = 0.2,
  fontSize = '1rem'
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [effectStarted, setEffectStarted] = useState(false);

  useEffect(() => {
    if (!textRef.current) return;

    const words = text.split(/\s+/).filter(Boolean);
    const newHTML = words
      .map((word) => {
        const isHighlighted = highlightWords.some((hw) => word.startsWith(hw));
        return `<span class="inline-block mx-[2px] select-none ${isHighlighted ? 'text-cyan-500 font-bold' : ''}">${word}</span>`;
      })
      .join(' ');

    textRef.current.innerHTML = newHTML;
  }, [text, highlightWords]);

  useEffect(() => {
    if (trigger === 'auto') {
      setEffectStarted(true);
      return;
    }

    if (trigger === 'scroll' && containerRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setEffectStarted(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [trigger]);

  useEffect(() => {
    if (!effectStarted || !containerRef.current || !textRef.current) return;

    const container = containerRef.current;
    const textNode = textRef.current;
    const containerRect = container.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;

    if (width <= 0 || height <= 0) return;

    const spans = Array.from(textNode.querySelectorAll('span')) as HTMLSpanElement[];
    if (!spans.length) return;

    const bodies: WordBody[] = spans.map((elem) => {
      const rect = elem.getBoundingClientRect();
      const body: WordBody = {
        elem,
        w: rect.width,
        h: rect.height,
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top + rect.height / 2,
        vx: (Math.random() - 0.5) * 4,
        vy: 0,
        angle: 0,
        va: (Math.random() - 0.5) * 0.04
      };

      elem.style.position = 'absolute';
      elem.style.left = `${body.x}px`;
      elem.style.top = `${body.y}px`;
      elem.style.transform = 'translate(-50%, -50%)';

      if (wireframes) {
        elem.style.outline = '1px dashed rgba(0, 0, 0, 0.25)';
      }

      return body;
    });

    const restitution = Math.min(0.95, 0.65 + mouseConstraintStiffness * 0.2);
    const airFriction = 0.992;
    const gravityFactor = gravity * 0.22;

    const tick = () => {
      for (const body of bodies) {
        body.vy += gravityFactor;
        body.vx *= airFriction;
        body.vy *= airFriction;

        body.x += body.vx;
        body.y += body.vy;
        body.angle += body.va;

        const halfW = body.w / 2;
        const halfH = body.h / 2;

        if (body.x - halfW < 0) {
          body.x = halfW;
          body.vx *= -restitution;
        }
        if (body.x + halfW > width) {
          body.x = width - halfW;
          body.vx *= -restitution;
        }
        if (body.y - halfH < 0) {
          body.y = halfH;
          body.vy *= -restitution;
        }
        if (body.y + halfH > height) {
          body.y = height - halfH;
          body.vy *= -restitution;
          body.va *= 0.997;
        }

        body.elem.style.left = `${body.x}px`;
        body.elem.style.top = `${body.y}px`;
        body.elem.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
      }

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [effectStarted, gravity, mouseConstraintStiffness, wireframes]);

  const handleTrigger = () => {
    if (!effectStarted && (trigger === 'click' || trigger === 'hover')) {
      setEffectStarted(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative z-[1] w-full min-h-[200px] cursor-pointer text-center pt-8 overflow-hidden"
      style={{ background: backgroundColor }}
      onClick={trigger === 'click' ? handleTrigger : undefined}
      onMouseEnter={trigger === 'hover' ? handleTrigger : undefined}
    >
      <div
        ref={textRef}
        className="inline-block text-[#111111] font-medium"
        style={{
          fontSize,
          lineHeight: 1.4
        }}
      />
    </div>
  );
};

export default FallingText;
