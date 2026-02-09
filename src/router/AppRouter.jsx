import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/Layout/Layout.jsx";
import Home from "../pages/Home/Home.jsx";
import Page from "../pages/Page/Page.jsx";
import Project from "../pages/Project/Project.jsx";

export default function AppRouter() {
  // Basename is optioneel; als je issues krijgt op project-pages,
  // kun je later <BrowserRouter basename="/repo/"> gebruiken.
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/category/:slug" element={<Home />} />
          <Route path="/project/:id" element={<Project />} />

          <Route path="/about" element={<Page pageKey="about" />} />
          <Route path="/services" element={<Page pageKey="services" />} />
          <Route path="/contact" element={<Page pageKey="contact" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
