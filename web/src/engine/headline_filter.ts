const DRY_OR_BLEAK_RE =
  /\b(cve-\d|kernel|x86|arm64|syscall|compiler|malloc|linux \d|release notes|changelog|obituary|murder|killed|killing|sentenced|arrested|funeral|cremated|massacre|shooting|rape|suicide|war crime|genocide)\b/i;

const OBSCURE_BIO_RE = /\(\d{4}[-–]\d{4}\)|—\s*(american|british|french|german|hungarian|polish|italian|russian)\s+(actor|actress|politician|footballer|player|painter|poet|bishop|soldier)/i;

const COMEDY_BOOST_RE =
  /\b(elon|musk|trump|putin|modi|gandhi|nasa|cern|mit|mars|moon|rocket|satellite|robot|ai|openai|anthropic|google|apple|billion|million|goa|beach|scooter|airport|sleep|coffee|tea|cat|dog|fish|whale|dolphin|octopus|pizza|toast|fridge|toaster|wifi|wi-fi|summit|treaty|bank|rent|broker|study|scientist|physicist|accidentally|bizarre|weird|record|world's)\b/gi;

/**
 * Scores a raw online headline for comedic/viral potential.
 * Returns -1 to reject dry kernel patches, tragedies, or obscure encyclopedia stubs.
 */
export function scoreHeadlineComedyPotential(title: string): number {
  const clean = title.trim();
  if (clean.length < 14 || clean.length > 160) return -1;
  if (DRY_OR_BLEAK_RE.test(clean) || OBSCURE_BIO_RE.test(clean)) return -1;
  if (/^(ask hn|tell hn|launch hn):/i.test(clean)) return -1;

  const hits = clean.match(COMEDY_BOOST_RE);
  const boost = hits ? Math.min(40, hits.length * 14) : 0;
  const hasNumber = /\d/.test(clean) ? 8 : 0;
  return 50 + boost + hasNumber;
}
