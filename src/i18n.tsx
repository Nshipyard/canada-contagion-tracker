"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export type Lang = "en" | "fr";

const en = {
  banner: {
    line: "An open-source civic project. Not affiliated with the Government of Canada or the City of Toronto.",
    badge: "Open source",
  },
  nav: { ripple: "Ripple", findings: "Findings", developers: "Developers", data: "Data", back: "All projects" },
  hero: {
    kicker: "Nshipyard Canada · Housing",
    title: "Unaffordability travels.",
    sub: "The thesis: when Toronto prices out a nurse, she moves to Hamilton. Hamilton gets expensive. The wave rolls on to Brantford. This tracker tests that story against 45 years of new-housing prices across seven corridor cities. Kitchener-Waterloo prices rose 46.7% since 2017 while Toronto managed 2.9%. The wave is not a metaphor. It has a number.",
    cta1: "See the ripple",
    cta2: "Read the methodology",
  },
  stats: [
    { value: "+46.7%", label: "Kitchener-Waterloo new-home price growth, 2017 to 2026. Toronto: +2.9%. The corridor outran the core." },
    { value: "1.43x", label: "Kitchener-Waterloo's price index relative to Toronto's in 2026, both set to 100 in 2017. The gap closed, then reversed." },
    { value: "0.87-0.96", label: "Correlation of each corridor city's monthly price cycle with Toronto's, 2017-2026. One regional market, five speeds." },
    { value: "548", label: "Months of new-housing price data per city, January 1981 to August 2026, from Statistics Canada's open tables." },
  ],
  ripple: {
    kicker: "The ripple",
    title: "Watch the wave move.",
    body: "New Housing Price Index, rebased to 100 in 2017 for every city. Drag the year slider to see each corridor city's index pull away from or fall back toward Toronto. The second chart shows each city's index divided by Toronto's: above 1.0 means it outran Toronto since 2017.",
    year: "Year",
    indexTitle: "New-home price index, 2017 = 100",
    catchupTitle: "Index relative to Toronto (Toronto = 1.0)",
    legendNote: "2026 covers January to August only.",
    perCity: "Per-city detail",
    distance: "km from downtown Toronto",
    population: "2021 population",
    growth: "Growth since 2017",
    cycle: "Price-cycle correlation with Toronto",
    lead: "Cycle lead vs Toronto",
    months: "months ahead",
    noNhpi: "Not covered by the New Housing Price Index; tracked by census population and distance only.",
    pickCity: "Select a city",
  },
  findings: {
    kicker: "Findings",
    title: "What the wave shows.",
    items: [
      {
        title: "Kitchener-Waterloo is the epicentre",
        body: "New-home prices there rose 46.7% from 2017 to 2026 against Toronto's 2.9%, peaking at 154.0 on the 2017=100 index in 2022. By 2026 its index sat at 1.43 times Toronto's. The nurse did not stop in Hamilton; the wave kept going.",
      },
      {
        title: "The corridor front-ran the core",
        body: "Hamilton's monthly price cycle correlates 0.87 with Toronto's, but its turning points arrive roughly 6 months earlier. In the 2017-2026 window the corridor did not follow Toronto with a lag; in the pandemic surge it moved first, as Toronto buyers spilled outward.",
      },
      {
        title: "The boom was a corridor boom",
        body: "From 2017 to 2021, Kitchener-Waterloo gained 35.4%, Guelph 17.2%, Hamilton 13.5% and Oshawa 13.0%, all ahead of Toronto's 6.6%. The 2021-2026 correction then bit the corridor harder: Hamilton -6.6%, the rest near flat. Contagion cuts both ways.",
      },
      {
        title: "Toronto is flat since 2017",
        body: "Toronto's new-home index sits at 102.9 in 2026 against 100 in 2017. Four decades of growth, 53.2 in 2000 to 111.4 in 2022, then a full round trip. Anyone who bought the Toronto new-build peak is underwater on price while the corridor kept its gains.",
      },
      {
        title: "What this cannot say",
        body: "The New Housing Price Index tracks new homes only, not resale, and Toronto's new supply is mostly condos while the corridor builds detached houses. Resale price levels are proprietary (Teranet, CREA) and are not in this dataset. Barrie and Brantford have no NHPI coverage at all. The wave is measured in new-home prices; treat it as one lens, not the whole market.",
      },
    ],
  },
  methodology: {
    kicker: "Methodology",
    title: "How the wave was measured, and where it is weak.",
    items: [
      "Price source: Statistics Canada table 18-10-0205-01, New Housing Price Index, monthly January 1981 to August 2026, retrieved 2026-10-09. Five corridor CMAs are covered: Toronto, Hamilton, Oshawa, Guelph and Kitchener-Cambridge-Waterloo. Oshawa and Guelph enter the series in December 2016, so the comparison window is 2017-2026.",
      "Annual values are simple averages of the twelve monthly index readings; 2026 averages January to August only. Each city's series is rebased to 2017 = 100 for the catch-up comparison.",
      "The ripple metric is the city's rebased index divided by Toronto's rebased index. Above 1.0 means the city outran Toronto since 2017. Cycle correlation is the Pearson correlation of monthly year-over-year growth rates against Toronto's, 2017-2026; the lead in months is the lag that maximizes that correlation.",
      "City metadata: 2021 census populations from StatCan table 98-10-0003-01; distances are great-circle kilometres from Union Station, Toronto, computed from OpenStreetMap Nominatim coordinates, rounded to 0.1 km.",
      "NHPI measures contractor-reported prices for new houses with a fixed specification, land included. It is not a resale index, and its dwelling mix differs by city: Toronto's new supply is condominium-heavy, the corridor's is detached-heavy. Compare growth rates, not levels, across cities.",
      "Not used, on purpose: resale price levels are proprietary to Teranet and CREA and cannot be redistributed; census median dwelling values by CMA are not published in an accessible StatCan table. No price-to-income levels are computed. Every number on this site traces to the two open tables above.",
    ],
  },
  developers: {
    kicker: "For developers",
    title: "Query it from code, or from an agent.",
    body: "Three consumption paths, same open data. REST for applications, OpenAPI for integration, MCP tools over streamable HTTP for AI agents.",
    endpoints: "Endpoints",
    tryIt: "Try it",
    openapi: "OpenAPI spec",
    mcpTitle: "MCP server",
    mcpBody: "One streamable-HTTP endpoint. Tools: city_lookup, ripple_series, contagion_summary.",
  },
  mcp: {
    kicker: "Connect your agent",
    title: "Put this data to work inside your AI tools.",
    body: "Pick your harness, copy the prompt, send it to your agent. Your agent runs the setup itself.",
    tabs: { chatgpt: "ChatGPT", claude: "Claude", claudecode: "Claude Code", cli: "CLI", other: "Other" },
    cardTitle: "Copy and send this to {tab}",
    copy: "Copy",
    copied: "Copied",
    chatgptNote: "ChatGPT connects through the documented REST API rather than MCP directly.",
    pChatgpt:
      "I want to use the {displayName} through its API.\n- OpenAPI spec: {origin}/api/openapi.json\n- REST base: {origin}/api/v1\nFirst tell me in two sentences what this API offers, then {exampleLower}, and show me the result.",
    pClaude:
      "In Claude (claude.ai), open Settings, then Connectors, and add a custom connector:\n- Name: {displayName}\n- URL: {origin}/mcp\nThen list the available tools, {exampleLower}, and show me the result.",
    pClaudeCode:
      "Set up the {displayName} MCP server so I can query it from here.\n1. Run: claude mcp add --transport http {slug} {origin}/mcp\n2. Run `claude mcp list` to confirm it connected.\n3. {example}, and show me the result.",
    pCli:
      "# MCP endpoint (streamable HTTP)\n{origin}/mcp\n\n# List the available tools\ncurl -s -X POST {origin}/mcp -H 'Content-Type: application/json' \\\n  -d '{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/list\"}'",
    otherTitle: "Everything else",
    otherBody: "Any harness that speaks MCP over streamable HTTP, or plain REST.",
    mcpEndpoint: "MCP endpoint",
    openapiSpec: "OpenAPI spec",
    restBase: "REST base",
  },
  downloads: {
    kicker: "Data",
    title: "Take the files.",
    body: "The full dataset and the annual price series, MIT licensed, as JSON and CSV.",
    files: [
      { name: "contagion.json", desc: "Cities, annual NHPI series, catch-up ratios and ripple analysis" },
      { name: "nhpi_annual.csv", desc: "Annual average NHPI by CMA, 1981-2026, with Toronto-relative ratios" },
    ],
    download: "Download",
  },
  footer: {
    line: "An open-source civic project. Not affiliated with the Government of Canada or the City of Toronto.",
    sources: "Price source: Statistics Canada table 18-10-0205-01 (New Housing Price Index). Populations: StatCan table 98-10-0003-01 (2021 Census). Coordinates: OpenStreetMap Nominatim.",
  },
};

