import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { transposeChord } from '../lib/musicUtils';
import { LyricsLine } from '../types';

export const LyricLine: React.FC<{ line: LyricsLine; transposeOffset?: number; textSizeMultiplier?: number; fontFamily?: string; chordBackground?: string }> = ({ line, transposeOffset = 0, textSizeMultiplier = 1, fontFamily = 'sans', chordBackground = 'none' }) => {
  const isChordsOnly = !line.text?.trim() && (line?.chords || []).length > 0;

  const renderChord = (chordStr: string) => (
    <motion.span 
      key={transposeOffset} // ensures re-animation on transpose
      initial={{ backgroundColor: 'rgba(255,255,255,0.4)', scale: 1.1 }}
      animate={{ backgroundColor: 'rgba(255,69,0,0.15)', scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "inline-flex items-center justify-center font-bold font-mono tracking-wider rounded whitespace-nowrap", 
        isChordsOnly ? "px-3 py-1 text-lg sm:text-xlg lg:text-2xl" : "px-1 sm:px-1.5 py-0.5 text-[0.65rem] sm:text-[0.75rem] lg:text-sm",
        chordBackground === 'none' ? 'text-brand shadow-none border border-transparent' : 
        chordBackground === 'subtle' ? 'bg-text-bright/5 text-brand border border-text-bright/10 shadow-sm' : 
        'bg-brand text-brand-contrast border border-brand'
      )}
    >
      {transposeChord(chordStr, transposeOffset)}
    </motion.span>
  );

  if (isChordsOnly) {
    return (
      <div className={cn(
        "relative group hover:bg-text-bright/[0.02] transition-colors -mx-2 sm:-mx-4 px-2 sm:px-4 rounded-xl", 
        "mb-8 sm:mb-12",
        `font-${fontFamily}`
      )} style={{ fontSize: `${textSizeMultiplier}rem` }}>
        <div className="flex flex-wrap gap-4 h-12 items-end">
          {(line.chords || []).map((c, i) => (
            <span key={i} className="inline-block">
              {renderChord(c.chord)}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Mixed text and chords
  return (
    <div className={cn(
      "relative group py-1 sm:py-2 hover:bg-text-bright/[0.02] transition-colors -mx-2 sm:-mx-4 px-2 sm:px-4 rounded-xl", 
      "mb-6 sm:mb-8",
      `font-${fontFamily}`
    )} style={{ fontSize: `${textSizeMultiplier}rem` }}>
      <div 
        className="flex flex-wrap items-end text-xl sm:text-2xl lg:text-4xl font-bold text-text-bright leading-relaxed tracking-tight"
        style={{ fontSize: `calc(clamp(1.125rem, 2vw, 1.5rem) * ${textSizeMultiplier})` }}
      >
        {(() => {
          const chords = [...(line.chords || [])].sort((a, b) => a.position - b.position);
          const elements = [];
          let currentIndex = 0;
          const text = line.text || "";

          chords.forEach((c, i) => {
            // Add Text before this chord
            if (c.position > currentIndex && currentIndex < text.length) {
              const textBefore = text.substring(currentIndex, c.position);
              elements.push(
                <span key={`text-${currentIndex}`} className="whitespace-pre">
                  {textBefore}
                </span>
              );
              currentIndex = c.position;
            }

            // Determine text under THIS chord
            const nextChord = chords[i + 1];
            let nextPos = nextChord ? nextChord.position : text.length;
            if (nextPos < currentIndex) nextPos = currentIndex;
            
            let textSegment = "";
            if (currentIndex < text.length) {
              textSegment = text.substring(currentIndex, nextPos);
              currentIndex = nextPos;
            }

            elements.push(
              <span key={`group-${i}`} className="inline-flex flex-col items-start -ml-1">
                <span className="mb-0.5 ml-1">
                  {renderChord(c.chord)}
                </span>
                <span className="whitespace-pre min-w-[1ch]">{textSegment || ' '}</span>
              </span>
            );
          });

          if (currentIndex < text.length) {
            elements.push(
              <span key={`text-${currentIndex}`} className="whitespace-pre">
                {text.substring(currentIndex)}
              </span>
            );
          }

          if (elements.length === 0 && text) {
            elements.push(
              <span key="full-text" className="whitespace-pre">{text}</span>
            );
          }

          return elements;
        })()}
      </div>
    </div>
  );
}