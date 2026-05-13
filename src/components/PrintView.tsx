import React from 'react';
import { Song } from '../types';

interface PrintViewProps {
  printMode: 'library' | 'setlist' | null;
  songs: Song[];
}

export function PrintView({ printMode, songs }: PrintViewProps) {
  if (!printMode) return null;

  // Determine which songs to render
  let renderSongs: Song[] = [];
  if (printMode === 'library') {
    // Render all songs, perhaps sorted alphabetically by title
    renderSongs = [...songs].sort((a, b) => a.title.localeCompare(b.title));
  } else {
    // Render only the current setlist in order (songs is already the setlist in expected order)
    renderSongs = [...songs];
  }

  return (
    <div className="hidden print:block print:w-full print:bg-white print:text-black">
      {/* Setlist/Library Cover or Header */}
      <div className="break-after-page print:p-8">
        <h1 className="text-4xl font-bold mb-4">{printMode === 'library' ? 'Song Library' : 'Gig Setlist'}</h1>
        <p className="text-lg text-gray-600 mb-8">{new Date().toLocaleDateString()}</p>
        
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Table of Contents</h2>
          <ol className="list-decimal list-inside space-y-2 text-lg">
            {renderSongs.map(song => (
              <li key={song.id} className="border-b border-gray-200 pb-1">
                <span className="font-medium">{song.title}</span>
                {song.artist && <span className="text-gray-600"> - {song.artist}</span>}
                {song.key && <span className="float-right text-gray-500 font-mono text-sm mt-1">{song.key}</span>}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Pages for each song */}
      {renderSongs.map((song, index) => (
        <div 
          key={song.id} 
          className="print:p-8"
          style={{ pageBreakBefore: index === 0 ? 'auto' : 'always' }}
        >
          <div className="border-b-2 border-black pb-4 mb-6">
            <h1 className="text-3xl font-bold">{song.title}</h1>
            <div className="text-gray-600 mt-2 text-lg flex gap-4">
              {song.artist && <span>Artist: {song.artist}</span>}
              {song.key && <span>Key: {song.key}</span>}
              {song.bpm ? <span>BPM: {song.bpm}</span> : null}
            </div>
          </div>

          <div className="space-y-6">
            {song.sections?.map((section, sIdx) => (
              <div key={sIdx} className="break-inside-avoid">
                <h3 className="font-bold text-gray-800 uppercase tracking-wider mb-2 text-sm">{section.title}</h3>
                <div className="space-y-4">
                  {section.lines.map((line, lIdx) => (
                    <div key={lIdx} className="relative font-mono text-lg leading-relaxed pt-6 min-h-[2.5rem]">
                      {line.chords?.map((chord, cIdx) => (
                        <span 
                          key={cIdx}
                          className="absolute top-0 text-blue-700 font-bold text-sm bg-white/90 px-0.5 rounded"
                          style={{ left: `${chord.position}ch` }}
                        >
                          {chord.chord}
                        </span>
                      ))}
                      <span>{line.text || '\u00A0'}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