export type Dict = typeof en;

const fr: Dict = {
  banner: {
    line: "Un projet civique à code source ouvert. Sans affiliation avec le gouvernement du Canada ni la Ville de Toronto.",
    badge: "Code source ouvert",
  },
  nav: { ripple: "Vague", findings: "Constats", developers: "Développeurs", data: "Données", back: "Tous les projets" },
  hero: {
    kicker: "Nshipyard Canada · Logement",
    title: "L'inabordabilité voyage.",
    sub: "La thèse : quand Toronto exclut une infirmière du marché, elle déménage à Hamilton. Hamilton devient cher. La vague déferle jusqu'à Brantford. Ce traqueur confronte ce récit à 45 ans de prix des logements neufs dans sept villes du corridor. Les prix à Kitchener-Waterloo ont grimpé de 46,7 % depuis 2017 contre 2,9 % à Toronto. La vague n'est pas une métaphore. Elle a un chiffre.",
    cta1: "Voir la vague",
    cta2: "Lire la méthodologie",
  },
  stats: [
    { value: "+46,7 %", label: "Hausse des prix des logements neufs à Kitchener-Waterloo, 2017 à 2026. Toronto : +2,9 %. Le corridor a dépassé le centre." },
    { value: "1,43x", label: "Indice des prix de Kitchener-Waterloo par rapport à celui de Toronto en 2026, base 100 en 2017 pour les deux. L'écart s'est refermé, puis inversé." },
    { value: "0,87-0,96", label: "Corrélation du cycle mensuel des prix de chaque ville du corridor avec celui de Toronto, 2017-2026. Un marché régional, cinq vitesses." },
    { value: "548", label: "Mois de données sur les prix des logements neufs par ville, de janvier 1981 à août 2026, tirés des tableaux ouverts de Statistique Canada." },
  ],
  ripple: {
    kicker: "La vague",
    title: "Regardez la vague avancer.",
    body: "Indice des prix des logements neufs, base 100 en 2017 pour chaque ville. Déplacez le curseur d'année pour voir l'indice de chaque ville s'éloigner de Toronto ou s'en rapprocher. Le deuxième graphique divise l'indice de chaque ville par celui de Toronto : au-dessus de 1,0, la ville a dépassé Toronto depuis 2017.",
    year: "Année",
    indexTitle: "Indice des prix des logements neufs, 2017 = 100",
    catchupTitle: "Indice par rapport à Toronto (Toronto = 1,0)",
    legendNote: "2026 couvre de janvier à août seulement.",
    perCity: "Détail par ville",
    distance: "km du centre-ville de Toronto",
    population: "Population 2021",
    growth: "Croissance depuis 2017",
    cycle: "Corrélation du cycle des prix avec Toronto",
    lead: "Avance du cycle sur Toronto",
    months: "mois d'avance",
    noNhpi: "Non couverte par l'Indice des prix des logements neufs; suivie par la population du recensement et la distance seulement.",
    pickCity: "Choisir une ville",
  },
  findings: {
    kicker: "Constats",
    title: "Ce que la vague montre.",
    items: [
      {
        title: "Kitchener-Waterloo est l'épicentre",
        body: "Les prix des logements neufs y ont grimpé de 46,7 % de 2017 à 2026 contre 2,9 % à Toronto, culminant à 154,0 (base 100 en 2017) en 2022. En 2026, son indice vaut 1,43 fois celui de Toronto. L'infirmière ne s'est pas arrêtée à Hamilton; la vague a continué.",
      },
      {
        title: "Le corridor a devancé le centre",
        body: "Le cycle mensuel des prix de Hamilton est corrélé à 0,87 avec celui de Toronto, mais ses points de retournement arrivent environ 6 mois plus tôt. Sur 2017-2026, le corridor n'a pas suivi Toronto avec du retard; pendant la flambée pandémique, il a bougé le premier, porté par les acheteurs qui quittaient Toronto.",
      },
      {
        title: "L'essor était celui du corridor",
        body: "De 2017 à 2021, Kitchener-Waterloo a gagné 35,4 %, Guelph 17,2 %, Hamilton 13,5 % et Oshawa 13,0 %, tous devant les 6,6 % de Toronto. La correction de 2021-2026 a ensuite frappé le corridor plus fort : Hamilton -6,6 %, les autres presque stables. La contagion frappe dans les deux sens.",
      },
      {
        title: "Toronto est stable depuis 2017",
        body: "L'indice des logements neufs de Toronto est à 102,9 en 2026 contre 100 en 2017. Quatre décennies de croissance, de 53,2 en 2000 à 111,4 en 2022, puis un aller-retour complet. Quiconque a acheté au sommet torontois paie le prix fort pendant que le corridor conservait ses gains.",
      },
      {
        title: "Ce que ceci ne peut pas dire",
        body: "L'Indice des prix des logements neufs ne suit que le neuf, pas la revente, et l'offre neuve de Toronto est surtout des condos alors que le corridor construit des maisons individuelles. Les prix de revente sont la propriété de Teranet et de l'ACI et ne figurent pas ici. Barrie et Brantford ne sont pas couvertes du tout. La vague est mesurée sur le neuf; c'est une lentille, pas tout le marché.",
      },
    ],
  },
  methodology: {
    kicker: "Méthodologie",
    title: "Comment la vague a été mesurée, et où elle est faible.",
    items: [
      "Source des prix : tableau 18-10-0205-01 de Statistique Canada, Indice des prix des logements neufs, mensuel de janvier 1981 à août 2026, récupéré le 2026-10-09. Cinq RMR du corridor sont couvertes : Toronto, Hamilton, Oshawa, Guelph et Kitchener-Cambridge-Waterloo. Oshawa et Guelph entrent dans la série en décembre 2016; la fenêtre de comparaison est donc 2017-2026.",
      "Les valeurs annuelles sont des moyennes simples des douze lectures mensuelles; 2026 moyenne janvier à août seulement. Chaque série est ramenée à 2017 = 100 pour la comparaison de rattrapage.",
      "La mesure de la vague divise l'indice rebasé de chaque ville par celui de Toronto. Au-dessus de 1,0, la ville a dépassé Toronto depuis 2017. La corrélation des cycles est la corrélation de Pearson des taux de croissance annuels mensuels contre Toronto, 2017-2026; l'avance en mois est le décalage qui maximise cette corrélation.",
      "Métadonnées des villes : populations du recensement 2021 du tableau 98-10-0003-01 de StatCan; distances en kilomètres orthodromiques depuis la gare Union de Toronto, calculées à partir des coordonnées Nominatim d'OpenStreetMap, arrondies à 0,1 km.",
      "L'IPLN mesure les prix déclarés par les entrepreneurs pour des maisons neuves à spécification fixe, terrain inclus. Ce n'est pas un indice de revente, et le type de logements diffère selon la ville : Toronto construit surtout des condos, le corridor des maisons individuelles. Comparez les taux de croissance, pas les niveaux, entre les villes.",
      "Non utilisé, à dessein : les prix de revente appartiennent à Teranet et à l'ACI et ne peuvent être redistribués; les valeurs médianes des logements du recensement par RMR ne sont pas publiées dans un tableau accessible de StatCan. Aucun ratio prix-revenu n'est calculé. Chaque chiffre de ce site remonte aux deux tableaux ouverts ci-dessus.",
    ],
  },
  developers: {
    kicker: "Pour les développeurs",
    title: "Interrogez-la depuis du code, ou depuis un agent.",
    body: "Trois façons de consommer les mêmes données ouvertes. REST pour les applications, OpenAPI pour l'intégration, outils MCP en HTTP continu pour les agents IA.",
    endpoints: "Points de terminaison",
    tryIt: "Essayer",
    openapi: "Spécification OpenAPI",
    mcpTitle: "Serveur MCP",
    mcpBody: "Un point de terminaison HTTP continu. Outils : city_lookup, ripple_series, contagion_summary.",
  },
  mcp: {
    kicker: "Connectez votre agent",
    title: "Exploitez ces données dans vos outils d'IA.",
    body: "Choisissez votre plateforme, copiez l'invite, envoyez-la à votre agent. Votre agent exécute la configuration lui-même.",
    tabs: { chatgpt: "ChatGPT", claude: "Claude", claudecode: "Claude Code", cli: "CLI", other: "Autre" },
    cardTitle: "Copiez et envoyez ceci à {tab}",
    copy: "Copier",
    copied: "Copié",
    chatgptNote: "ChatGPT se connecte via l'API REST documentée plutôt que directement en MCP.",
    pChatgpt:
      "Je veux utiliser {displayName} via son API.\n- Spécification OpenAPI : {origin}/api/openapi.json\n- Base REST : {origin}/api/v1\nD'abord, dis-moi en deux phrases ce que cette API offre, puis {exampleLower}, et montre-moi le résultat.",
    pClaude:
      "Dans Claude (claude.ai), ouvre les paramètres, puis Connecteurs, et ajoute un connecteur personnalisé :\n- Nom : {displayName}\n- URL : {origin}/mcp\nEnsuite, liste les outils disponibles, {exampleLower}, et montre-moi le résultat.",
    pClaudeCode:
      "Configure le serveur MCP {displayName} pour que je puisse l'interroger d'ici.\n1. Exécute : claude mcp add --transport http {slug} {origin}/mcp\n2. Exécute `claude mcp list` pour confirmer la connexion.\n3. {example}, et montre-moi le résultat.",
    pCli:
      "# Point de terminaison MCP (HTTP continu)\n{origin}/mcp\n\n# Lister les outils disponibles\ncurl -s -X POST {origin}/mcp -H 'Content-Type: application/json' \\\n  -d '{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/list\"}'",
    otherTitle: "Tout le reste",
    otherBody: "Toute plateforme qui parle MCP en HTTP continu, ou REST tout court.",
    mcpEndpoint: "Point de terminaison MCP",
    openapiSpec: "Spécification OpenAPI",
    restBase: "Base REST",
  },
  downloads: {
    kicker: "Données",
    title: "Prenez les fichiers.",
    body: "Le jeu de données complet et la série annuelle des prix, sous licence MIT, en JSON et CSV.",
    files: [
      { name: "contagion.json", desc: "Villes, séries annuelles de l'IPLN, ratios de rattrapage et analyse de la vague" },
      { name: "nhpi_annual.csv", desc: "IPLN annuel moyen par RMR, 1981-2026, avec ratios par rapport à Toronto" },
    ],
    download: "Télécharger",
  },
  footer: {
    line: "Un projet civique à code source ouvert. Sans affiliation avec le gouvernement du Canada ni la Ville de Toronto.",
    sources: "Source des prix : tableau 18-10-0205-01 de Statistique Canada (Indice des prix des logements neufs). Populations : tableau 98-10-0003-01 (Recensement 2021). Coordonnées : Nominatim d'OpenStreetMap.",
  },
};

const dicts: Record<Lang, Dict> = { en, fr };

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Dict }>({
  lang: "en",
  setLang: () => {},
  t: en,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return <LangCtx.Provider value={{ lang, setLang, t: dicts[lang] }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  return useContext(LangCtx);
}
