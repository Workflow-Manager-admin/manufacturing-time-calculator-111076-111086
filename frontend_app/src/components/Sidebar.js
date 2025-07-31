import React from "react";
import { NavLink } from "react-router-dom";
import theme from "../theme";

// PUBLIC_INTERFACE
function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">MCT<span style={{ color: theme.colors.secondary }}>app</span></div>
      <nav>
        <NavLink to="/" end>
          Dashboard
        </NavLink>
        <NavLink to="/product">Product</NavLink>
        <NavLink to="/operations">Operations</NavLink>
        <NavLink to="/reports">Reports</NavLink>
      </nav>
      <div className="sidebar-footer">
        <span style={{ color: theme.colors.accent, fontWeight: "bold" }}>QRM</span> MCT Calculator
      </div>
    </aside>
  );
}

export default Sidebar;
