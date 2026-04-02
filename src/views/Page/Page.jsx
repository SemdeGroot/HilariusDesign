"use client";

import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { routesConfig } from "../../router/routesConfig";
import { I18nContext } from "../../i18n/I18nProvider";
import { Plus } from "lucide-react";
import "./Page.css";

function useFadeIn(delay = 0) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return visible;
}

/* ─── About ─────────────────────────────────────────────────── */
function AboutPage({ page }) {
  const { pick } = useContext(I18nContext);
  const imgVisible = useFadeIn(100);
  const textVisible = useFadeIn(300);

  return (
    <section className="aboutLayout">
      <div className="aboutLeft">
        <div className={`aboutImgWrap pageFade ${imgVisible ? "visible" : ""}`}>
          <img
            src="/over-wim.JPG"
            alt="Wim Hilarius"
            className="aboutImg"
          />
        </div>
      </div>

      <div className={`aboutRight pageFade ${textVisible ? "visible" : ""}`}>
        <p className="aboutSuper">Over Hilarius Design</p>
        <h1 className="aboutHeading">{pick(page, "heading")}</h1>
        <p className="aboutIntro">{pick(page, "intro")}</p>
        <div className="aboutBody">{pick(page, "body")}</div>

        <Link href="/" className="aboutCta">
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
        <Plus
          size={18}
          strokeWidth={1.8}
          className={`faqPlus ${open ? "open" : ""}`}
          aria-hidden="true"
        />
      </button>

      <div className={`faqPanel ${open ? "open" : ""}`}>
        <div className="faqPanelInner">
          <p className="faqA">{a}</p>
        </div>
      </div>
    </div>
  );
}

function FaqItemFade({ index, q, a }) {
  const visible = useFadeIn(200 + index * 80);
  return (
    <div className={`pageFade ${visible ? "visible" : ""}`}>
      <FaqItem q={q} a={a} />
    </div>
  );
}

function FaqPage({ page }) {
  const { pick } = useContext(I18nContext);
  const items = pick(page, "items") ?? [];
  const headerVisible = useFadeIn(100);

  return (
    <section className="page">
      <div className={`pageFade ${headerVisible ? "visible" : ""}`}>
        <h1 className="pageTitle">{pick(page, "title")}</h1>
        <p className="pageIntro">{pick(page, "intro")}</p>
      </div>

      <div className="faqList">
        {items.map((item, i) => (
          <FaqItemFade key={i} index={i} q={item.q} a={item.a} />
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
  const imgVisible = useFadeIn(100);
  const formVisible = useFadeIn(300);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    const form = e.target;
    const formData = new FormData(form);
    formData.set("form-name", "contact");

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString()
    })
      .then((response) => {
        if (response.ok) {
          setSent(true);
        } else {
          throw new Error("Form submission failed");
        }
        setSubmitting(false);
      })
      .catch(() => {
        setSubmitting(false);
      });
  }

  return (
    <div className="contactLayout">
      <div className="contactInfo">
        <div className={`contactImgWrap pageFade ${imgVisible ? "visible" : ""}`}>
          <img
            src="/contact-image.JPG"
            alt="HilariusDesign contact"
            className="contactImg"
          />
        </div>

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
          <a
            className="contactDetailLink"
            href={routesConfig.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <div className="contactDetailText" style={{ whiteSpace: "pre-line" }}>
            {routesConfig.contact.address}
          </div>
          <div className="contactDetailText">KVK 34321364</div>
          <div className="contactDetailText">BTW NL001184466B83</div>
        </div>
      </div>

      <div className={`contactFormCol pageFade ${formVisible ? "visible" : ""}`}>
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
    </div>
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
