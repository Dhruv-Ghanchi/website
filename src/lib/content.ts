export type RichTextBlock = { heading?: string; paragraphs: string[] };
export type Service = { id: string; title: string; icon: string; shortDesc: string; longDesc: string; deliverables: string[]; image: string; testimonial: { quote: string; name: string; role: string; image: string } };
export type TeamMember = { id: string; name: string; role: string; headshot: string; bio: string; socialLinks: { label: string; url: string }[] };
export type Category = { id: string; name: string };
export type Insight = { id: string; title: string; coverImage: string; publishDate: string; content: RichTextBlock[]; authorId: string; categoryId: string };
export type CaseStudy = { id: string; clientName: string; title: string; heroImage: string; challenge: RichTextBlock[]; solution: RichTextBlock[]; resultStats: { value: number; prefix?: string; suffix: string; label: string }[]; testimonial: { quote: string; name: string; role: string; image: string }; serviceIds: string[]; industry: string; companySize: string; timeline: string; publishDate: string };
export type LegalPage = { id: string; title: string; content: RichTextBlock[] };
export const asset = (name: string) => `/assets/${name}`;
export const images = {
  hero: asset('IaiFRY4S4OYymE10NQ9ipQb5dwc.jpg'),
  contact: asset('YLqSXPwuRjvZniqgw49AQYJMSzM.png'),
  sitemark: asset('qWS4BiNWHU6BsV03nquz3LOXcM.jpeg'),
  process: asset('38NpwzghYIptRRbFZ6Soejx3wVY.jpeg'),
  hiring: asset('vJ0BOWZIknJPSUQfc9t1XTrJIE.jpeg'),
  testimonial: asset('F1UsC3Qy2MBxr7spZdOv8SWIZpQ.jpg'),
  founder: asset('ptzdfa8kamllLFJeEJ6fpHyKaQ.jpg'),
};
export const teamMembers: TeamMember[] = [
  {
    "id": "koraline-spencer",
    "name": "Koraline Spencer",
    "role": "Founder & CEO",
    "headshot": "/assets/ptzdfa8kamllLFJeEJ6fpHyKaQ.jpg",
    "bio": "Koraline built Kora after a decade leading growth at two venture-backed startups, where she took both from Series A through acquisition. She founded Kora to give mid-market companies access to the same caliber of growth strategy that used to be reserved for companies with eight-figure budgets. She specializes in go-to-market architecture and has personally led engagements that have generated over $200M in client revenue.",
    "socialLinks": [
      {
        "label": "Email",
        "url": "mailto:koraline@kora.com"
      }
    ]
  },
  {
    "id": "priya-sharma",
    "name": "Priya Sharma",
    "role": "Head of Growth Strategy",
    "headshot": "/assets/gU8yKC3ZiCyONDaKr0hgrinSY5U.jpg",
    "bio": "Priya leads growth strategy for Kora's most complex engagements, specializing in pipeline architecture and revenue modeling. She previously ran demand generation at a $90M B2B platform where she built the acquisition engine from scratch. Her analytical approach to growth planning has helped Kora clients unlock over $45M in net-new pipeline.",
    "socialLinks": [
      {
        "label": "Email",
        "url": "mailto:priya@kora.com"
      }
    ]
  },
  {
    "id": "james-okoro",
    "name": "James Okoro",
    "role": "Senior Growth Consultant",
    "headshot": "/assets/akJQe3BhYVaYiW8D7XTtFNAS2A.jpg",
    "bio": "James is the person who turns strategy into execution. He works hands-on with client teams to implement growth playbooks, restructure funnels, and build repeatable processes. Before Kora, he spent six years at early-stage startups wearing every hat from SDR to VP of Sales, giving him a ground-level understanding of what actually works in the trenches.",
    "socialLinks": [
      {
        "label": "Email",
        "url": "mailto:james@kora.com"
      }
    ]
  },
  {
    "id": "alex-tanaka",
    "name": "Alex Tanaka",
    "role": "Growth Operations Lead",
    "headshot": "/assets/gJRsKq8nmNa966w6uRWMJoB7p90.jpg",
    "bio": "Alex runs the operational backbone of Kora's engagements, from CRM architecture to reporting infrastructure to sales enablement tooling. He previously led revenue operations at a Series C fintech where he built the data systems that supported a 4x revenue scale. He believes that clean data and clear processes are the foundation everything else is built on.",
    "socialLinks": [
      {
        "label": "Email",
        "url": "mailto:alex@kora.com"
      }
    ]
  },
  {
    "id": "david-wilson",
    "name": "David Wilson",
    "role": "Head of Client Solutions",
    "headshot": "/assets/vT4xPYmbaRCnYfkKyzUAbKKiR0.jpg",
    "bio": "David oversees every client engagement from kickoff through transition, ensuring each one delivers measurable outcomes. Before joining Kora, he spent eight years in management consulting at Bain and later led client success at a high-growth SaaS company. He brings a rare combination of strategic rigor and operational empathy that keeps engagements on track and clients heard.",
    "socialLinks": [
      {
        "label": "Email",
        "url": "mailto:david@kora.com"
      }
    ]
  },
  {
    "id": "rachel-andersen",
    "name": "Rachel Andersen",
    "role": "Revenue Strategist",
    "headshot": "/assets/HSDuVqMhSgRPV5plzbPZvxsh3c.jpg",
    "bio": "Rachel focuses on revenue strategy, helping clients redesign their sales motions, pricing models, and expansion playbooks. She spent seven years in B2B sales leadership, most recently as VP of Revenue at a mid-market SaaS company where she grew ARR from $8M to $28M. She brings a practitioner's perspective to every engagement — she has lived the problems Kora's clients are trying to solve.",
    "socialLinks": [
      {
        "label": "Email",
        "url": "mailto:rachel@kora.com"
      }
    ]
  }
];
export const services: Service[] = [
  { id: 'go-to-market', title: 'Go-to-Market', icon: 'network', shortDesc: 'Launches that land and scale.', longDesc: "Whether you’re launching a new product or entering a new segment, we design the GTM motion that lands and scales.", deliverables: ['Launch Strategy & Execution', 'ICP & Persona Development', 'Messaging & Value Proposition', 'Channel Selection & Activation', 'Partner & Alliance Programs', 'Market Entry Playbooks'], image: asset('OqCGYrjHIzy11F9CWaDgfYAzKQ.jpg'), testimonial: { quote: 'Kora designed something that actually made our brand stronger.', name: 'James Martin', role: 'CEO, Hamilton', image: asset('BP9PfINr3O04BI5y3ieM8tzir1c.jpg') } },
  { id: 'growth-strategy', title: 'Growth Strategy', icon: 'chart', shortDesc: 'Strategy that turns ambition into revenue.', longDesc: 'We build the roadmap that gets you from where you are to where the revenue needs to be.', deliverables: ['Market Sizing & Opportunity Mapping', 'Revenue Goal Architecture', 'Competitive Positioning', 'Growth Modeling & Forecasting', 'Channel Strategy', 'Quarterly Planning Sprints'], image: asset('3NdwQXmM1SRuYwMwOwL4wEa9Y.jpg'), testimonial: { quote: 'Kora didn’t just give us a strategy—they helped us become a more strategic company.', name: 'Sarah Bouchard', role: 'Founder & CEO, Lightspeed', image: asset('mAVFdgGkoAuNgor7naAnOLpKiIs.jpg') } },
  { id: 'revenue-operations', title: 'Revenue Operations', icon: 'dollar', shortDesc: 'Systems that make revenue predictable.', longDesc: 'Your pipeline has leaks. We find them, fix them, and build the systems that keep revenue flowing predictably.', deliverables: ['Pipeline Architecture', 'CRM & Tech Stack Optimization', 'Lead Scoring & Qualification', 'Funnel Analytics & Reporting', 'Handoff Process Design', 'Revenue Forecasting Dashboards'], image: asset('NF5tRpn3xrpV81CGf1SDQo60Lk.jpg'), testimonial: { quote: 'Kora helped us realize we had a conversion problem, not a capacity problem.', name: 'David Kim', role: 'VP Strategy, Sitemark', image: asset('MI76ZMTeB2Mvtl0tBcBCscmA.jpg') } },
  { id: 'sales-optimization', title: 'Sales Optimization', icon: 'target', shortDesc: 'Sales teams that close faster and bigger.', longDesc: 'We restructure how your team sells so every rep closes faster, bigger, and more consistently.', deliverables: ['Sales Process Redesign', 'Team Structure & Hiring', 'Compensation & Incentive Design', 'Win/Loss Analysis', 'Deal Acceleration Playbooks', 'Sales Enablement & Training'], image: asset('Xg3naOB3jlkrgVdI79zfTGmUpxo.jpg'), testimonial: { quote: 'What sets Kora apart is their commitment to building our capabilities.', name: 'Jennifer Holland', role: 'CFO, Elevance', image: asset('OLuRkG9gyMPQXSy4xo8GQM2EmU.jpg') } },
  { id: 'pricing-packaging', title: 'Pricing & Packaging', icon: 'package', shortDesc: 'Pricing that captures what you’re actually worth.', longDesc: 'Most companies leave 20–40% on the table with bad pricing. We fix that with data-backed packaging that captures real value.', deliverables: ['Pricing Model Design', 'Willingness-to-Pay Research', 'Expansion Revenue Strategy', 'Discount & Negotiation Frameworks'], image: asset('qkntRVyDFXSavXk2fE20yVB6CU.jpg'), testimonial: { quote: 'Kora challenged our assumptions, and stayed until the changes actually stuck.', name: 'Marcus Thompson', role: 'President, Theo', image: asset('bHZPgCMyonDjkoqqgaJSh43gsI.jpg') } },
];
export const caseStudies: CaseStudy[] = [
  {
    "id": "sitemark",
    "clientName": "Sitemark",
    "title": "How Sitemark broke through an $18M plateau and grew 47% in six months.",
    "heroImage": "/assets/qWS4BiNWHU6BsV03nquz3LOXcM.jpeg",
    "industry": "Enterprise Software",
    "companySize": "450 Employees",
    "timeline": "6 Months",
    "publishDate": "2026-03-18",
    "serviceIds": [
      "growth-strategy",
      "revenue-operations",
      "pricing-packaging",
      "sales-optimization",
      "go-to-market"
    ],
    "resultStats": [
      {
        "value": 47,
        "suffix": "%",
        "label": "Revenue growth in 6 months"
      },
      {
        "value": 2.4,
        "suffix": "x",
        "label": "Pipeline velocity increase"
      }
    ],
    "testimonial": {
      "quote": "Kora helped us see around corners. When everyone else was telling us to grow headcount, they helped us realize we had a conversion problem, not a capacity problem. That insight alone saved us from making a costly mistake.",
      "name": "David Kim",
      "role": "VP Strategy",
      "image": "/assets/MI76ZMTeB2Mvtl0tBcBCscmA.jpg"
    },
    "challenge": [
      {
        "paragraphs": [
          "Sitemark is a B2B SaaS platform serving 2,000+ enterprise customers. After three years of growth, they hit a plateau at $18M ARR."
        ]
      },
      {
        "heading": "The challenge",
        "paragraphs": [
          "Stuck at $18M for four straight quarters. Acquisition was steady, but churn and contraction were eating every gain.",
          "Sitemark was adding 40-50 new customers per quarter, but churn and contraction were eating the gains. Their sales cycle had ballooned from 25 to 42 days as they moved upmarket without adjusting their process. Reps were chasing unqualified enterprise leads while existing customers had no structured path to expand."
        ]
      }
    ],
    "solution": [
      {
        "heading": "The approach",
        "paragraphs": [
          "Kora ran a full-funnel diagnostic in the first two weeks, then focused on three high-leverage initiatives.",
          "We rebuilt their qualification framework after finding 60% of enterprise leads were a poor fit. The sales team refocused on prospects with a 3x higher close rate. We restructured customer success around expansion triggers and compressed the sales cycle by replacing the three-meeting discovery process with a live product audit on the first call."
        ]
      },
      {
        "heading": "The Results",
        "paragraphs": [
          "Sitemark broke through a four-quarter plateau and grew from $18M to $26.5M ARR in six months. Expansion revenue became their primary growth driver for the first time.",
          "Revenue grew from $18M to $26.5M ARR within six months",
          "Pipeline velocity increased 2.4x through better qualification",
          "Sales cycle compressed from 42 days to 29 days",
          "Net revenue retention jumped from 97% to 118%",
          "Expansion revenue became the largest growth driver within 90 days"
        ]
      }
    ]
  },
  {
    "id": "milano",
    "clientName": "Lightspeed",
    "title": "How Lightspeed tripled revenue in 18 months by rebuilding their sales engine from the ground up.",
    "heroImage": "/assets/CtZtT97lx3imoMOuinUNyvOUo.jpg",
    "industry": "Financial Technology",
    "companySize": "320 Employees",
    "timeline": "6 Months",
    "publishDate": "2026-03-12",
    "serviceIds": [
      "revenue-operations",
      "growth-strategy",
      "pricing-packaging",
      "sales-optimization"
    ],
    "resultStats": [
      {
        "value": 3.1,
        "suffix": "x",
        "label": "Revenue growth in 18 months"
      },
      {
        "value": 34,
        "suffix": "%",
        "label": "Close rate (from 12%)"
      }
    ],
    "testimonial": {
      "quote": "Kora didn’t just give us a strategy—they helped us become a more strategic company. They identified three fundamental issues that we’d been blind to for years. Two years later, we’re at $52M and just closed our Series B.",
      "name": "Sarah Bouchard",
      "role": "Founder & CEO",
      "image": "/assets/mAVFdgGkoAuNgor7naAnOLpKiIs.jpg"
    },
    "challenge": [
      {
        "paragraphs": [
          "Lightspeed operates a fintech platform processing millions of transactions across 1,200+ merchants. Post-Series C, they needed to scale revenue 3x in 18 months."
        ]
      },
      {
        "heading": "The challenge",
        "paragraphs": [
          "$45M Series C closed, but the sales motion was still seed-stage. A 12% close rate and a founder-dependent pipeline.",
          "The founder was involved in every deal over $50K. Sales reps had no standardized process, no qualification framework, and no defined handoff from marketing. The 12% close rate meant the team was burning energy on prospects that never converted."
        ]
      }
    ],
    "solution": [
      {
        "heading": "The approach",
        "paragraphs": [
          "Kora built a complete sales infrastructure for Lightspeed in six months, starting with process and ending with hiring.",
          "We shadowed the founder for three weeks and codified his instincts into a scoring framework, demo playbook, and training materials. Then we built a four-stage pipeline with clear criteria, standardized CRM usage, and helped hire four reps who hit quota in their first quarter."
        ]
      },
      {
        "heading": "The Results",
        "paragraphs": [
          "Lightspeed delivered 3.1x revenue growth in 18 months, beating board targets by six months. Close rates jumped to 34% and the founder was fully removed from day-to-day sales by month four.",
          "Revenue grew 3.1x in 18 months, ahead of board targets",
          "Close rate improved from 12% to 34% on qualified opportunities",
          "Average sales cycle compressed from 51 days to 22 days",
          "New reps hit quota in first quarter instead of two quarters",
          "Founder removed from day-to-day sales by month four"
        ]
      }
    ]
  },
  {
    "id": "hamilton",
    "clientName": "Hamilton",
    "title": "How Hamilton broke their referral ceiling and grew from $6M to $15.6M in a year.",
    "heroImage": "/assets/CQiGiMt8KaPh7SAIXpl7ZHUpwYU.jpg",
    "industry": "Data Analytics",
    "companySize": "85 Employees",
    "timeline": "16 Weeks",
    "publishDate": "2026-03-05",
    "serviceIds": [
      "go-to-market",
      "sales-optimization",
      "growth-strategy",
      "revenue-operations"
    ],
    "resultStats": [
      {
        "value": 2.6,
        "suffix": "x",
        "label": "Revenue in 12 months"
      },
      {
        "value": 41,
        "suffix": "%",
        "label": "Revenue from new channels"
      }
    ],
    "testimonial": {
      "quote": "We were terrified that building a sales motion would make us feel like every other consulting firm. Kora designed something that actually made our brand stronger. The thought leadership approach brings in better prospects than referrals ever did, and our deal sizes have more than doubled because we finally know how to package and price what we do.",
      "name": "James Martin",
      "role": "CEO",
      "image": "/assets/BP9PfINr3O04BI5y3ieM8tzir1c.jpg"
    },
    "challenge": [
      {
        "paragraphs": [
          "Hamilton is a data analytics consultancy serving enterprise clients across healthcare, finance, and retail. Entirely referral-dependent and capped at $6M."
        ]
      },
      {
        "heading": "The challenge",
        "paragraphs": [
          "Eight years of referral-only growth capped revenue at $6M. No outbound motion, no pipeline control, no forecast visibility.",
          "The leadership team had never needed to sell. But referrals gave them no control over pipeline timing or volume, and deals stayed small because they came through personal relationships rather than enterprise procurement. Analysts capable of $200K engagements were scoping $60-80K projects."
        ]
      }
    ],
    "solution": [
      {
        "heading": "The approach",
        "paragraphs": [
          "Kora built Hamilton's first structured go-to-market without compromising their consultative DNA.",
          "Instead of cold outreach, we built a thought leadership engine where senior analysts published industry-specific insights that attracted enterprise buyers. We restructured service packaging into three tiers and implemented a systematic referral program that turned word-of-mouth into a predictable, trackable channel."
        ]
      },
      {
        "heading": "The Results",
        "paragraphs": [
          "Hamilton grew from $6M to $15.6M in 12 months. 41% of revenue now comes from new channels and average deal size jumped from $72K to $185K.",
          "Revenue grew from $6M to $15.6M in 12 months",
          "41% of revenue now comes from non-referral channels",
          "Average deal size increased from $72K to $185K",
          "Signed 8 new enterprise accounts in Q1 alone",
          "Pipeline is now predictable with 90-day forward visibility"
        ]
      }
    ]
  },
  {
    "id": "elevance",
    "clientName": "Elevance",
    "title": "How Elevance cut CAC by 62% and reached profitability four months ahead of plan.",
    "heroImage": "/assets/J4dgxrD9A3uDkL6hIukWwcBQ.jpg",
    "industry": "Developer Tools",
    "companySize": "280 Employees",
    "timeline": "10 Weeks",
    "publishDate": "2026-02-11",
    "serviceIds": [
      "pricing-packaging",
      "revenue-operations",
      "sales-optimization"
    ],
    "resultStats": [
      {
        "value": 62,
        "suffix": "%",
        "label": "CAC reduction"
      },
      {
        "value": 2.8,
        "prefix": "$",
        "suffix": "M",
        "label": "Annual savings"
      }
    ],
    "testimonial": {
      "quote": "What sets Kora apart is their commitment to building our capabilities, not creating dependency. A year after our engagement ended, we’re still using the frameworks they taught us. That’s the mark of a true partner.",
      "name": "Jennifer Holland",
      "role": "CFO",
      "image": "/assets/OLuRkG9gyMPQXSy4xo8GQM2EmU.jpg"
    },
    "challenge": [
      {
        "paragraphs": [
          "Elevance is a developer tools platform serving 50,000+ software teams. Growing 40% YoY but burning cash and needed to reach profitability fast."
        ]
      },
      {
        "heading": "The challenge",
        "paragraphs": [
          "40% growth but $1.2M in monthly burn. Seven channels, no attribution, and a board deadline to hit profitability.",
          "Elevance was measuring channel performance on lead volume rather than closed revenue. Paid search generated the most leads but those customers churned at 2x the rate. Content marketing looked expensive per lead but produced customers who expanded 3x more. The team had been optimizing for the wrong metrics for two years."
        ]
      }
    ],
    "solution": [
      {
        "heading": "The approach",
        "paragraphs": [
          "Kora rebuilt Elevance's growth model around unit economics rather than volume metrics.",
          "We built a cohort analysis connecting every customer back to their acquisition channel and tracking their full lifecycle. The data was decisive: we cut paid search by 80%, doubled content and community investment, and redesigned pricing tiers to fix activation rates that were quietly killing unit economics."
        ]
      },
      {
        "heading": "The Results",
        "paragraphs": [
          "Elevance cut blended CAC from $890 to $338, saved $2.8M annually, and reached profitability four months ahead of the board's timeline. LTV:CAC improved from 1.8x to 5.2x.",
          "Blended CAC dropped from $890 to $338",
          "$2.8M annual savings from channel reallocation",
          "LTV:CAC ratio improved from 1.8x to 5.2x",
          "Reached profitability four months ahead of board timeline",
          "Free-to-paid conversion rate doubled after pricing restructure"
        ]
      }
    ]
  },
  {
    "id": "theo",
    "clientName": "Theo",
    "title": "How Theo grew deal sizes 3.8x and added $4.2M in new ARR by repositioning upmarket.",
    "heroImage": "/assets/7ZSIdyPw23PAYM3qvBNhoBOW828.jpg",
    "industry": "Cybersecurity",
    "companySize": "180 Employees",
    "timeline": "12 Weeks",
    "publishDate": "2026-01-22",
    "serviceIds": [
      "growth-strategy",
      "sales-optimization",
      "go-to-market"
    ],
    "resultStats": [
      {
        "value": 68,
        "suffix": "%",
        "label": "Win rate improvement"
      },
      {
        "value": 4.2,
        "prefix": "$",
        "suffix": "M",
        "label": "New ARR in first year"
      }
    ],
    "testimonial": {
      "quote": "I was skeptical of consultants—we’d been burned before by firms that delivered pretty slides and then disappeared. Kora was different. They rolled up their sleeves, challenged our assumptions, and stayed until the changes actually stuck.",
      "name": "Marcus Thompson",
      "role": "President",
      "image": "/assets/bHZPgCMyonDjkoqqgaJSh43gsI.jpg"
    },
    "challenge": [
      {
        "paragraphs": [
          "Theo is a cybersecurity firm providing penetration testing and security audits for Fortune 500 companies. They had plateaued at $12M in revenue."
        ]
      },
      {
        "heading": "The challenge",
        "paragraphs": [
          "Enterprise-ready talent priced like a mid-market shop. $35K average deals and hourly billing left millions on the table.",
          "The sales team was pricing critical security work like a commodity. Enterprise buyers questioned whether Theo was serious enough because proposals looked identical to boutique shops charging half the price. Senior consultants were stretched across too many small engagements when they should have been leading $150K assessments."
        ]
      }
    ],
    "solution": [
      {
        "heading": "The approach",
        "paragraphs": [
          "Kora repositioned Theo's entire go-to-market around enterprise value rather than hourly delivery.",
          "We analyzed Theo's last 50 engagements and quantified the business impact of their work. This gave us the data to build a value-based pricing model tied to risk reduction. We restructured proposals into executive-level risk assessments and rebuilt the sales process around consultative discovery rather than technical demos."
        ]
      },
      {
        "heading": "The Results",
        "paragraphs": [
          "Average deal size grew from $35K to $133K and Theo added $4.2M in new ARR within the first year. The team now handles fewer, higher-impact engagements with significantly better margins.",
          "Average deal size grew from $35K to $133K",
          "Win rate on enterprise deals improved 68%",
          "$4.2M in new ARR added within the first year",
          "Sales cycle shortened from 38 days to 19 days at higher price points",
          "Senior consultants now handle fewer, higher-value engagements with better margins"
        ]
      }
    ]
  }
];
export const categories: Category[] = [
  {
    "id": "roi-strategy",
    "name": "ROI & Strategy"
  },
  {
    "id": "implementation",
    "name": "Implementation"
  },
  {
    "id": "technology-selection",
    "name": "Technology Selection"
  },
  {
    "id": "risk-management",
    "name": "Risk Management"
  }
];
export const insights: Insight[] = [
  {
    "id": "your-crm-is-not-the-problem",
    "title": "Your CRM is not the problem. Your process is.",
    "coverImage": "/assets/ZUKAuHzqrTMon49eyQdZ9vuSDfY.jpeg",
    "publishDate": "2026-03-04",
    "authorId": "alex-tanaka",
    "categoryId": "technology-selection",
    "content": [
      {
        "paragraphs": [
          "Swapping CRMs without fixing the underlying process just gives you the same mess in a new interface.",
          "Every quarter, a company somewhere decides a new CRM will fix their pipeline problems. Six months later, same leaky funnel with better dashboard branding."
        ]
      },
      {
        "heading": "The CRM Migration Trap",
        "paragraphs": [
          "It starts with a familiar complaint. The sales team says the CRM is too clunky. Reporting is unreliable. Nobody trusts the pipeline numbers. Leadership concludes the tool is the bottleneck and kicks off a migration project. New vendor, new implementation partner, new training sessions, new data migration headaches.",
          "Three months post-launch, the same problems resurface. Reps are still not logging activities. Pipeline stages still mean different things to different people. Forecasts are still fiction. The tool changed but the behavior did not.",
          "“We migrated from HubSpot to Salesforce thinking it would solve our visibility problem. Turns out the problem was that nobody agreed on what a qualified opportunity looked like. We could have fixed that in a week without spending a dollar on new software.”"
        ]
      },
      {
        "heading": "What Actually Causes CRM Dysfunction",
        "paragraphs": [
          "In almost every case we audit, the CRM is not broken. It is just reflecting a broken process. The most common root causes are undefined pipeline stages, inconsistent data entry standards, no clear ownership of data quality, and reporting that measures activity instead of outcomes.",
          "These are process problems masquerading as technology problems. No CRM on the market can compensate for a team that has not aligned on what each pipeline stage means, what data needs to be captured at each stage, and who is responsible for keeping it accurate.",
          "Symptom: Unreliable forecasts; Assumed Cause: Bad reporting tools; Actual Cause: Inconsistent stage definitions.",
          "Symptom: Low adoption; Assumed Cause: Clunky interface; Actual Cause: No clear value for reps to log data.",
          "Symptom: Duplicate records; Assumed Cause: Poor deduplication; Actual Cause: No data governance ownership.",
          "Symptom: Missing insights; Assumed Cause: Weak analytics; Actual Cause: Garbage in, garbage out."
        ]
      },
      {
        "heading": "Fix the Process First",
        "paragraphs": [
          "Before evaluating any new tool, document your current sales process end to end. Not the idealized version in your sales playbook. The real one. Shadow reps for a week. Watch how deals actually move through the pipeline. Note where data drops off, where stages get skipped, and where the CRM record diverges from reality.",
          "Then fix those gaps. Define each pipeline stage with explicit entry and exit criteria. Standardize required fields at each stage. Assign a single owner for data quality. Build reporting that answers the questions your leadership team actually asks in forecast reviews. Do all of this in your current tool before you even consider switching."
        ]
      },
      {
        "heading": "When a New Tool Actually Makes Sense",
        "paragraphs": [
          "Sometimes a migration is warranted. If your current CRM genuinely cannot support the workflows you need, if it lacks integrations critical to your stack, or if you have outgrown its capabilities at scale, a new tool is the right call. But you should only reach that conclusion after you have optimized your process in the existing system and still hit a wall.",
          "The companies that migrate successfully are the ones that fixed their process first and then chose a tool that supports it. The ones that fail are the ones hoping the new tool will impose the process for them. Tools do not create discipline. People do."
        ]
      },
      {
        "heading": "The One-Week Process Audit",
        "paragraphs": [
          "You can diagnose most CRM dysfunction in five business days. Day one, interview sales leadership about what they wish the CRM told them. Day two and three, shadow reps and watch how they actually use the tool. Day four, audit data quality across a sample of 50 deals. Day five, map the gaps between the ideal process and the real one. The output is a prioritized list of process fixes that will cost you nothing but attention."
        ]
      }
    ]
  },
  {
    "id": "five-growth-levers-most-companies-ignore",
    "title": "5 growth levers most companies ignore until it is too late.",
    "coverImage": "/assets/IXWqaCHPbvPQKcyZ9Mch2cWh9hU.jpg",
    "publishDate": "2026-03-03",
    "authorId": "james-okoro",
    "categoryId": "implementation",
    "content": [
      {
        "paragraphs": [
          "The fastest path to growth is usually sitting in the funnel you already have.",
          "Most growth conversations start and end with lead generation. But when we audit companies doing $5M to $50M, the biggest opportunities are almost never at the top of the funnel."
        ]
      },
      {
        "heading": "Why Top-of-Funnel Obsession Stalls Growth",
        "paragraphs": [
          "When revenue plateaus, the instinct is to spend more on acquisition. Run more ads, hire more SDRs, launch another campaign. It feels productive because the activity is visible. But if your funnel leaks at every stage, more volume just means more waste.",
          "A company converting 2% of leads to customers does not need more leads. It needs to figure out why 98% of them disappear. The math is simple: doubling your close rate from 2% to 4% has the same revenue impact as doubling your lead volume, at a fraction of the cost."
        ]
      },
      {
        "heading": "Lever 1: Activation Rate",
        "paragraphs": [
          "How many people who express interest actually take the first meaningful step? For SaaS companies, this is the trial-to-active conversion. For service businesses, it is the discovery-call-to-proposal rate. Most companies lose 40-60% of interested prospects before any real evaluation happens.",
          "The fix is usually not a sales problem. It is a speed and friction problem. How fast do you follow up? How easy is it to book a call? How clear is the next step after someone raises their hand? Small improvements here cascade through every stage below."
        ]
      },
      {
        "heading": "Lever 2: Sales Cycle Compression",
        "paragraphs": [
          "Long sales cycles kill growth companies quietly. Every extra week in your pipeline is a week where the prospect can go cold, find a competitor, or deprioritize the project. Most B2B companies accept their sales cycle as a given when it is actually highly compressible.",
          "“We cut our average sales cycle from 47 days to 22 by restructuring our proposal process and adding a live audit to the first call. Same close rate, half the time.”"
        ]
      },
      {
        "heading": "Lever 3: Expansion Revenue",
        "paragraphs": [
          "Your existing customers are the most underutilized growth channel you have. They already trust you, understand your value, and have budget allocated. Yet most companies treat upselling as an afterthought rather than a systematic motion.",
          "Track net revenue retention as a core metric. If it is below 110%, you are leaving significant revenue on the table. Build expansion into your delivery process rather than treating it as a separate sales activity."
        ]
      },
      {
        "heading": "Lever 4: Referral Velocity",
        "paragraphs": [
          "Happy customers refer other customers. But most companies leave this entirely to chance. They wait for referrals to happen organically instead of building a system that prompts, tracks, and rewards them.",
          "The best referral programs are not formal programs at all. They are moments built into the customer experience where sharing feels natural. After a big win, after a milestone, after a positive review. Timing matters more than incentives."
        ]
      },
      {
        "heading": "Lever 5: Pricing Architecture",
        "paragraphs": [
          "Most companies set their pricing once and never revisit it. But pricing is the single highest-leverage growth tool you have. A 10% price increase on the same volume drops straight to the bottom line with zero additional cost.",
          "This does not mean raising prices blindly. It means structuring your pricing to capture more value from customers who get more value. Tiered pricing, usage-based models, and strategic packaging can unlock 20-40% more revenue from the same customer base."
        ]
      },
      {
        "heading": "Where to Start",
        "paragraphs": [
          "Run a funnel audit. Map every stage from first touch to expansion revenue. Identify where the biggest percentage drops happen. That is where your highest-leverage opportunity lives. In our experience, most companies find that fixing one or two of these levers creates more growth than any new acquisition channel could."
        ]
      }
    ]
  },
  {
    "id": "hiring-a-growth-team-vs-hiring-a-growth-partner",
    "title": "Hiring a growth team vs. hiring a growth partner.",
    "coverImage": "/assets/S2aS99cMH11aKHuGDtt8CdqYPqs.jpg",
    "publishDate": "2026-03-02",
    "authorId": "alex-tanaka",
    "categoryId": "technology-selection",
    "content": [
      {
        "paragraphs": [
          "Building in-house or bringing in outside help isn't an either-or decision.",
          "At some point every growing company asks: do we hire a VP of Growth or bring in a partner? The answer depends on your stage, speed, and what you actually need built."
        ]
      },
      {
        "heading": "The Case for Building In-House",
        "paragraphs": [
          "An internal growth team lives inside your business every day. They understand your culture, your product nuances, and your customer relationships in a way that no outside partner fully can. Over time, they build institutional knowledge that compounds.",
          "The challenge is time and cost. A strong VP of Growth costs $200K-350K in total compensation. Beneath them, you need analysts, operators, and potentially marketing and sales specialists. You are looking at 6-12 months before the team is hired, ramped, and producing strategic output. If you are a Series A company trying to find product-market fit, that timeline can be fatal."
        ]
      },
      {
        "heading": "The Case for External Partners",
        "paragraphs": [
          "A growth consulting partner brings pattern recognition from dozens of engagements across industries. They have seen what works and what does not, and they can compress your learning curve dramatically. An engagement that starts Monday can produce diagnostic findings by Friday.",
          "The trade-off is that partners leave. They transfer knowledge and build systems, but they do not stick around for daily execution indefinitely. The best engagements are designed with a transition plan from day one, building the playbooks and processes that an internal team can own long-term.",
          "“We brought in a growth partner for 90 days before hiring our first VP of Growth. It meant our VP walked into a company that already had a diagnostic, a roadmap, and clean data. She was executing strategy by week two instead of spending her first quarter figuring out what was broken.”"
        ]
      },
      {
        "heading": "The Hybrid Model",
        "paragraphs": [
          "The most effective approach for companies between $5M and $50M in revenue is usually a hybrid. Start with an external partner to diagnose, build the strategy, and establish the operating cadence. Then hire internally to own ongoing execution with the partner transitioning to an advisory role.",
          "This model gives you speed when you need it and institutional ownership when you are ready for it. It also means your internal hire walks into a structured environment rather than a blank slate.",
          "Factor: Time to Impact; In-House Team: 6-12 months; External Partner: 2-4 weeks.",
          "Factor: Annual Cost; In-House Team: $400K-800K (team); External Partner: $100K-200K (engagement).",
          "Factor: Pattern Recognition; In-House Team: Limited to your company; External Partner: Cross-industry insights.",
          "Factor: Long-term Ownership; In-House Team: Strong; External Partner: Requires transition plan.",
          "Factor: Cultural Fit; In-House Team: Deep; External Partner: Surface-level."
        ]
      },
      {
        "heading": "How to Choose",
        "paragraphs": [
          "If you have a clear strategy and need execution capacity, hire internally. If you are not sure what the right strategy is or need to move faster than a hiring timeline allows, start with a partner. If you are building a growth function from scratch, do both sequentially. The partner builds the foundation and the internal team inherits a running operation.",
          "The worst outcome is hiring a senior growth leader into a company that has not done the diagnostic work. They spend their first two quarters doing discovery instead of driving results, and everyone loses patience."
        ]
      }
    ]
  },
  {
    "id": "what-a-growth-audit-actually-reveals",
    "title": "What a growth audit actually reveals about your business.",
    "coverImage": "/assets/IQe1Ak6IQCv8JGUh2qx9RiQCBQ.jpg",
    "publishDate": "2026-02-20",
    "authorId": "david-wilson",
    "categoryId": "roi-strategy",
    "content": [
      {
        "paragraphs": [
          "Most companies think they know where growth is stalling. The audit usually tells a different story.",
          "A growth audit isn't a report card. It's a diagnostic that finds the specific friction points between where you are and where you want to be."
        ]
      },
      {
        "heading": "What a Growth Audit Covers",
        "paragraphs": [
          "A proper audit examines five areas: your acquisition channels, your conversion funnel, your customer economics, your competitive positioning, and your team structure. Each one tells a piece of the story. Together, they reveal the system your business is actually running versus the one you think you are running.",
          "Most companies have strong intuition about one or two of these areas and blind spots in the rest. The audit's value is in connecting dots across all five and finding the interactions that are not obvious from the inside."
        ]
      },
      {
        "heading": "The Acquisition Reality Check",
        "paragraphs": [
          "Almost every company we audit is over-indexed on one or two acquisition channels and under-invested in the rest. They found something that worked early and kept doubling down. The problem is that channel concentration creates fragility. When your primary channel gets more expensive or less effective, growth stalls overnight.",
          "“We were spending 80% of our marketing budget on paid search. The audit showed our organic content was converting at 3x the rate at one-tenth the cost. We had been sitting on our best channel for two years without realizing it.”"
        ]
      },
      {
        "heading": "The Funnel You Think You Have vs. The One You Actually Have",
        "paragraphs": [
          "This is where the most surprising findings live. Companies describe their funnel as a clean, linear progression from lead to customer. The reality is usually messier. Prospects loop back, skip stages, get stuck in dead zones, or fall out at points nobody is tracking.",
          "We map the actual customer journey using your CRM data, not your CRM pipeline stages. The difference between the two often explains months of stalled revenue growth. Deals are not being lost at the stages you think they are."
        ]
      },
      {
        "heading": "Customer Economics Nobody Is Tracking",
        "paragraphs": [
          "Most companies can tell you their MRR or ARR. Fewer can tell you their CAC by channel, their payback period, their net revenue retention, or their LTV-to-CAC ratio segmented by customer type. These are not vanity metrics. They are the numbers that tell you whether your growth is profitable or whether you are buying revenue at a loss.",
          "Metric: CAC by Channel; What It Tells You: Which acquisition sources are actually efficient.",
          "Metric: Payback Period; What It Tells You: How long until a customer becomes profitable.",
          "Metric: Net Revenue Retention; What It Tells You: Whether existing customers are growing or shrinking.",
          "Metric: LTV:CAC Ratio; What It Tells You: Overall unit economics health (target 3:1 or higher)."
        ]
      },
      {
        "heading": "Positioning Gaps",
        "paragraphs": [
          "How you talk about your company and how your customers describe you are rarely the same thing. The audit includes interviews with recent wins, recent losses, and churned customers. The language they use to describe your value is almost always more specific and more compelling than your marketing copy.",
          "These conversations also reveal why you win and lose deals. The reasons are rarely what your sales team reports. Understanding the real decision drivers changes everything from messaging to targeting to product roadmap priorities."
        ]
      },
      {
        "heading": "Team and Process Bottlenecks",
        "paragraphs": [
          "Growth is often constrained not by strategy but by capacity. The audit looks at how your team is structured, how they spend their time, and where handoffs break down. Common findings include senior people doing junior work, lack of clear ownership for key metrics, and reporting that measures activity rather than outcomes."
        ]
      },
      {
        "heading": "What Happens After the Audit",
        "paragraphs": [
          "The output is not a 50-page report. It is a prioritized roadmap with three to five initiatives ranked by expected impact and effort. Each initiative has a clear owner, a timeline, and a measurable target. The goal is to leave the audit with a 90-day plan you can start executing immediately, not a strategy document that sits on a shelf."
        ]
      }
    ]
  },
  {
    "id": "scaling-too-fast-the-risks-nobody-talks-about",
    "title": "Scaling too fast: the risks nobody talks about.",
    "coverImage": "/assets/MuKacYjazqkYtwK8LUQanQB1xg.jpeg",
    "publishDate": "2026-02-03",
    "authorId": "koraline-spencer",
    "categoryId": "risk-management",
    "content": [
      {
        "paragraphs": [
          "Growth at all costs sounds exciting until it breaks your operations, culture, and margins.",
          "Premature scaling is the most common cause of startup death and mid-market stagnation. Here's what to watch for."
        ]
      },
      {
        "heading": "When Growth Outpaces Infrastructure",
        "paragraphs": [
          "Revenue growth feels great until your operations cannot keep up. Customer onboarding takes twice as long because your team is overwhelmed. Support tickets pile up. Delivery quality drops. The customers you worked so hard to acquire start churning because the experience does not match the promise.",
          "This is the most common scaling failure we see. Companies invest heavily in sales and marketing without proportionally investing in delivery and operations. The front of the business grows while the back of the business breaks.",
          "“We grew revenue 180% in a year. Our NPS dropped from 72 to 31 in the same period. It took us 18 months to recover the customer trust we destroyed in 12 months of aggressive growth.”"
        ]
      },
      {
        "heading": "The Hiring Trap",
        "paragraphs": [
          "Fast growth creates hiring pressure. Hiring pressure creates bad hires. Bad hires create management overhead, cultural dilution, and performance problems that take months to surface and longer to fix.",
          "The pattern is predictable. A company hits a growth milestone and decides to double the team in six months. Hiring standards drop because seats need filling. Onboarding gets rushed because everyone is too busy. Six months later, half the new hires are underperforming and the original team is burned out from carrying the load.",
          "The better approach is to hire ahead of growth by one quarter, not one year. Staff for where you will be in 90 days, not where you hope to be in 12 months. This creates healthy tension without the chaos of over-hiring."
        ]
      },
      {
        "heading": "Margin Erosion",
        "paragraphs": [
          "Revenue growth that comes at the expense of margins is not growth. It is subsidized volume. This happens when companies discount to win deals, over-service to retain customers, or invest in channels with poor unit economics just to hit a top-line target.",
          "Growth Pattern: Discounting for volume; Revenue Impact: Up 30%; Margin Impact: Down 15%.",
          "Growth Pattern: Over-servicing key accounts; Revenue Impact: Flat; Margin Impact: Down 20%.",
          "Growth Pattern: Scaling paid acquisition; Revenue Impact: Up 50%; Margin Impact: Down 25%.",
          "Growth Pattern: Optimizing existing funnel; Revenue Impact: Up 25%; Margin Impact: Up 10%.",
          "Track gross margin per customer segment quarterly. If margins are declining as you grow, something structural needs to change before you scale further."
        ]
      },
      {
        "heading": "Culture Breaks at Every Doubling",
        "paragraphs": [
          "Company culture that works at 20 people does not survive at 50. What works at 50 does not survive at 150. Every doubling requires a conscious reinvention of how you communicate, make decisions, and maintain alignment.",
          "The companies that scale culture successfully do it intentionally. They document their values early, hire for cultural fit alongside skill, and invest in management training before they need it. The ones that ignore culture end up with pockets of dysfunction that show up as attrition, low morale, and eventually, declining performance."
        ]
      },
      {
        "heading": "The Cash Flow Timing Problem",
        "paragraphs": [
          "Growth consumes cash. Hiring, marketing, tooling, and infrastructure all require upfront investment before the revenue shows up. Many profitable companies have gone under because they grew faster than their cash flow could support.",
          "Model your cash requirements at your target growth rate, not your current run rate. Add 30% as a buffer. If the numbers do not work without external funding, either slow down or secure the capital before you accelerate. Running out of cash with a growing pipeline is a painful way to fail."
        ]
      },
      {
        "heading": "How to Scale Sustainably",
        "paragraphs": [
          "Sustainable scaling means growing as fast as your operations, team, and margins can support. Set growth targets that account for delivery capacity, not just sales capacity. Invest in infrastructure before you need it. Monitor leading indicators like NPS, employee satisfaction, and gross margin alongside revenue. And be willing to pump the brakes if the foundation starts cracking."
        ]
      }
    ]
  }
];
export const legalPages: LegalPage[] = [
  { id: 'privacy-policy', title: 'Privacy Policy', content: [{ heading: 'Information you choose to share', paragraphs: ['This preview includes contact and newsletter forms. Forms are not connected to a destination until the site owner configures a submission endpoint. When enabled, the contact form sends the information you provide to that destination so the team can respond to your enquiry.'] }, { heading: 'Your information', paragraphs: ['We do not sell your personal information. Contact the site owner to request access, correction, or deletion of information you have submitted.'] }, { heading: 'Before publishing', paragraphs: ['This is draft policy content for the website implementation, not legal advice. The site owner must replace it with an approved policy describing the actual business, processors, retention periods, and applicable privacy rights before launch.'] }] },
  { id: 'terms-of-service', title: 'Terms of Service', content: [{ heading: 'Website use', paragraphs: ['The information on this website is provided for general information. Submitting an enquiry does not create a consulting agreement or guarantee a particular result.'] }, { heading: 'Engagements', paragraphs: ['The scope, fees, responsibilities, and terms of any consulting engagement must be agreed separately in writing. Reference-site testimonials and results are demonstration content and are not a promise of future performance.'] }, { heading: 'Before publishing', paragraphs: ['These are draft terms for the website implementation. The site owner must replace them with legally reviewed terms appropriate to the business before launch.'] }] },
];
export const getService = (id: string) => services.find(item => item.id === id);
export const getCaseServices = (study: CaseStudy) => study.serviceIds.map(id => services.find(item => item.id === id)!);
export const getAuthor = (insight: Insight) => teamMembers.find(item => item.id === insight.authorId)!;
export const getCategory = (insight: Insight) => categories.find(item => item.id === insight.categoryId)!;
export const getAuthorInsights = (authorId: string) => insights.filter(item => item.authorId === authorId);
export const formatDate = (value: string) => new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(value));
export function validateContent() {
  for (const collection of [services, caseStudies, insights, teamMembers, categories, legalPages]) {
    if (new Set(collection.map(item => item.id)).size !== collection.length) throw new Error('Duplicate content ID');
  }
  const validateBlocks = (id: string, blocks: RichTextBlock[]) => {
    if (!blocks.length || blocks.some(block => !block.paragraphs.length || block.paragraphs.some(paragraph => !paragraph.trim()))) throw new Error(`Empty content block: ${id}`);
  };
  for (const study of caseStudies) {
    for (const id of study.serviceIds) if (!getService(id)) throw new Error(`Missing service reference: ${id}`);
    validateBlocks(study.id, study.challenge);
    validateBlocks(study.id, study.solution);
    if (study.resultStats.some(stat => !Number.isFinite(stat.value) || !stat.label.trim())) throw new Error(`Invalid result statistic: ${study.id}`);
    if (!study.testimonial.quote.trim() || !study.testimonial.name.trim()) throw new Error(`Missing testimonial: ${study.id}`);
  }
  for (const insight of insights) {
    if (!getAuthor(insight) || !getCategory(insight)) throw new Error(`Broken insight reference: ${insight.id}`);
    validateBlocks(insight.id, insight.content);
  }
  for (const item of [...caseStudies, ...insights]) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(item.publishDate) || Number.isNaN(Date.parse(item.publishDate))) throw new Error(`Invalid publication date: ${item.id}`);
  }
}
validateContent();
