export type HKTriageCategory =
  | "security"
  | "account-access"
  | "connectivity"
  | "device-setup"
  | "documents"
  | "employment"
  | "telehealth"
  | "unknown";

export type HKTriagePriority = "urgent" | "high" | "normal";

export type HKTriageStage =
  "stabilize" | "classify" | "collect-evidence" | "safe-fix" | "escalate";

export interface HKTriageResult {
  category: HKTriageCategory;
  categoryLabel: string;
  priority: HKTriagePriority;
  stage: HKTriageStage;
  needsHuman: boolean;
  confidence: "high" | "medium" | "low";
  response: string;
}

interface Rule {
  category: Exclude<HKTriageCategory, "unknown">;
  label: string;
  keywords: string[];
}

const RULES: Rule[] = [
  {
    category: "security",
    label: "Security or scam risk",
    keywords: [
      "phish",
      "phishing",
      "scam",
      "hacked",
      "hack",
      "malware",
      "virus",
      "ransomware",
      "remote access",
      "anydesk",
      "teamviewer",
      "stolen",
      "fraud",
      "2fa code",
      "verification code",
      "someone called",
      "someone texted",
      "gift card",
    ],
  },
  {
    category: "account-access",
    label: "Account or sign-in access",
    keywords: [
      "email",
      "gmail",
      "yahoo",
      "outlook",
      "password",
      "reset",
      "forgot",
      "locked out",
      "login",
      "log in",
      "sign in",
      "account recovery",
      "2fa",
      "two factor",
    ],
  },
  {
    category: "connectivity",
    label: "Internet or connectivity",
    keywords: [
      "wifi",
      "wi-fi",
      "internet",
      "router",
      "modem",
      "hotspot",
      "network",
      "offline",
      "no connection",
      "connectivity",
    ],
  },
  {
    category: "device-setup",
    label: "Device setup or troubleshooting",
    keywords: [
      "phone",
      "iphone",
      "android",
      "samsung",
      "tablet",
      "computer",
      "laptop",
      "windows",
      "mac",
      "printer",
      "setup",
      "set up",
      "install app",
      "update",
    ],
  },
  {
    category: "documents",
    label: "Documents or online forms",
    keywords: [
      "document",
      "upload",
      "scan",
      "pdf",
      "form",
      "benefits",
      "housing",
      "application form",
      "attach file",
    ],
  },
  {
    category: "employment",
    label: "Job search or employment",
    keywords: [
      "job",
      "jobs",
      "resume",
      "résumé",
      "indeed",
      "linkedin",
      "ncworks",
      "employment",
      "interview",
      "apply for work",
    ],
  },
  {
    category: "telehealth",
    label: "Telehealth access",
    keywords: [
      "telehealth",
      "mychart",
      "patient portal",
      "video visit",
      "doctor app",
      "medical portal",
      "health portal",
      "appointment link",
    ],
  },
];

const SECURITY_DISCLOSURE_PATTERNS = [
  "i gave them my password",
  "i gave my password",
  "shared my password",
  "gave them the code",
  "shared the code",
  "gave my 2fa",
  "sent money",
  "paid them",
  "gave bank",
  "shared bank",
  "gave my social",
  "shared my social",
  "gave my ssn",
  "shared my ssn",
];

function includesAny(text: string, values: string[]): boolean {
  return values.some(value => text.includes(value));
}

function scoreRule(text: string, rule: Rule): number {
  return rule.keywords.reduce(
    (score, keyword) => score + (text.includes(keyword) ? 1 : 0),
    0
  );
}

function classify(text: string): {
  category: HKTriageCategory;
  label: string;
  confidence: HKTriageResult["confidence"];
} {
  const scored = RULES.map(rule => ({
    rule,
    score: scoreRule(text, rule),
  })).sort((a, b) => b.score - a.score);

  const best = scored[0];
  if (!best || best.score === 0) {
    return {
      category: "unknown",
      label: "Needs clarification",
      confidence: "low",
    };
  }

  return {
    category: best.rule.category,
    label: best.rule.label,
    confidence: best.score >= 2 ? "high" : "medium",
  };
}

