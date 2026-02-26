import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { routesConfig } from "../../router/routesConfig";
import { I18nContext } from "../../i18n/I18nProvider";
import { ChevronDown } from "lucide-react";
import "./Page.css";

/* ─── About ─────────────────────────────────────────────────── */
function AboutPage({ page }) {
  const { pick } = useContext(I18nContext);

  return (
    <section className="aboutLayout">
      <div className="aboutLeft">
        <div className="aboutImgWrap">
          <img
            src="/about-wim.jpg"
            alt="Wim Hilarius"
            className="aboutImg"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </div>
      </div>

      <div className="aboutRight">
        <p className="aboutSuper">Over Hilarius Design</p>
        <h1 className="aboutHeading">{pick(page, "heading")}</h1>
        <p className="aboutIntro">{pick(page, "intro")}</p>
        <div className="aboutBody">{pick(page, "body")}</div>

        <Link to="/" className="aboutCta">
          <span className="aboutCtaLabel">{pick(page, "cta")}</span>
          <span className="aboutCtaArrow">→</span>
        </Link>
      </div>
    </section>
  );
}

/* ─── FAQ ────────────────────────────────────────────────────── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`faqItem ${open ? "isOpen" : ""}`}>
      <button
        type="button"
        className="faqBtn"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="faqQ">{q}</span>
        <ChevronDown
          size={18}
          strokeWidth={1.8}
          className={`faqChev ${open ? "open" : ""}`}
        />
      </button>
      <div className="faqPanel">
        <p className="faqA">{a}</p>
      </div>
    </div>
  );
}

function FaqPage({ page }) {
  const { pick } = useContext(I18nContext);
  const items = pick(page, "items") ?? [];

  return (
    <section className="page">
      <h1 className="pageTitle">{pick(page, "title")}</h1>
      <p className="pageIntro">{pick(page, "intro")}</p>

      <div className="faqList">
        {items.map((item, i) => (
          <FaqItem key={i} q={item.q} a={item.a} />
        ))}
      </div>
    </section>
  );
}

/* ─── Contact ────────────────────────────────────────────────── */
function ContactPage({ page }) {
  const { pick } = useContext(I18nContext);
  const labels = pick(page, "formLabels") ?? {};
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    const form = e.target;
    const data = new FormData(form);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(data).toString()
    })
      .then(() => {
        setSent(true);
        setSubmitting(false);
      })
      .catch(() => {
        setSubmitting(false);
      });
  }

  return (
    <section className="contactLayout">
      <div className="contactLeft">
        <h1 className="pageTitle">{pick(page, "title")}</h1>
        <p className="pageIntro">{pick(page, "intro")}</p>

        <div className="contactDetails">
          <a
            className="contactDetailLink"
            href={`mailto:${routesConfig.contact.email}`}
          >
            {routesConfig.contact.email}
          </a>
          <a
            className="contactDetailLink"
            href={`tel:${routesConfig.contact.phone.replace(/\s/g, "")}`}
          >
            {routesConfig.contact.phone}
          </a>
          <div className="contactDetailText" style={{ whiteSpace: "pre-line" }}>
            {routesConfig.contact.address}
          </div>
          <a
            className="contactDetailLink"
            href={routesConfig.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </div>

        {sent ? (
          <div className="contactSuccess">{labels.success}</div>
        ) : (
          <form
            className="contactForm"
            name="contact"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
          >
            <input type="hidden" name="form-name" value="contact" />
            <input type="hidden" name="bot-field" />

            <div className="formGroup">
              <label className="formLabel" htmlFor="cf-name">
                {labels.name}
              </label>
              <input
                id="cf-name"
                className="formInput"
                type="text"
                name="name"
                required
                autoComplete="name"
              />
            </div>

            <div className="formGroup">
              <label className="formLabel" htmlFor="cf-email">
                {labels.email}
              </label>
              <input
                id="cf-email"
                className="formInput"
                type="email"
                name="email"
                required
                autoComplete="email"
              />
            </div>

            <div className="formGroup">
              <label className="formLabel" htmlFor="cf-message">
                {labels.message}
              </label>
              <textarea
                id="cf-message"
                className="formInput formTextarea"
                name="message"
                required
                rows={6}
              />
            </div>

            <button
              type="submit"
              className="formSubmit"
              disabled={submitting}
            >
              {submitting ? "..." : labels.send}
            </button>
          </form>
        )}
      </div>

      <div className="contactRight">
        <div className="contactImgWrap">
          <img
            src="/uitstalling.jpg"
            alt=""
            className="contactImg"
            onError={(e) => (e.currentTarget.parentElement.style.display = "none")}
          />
        </div>
      </div>
    </section>
  );
}

/* ─── Router ─────────────────────────────────────────────────── */
export default function Page({ pageKey }) {
  const page = routesConfig.pages[pageKey];

  if (pageKey === "about") return <AboutPage page={page} />;
  if (pageKey === "faq") return <FaqPage page={page} />;
  if (pageKey === "contact") return <ContactPage page={page} />;

  return null;
}