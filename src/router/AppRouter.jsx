import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/Layout/Layout.jsx";
import Home from "../pages/Home/Home.jsx";
import Page from "../pages/Page/Page.jsx";
import Category from "../pages/Category/Category.jsx";
import Project from "../pages/Project/Project.jsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/project/:id" element={<Project />} />

          <Route path="/about" element={<Page pageKey="about" />} />
          <Route path="/faq" element={<Page pageKey="faq" />} />
          <Route path="/contact" element={<Page pageKey="contact" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
