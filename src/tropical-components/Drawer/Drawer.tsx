import React from "react";
import { X } from "lucide-react";

interface DrawerProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  icon?: React.ReactNode;
  headerActions?: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  children,
  isOpen,
  onClose,
  title,
  icon,
  headerActions,
}) => {
  return (
    <>
      <div
        className={`drawer-backdrop ${isOpen ? "open" : ""}`}
        onClick={() => {
          console.log("Backdrop clicked");
          onClose();
        }}
      />
      <div className={`drawer-preview ${isOpen ? "open" : ""}`}>
        <div className="drawer-handle" onClick={onClose} />
        <div className="drawer-header">
          {icon && <span className="drawer-icon">{icon}</span>}
          {title && <div className="drawer-title">{title}</div>}
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              gap: "6px",
              alignItems: "center",
            }}
          >
            {headerActions}
            <div
              className="drawer-close"
              onClick={() => {
                console.log("Drawer close clicked");
                onClose();
              }}
            >
              <X size={16} />
            </div>
          </div>
        </div>
        <div className="drawer-body">{children}</div>
      </div>
    </>
  );
};
