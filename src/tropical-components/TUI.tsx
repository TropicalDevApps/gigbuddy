import React from 'react';

interface TUIProps {
  children: React.ReactNode;
  className?: string;
}

export const TUIWindow: React.FC<TUIProps> = ({ children, className }) => (
  <div className={`tui-window tui-theme ${className || ''}`}>
    {children}
  </div>
);

export const TUIStatusBar: React.FC<TUIProps> = ({ children, className }) => (
  <div className={`tui-status-bar ${className || ''}`}>
    {children}
  </div>
);

export const TUIStatusSeg: React.FC<TUIProps & { dim?: boolean; variant?: string }> = ({ children, dim, variant, className }) => (
  <div className={`tui-status-seg ${dim ? 'dim' : ''} ${variant ? `tui-text-${variant}` : ''} ${className || ''}`}>
    {children}
  </div>
);

export const TUIPanel: React.FC<TUIProps & { title?: string }> = ({ title, children, className }) => (
  <div className={`tui-panel ${className || ''}`}>
    {title && <div className="tui-panel-header">{title}</div>}
    <div className="tui-panel-content">
      {children}
    </div>
  </div>
);

export const TUIRow: React.FC<TUIProps & { active?: boolean; selected?: boolean }> = ({ children, active, selected, className }) => (
  <div className={`tui-row ${active ? 'active' : ''} ${selected ? 'selected' : ''} ${className || ''}`}>
    {children}
  </div>
);

export const TUIText: React.FC<TUIProps & { variant?: 'primary' | 'success' | 'warning' | 'danger' | 'dim' }> = ({ children, variant, className }) => (
  <span className={`${variant ? `tui-text-${variant}` : ''} ${className || ''}`}>
    {children}
  </span>
);

export const TUIDivider: React.FC<{ className?: string }> = ({ className }) => <div className={`tui-divider ${className || ''}`} />;
