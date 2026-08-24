from pathlib import Path
import re

HOME_PATH = Path("client/src/pages/Home.tsx")
HK_PATH = Path("client/src/components/HKChatBubble.tsx")

home = HOME_PATH.read_text()
hk = HK_PATH.read_text()


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one match, found {count}")
    return text.replace(old, new, 1)


def sub_once(text: str, pattern: str, replacement: str, label: str) -> str:
    updated, count = re.subn(pattern, replacement, text, count=1, flags=re.S)
    if count != 1:
        raise SystemExit(f"{label}: expected exactly one regex match, found {count}")
    return updated


required_applied = [
    "HeroInfrastructureBackdrop",
    "NavigatorInfrastructureBackdrop",
    "HubInfrastructureVisual",
    "HKIdentityMark",
    "SpanInfrastructureBackdrop",
    "SuccessInfrastructureBackdrop",
    'button[data-hk-launcher="true"]',
]

if "d2xsxph8kpxj0f.cloudfront.net" not in home:
    missing = [marker for marker in required_applied if marker not in home]
    if missing:
        raise SystemExit(f"CloudFront block is gone but repair markers are incomplete: {missing}")
    if 'data-hk-launcher="true"' not in hk:
        raise SystemExit("Home repair exists but stable H.K. launcher hook is missing")
    print("TECHBRIDGE_FIRST_PARTY_VISUAL_REPAIR=ALREADY_APPLIED")
    raise SystemExit(0)

home = replace_once(
    home,
    'import BridgeSVG from "../components/BridgeSVG";\n',
    'import BridgeSVG from "../components/BridgeSVG";\nimport {\n'
    '  HeroInfrastructureBackdrop,\n'
    '  HKIdentityMark,\n'
    '  HubInfrastructureVisual,\n'
    '  NavigatorInfrastructureBackdrop,\n'
    '  SpanInfrastructureBackdrop,\n'
    '  SuccessInfrastructureBackdrop,\n'
    '} from "../components/TechBridgeVisuals";\n',
    "visual imports",
)

home = sub_once(
    home,
    r'\nconst CDN = \{\n.*?d2xsxph8kpxj0f\.cloudfront\.net.*?\n\};\n',
    "\n",
    "dead CloudFront CDN block",
)

home = replace_once(
    home,
    '    desc: "Named for Horace King, master bridge builder. 24/7 step-by-step guidance between visits.",',
    '    desc: "H.K. is TechBridge\'s male Help Desk Architect, inspired by Horace King. Deterministic guidance between visits.",',
    "H.K. pillar description",
)
home = replace_once(
    home,
    '      "Powered by Anthropic Claude with TechBridge safety guardrails",',
    '      "Deterministic browser-based triage with TechBridge safety guardrails",',
    "H.K. pillar runtime claim",
)

home = sub_once(
    home,
    r'''const hkButton = document\.querySelector\(\s*'button\[aria-label="Ask H\.K\. AI"\]'\s*\) as HTMLButtonElement;''',
    '''const hkButton = document.querySelector(\n      'button[data-hk-launcher="true"]'\n    ) as HTMLButtonElement;''',
    "stable Home-to-H.K. launcher selector",
)

home = sub_once(
    home,
    r'''<img\s+src=\{CDN\.bridgeHero\}\s+alt=""\s+className="w-full h-full object-cover"\s*/>''',
    "<HeroInfrastructureBackdrop />",
    "hero visual",
)
home = replace_once(
    home,
    '"linear-gradient(135deg, rgba(10, 31, 20, 0.85) 0%, rgba(10, 31, 20, 0.7) 40%, rgba(10, 31, 20, 0.92) 100%)"',
    '"linear-gradient(135deg, rgba(10, 31, 20, 0.48) 0%, rgba(10, 31, 20, 0.34) 44%, rgba(10, 31, 20, 0.68) 100%)"',
    "hero visual veil",
)

home = sub_once(
    home,
    r'''<img\s+src=\{CDN\.navigatorHelping\}\s+alt="Digital Navigator helping community member"\s+className="w-full h-full object-cover"\s*/>''',
    "<NavigatorInfrastructureBackdrop />",
    "Navigator visual",
)
home = replace_once(
    home,
    '"linear-gradient(to right, rgba(10, 31, 20, 0.92), rgba(10, 31, 20, 0.6))"',
    '"linear-gradient(to right, rgba(10, 31, 20, 0.82), rgba(10, 31, 20, 0.34))"',
    "Navigator visual veil",
)

home = sub_once(
    home,
    r'''<img\s+src=\{i === 0 \? CDN\.hubExterior : CDN\.communityGathering\}\s+alt=\{hub\.name\}\s+className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"\s*/>''',
    '<HubInfrastructureVisual index={i} label={hub.name} />',
    "hub visuals",
)

home = sub_once(
    home,
    r'''<div\s+className="w-10 h-10 rounded-full overflow-hidden"\s+style=\{\{\s*border: "2px solid var\(--tb-gold\)",\s*boxShadow: "var\(--glow-gold\)",\s*\}\}\s*>\s*<img\s+src=\{CDN\.hkAvatar\}\s+alt="H\.K\."\s+className="w-full h-full object-cover"\s*/>\s*</div>''',
    '<HKIdentityMark size="sm" />',
    "H.K. Home identity visual",
)
home = replace_once(
    home,
    "                          Powered by Claude AI",
    "                          Deterministic triage · privacy-first",
    "H.K. Home runtime status",
)

