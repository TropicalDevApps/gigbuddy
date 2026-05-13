import React from 'react';

export interface GigBuddyPlugin {
  id: string;
  name: string;
  icon: React.ReactNode;
  component: React.ComponentType;
  description: string;
}

export const PluginContainer: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => (
  <div className="bg-bg-card border border-white/10 rounded-lg overflow-hidden mb-4">
    <div className="bg-white/5 px-3 py-1 border-b border-white/10 flex justify-between items-center">
      <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim">{title}</span>
      <div className="flex gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-red-400 opacity-50"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 opacity-50"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-green-400 opacity-50"></div>
      </div>
    </div>
    <div className="p-3 font-mono text-xs">
      {children}
    </div>
  </div>
);
