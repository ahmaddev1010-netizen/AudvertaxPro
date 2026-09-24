"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/design-system";
import StartApplicationButton from "@/components/services/StartApplicationButton";
import { UsaGlowMap } from "@/components/UsaGlowMap";
import { formationStates, getServiceBySlug } from "@/lib/services";

type StateInfo = (typeof formationStates)[number];
const PACKAGES = getServiceBySlug("usa-llc")?.packages ?? [];

const POPULAR_STATE_SLUGS = ["wyoming", "new-mexico", "delaware", "texas", "florida"] as const;
const POPULAR_STATES = POPULAR_STATE_SLUGS.map((slug) =>
  formationStates.find((state) => state.slug === slug),
).filter(Boolean) as StateInfo[];

const styles = {
  section:
    "relative isolate overflow-hidden bg-[var(--fm-graphite-deep)] px-6 py-[clamp(72px,10vh,110px)] text-[var(--fm-text-primary)]",
  background:
    "pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(46%_40%_at_88%_12%,color-mix(in_srgb,var(--fm-lime)_8%,transparent),transparent_62%),radial-gradient(40%_38%_at_8%_70%,color-mix(in_srgb,var(--fm-lime)_4.5%,transparent),transparent_62%)]",
  container: "relative z-[1] mx-auto w-full max-w-[1240px]",
  intro: "max-w-[760px]",
  eyebrow: "font-mono text-fm-label font-semibold uppercase tracking-[.18em] text-[var(--fm-lime)]",
  heading:
    "mt-4 font-display text-fm-section font-extrabold leading-[var(--fm-type-section-line-height)] tracking-fm-section text-[var(--fm-text-primary)]",
  headingAccent: "text-[var(--fm-lime-bright)]",
  description: "mt-[18px] text-[17px] leading-relaxed text-[var(--fm-text-secondary)]",
  packageSection: "mt-12",
  packageHeading:
    "font-display text-2xl font-extrabold tracking-[-.03em] text-[var(--fm-text-primary)]",
  packageDescription: "mt-2 text-sm text-[var(--fm-text-secondary)]",
  packageGrid: "mt-5 grid grid-cols-1 gap-3 md:grid-cols-3",
  packageCard:
    "group relative min-h-[250px] cursor-pointer overflow-hidden rounded-[var(--fm-radius-feature)] border p-6 text-left shadow-[var(--fm-shadow-subtle)] transition-[transform,border-color,background-color,box-shadow] duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fm-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--fm-graphite-deep)]",
  packageCardInactive:
    "border-[var(--fm-card-border)] bg-[var(--fm-card-bg)] text-[var(--fm-text-primary)] hover:-translate-y-1 hover:border-[var(--fm-border-accent)] hover:bg-[var(--fm-surface-raised)] hover:shadow-[var(--fm-shadow-elevated)]",
  packageCardActive:
    "border-[var(--fm-lime)] bg-[var(--fm-lime)] text-[var(--fm-graphite-deep)] shadow-[0_18px_50px_color-mix(in_srgb,var(--fm-lime)_18%,transparent)] ring-1 ring-[var(--fm-lime)] -translate-y-1",
  packageName: "font-mono text-[10px] font-bold uppercase tracking-[.14em]",
  packageNameInactive: "text-[var(--fm-text-secondary)]",
  packageNameActive: "text-[var(--fm-graphite-deep)] opacity-70",
  packagePrice: "mt-3 font-display text-4xl font-extrabold tracking-[-.04em]",
  packageCopy: "mt-3 min-h-[40px] text-xs leading-5",
  packageCopyInactive: "text-[var(--fm-text-secondary)]",
  packageCopyActive: "text-[var(--fm-graphite-deep)] opacity-80",
  packageFeatures: "mt-5 space-y-2 border-t pt-4",
  packageFeaturesInactive: "border-[var(--fm-border)]",
  packageFeaturesActive: "border-[color-mix(in_srgb,var(--fm-graphite-deep)_20%,transparent)]",
  packageFeature: "flex gap-2 text-xs",
  packageFeatureInactive: "text-[var(--fm-text-secondary)]",
  packageFeatureActive: "text-[var(--fm-graphite-deep)]",
  packageCheck: "text-[var(--fm-lime)] font-bold",
  packageCardAccent:
    "pointer-events-none absolute inset-x-0 top-0 h-1 bg-[var(--fm-lime)] opacity-0 transition-opacity duration-[var(--fm-motion-component)] group-hover:opacity-100",
  packageCardAccentActive: "opacity-100 bg-[var(--fm-graphite-deep)]",
  packageCheckInactive: "text-[var(--fm-lime)]",
  packageCheckActive: "text-[var(--fm-graphite-deep)]",
  layout:
    "mt-[54px] grid grid-cols-1 items-start gap-8 md:gap-9 lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,.95fr)] xl:grid-cols-[minmax(0,1.6fr)_minmax(330px,.9fr)]",
  previewColumn: "min-w-0",
  previewCard:
    "relative flex min-h-[320px] flex-col items-center justify-center gap-8 overflow-hidden p-[clamp(20px,4vw,40px)] text-center sm:min-h-[360px]",
  previewGrid:
    "pointer-events-none absolute inset-0 opacity-70 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--fm-lime)_5.5%,transparent)_1px,transparent_1px),linear-gradient(color-mix(in_srgb,var(--fm-lime)_5.5%,transparent)_1px,transparent_1px)] [background-size:36px_36px]",
  searchWrap: "relative z-[4] mt-5",
  searchField:
    "flex h-12 w-full items-center gap-3 rounded-[var(--fm-radius-pill)] border border-[var(--fm-border)] bg-[var(--fm-surface)] px-4 text-[var(--fm-text-primary)] shadow-[var(--fm-shadow-subtle)] transition-[border-color,box-shadow] duration-[var(--fm-motion-component)] focus-within:border-[var(--fm-lime)] focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--fm-lime)_12%,transparent)]",
  searchIcon: "h-4 w-4 flex-shrink-0 text-[var(--fm-text-secondary)]",
  searchInput:
    "min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-[var(--fm-text-secondary)]",
  suggestions:
    "absolute left-0 right-0 top-[calc(100%+8px)] max-h-72 overflow-y-auto rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-surface)] p-1.5 shadow-[var(--fm-shadow-elevated)]",
  suggestion:
    "flex w-full items-center justify-between rounded-[var(--fm-radius-sm)] px-3 py-2.5 text-left text-sm font-semibold text-[var(--fm-text-primary)] transition-colors hover:bg-[var(--fm-surface-raised)]",
  suggestionCode:
    "font-mono text-[10px] uppercase tracking-[.12em] text-[var(--fm-text-secondary)]",
  noResults: "px-3 py-3 text-sm text-[var(--fm-text-secondary)]",
  selectedState:
    "pointer-events-none absolute bottom-5 left-5 z-[1] text-left sm:bottom-7 sm:left-7",
  selectedLabel:
    "font-mono text-[10px] font-bold uppercase tracking-[.14em] text-[var(--fm-text-secondary)] sm:text-[11px]",
  selectedCode: "font-bold text-[var(--fm-lime-bright)]",
  selectedName:
    "mt-1 font-display text-[clamp(1.65rem,3.5vw,3.2rem)] font-extrabold leading-none text-[var(--fm-text-primary)]",
  popular: "mt-[22px] flex flex-wrap items-center gap-2.5",
  popularLabel: "font-mono text-[11px] uppercase tracking-[.14em] text-[var(--fm-text-secondary)]",
  stateButton:
    "rounded-[var(--fm-radius-pill)] border border-[var(--fm-border)] bg-[var(--fm-surface)] px-[18px] py-[9px] text-[13px] font-bold text-[var(--fm-lime-bright)] transition-[background-color,border-color,color] duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)] hover:border-[var(--fm-border-accent)] hover:bg-[var(--fm-surface-raised)] hover:text-black",
  stateButtonActive:
    "border-[var(--fm-lime)] bg-[var(--fm-lime)] text-[var(--fm-graphite-deep)] hover:border-[var(--fm-lime)] hover:bg-[var(--fm-lime)] hover:text-[var(--fm-graphite-deep)]",
  sourceNote: "mt-[18px] font-mono text-[11px] leading-relaxed text-[var(--fm-text-secondary)]",
  detailCard: "relative h-fit min-w-0 overflow-hidden p-5 sm:p-6 lg:sticky lg:top-6 lg:p-7 xl:p-8",
  detailGlow:
    "pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,var(--fm-lime-soft),transparent)]",
  detailHeader:
    "relative z-[1] flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4",
  detailCode:
    "font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[var(--fm-text-secondary)]",
  detailName:
    "mt-1 font-display text-[clamp(1.65rem,2.5vw,2.15rem)] font-extrabold leading-[1.08] tracking-[-.03em] text-[var(--fm-text-primary)]",
  tag: "w-fit rounded-[var(--fm-radius-pill)] border border-[var(--fm-border-accent)] bg-[var(--fm-lime-soft)] px-3 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[.08em] text-[var(--fm-lime-bright)] sm:mt-1 sm:max-w-[55%] sm:truncate",
  note: "relative z-[1] mt-3 text-[13px] leading-5 text-[var(--fm-text-secondary)]",
  metrics: "relative z-[1] mt-5 grid grid-cols-2 gap-2.5 sm:gap-3",
  metric:
    "min-w-0 rounded-[var(--fm-radius-md)] border border-[var(--fm-card-border)] bg-[var(--fm-card-bg)] p-3.5 sm:p-4",
  metricLabel: "font-mono text-[9.5px] uppercase tracking-[.09em] text-[var(--fm-text-secondary)]",
  metricValue:
    "mt-1 font-display text-[clamp(1.45rem,2.5vw,1.8rem)] font-extrabold text-[var(--fm-text-primary)]",
  metricNote: "mt-0.5 text-[10.5px] leading-4 text-[var(--fm-text-secondary)]",
  renewal:
    "relative z-[1] mt-2.5 rounded-[var(--fm-radius-md)] border border-[var(--fm-card-border)] bg-[var(--fm-card-bg)] p-3.5 sm:p-4",
  renewalLabel: "font-mono text-[9.5px] uppercase tracking-[.09em] text-[var(--fm-text-secondary)]",
  renewalValue: "mt-1 text-[14px] font-bold text-[var(--fm-text-primary)]",
  investment:
    "relative z-[1] mt-5 flex flex-col gap-3 border-t border-[var(--fm-border)] pt-5 sm:flex-row sm:items-end sm:justify-between sm:gap-4",
  investmentTitle: "text-[13px] font-bold text-[var(--fm-text-primary)] sm:text-sm",
  investmentBreakdown: "mt-1 font-mono text-[10px] leading-4 text-[var(--fm-text-secondary)]",
  total:
    "font-display text-[clamp(2rem,4vw,2.45rem)] font-extrabold tracking-[-.03em] text-[var(--fm-lime-bright)] sm:flex-shrink-0",
  renewalSummary:
    "relative z-[1] mt-2 flex items-center justify-between gap-3 border-t border-[var(--fm-border)] pt-3",
  renewalSummaryLabel: "text-[12px] font-semibold text-[var(--fm-text-secondary)]",
  renewalSummaryValue: "font-display text-lg font-extrabold text-[var(--fm-text-primary)]",
  suitability: "relative z-[1] mt-5 border-t border-[var(--fm-border)] pt-5",
  suitabilityLabel:
    "font-mono text-[9.5px] font-bold uppercase tracking-[.1em] text-[var(--fm-text-secondary)]",
  suitabilityList: "mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2",
  suitabilityItem:
    "flex min-w-0 items-start gap-2 text-[11.5px] leading-4 text-[var(--fm-text-secondary)]",
  suitabilityCheck: "mt-px flex-shrink-0 font-bold text-[var(--fm-lime)]",
  cta: "relative z-[1] mt-5 w-full shadow-[var(--fm-shadow-subtle)]",
} as const;

