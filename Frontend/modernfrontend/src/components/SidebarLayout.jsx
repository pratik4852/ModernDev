import { useState } from "react";
import Sidebar from "./Sidebar";


const SidebarLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 p-4">
        <h1>Dashboard</h1>
      </div>
    </div>
  );
};

export default SidebarLayout;