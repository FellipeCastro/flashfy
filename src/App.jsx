import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Methodology from "./pages/Methodology/Methodology";
import Cards from "./pages/Cards/Cards";

const App = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />} />
                <Route path="/methodology" element={<Methodology isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />} />
                <Route path="/cards/:id" element={<Cards />} /> 
            </Routes>
        </BrowserRouter>
    );
};

export default App;