function securityResponse(text: string): HKTriageResult {
  const disclosed = includesAny(text, SECURITY_DISCLOSURE_PATTERNS);

  return {
    category: "security",
    categoryLabel: "Security or scam risk",
    priority: disclosed ? "urgent" : "high",
    stage: "stabilize",
    needsHuman: true,
    confidence: "high",
    response: disclosed
      ? "Stop contact with the person or service for now. Do not send more money, passwords, verification codes, or personal information. From a trusted device, change the affected account password and contact the real bank/provider using its official website or phone number. If money or identity information was exposed, human follow-up is recommended. H.K. will never ask you to paste a password, SSN, bank number, or 2FA code here."
      : "Treat this as a possible security issue first. Do not click more links, install remote-access software, send money, or share passwords or verification codes. Use the organization’s official app or website to verify the message independently. If an account may be compromised, change its password from a trusted device. Human follow-up is recommended for anything involving money, identity data, or account takeover.",
  };
}

function buildCategoryResponse(category: HKTriageCategory): string {
  switch (category) {
    case "account-access":
      return "I’ve classified this as account access. Use the provider’s official sign-in page and choose its recovery or “forgot password” option. Use only a recovery phone or backup email you recognize. Never paste your password or verification code into this chat. If the recovery method is unavailable or the account may be compromised, the next step is human escalation rather than repeated reset attempts.";
    case "connectivity":
      return "I’ve classified this as connectivity. First check whether the problem affects one device or every device. If all devices are offline, confirm the modem/router has power and restart it once. If only one device is affected, turn Wi-Fi off and back on and reconnect to the correct network. Tell me whether one device or all devices are affected if you need the next step.";
    case "device-setup":
      return "I’ve classified this as device setup or troubleshooting. Keep the device powered and, if possible, connected to a trusted Wi-Fi network. Tell me the device type and the exact screen or error you are seeing. Do not share unlock codes, passwords, or account recovery codes. I’ll use that evidence to choose the safest next step.";
    case "documents":
      return "I’ve classified this as a document or online-form issue. Confirm the site is the official site before uploading anything. Check the requested file type and size, then use the site’s Upload or Choose file control. Avoid sending sensitive documents through this chat. If the site rejects the file, tell me the file type and the exact error message—not the document contents.";
    case "employment":
      return "I’ve classified this as employment support. Start with a working email account and your resume saved as PDF or DOCX. Use the employer’s official careers page or a known platform such as NCWorks, Indeed, or LinkedIn. Never pay someone to submit a normal job application or send banking details before verifying the employer. Tell me which step is blocking you and I’ll narrow it down.";
    case "telehealth":
      return "I’ve classified this as telehealth access. Use the health system’s official app, patient portal, or appointment link. Test camera, microphone, speakers, and internet before the visit. Do not share medical details, insurance numbers, passwords, or portal codes in this chat. If you tell me the app or portal name and the technical error—not private health information—I can guide the setup.";
    default:
      return "I can help triage this, but I need one detail first: is the main problem account access, internet/Wi-Fi, a phone or computer, uploading a document, a job application, telehealth, or a possible scam/security issue? Please choose the closest category and describe the exact error without sharing passwords, SSNs, bank information, or verification codes.";
  }
}

export function triageHKRequest(input: string): HKTriageResult {
  const normalized = input.trim().toLowerCase();

  if (!normalized) {
    return {
      category: "unknown",
      categoryLabel: "Needs clarification",
      priority: "normal",
      stage: "classify",
      needsHuman: false,
      confidence: "low",
      response:
        "Tell me what you are trying to do and what stopped you. Do not include passwords, SSNs, bank information, or verification codes.",
    };
  }

  const securityRule = RULES.find(rule => rule.category === "security")!;
  if (
    scoreRule(normalized, securityRule) > 0 ||
    includesAny(normalized, SECURITY_DISCLOSURE_PATTERNS)
  ) {
    return securityResponse(normalized);
  }

  const classification = classify(normalized);
  const needsHuman = classification.category === "unknown";

  return {
    category: classification.category,
    categoryLabel: classification.label,
    priority: "normal",
    stage: needsHuman ? "classify" : "safe-fix",
    needsHuman,
    confidence: classification.confidence,
    response: buildCategoryResponse(classification.category),
  };
}
