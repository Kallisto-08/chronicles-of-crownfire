import { AnimatePresence, motion } from "framer-motion";

export function PixelImage({ src, alt = "", className = "" }) {
  return <img src={src} alt={alt} className={`[image-rendering:pixelated] ${className}`} draggable="false" />;
}

export function ResourcePill({ id, label, value, icon }) {
  return (
    <div className="flex min-h-8 items-center gap-1.5 rounded-sm border border-amber-400/30 bg-black/45 px-2 py-1 text-[10px] font-black text-amber-100 shadow-[0_0_10px_rgba(245,158,11,0.1),inset_0_1px_rgba(255,236,180,0.08)]">
      {icon ? <PixelImage src={icon} className="h-4 w-4 shrink-0 md:h-5 md:w-5" /> : null}
      <span className="hidden uppercase tracking-[0.05em] text-stone-300 sm:inline">{label}</span>
      <span className="text-amber-50">{value ?? 0}</span>
    </div>
  );
}

export function NavBar({ screen, resources, currentArea = "Crownfire", campaignProgress = "", onNavigate, onNewCampaign, onOpenParty, partyOpen = false, partySummary = "", icons }) {
  const tabs = [
    { id: "battle", label: "Battle", icon: icons.battle },
    { id: "map", label: "World Map", icon: icons.worldMap },
    { id: "village", label: "Village", icon: icons.build },
    { id: "inventory", label: "Inventory", icon: icons.inventory },
    { id: "codex", label: "Codex", icon: icons.quest },
  ];

  return (
    <nav className="mb-2 grid min-w-0 grid-cols-1 items-center gap-2 rounded-md border border-amber-400/30 bg-black/45 p-2 shadow-[0_0_22px_rgba(245,158,11,0.1),inset_0_1px_rgba(255,236,180,0.08)] lg:grid-cols-[minmax(170px,0.68fr)_minmax(300px,1fr)] 2xl:grid-cols-[minmax(170px,0.72fr)_minmax(300px,1fr)_minmax(420px,0.95fr)]">
      <div className="flex min-w-0 items-center gap-2">
        <PixelImage src={icons.logo} className="h-9 w-9 shrink-0 md:h-10 md:w-10" />
        <div className="min-w-0 pr-2">
          <p className="text-[8px] uppercase tracking-[0.18em] text-amber-300">Chronicles of</p>
          <h1 className="truncate font-display text-lg font-black leading-none text-amber-100 md:text-xl">Crownfire</h1>
          <p className="mt-0.5 truncate text-[8px] uppercase tracking-[0.12em] text-stone-500">{currentArea}{campaignProgress ? ` | ${campaignProgress}` : ""}</p>
        </div>
      </div>

      <div className="flex min-w-0 flex-wrap justify-center gap-1 rounded-sm bg-amber-950/10 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            aria-label={tab.label}
            title={tab.label}
            onClick={() => onNavigate(tab.id)}
            className={`grid h-12 w-[3.65rem] place-items-center rounded-sm border px-1 py-1 transition sm:w-[4.35rem] md:h-14 md:w-[4.8rem] ${
              screen === tab.id
                ? "border-amber-200 bg-amber-400/25 text-amber-50 shadow-[0_0_22px_rgba(251,191,36,0.28),inset_0_1px_rgba(255,255,255,0.12)]"
                : "border-stone-700 bg-black/35 text-stone-200 hover:border-amber-300 hover:bg-amber-500/15 hover:text-amber-50"
            }`}
          >
            <PixelImage src={tab.icon} className="h-6 w-6 md:h-7 md:w-7" />
            <span className="mt-0.5 max-w-full truncate text-[8px] font-black uppercase tracking-[0.04em] md:text-[9px]">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex min-w-0 flex-wrap items-center justify-start gap-1 lg:col-span-2 2xl:col-span-1 2xl:justify-end">
        <button
          type="button"
          onClick={onOpenParty}
          className={`flex min-h-8 items-center gap-1.5 rounded-sm border px-2 py-1 text-[10px] font-black uppercase tracking-[0.05em] transition-colors ${
            partyOpen
              ? "border-amber-200 bg-amber-400/25 text-amber-50 shadow-[0_0_18px_rgba(251,191,36,0.24)]"
              : "border-amber-400/35 bg-black/45 text-amber-100 shadow-[0_0_14px_rgba(245,158,11,0.12),inset_0_1px_rgba(255,236,180,0.08)] hover:border-amber-200 hover:bg-amber-500/15 hover:text-amber-50"
            }`}
        >
          <PixelImage src={icons.quest} className="h-4 w-4 md:h-5 md:w-5" />
          <span>Party {partySummary}</span>
        </button>
        {[
          ["gold", "Gold"],
          ["wood", "Wood"],
          ["stone", "Stone"],
          ["essence", "Essence"],
        ].map(([id, label]) => <ResourcePill key={id} id={id} label={label} value={resources[id]} icon={icons[id]} />)}
        <button type="button" onClick={onNewCampaign} className="min-h-8 rounded-sm border border-red-400/45 bg-red-950/45 px-2 py-1 text-[10px] font-black uppercase tracking-[0.05em] text-red-100 shadow-[0_0_12px_rgba(248,113,113,0.12)] transition-colors hover:border-red-200 hover:bg-red-800/55 hover:text-red-50">
          New Campaign
        </button>
      </div>
    </nav>
  );
}

export function TopNav(props) {
  return <NavBar {...props} />;
}

export function LoadingScreen({ loading, logo, tip, background }) {
  return (
    <AnimatePresence>
      {loading ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-[#080608]/95"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="relative w-[460px] max-w-[calc(100vw-48px)] overflow-hidden rounded-md border border-amber-500/35 bg-gradient-to-br from-stone-950 to-red-950/70 p-6 text-center shadow-blood">
            {background ? <PixelImage src={background} className="absolute inset-0 h-full w-full object-cover opacity-20" /> : null}
            <div className="relative">
            <PixelImage src={logo} className="mx-auto h-20 w-20" />
            <p className="mt-3 text-xs uppercase tracking-[0.28em] text-amber-300">Chronicles of</p>
            <h2 className="font-display text-3xl font-black text-amber-100">Crownfire</h2>
            <div className="mt-5 h-3 overflow-hidden rounded-sm border border-stone-700 bg-black/50">
              <motion.div
                className="h-full bg-gradient-to-r from-red-700 via-orange-500 to-amber-200"
                initial={{ width: "8%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.95, ease: "easeInOut" }}
              />
            </div>
            <p className="mt-4 text-sm text-stone-300">{tip}</p>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