function scoreState(state: StateInfo, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return 0;

  const name = state.name.toLowerCase();
  const abbreviation = state.abbreviation.toLowerCase();
  const slug = state.slug.toLowerCase();

  if (name === normalized || abbreviation === normalized) return 1000;
  if (name.startsWith(normalized)) return 800 - name.length;
  if (abbreviation.startsWith(normalized)) return 750 - abbreviation.length;
  if (slug.startsWith(normalized)) return 700 - slug.length;
  if (name.includes(normalized)) return 500 - name.indexOf(normalized);
  if (slug.includes(normalized)) return 400 - slug.indexOf(normalized);

  let queryIndex = 0;
  let score = 0;
  for (const character of name) {
    if (character === normalized[queryIndex]) {
      score += 1;
      queryIndex += 1;
      if (queryIndex === normalized.length) break;
    }
  }

  return queryIndex === normalized.length ? 200 + score : -1;
}

export default function StateExplorerSection() {
  const [selected, setSelected] = useState<StateInfo>(formationStates[0]);
  const [packageSlug, setPackageSlug] = useState(PACKAGES[0]?.slug ?? "basic");
  const [stateQuery, setStateQuery] = useState("");
  const selectedPackage = PACKAGES.find((item) => item.slug === packageSlug) ?? PACKAGES[0];
  const total = useMemo(
    () => selected.filingFee + (selectedPackage?.price ?? 0),
    [selected, selectedPackage],
  );

  const suggestions = useMemo(() => {
    const query = stateQuery.trim();
    if (!query) return [];

    return formationStates
      .map((state) => ({ state, score: scoreState(state, query) }))
      .filter(({ score }) => score >= 0)
      .sort((a, b) => b.score - a.score || a.state.name.localeCompare(b.state.name))
      .slice(0, 6)
      .map(({ state }) => state);
  }, [stateQuery]);

  const selectState = (state: StateInfo) => {
    setSelected(state);
    setStateQuery("");
  };

  const handleMapStateSelect = (stateSlug: string) => {
    const state = formationStates.find((item) => item.slug === stateSlug);
    if (state) selectState(state);
  };

  return (
    <section id="states" aria-labelledby="states-heading" className={styles.section}>
      <div className={styles.background} />
      <div className={styles.container}>
        <div className={styles.intro}>
          <span className={styles.eyebrow}>USA LLC Formation</span>
          <h2 id="states-heading" className={styles.heading}>
            Choose your package. Choose your state.{" "}
            <span className={styles.headingAccent}>Know your total.</span>
          </h2>
          <p className={styles.description}>
            Start by choosing the level of support you need. Then select your state to see the
            filing fee, renewal cost and your exact first-year investment.
          </p>
        </div>

        <div className={styles.packageSection}>
          <h3 className={styles.packageHeading}>1. Choose your package</h3>
          <p className={styles.packageDescription}>
            Your package covers Audvertax services. State filing fees are shown separately.
          </p>
          <div className={styles.packageGrid}>
            {PACKAGES.map((pkg) => {
              const active = pkg.slug === selectedPackage?.slug;
              return (
                <button
                  key={pkg.slug}
                  type="button"
                  onClick={() => setPackageSlug(pkg.slug)}
                  aria-pressed={active}
                  className={`${styles.packageCard} ${active ? styles.packageCardActive : styles.packageCardInactive}`}
                >
                  <span
                    className={`${styles.packageCardAccent} ${active ? styles.packageCardAccentActive : ""}`}
                  />
                  <p
                    className={`${styles.packageName} ${active ? styles.packageNameActive : styles.packageNameInactive}`}
                  >
                    {pkg.name}
                  </p>
                  <p className={styles.packagePrice}>${pkg.price}</p>
                  <p
                    className={`${styles.packageCopy} ${active ? styles.packageCopyActive : styles.packageCopyInactive}`}
                  >
                    {pkg.description}
                  </p>
                  <ul
                    className={`${styles.packageFeatures} ${active ? styles.packageFeaturesActive : styles.packageFeaturesInactive}`}
                  >
                    {pkg.features.map((feature) => (
                      <li
                        key={feature}
                        className={`${styles.packageFeature} ${active ? styles.packageFeatureActive : styles.packageFeatureInactive}`}
                      >
                        <span
                          className={`${styles.packageCheck} ${active ? styles.packageCheckActive : styles.packageCheckInactive}`}
                        >
                          ✓
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.layout}>
          <div className={styles.previewColumn}>
            <p className={styles.packageHeading}>2. Choose your state</p>
            <p className={styles.packageDescription}>
              Compare the state costs before starting your application.
            </p>

            <div className={styles.searchWrap}>
              <label className="sr-only" htmlFor="state-search">
                Search for a state
              </label>
              <div className={styles.searchField}>
                <Search aria-hidden="true" className={styles.searchIcon} />
                <input
                  id="state-search"
                  type="search"
                  value={stateQuery}
                  onChange={(event) => setStateQuery(event.target.value)}
                  placeholder="Search for a state..."
                  autoComplete="off"
                  className={styles.searchInput}
                  aria-label="Search for a state"
                  aria-autocomplete="list"
                  aria-controls="state-search-suggestions"
                  aria-expanded={stateQuery.trim().length > 0}
                />
              </div>
              {stateQuery.trim() && (
                <div id="state-search-suggestions" role="listbox" className={styles.suggestions}>
                  {suggestions.length > 0 ? (
                    suggestions.map((state) => (
                      <button
                        key={state.slug}
                        type="button"
                        role="option"
                        aria-selected={selected.slug === state.slug}
                        onClick={() => selectState(state)}
                        className={styles.suggestion}
                      >
                        <span>{state.name}</span>
                        <span className={styles.suggestionCode}>{state.abbreviation}</span>
                      </button>
                    ))
                  ) : (
                    <p className={styles.noResults}>No matching state found.</p>
                  )}
                </div>
              )}
            </div>

            <Card variant="elevated" tone="dark" className={`${styles.previewCard} mt-5`}>
              <div className={styles.previewGrid} />
              <div className="absolute inset-0">
                <UsaGlowMap
                  color="var(--fm-lime)"
                  selectedStateSlug={selected.slug}
                  onStateSelect={handleMapStateSelect}
                />
              </div>
              <div className={styles.selectedState}>
                <p className={styles.selectedLabel}>
                  Selected state ·{" "}
                  <span className={styles.selectedCode}>{selected.abbreviation}</span>
                </p>
                <p className={styles.selectedName}>{selected.name}</p>
              </div>
            </Card>

            <div className={styles.popular}>
              <span className={styles.popularLabel}>States:</span>
              {POPULAR_STATES.map((state) => (
                <button
                  key={state.slug}
                  type="button"
                  onClick={() => selectState(state)}
                  className={`${styles.stateButton} ${selected.slug === state.slug ? styles.stateButtonActive : ""}`}
                >
                  {state.name}
                </button>
              ))}
            </div>
            <p className={styles.sourceNote}>
              Fees compiled from state Secretary of State schedules, June 2026.
              <br />
              State fees are paid to the state, not to Audvertax.
            </p>
          </div>

          <Card variant="elevated" tone="dark" className={styles.detailCard}>
            <div aria-hidden="true" className={styles.detailGlow} />
            <div className={styles.detailHeader}>
              <div className="min-w-0">
                <p className={styles.detailCode}>Selected state · {selected.abbreviation}</p>
                <h3 className={styles.detailName}>{selected.name}</h3>
              </div>
              <span className={styles.tag}>{selected.tag}</span>
            </div>

            <p className={styles.note}>{selected.description}</p>

            <div className={styles.metrics}>
              <div className={styles.metric}>
                <p className={styles.metricLabel}>Formation fee</p>
                <p className={styles.metricValue}>${selected.filingFee}</p>
                <p className={styles.metricNote}>Paid to the state</p>
              </div>
              <div className={styles.metric}>
                <p className={styles.metricLabel}>Annual renewal</p>
                <p className={styles.metricValue}>${selected.renewalFee}</p>
                <p className={styles.metricNote}>{selected.renewalDue}</p>
              </div>
            </div>

            <div className={styles.renewal}>
              <p className={styles.renewalLabel}>Renewal timing</p>
              <p className={styles.renewalValue}>{selected.renewalDue}</p>
            </div>

            <div className={styles.suitability}>
              <p className={styles.suitabilityLabel}>Good for</p>
              <ul className={styles.suitabilityList}>
                {selected.suitableFor.slice(0, 4).map((item) => (
                  <li key={item} className={styles.suitabilityItem}>
                    <span className={styles.suitabilityCheck}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.investment}>
              <div className="min-w-0">
                <p className={styles.investmentTitle}>Your first-year investment</p>
                <p className={styles.investmentBreakdown}>
                  Package ${selectedPackage?.price ?? 0} + state fee ${selected.filingFee}
                </p>
              </div>
              <p className={styles.total}>${total}</p>
            </div>

            <div className={styles.renewalSummary}>
              <span className={styles.renewalSummaryLabel}>Annual state renewal</span>
              <span className={styles.renewalSummaryValue}>${selected.renewalFee}</span>
            </div>

            <StartApplicationButton
              serviceSlug="usa-llc"
              packageSlug={selectedPackage?.slug}
              formationState={selected.slug}
              variant="card"
              size="lg"
              className={styles.cta}
            >
              Start your {selected.name} LLC <span aria-hidden="true">→</span>
            </StartApplicationButton>
          </Card>
        </div>
      </div>
    </section>
  );
}
