import React, { useEffect, useRef } from "react";

const BLUE_COLOR = "#3b82f6";
const ORANGE_COLOR = "#f97316";
const DEFAULT_COLOR = ORANGE_COLOR;

const isBlue = (r: number, g: number, b: number) => b > r + 25 && b > g + 25 && b > 120;
const isOrange = (r: number, g: number, b: number) =>
  r > 180 && g > 80 && b < 120 && r > g;

const parseRgb = (value: string) => {
  const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);
  if (!match) return null;
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
    a: match[4] ? Number(match[4]) : 1,
  };
};

const findBackgroundColor = (el: Element | null) => {
  let node: Element | null = el;
  while (node) {
    const bg = window.getComputedStyle(node).backgroundColor;
    if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") {
      const rgb = parseRgb(bg);
      if (rgb && rgb.a > 0.05) return rgb;
    }
    node = node.parentElement;
  }
  return null;
};

const CursorDot: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const move = (e: MouseEvent) => {
      if (!cursor) return;
      const x = e.clientX;
      const y = e.clientY;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      const target = document.elementFromPoint(x, y);
      const bg = findBackgroundColor(target);
      let color = DEFAULT_COLOR;
      if (bg) {
        if (isOrange(bg.r, bg.g, bg.b)) color = BLUE_COLOR;
        else if (isBlue(bg.r, bg.g, bg.b)) color = ORANGE_COLOR;
      }
      cursor.style.backgroundColor = color;
    };

    const onMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => move(e));
    };

    const onLeave = () => cursor.classList.add("is-hidden");
    const onEnter = () => cursor.classList.remove("is-hidden");

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mouseenter", onEnter);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" />;
};

export default CursorDot;
