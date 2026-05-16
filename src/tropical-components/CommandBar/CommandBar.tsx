import React from 'react';

export type CommandBarPlatform = 'windows' | 'macos' | 'linux-gnome';

interface CommandBarProps {
  children: React.ReactNode;
  platform?: CommandBarPlatform;
  title?: string;
  className?: string;
}

export const CommandBar: React.FC<CommandBarProps> = ({ 
  children, 
  platform = 'macos',
  title,
  className = ''
}) => {
  return (
    <div className={`command-bar cb-platform-${platform} ${className}`}>
      {platform === 'macos' && (
        <div className="cb-traffic-lights">
          <div className="cb-dot r" />
          <div className="cb-dot y" />
          <div className="cb-dot g" />
        </div>
      )}
      
      {platform === 'linux-gnome' && (
        <div className="cb-gnome-controls">
          <div className="cb-gnome-btn close"><i className="ti ti-x"></i></div>
        </div>
      )}

      <div className="cb-content">
        {title && <div className="cb-title">{title}</div>}
        {children}
      </div>

      {platform === 'windows' && (
        <div className="cb-win-controls">
          <div className="cb-win-btn"><i className="ti ti-minus"></i></div>
          <div className="cb-win-btn"><i className="ti ti-square"></i></div>
          <div className="cb-win-btn close"><i className="ti ti-x"></i></div>
        </div>
      )}

      {platform === 'linux-gnome' && (
        <div className="cb-gnome-actions">
          <div className="cb-gnome-btn"><i className="ti ti-minus"></i></div>
          <div className="cb-gnome-btn"><i className="ti ti-square"></i></div>
        </div>
      )}
    </div>
  );
};

interface CommandBarSegmentProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'neutral';
  onClick?: () => void;
  active?: boolean;
  style?: React.CSSProperties;
}

export const CommandBarSegment: React.FC<CommandBarSegmentProps> = ({
  children,
  variant = 'neutral',
  onClick,
  active,
  style
}) => {
  return (
    <div 
      className={`cb-seg ${variant} ${active ? 'active' : ''}`}
      onClick={onClick}
      style={style}
    >
      <span className="cb-seg-inner">{children}</span>
    </div>
  );
};

export const CommandBarDivider: React.FC = () => <div className="cb-div" />;
export const CommandBarSpacer: React.FC = () => <div className="cb-spacer" />;
