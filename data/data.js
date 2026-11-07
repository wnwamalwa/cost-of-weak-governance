// =====================================================================
// Cost of Weak Governance: all figures shown on the dashboard.
// Edit numbers here; the page reads everything from this file.
// Source unless stated: World Bank (2026), Kenya Economic Update No. 34,
// Special Focus on Governance Constraints to Economic Growth and Job Creation.
// =====================================================================
window.CWG_DATA = {
  updated: "7 November 2026",

  // ---- headline ----------------------------------------------------
  headline: {
    shareOfGDP: 0.02,          // governance constraints widen the deficit by ~2% of GDP a year (KEU 34)
    gdpKsh: 18.9e12,           // fallback nominal GDP (KSh); replaced by the live figure from the debt counter when available
    population: 54.54e6,       // fallback population; replaced by the live figure when available
    savingsKshBn: 192.8,       // three fixes, a year (KEU 34)
    savingsShareOfDeficit: 18, // % of the FY2026/27 deficit
    source: "KEU 34, pp. v, 2, 27",
  },

  // ---- live data from the Kenya National Debt Counter ---------------
  live: {
    debtApi: "https://kenyadebtcounter.vercel.app/api/debt/summary",
    indicatorsApi: "https://kenyadebtcounter.vercel.app/api/indicators/current",
    counterUrl: "https://kenyadebtcounter.vercel.app",
    fallbackDebtKsh: 13.72e12,
    fallbackDebtPerSec: 36321,
    fallbackDebtPctGDP: 72.5,      // shown until the live debt and GDP arrive
    fallbackDebtPerPerson: 251000,
  },

  // ---- fiscal snapshot (KEU 34) -------------------------------------
  fiscal: [
    { label: "Fiscal deficit FY2025/26", value: "6.8%", note: "of GDP, against 4.7% budgeted" },
    { label: "Primary balance FY2025/26", value: "−1.0%", note: "of GDP; +0.5% budgeted for FY2026/27" },
    { label: "Public debt", value: "69.9%", note: "of GDP" },
    { label: "Interest payments", value: "33.6%", note: "of revenue (5.8% of GDP)" },
  ],

  // ---- loss channels -------------------------------------------------
  channels: [
    {
      key: "A", tag: "Fiscal leakage", title: "Wider deficits, costlier debt",
      fig: "KSh 192.8 bn", figLabel: "a year saved by three fixes, about 18% of the FY2026/27 deficit",
      bullets: [
        "Cut procurement leakage by 10%: about <b>KSh 120 bn</b>",
        "Higher tax morale, +10% personal income tax: <b>KSh 50–60 bn</b>",
        "Lower risk premium on borrowing: <b>KSh 12.8 bn</b>",
        "Interest already takes <b>33.6%</b> of revenue",
      ],
      source: "KEU 34, pp. v, 2, 27",
    },
    {
      key: "B", tag: "Accountability", title: "Audit findings ignored",
      fig: "18–21%", figLabel: "of Auditor-General recommendations adopted (late 2025), down from 45% in 2015",
      bullets: [
        "<b>79%</b> of Public Accounts Committee recommendations (FY2020/21) still pending",
        "Only <b>25%</b> of Public Investment Committee recommendations implemented",
        "Parliament is <b>4–5 years</b> behind in reviewing audit reports",
      ],
      source: "KEU 34, p. 40",
    },
    {
      key: "C", tag: "Backbone costs", title: "Power that costs more",
      figLabel: "Electricity for businesses, US cents per kWh",
      bars: [
        { label: "Kenya", value: 17.5, highlight: true },
        { label: "Uganda", value: 11.8 },
        { label: "Morocco", value: 10.9 },
        { label: "South Africa", value: 10.0 },
        { label: "Viet Nam", value: 7.8 },
      ],
      bullets: [
        "Only <b>24%</b> of 42 power purchase agreements were competitively procured",
        "Mombasa port ranked <b>375 of 403</b> worldwide",
      ],
      source: "KEU 34, Table 5, pp. v, 27–28",
    },
    {
      key: "D", tag: "Firms and jobs", title: "Bribes that hold firms back",
      fig: "36%", figLabel: "of firms faced at least one bribe request in the past year",
      bullets: [
        "<b>39%</b> call corruption a major constraint (2025), up from 25% in 2013",
        "Firms facing bribes are <b>30%+ less likely</b> to innovate",
        "FDI below <b>0.5% of GDP</b> since 2018; peers 1.5–2%",
      ],
      source: "KEU 34, pp. v, 17, 32–36",
    },
    {
      key: "E", tag: "Households", title: "The informal “bribe tax”",
      fig: "Up to 20%", figLabel: "of an informal worker’s daily earnings lost to frontline bribes",
      bullets: [
        "Informal workers are <b>83.8%</b> of Kenya’s workforce",
        "<b>KSh 88 bn</b> a year paid to traffic police (World Bank 2025b)",
        "Riders report paying <b>KSh 50–100 a day</b> in bribes",
        "Poorer workers are more likely to pay",
      ],
      source: "KEU 34, pp. vi, 37–39 and note 91",
    },
    {
      key: "↗", tag: "The upside", title: "What reform could unlock", positive: true,
      fig: "+7.7 m", figLabel: "more and better jobs by 2035 with ambitious reform",
      bullets: [
        "GDP up to <b>22.3%</b> larger by 2035",
        "Household consumption up to <b>27%</b> higher",
        "Peers such as Ethiopia, India and Senegal already do better",
      ],
      source: "KEU 34, pp. 41–42",
    },
  ],

  // ---- Africa map: the six World Bank governance indicators ----------
  // Definitions follow the World Bank's Worldwide Governance Indicators.
  indicators: [
    { key: "CC", name: "Control of Corruption",
      what: "How far public power is used for private gain: petty and grand corruption, and the “capture” of the state by elites and private interests.",
      why: "This is the index behind the World Bank’s reform scenarios: improving it by one standard deviation could make Kenya’s economy 22% larger by 2035.",
      citizen: { line: "Corruption is a hidden tax: you pay it in higher prices, poorer services and more public debt.",
        items: [
          { icon: "🧾", title: "Your taxes", text: "Money lost to inflated contracts is money not spent on classrooms, medicines and roads. The gap is filled with more borrowing, and interest already takes a third of all the taxes Kenya collects." },
          { icon: "🛵", title: "Your daily earnings", text: "Bribes at a police stop or a county office can take up to a fifth of an informal worker’s daily earnings, says the World Bank. Most Kenyan workers are informal." },
          { icon: "💡", title: "Your power bill", text: "Kenyan businesses pay 17.5 US cents per kWh for electricity, more than in Uganda or South Africa. Only a quarter of power deals were competitively bought; those costs end up in the prices you pay." },
        ] } },
    { key: "GE", name: "Government Effectiveness",
      what: "The quality of public services and the civil service, its independence from political pressure, and how well policies are made, carried out and kept to.",
      why: "Weak delivery shows up in low development budget execution, stalled projects and pending bills.",
      citizen: { line: "Government effectiveness is whether your taxes turn into a working clinic, school or road.",
        items: [
          { icon: "🏥", title: "Services you use", text: "When budgets are not spent as planned, projects stall: half-built roads, dispensaries without staff, classrooms without desks." },
          { icon: "🏪", title: "Small businesses", text: "Government owes suppliers KSh 149.7 billion in unpaid bills. When it pays late, small firms cut jobs or close." },
          { icon: "⏳", title: "Your time", text: "Lost records, long queues and repeat visits are a cost too, especially for people who earn by the day." },
        ] } },
    { key: "RL", name: "Rule of Law",
      what: "How far people trust and follow the rules of society: contract enforcement, property rights, the police and the courts, and the risk of crime and violence.",
      why: "Slow courts and weak enforcement let corruption go unpunished; see the Judiciary and EACC figures on the Watchdogs tab.",
      citizen: { line: "Rule of law decides whether people who steal public money are caught, and whether your rights are protected.",
        items: [
          { icon: "⚖️", title: "Justice", text: "When cases drag on for years, stolen money is rarely recovered. Over 177,000 court cases are more than a year old." },
          { icon: "🏠", title: "Your land and contracts", text: "If you cannot enforce a contract or protect your title deed, you are less likely to invest, lend or hire." },
          { icon: "🚓", title: "Your safety", text: "Trust in the police and courts shapes how safe people feel, and how much they pay to stay safe." },
        ] } },
    { key: "RQ", name: "Regulatory Quality",
      what: "Whether government can make and apply sound policies and regulations that allow and promote private sector development.",
      why: "Frequent tax and levy changes and unpredictable rules hold back investment; FDI has stayed below 0.5% of GDP since 2018.",
      citizen: { line: "Good rules let businesses grow and create jobs; unpredictable rules make them wait.",
        items: [
          { icon: "💼", title: "Jobs", text: "Frequent changes to taxes and levies make firms hesitate to invest. Foreign investment has stayed below 0.5% of GDP since 2018, a third of what peers attract." },
          { icon: "🛒", title: "Prices", text: "New levies and fees are usually passed on to customers in the price of goods." },
          { icon: "📝", title: "Starting out", text: "Each extra permit or licence is another place where a bribe can be asked for." },
        ] } },
    { key: "VA", name: "Voice and Accountability", short: "Voice & Accountability",
      what: "How far citizens can take part in choosing their government, and enjoy freedom of expression, freedom of association and a free media.",
      why: "Citizens, media and Parliament are the first line of oversight on how public money is spent.",
      citizen: { line: "Voice and accountability is your power to question how public money is spent, and to be heard.",
        items: [
          { icon: "🗣️", title: "Your voice in the budget", text: "Public participation and a free media are how waste gets exposed before it becomes debt." },
          { icon: "🔎", title: "Oversight", text: "Only about one in five of the Auditor-General’s recommendations is acted on. Citizens asking questions keeps the pressure on." },
          { icon: "📊", title: "Information", text: "Open data, like the figures on this dashboard, lets anyone check what government promised against what it delivered." },
        ] } },
    { key: "PV", name: "Political Stability and Absence of Violence", short: "Political Stability",
      what: "The likelihood of political instability or politically motivated violence, including terrorism.",
      why: "Instability raises the risk premium on borrowing and deters investment. Kenya’s score fell sharply in 2024, the year of the Finance Bill protests.",
      citizen: { line: "Stability affects your livelihood today and the interest Kenya pays on its debt tomorrow.",
        items: [
          { icon: "🏬", title: "Your livelihood", text: "Unrest closes shops, stops transport and keeps tourists away; daily earners feel it first." },
          { icon: "💸", title: "Borrowing costs", text: "Investors charge a riskier country more to lend. Interest already takes about a third of Kenya’s revenue, money not spent on services." },
          { icon: "🏗️", title: "Investment", text: "Firms delay new factories and hiring when they cannot predict the next year." },
        ] } },
  ],

  // ---- expandable "spotlight" figures: click the big number for details ----
  // where = id of the container on the page
  spotlights: [
    {
      where: "spotCost", tag: "How big is the problem?", label: "Estimates of what corruption costs Kenya each year",
      fig: "KSh 194–608 bn", figNote: "depending on who you ask",
      stats: [
        { v: "KSh 194 bn", l: "African Development Bank estimate of annual losses" },
        { v: "≈ KSh 380 bn", l: "World Bank: extra deficit, about 2% of GDP" },
        { v: "KSh 608 bn", l: "figure cited by the Prime Cabinet Secretary in 2024 (3.8% of GDP)" },
      ],
      more: [
        { h: "Why the estimates differ", p: "They measure different things. The African Development Bank and the 2024 government figure try to count money lost to corruption. The World Bank estimates how much weak governance widens the budget deficit, through overspending and lost revenue." },
        { h: "What they agree on", p: "Every estimate runs to hundreds of billions of shillings a year: between about 1% and 4% of GDP. Even the lowest is larger than many ministries’ budgets." },
      ],
      caveat: "No one can count corruption directly. Treat these as a range of informed estimates, not a measured loss, and do not add them together.",
      source: "World Bank, Kenya Economic Update No. 34 (Nov 2026), p. 23 and note 21, citing the African Development Bank (2025) and remarks by Prime Cabinet Secretary Mudavadi (Aug 2024).",
    },
    {
      where: "spotLosses", tag: "Standard Gauge Railway", label: "Could have been saved on the Mombasa–Nairobi railway",
      fig: "US$900 m", figNote: "at Tanzania’s cost per kilometre",
      stats: [
        { v: "US$7.6 m", l: "per km, Mombasa–Nairobi (diesel)" },
        { v: "US$5.7 m", l: "per km, Dar es Salaam–Dodoma, Tanzania (electric)" },
        { v: "≥ 30%", l: "of the extra cost attributed to governance problems" },
      ],
      more: [
        { h: "The comparison", p: "Kenya’s line cost more per kilometre than Tanzania’s Dar es Salaam–Dodoma line (US$5.7 m) and the Djibouti–Addis Ababa line (US$5.3 m), even though both of those are electrified and Kenya’s runs on diesel." },
        { h: "What went wrong", p: "The World Bank points to direct contracting instead of competitive tendering, land speculation, and outright fraud around land titling, valuation and compensation payments. It attributes at least 30% of the extra cost to these governance problems rather than to terrain or technical differences." },
        { h: "Why it matters to you", p: "The railway was built with borrowed money. Every extra dollar spent is a dollar Kenyans repay, with interest." },
      ],
      caveat: "Not all of the US$900 m gap is corruption. The World Bank attributes at least 30% of it (about US$270 m) to governance problems; the rest may reflect differences between the projects.",
      source: "World Bank, Kenya Economic Update No. 34 (Nov 2026), p. 26.",
    },
    {
      where: "spotLosses", tag: "Lake Turkana wind power", label: "Reportedly paid for electricity that was never used",
      fig: "US$150 m", figNote: "in ‘take-or-pay’ penalties",
      stats: [
        { v: "Take-or-pay", l: "the contract pays for power the plant can produce, used or not" },
        { v: "Delayed line", l: "the transmission line was late, so the power could not be delivered" },
        { v: "Your bill", l: "costs like these feed into Kenya’s high power prices" },
      ],
      more: [
        { h: "What happened", p: "Delays in building the transmission line meant the wind farm’s power could not reach the grid. Under the contract’s take-or-pay terms, government reportedly paid the equivalent of US$150 million for energy that was never used. There were also allegations that land for the project was acquired irregularly." },
        { h: "The bigger picture", p: "Only 24% of Kenya’s 42 power purchase agreements were competitively procured. Kenyan businesses pay 17.5 US cents per kWh, more than in Uganda, Morocco, South Africa or Viet Nam." },
      ],
      caveat: "These are allegations reported by the World Bank from public sources, not court findings.",
      source: "World Bank, Kenya Economic Update No. 34 (Nov 2026), p. 28 and note 56.",
    },
    {
      where: "spotLevers", tag: "Procurement transparency", label: "Share of public procurement published with winners and contract amounts",
      fig: "≈ 15%", figNote: "KSh 186 bn of about KSh 1.2 trillion",
      stats: [
        { v: "KSh 1.2 tn", l: "estimated spending through public procurement a year" },
        { v: "KSh 410 bn", l: "with at least some data published (FY2024/25)" },
        { v: "KSh 186 bn", l: "with full details: bid winners and contract amounts" },
      ],
      more: [
        { h: "Why it matters", p: "If you cannot see who won a contract and for how much, you cannot check whether the price was fair. Procurement is where the World Bank finds the largest savings: cutting leakage by 10% would save about KSh 120 bn a year." },
        { h: "What is changing", p: "Kenya moved to electronic government procurement (e-GP) in 2025. Procurement plans worth KSh 347 bn, about 2% of GDP, have now been published." },
        { h: "What to track", p: "The share of procurement spending published in full on the e-GP portal, every year, until it reaches 100%." },
      ],
      caveat: "The KSh 1.2 trillion total is the World Bank’s working assumption, so the 15% share is approximate.",
      source: "World Bank, Kenya Economic Update No. 34 (Nov 2026), pp. 25–27.",
    },
  ],

  // ---- what Kenya's watchdogs report ---------------------------------
  watchdogs: [
    {
      key: "OAG", tag: "Auditor-General", title: "Bills pile up, money moves without approval",
      fig: "KSh 149.7 bn", figLabel: "pending bills owed by national government ministries, departments and agencies (MDAs), FY2024/25 (up from KSh 130.3 bn)",
      bullets: [
        "<b>KSh 113.2 bn</b> of Exchequer releases backdated to 30 June 2025",
        "<b>KSh 10.2 bn</b> withdrawn without the approval Article 223 requires",
        "Audit opinions improving: qualified opinions fell from <b>109 to 56</b> (FY2022/23–FY2024/25), but disclaimers rose from 1 to 3",
      ],
      source: "Office of the Auditor-General, Summary Report on National Government FY2024/25, pp. 6, 12, 24, 31",
      url: "https://www.oagkenya.go.ke/wp-content/uploads/2026/05/AUDITOR-GENERALS-SUMMARY-REPORT-ON-NATIONAL-GOVERNMENT-–-2024-2025-2.pdf",
    },
    {
      key: "EACC", tag: "Ethics and Anti-Corruption Commission", title: "Traced far more than recovered",
      fig: "KSh 3.4 bn", figLabel: "recovered in FY2024/25, out of KSh 22.9 bn of suspected corrupt assets traced",
      bullets: [
        "<b>KSh 16.5 bn</b> of potential losses averted",
        "<b>4,183</b> corruption reports; <b>175</b> files sent to the prosecutor",
        "<b>33</b> convictions out of 54 cases concluded",
      ],
      compareRecovered: 3.4,   // KSh bn; compared on the page with the headline annual cost
      source: "EACC Annual Report FY2024/25, as reported by Capital FM, Dec 2025",
      url: "https://www.capitalfm.co.ke/news/2025/12/eacc-2024-2025-anti-corruption-report-numbers/",
    },
    {
      key: "⚖", tag: "Judiciary", title: "Courts clearing corruption cases, slowly",
      fig: "2,909", figLabel: "corruption and economic crimes cases resolved in FY2025/26, against 2,852 filed (102% clearance rate)",
      bullets: [
        "The pending corruption caseload fell, but only by about <b>57 cases</b> in the year",
        "Across all courts: <b>601,490</b> cases pending, <b>177,081</b> of them over a year old (FY2024/25)",
        "EACC in FY2025/26: <b>KSh 3.63 bn</b> recovered, <b>KSh 7.3 bn</b> preserved, 46 civil suits worth <b>KSh 14.1 bn</b>",
      ],
      source: "Administration of Justice in Kenya Annual Report 2025/26 (Capital FM, 3 Nov 2026); State of the Judiciary Report 2024/25, p. xviii",
      url: "https://allafrica.com/stories/202611030570.html",
    },
    {
      key: "TI", tag: "Transparency International", title: "Perceived corruption getting worse",
      fig: "30 / 100", figLabel: "Kenya’s Corruption Perceptions Index score for 2025, ranked 130 of 182 (121st in 2024)",
      bars: [
        { label: "Rwanda", value: 58 },
        { label: "Botswana", value: 58 },
        { label: "Tanzania", value: 40 },
        { label: "SSA average", value: 32 },
        { label: "Kenya", value: 30, highlight: true },
        { label: "Uganda", value: 25 },
      ],
      bullets: [
        "Down from 32 in 2024; between 25 and 33 for 13 years",
      ],
      source: "Transparency International Kenya, CPI 2025, Feb 2026",
      url: "https://tikenya.org/?p=10699",
    },
  ],

  // ---- Kenya against benchmarks (paired comparisons) -----------------
  // lowerIsBetter decides which bar is shown as the gap.
  benchmarks: [
    { label: "Fiscal deficit, % of GDP (FY2025/26)", kenya: 6.8, kenyaLabel: "Outturn", bench: 4.7, benchLabel: "Budget", unit: "%", lowerIsBetter: true },
    { label: "Auditor-General recommendations adopted, %", kenya: 19.5, kenyaLabel: "Late 2025 (18–21)", bench: 45, benchLabel: "2015", unit: "%" },
    { label: "Firms citing corruption as a major constraint, %", kenya: 39, kenyaLabel: "2025", bench: 25, benchLabel: "2013", unit: "%", lowerIsBetter: true },
    { label: "Foreign direct investment, % of GDP", kenya: 0.5, kenyaLabel: "Kenya (below)", bench: 1.75, benchLabel: "Lower-middle-income peers (1.5–2.0)", unit: "%" },
    { label: "Exports, % of GDP", kenya: 17.1, kenyaLabel: "Kenya", bench: 27.2, benchLabel: "Peers", unit: "%" },
    { label: "Business electricity tariff, US¢/kWh", kenya: 17.5, kenyaLabel: "Kenya", bench: 10.1, benchLabel: "Average of 4 comparators", unit: "", lowerIsBetter: true },
  ],

  // ---- reform scenarios to 2035 (KEU 34, pp. 41–42) ------------------
  scenarios: [
    { name: "Moderate", gdp: "+8.7%", jobs: "~3.0 m", share: "10%",
      desc: "Control of corruption improves by 0.3 standard deviations, about 10 places up the global rankings (around Togo or the Philippines). Debt-to-GDP falls markedly compared with no reform." },
    { name: "Intermediate", gdp: "+13%", jobs: "~4.5 m*", share: "16%",
      desc: "An improvement of 0.5 standard deviations, about 17 places up (around Ethiopia, Albania or India). *IEA conversion: 16% of the ~28.4 m working population in 2035." },
    { name: "Ambitious", gdp: "+22.3%", jobs: "~7.7 m", share: "27%",
      desc: "An improvement of one standard deviation (around Senegal or São Tomé and Príncipe). Household consumption could be 27% higher." },
  ],

  // ---- bribe-tax calculator defaults --------------------------------
  calculator: { dailyEarnings: 1500, sharePct: 10, maxSharePct: 20, workingDays: 300 },

  // ---- five levers IEA proposes to track ----------------------------
  levers: [
    { title: "Spending efficiency", items: ["Development budget execution rate", "O&M share of total spending"] },
    { title: "Fiscal credibility", items: ["Overall fiscal deficit", "Primary balance", "Supplementary budgets", "Procurement through e-GP"] },
    { title: "Manufactured exports", items: ["Manufactures’ share of exports", "Export diversification"] },
    { title: "Stable tax regime", items: ["Tax, tariff and levy changes a year", "Private investment and FDI"] },
    { title: "Governance", items: ["Control of Corruption and CPI rank", "MDAs with adverse audit opinions"] },
  ],
};
