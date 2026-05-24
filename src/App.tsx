/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import { ConfigProvider } from "./context/ConfigContext";

export default function App() {
  return (
    <ConfigProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </ConfigProvider>
  );
}
