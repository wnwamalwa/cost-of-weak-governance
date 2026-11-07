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
        "Demands come from traffic police and county inspectors",
        "Poorer workers are more likely to pay",
      ],
      source: "KEU 34, pp. vi, 37–39",
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
