import React from 'react';

export default function SplitReveal({ text, className }) {
  // Splits text into masked words for GSAP targeting
  const words = text.split(" ").map((word, i) => (
    <span key={i} className="inline-block overflow-hidden align-bottom">
      <span className="gsap-word inline-block translate-y-full opacity-0">{word}</span>
      <span className="inline-block">&nbsp;</span>
    </span>
  ));

  return <span className={className}>{words}</span>;
}