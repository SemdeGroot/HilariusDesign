// src/router/projectsData.js
// Hier beheer je per afbeelding (project) de velden zoals Title/Type/Jaar/Description + Body (extra tekst).
// Key = exact het pad onder src/assets/images/

export const projectOverrides = {
  // Transport
  "transport/bedrijfsautos/bedrijfsautos.jpg": {
    i18n: {
      nl: {
        title: "Bedrijfsauto’s",
        type: "Transportmodel / Relatiegeschenk",
        year: "—",
        description:
          "Kartonnen transportmodel voor relatiegeschenken en merkpresentaties.\n\nOntworpen voor eenvoudige assemblage en sterke visuele impact op een bureau of in een showroom.",
        body:
          "Extra tekst (optioneel):\n- Variaties in formaat en afwerking\n- Mogelijkheid voor persoonlijke boodschap\n- Inzetbaar voor mailing of event"
      },
      en: {
        title: "Company cars",
        type: "Transport model / Gift",
        year: "—",
        description:
          "Cardboard transport model for corporate gifts and brand presentations.\n\nDesigned for easy assembly and a strong visual presence on desks or in showrooms.",
        body: ""
      },
      de: {
        title: "Firmenwagen",
        type: "Transportmodell / Geschenk",
        year: "—",
        description:
          "Transportmodell aus Pappe für Werbegeschenke und Markenpräsentationen.\n\nKonzipiert für einfache Montage und starke Wirkung am Arbeitsplatz oder im Showroom.",
        body: ""
      }
    }
  },

  "transport/vrachtwagens/vrachtwagens.jpg": {
    i18n: {
      nl: {
        title: "Vrachtwagens",
        type: "Transportmodel / Relatiegeschenk",
        year: "—",
        description:
          "Vrachtwagenmodellen in gerecycled karton, geschikt voor acties, events en langdurige merkzichtbaarheid.\n\nLeverbaar in verschillende formaten en volledig te personaliseren."
      }
    }
  },

  // Bureau accessoires
  "bureau-accessoires/klokken/klokken.jpg": {
    i18n: {
      nl: {
        title: "Klokken",
        type: "Bureau-accessoire",
        year: "—",
        description:
          "Compacte (wand)klok in gerecycled karton. Strak ontwerp met veel ruimte voor branding.\n\nGeschikt als mailing item of give-away bij productintroducties."
      }
    }
  },

  // Wijnverpakkingen
  "wijnverpakkingen-displays/vikokoker/vikokoker.jpg": {
    i18n: {
      nl: {
        title: "Viko koker",
        type: "Verpakking / Koker",
        year: "2009",
        description:
          "Luxe kartonnen koker met slimme sluiting (Europees patent).\n\nDoel: premium uitstraling zonder nietjes of tape, en snel op te zetten in productie."
      }
    }
  }
};

// Volgorde in categorie-tabellen.
// Alles wat hier niet in staat komt daarna alfabetisch.
export const projectOrder = {
  transport: [
    "transport/vrachtwagens/vrachtwagens.jpg",
    "transport/bedrijfsautos/bedrijfsautos.jpg"
  ],
  "bureau-accessoires": [
    "bureau-accessoires/klokken/klokken.jpg"
  ]
};
