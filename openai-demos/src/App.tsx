import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Route, Routes } from "react-router-dom";
import AksMe from "./components/askme";
import Products from "./components/products";
import Guides from "./components/guides";
import SideBar from "./components/sidebar";
import { ISettings } from "./interfaces";
import Translation from "./components/translation";
//import "./App.css";

const App = () => {
  const defaultSettings: ISettings = {
    temperature: "0.3",
    max_tokens: "300",
    n: "1",
    sensitive: false,
  };
  let [settings, setSettings] = useState<ISettings>(defaultSettings);
  const handleInputValue = (value: ISettings) => {
    console.info("Calling handler", value);
    setSettings(value);
  };
  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <SideBar settings={settings} handler={setSettings} />
        <div className="col p-4">
          <Routes>
            <Route path="/" element={<AksMe settings={settings} />} />
            <Route
              path="/products"
              element={<Products settings={settings} />}
            />
            <Route path="/guides" element={<Guides settings={settings} />} />
            <Route
              path="/translation"
              element={<Translation settings={settings} />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

// function App1() {
//   return (
//     <div className="App">
//       <nav className="bg-dark text-light p-2 mb-2">OpenAI Demos</nav>
//       <div className="row">
//         <div className="col-md-2 text-center">
//           <nav>
//             <div className="mb-3">
//               <Link to="/" className="btn btn-primary">
//                 Ask Anything
//               </Link>
//             </div>
//             <div className="mb-3 mt-3">
//               <Link to="/products" className="btn btn-primary">
//                 Products
//               </Link>
//             </div>
//             <div className="mb-3">
//               <Link to="/guides" className="btn btn-primary">
//                 Travel Guide
//               </Link>
//             </div>
//           </nav>
//         </div>
//         <div className="col-md-8">
//           <Routes>
//             <Route path="/" element={<AksMe />} />
//             <Route path="/products" element={<Products />} />
//             <Route path="/guides" element={<Guides />} />
//           </Routes>
//         </div>
//       </div>
//     </div>
//   );
// }

export default App;
