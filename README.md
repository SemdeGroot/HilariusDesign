# HilariusDesign – Portfolio site (Vite + React)

Deze website is een statische portfolio-site (Vite + React + React Router) en wordt gehost op **Netlify**.
Als je op GitHub een tekst of afbeelding aanpast, bouwt Netlify automatisch een nieuwe versie en zet die live.

---

## Live & hosting (Netlify)

- **Productie (live site)** wordt automatisch gedeployed vanaf de `main` branch.
- Netlify bouwt de site en host deze als statische website.
- Routing is al ingesteld voor Netlify (zie `public/_redirects`), dus alle pagina’s werken als “single page app”.

---

## Snel wijzigen (zonder codekennis)

### 1) Teksten aanpassen (menu, categorieën, pagina’s)
Bijna alle tekst staat in:

- `src/router/routesConfig.js` (navigatie, categorieën, projectlijst, instellingen)
- `src/router/texts.js` (lange pagina-teksten zoals About/FAQ/Contact, plus Home-teksten)

#### Categorie-teksten (Home + Category pagina)
- Bestand: `src/router/routesConfig.js`
- Sectie: `categories[]`
- Per taal: `i18n.nl`, `i18n.en`, `i18n.de`

Belangrijke velden:
- `title` → korte titel (o.a. menu)
- `subtitle` → wordt gebruikt als tekst (o.a. Home hover + onderaan Category pagina)
- `titleLine1/titleLine2/titleLine3` → grote kop op de Category pagina (desktop)

Voorbeeld:
`src/router/routesConfig.js` → `categories[]` → `i18n.nl.subtitle`

#### Home teksten (“HilariusDesign” intro + “Van idee tot uitvoering”)
- Bestand: `src/router/texts.js`
- Sectie: `texts.home.i18n.{nl|en|de}`

Velden:
- `leadTitle`, `leadBody`
- `secondTitle`, `secondBody`

---

### 2) Project teksten aanpassen (project detailpagina)
Er zijn 2 niveaus:

#### A) Standaardtekst (als er geen override is)
- Bestand: `src/router/routesConfig.js`
- Functie: `defaultProjectI18n()`

#### B) Per project overriden (meest gebruikt)
- Bestand: `src/router/projectsData.js`
- Object: `projectOverrides`

Daar kun je per taal instellen:
- `title`
- `type`
- `year`
- `description` (korte intro op projectpagina)
- `body` (extra tekst, optioneel)

Belangrijk:
- De key in `projectOverrides` is het **exacte pad** onder `src/assets/images/`.

Voorbeeld key:
`"transport/bedrijfsautos/bedrijfsautos.jpg"`

---

### 3) Afbeeldingen aanpassen / vervangen
Alle images staan in:

`src/assets/images/...`

De site laadt images automatisch via Vite (zie `src/router/images.js`).

#### Categorie-cover op Home (welke afbeelding hoort bij welke categorie)
- Bestand: `src/router/routesConfig.js`
- Sectie: `homeCovers`

Voorbeeld:
`homeCovers.transport = "transport/heineken/heineken.jpg"`

#### Project cover + gallery
Projecten worden opgebouwd in:
- `src/router/routesConfig.js` → `projects: [...]`

De belangrijkste logica:
- `buildCategoryProjects()` maakt per categorie een lijst projecten op basis van een lijst bestanden.
- `getImagesInDir()` pakt automatisch alle images uit dezelfde folder voor de project-gallery.

Concreet:
Als een project-file is:
`transport/dieplader/dieplader.jpg`

Dan komt de gallery uit de map:
`src/assets/images/transport/dieplader/`

---

## Afbeeldingen vervangen op GitHub (stap-voor-stap)

1. Ga naar `src/assets/images/`
2. Klik door naar de juiste map (bijv. `transport/dieplader/`)
3. Klik **Add file → Upload files**
4. Upload de nieuwe afbeelding

### Belangrijk: bestandsnaam en extensie
De makkelijkste manier (geen code aanpassen):
- Houd **exact dezelfde bestandsnaam én extensie** aan.
  - Dus vervang `dieplader.jpg` door opnieuw `dieplader.jpg`.

Wil je transparantie gebruiken (PNG/WebP met alpha):
- Gebruik `.png` of `.webp`.
- Dan moet óók de verwijzing (waar die filename staat) worden aangepast:
  - in `homeCovers` (voor Home covers)
  - of in de projects-lijst (als je handmatig een file noemt)

Opmerking:
CSS kan een JPG niet transparant maken; transparantie kan alleen met PNG/WebP.

---

## Wat verandert waar (korte “spiekbrief”)

### Categorie beschrijvingen (Home hover + Category tekst)
- `src/router/routesConfig.js` → `categories[]` → `i18n.{nl|en|de}.subtitle`

### Project beschrijvingen (detailpagina)
- Standaard: `src/router/routesConfig.js` → `defaultProjectI18n()`
- Per project: `src/router/projectsData.js` → `projectOverrides`

### Home covers
- `src/router/routesConfig.js` → `homeCovers`

### Project images / galleries
- Images: `src/assets/images/...`
- Projectlijst: `src/router/routesConfig.js` → `projects` (via `buildCategoryProjects()`)

---

## Deployment workflow (GitHub → Netlify)

### Productie
- Push naar `main` → Netlify bouwt en deployt live.

### Werken met een “dev” branch (aanrader)
Je kunt een aparte branch gebruiken, bijvoorbeeld `dev`:

- In Netlify kun je **Branch deploys** aanzetten:
  - Netlify maakt dan automatisch een aparte deploy-url voor `dev`.
- Je kunt ook **Deploy Previews** gebruiken:
  - Als je een Pull Request maakt, krijg je automatisch een preview link via Netlify.

---

## Lokaal draaien (voor developers)

### Dev
```bash
npm install
npm run dev
