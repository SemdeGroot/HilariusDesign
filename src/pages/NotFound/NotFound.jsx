import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  return (
    <section className="notFound">
      <div className="notFoundInner">
        <p className="notFoundCode">404</p>
        <h1 className="notFoundTitle">Pagina niet gevonden</h1>
        <p className="notFoundBody">
          De pagina die je zoekt bestaat niet of is verplaatst.
        </p>
        <Link to="/" className="notFoundCta">
          <span className="notFoundCtaArrow">←</span>
          <span>Terug naar Home</span>
        </Link>
      </div>
    </section>
  );
}