home = sub_once(
    home,
    r'''Named for\{" "\}\s*<strong className="text-glow-gold">Horace King</strong>, the\s*enslaved master bridge builder who connected communities\s*across the American South\.''',
    '''H.K. is TechBridge's male Help Desk Architect, inspired by\n                  the bridge-building legacy of{" "}\n                  <strong className="text-glow-gold">Horace King</strong>. It is\n                  a product persona, not an impersonation of the historical\n                  Horace King.''',
    "H.K. Home identity copy",
)
home = sub_once(
    home,
    r'''H\.K\. never guesses\. Never asks for credentials\. Routes you to\s*the right portal, walks you through each step, and escalates\s*to a human Navigator when needed\.''',
    '''H.K. follows a bounded triage flow: stabilize risk, classify\n                  the issue, recommend a safe next step, and escalate to a human\n                  Navigator when the issue needs a person.''',
    "H.K. Home behavior copy",
)
home = sub_once(
    home,
    r'''"H\.K\. is not a chatbot\. It is a deterministic triage state\s*machine augmented by generative AI\."''',
    '''"H.K. uses deterministic triage to classify, stabilize,\n                    guide, and escalate without sending chat text to an external\n                    language-model endpoint."''',
    "H.K. Home runtime quote",
)
home = sub_once(
    home,
    r'''"📧 Recover my email",\s*"💼 Apply for jobs",\s*"📱 Set up my phone",\s*"📁 Upload documents",\s*"🔑 Reset a password",\s*"🏥 Set up telehealth",''',
    '''"🛡️ Check a suspicious message",\n                        "📧 Recover my email",\n                        "🌐 Fix Wi-Fi",\n                        "💼 Apply for jobs",\n                        "📱 Set up my phone",\n                        "📁 Upload documents",\n                        "🏥 Set up telehealth",''',
    "H.K. Home quick starts",
)

home = sub_once(
    home,
    r'''<img\s+src=\{CDN\.spanJourney\}\s+alt=""\s+className="w-full h-full object-cover"\s+style=\{\{ opacity: 0\.06 \}\}\s*/>''',
    "<SpanInfrastructureBackdrop />",
    "SPAN visual",
)

home = sub_once(
    home,
    r'''<img\s+src=\{CDN\.successMoment\}\s+alt="Community member celebrating"\s+className="w-full h-full object-cover"\s*/>''',
    "<SuccessInfrastructureBackdrop />",
    "success visual",
)
home = replace_once(
    home,
    '"linear-gradient(to left, rgba(10, 31, 20, 0.92), rgba(10, 31, 20, 0.6))"',
    '"linear-gradient(to left, rgba(10, 31, 20, 0.82), rgba(10, 31, 20, 0.36))"',
    "success visual veil",
)

hk = replace_once(
    hk,
    "          ref={toggleButtonRef}\n          onClick={toggleChat}",
    '          ref={toggleButtonRef}\n          data-hk-launcher="true"\n          onClick={toggleChat}',
    "stable H.K. launcher hook",
)
hk = replace_once(
    hk,
    '          className="relative grid h-16 w-16 place-items-center rounded-full shadow-2xl"',
    '          className="relative flex h-16 min-w-16 items-center justify-center gap-3 rounded-full px-2.5 shadow-2xl sm:min-w-[204px] sm:justify-start sm:pr-5"',
    "named H.K. launcher capsule",
)
hk = replace_once(
    hk,
    '''          ) : (\n            <HKMark />\n          )}\n          <span''',
    '''          ) : (\n            <HKMark />\n          )}\n          <div className="hidden min-w-0 text-left sm:block">\n            <p className="text-sm font-bold leading-tight" style={{ color: "#FDF8F0" }}>\n              {isOpen ? "Close H.K." : "H.K."}\n            </p>\n            <p className="mt-0.5 text-[10px] font-mono uppercase tracking-[0.12em]" style={{ color: "#D8B84A" }}>\n              {isOpen ? "Return to site" : "Help Desk Architect"}\n            </p>\n          </div>\n          <span''',
    "visible H.K. launcher identity",
)

HOME_PATH.write_text(home)
HK_PATH.write_text(hk)

for forbidden in [
    "d2xsxph8kpxj0f.cloudfront.net",
    "Powered by Claude AI",
    "Powered by Anthropic Claude",
    "augmented by generative AI",
]:
    if forbidden in home:
        raise SystemExit(f"forbidden stale dependency/claim remains in Home.tsx: {forbidden}")

for marker in required_applied:
    if marker not in home:
        raise SystemExit(f"required Home repair marker missing: {marker}")

if 'data-hk-launcher="true"' not in hk:
    raise SystemExit("stable H.K. launcher hook missing")

print("TECHBRIDGE_FIRST_PARTY_VISUAL_REPAIR=PASS")
