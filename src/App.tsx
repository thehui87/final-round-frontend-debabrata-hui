// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
import TravelPage from "./pages/TravelPage";
import Sidebar from "./components/Sidebar";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full">
        <TravelPage />
      </div>
    </div>
  );
}

export default App;
