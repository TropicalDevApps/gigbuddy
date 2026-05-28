import React from 'react';

interface TerminalViewProps {
  children: React.ReactNode;
}

export const TerminalView: React.FC<TerminalViewProps> = ({ children }) => {
  return (
    <div className="terminal-window">
      <div className="terminal-header">
        <div className="terminal-buttons">
          <div className="terminal-btn close"></div>
          <div className="terminal-btn min"></div>
          <div className="terminal-btn max"></div>
        </div>
        <div className="terminal-title">bash — 80x24</div>
      </div>
      <div className="tui-block">
        {children}
      </div>
    </div>
  );
};
