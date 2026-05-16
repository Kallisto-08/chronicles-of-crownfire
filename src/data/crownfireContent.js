export const WORLD_LORE = {
  premise:
    "Crownfire was a mountain kingdom built around a living flame said to crown the rightful sovereign. When the flame was forced into a weapon, it became a curse that burned memory, bloodlines, and oaths.",
  playerArc:
    "Sire begins as a forgotten adventurer and slowly learns that his missing past is the lost inheritance of Crownfire. The campaign asks whether the kingdom should be restored, purified, or ended forever.",
  factions: [
    { name: "The Hollowed", motive: "Undead soldiers bound to broken royal commands.", element: "Shadow" },
    { name: "Crownfire Cult", motive: "Zealots who worship the curse as a second sun.", element: "Fire" },
    { name: "Frostborn", motive: "Northern exiles who froze their hearts to survive the fall.", element: "Frost" },
    { name: "Veiled Survivors", motive: "Spies, refugees, and oathbreakers hiding the true history.", element: "Poison" },
    { name: "Ash Legion", motive: "A militarized remnant that wants conquest over restoration.", element: "Fire" },
    { name: "Forgotten Royalty", motive: "Lost heirs and pretenders drawn toward the throne.", element: "Arcane" },
  ],
};

export const CAMPAIGN_CHAPTERS = [
  { act: 1, title: "The Cinder Road", areas: ["Crownfire Catacombs", "Fallen Gate", "Ashwood Forest"], reveal: "Sire carries a royal ember in his blood." },
  { act: 2, title: "Oaths Under Ash", areas: ["Ember Valley", "Frost Hollow", "Shadow Marsh"], reveal: "The Curse was created by a desperate king, not an invader." },
  { act: 3, title: "The Broken Choir", areas: ["Sunken Crypt", "Crystal Cavern", "Blood Chapel"], reveal: "The throne feeds on sacrifice and memory." },
  { act: 4, title: "Heirs of Ruin", areas: ["Sunspire Pass", "Ruined Keep", "Crownfire Throne"], reveal: "The True Sovereign is not false by blood, only by choice." },
  { act: 5, title: "The Last Crown", areas: ["Ashen Citadel", "Moonveil Cathedral", "Abyssal Rift"], reveal: "The final choice: reign, redeem, or raze Crownfire." },
];

export const SIDE_QUESTS = [
  { id: "embers-for-the-forge", name: "Embers for the Forge", giver: "Master Orric", reward: "Blacksmith discount", objective: "Defeat fire enemies and recover forge embers." },
  { id: "bells-of-the-chapel", name: "Bells of the Chapel", giver: "Sister Maera", reward: "Revival Bell recipe", objective: "Cleanse the Blood Chapel altar." },
  { id: "the-last-arrow", name: "The Last Arrow", giver: "Ranger Vale", reward: "Ranger crit talent", objective: "Track the assassin through Shadow Marsh." },
  { id: "moonlit-correspondence", name: "Moonlit Correspondence", giver: "The Veiled Archivist", reward: "Hidden lore pages", objective: "Find letters between the heirs." },
  { id: "tithe-of-stone", name: "Tithe of Stone", giver: "Quarry Steward Halden", reward: "Building stone income", objective: "Clear Crystal Cavern patrols." },
];

export const NPC_DIALOGUE = [
  { npc: "Master Orric", location: "Blacksmith", line: "Steel remembers every hand that failed it. Bring me better ore, and I will teach it your name." },
  { npc: "Sister Maera", location: "Chapel", line: "Death is not a door here. It is a debt, and Crownfire always collects." },
  { npc: "Archivist Edran", location: "Mage Tower", line: "A curse is only a spell with enough witnesses to become history." },
  { npc: "Captain Rusk", location: "Barracks", line: "A kingdom is not walls. It is who still stands when the walls are gone." },
  { npc: "Mira of the Market", location: "Market", line: "Gold buys bread. Essence buys secrets. Try not to confuse the two." },
];

export const CLASS_EVOLUTIONS = {
  sire: ["Sire", "Crown Knight", "Ashen King"],
  warden: ["Warden", "Iron Sentinel", "Titan Guard"],
  ranger: ["Ranger", "Shadow Hunter", "Phantom Archer"],
  luminary: ["Luminary", "Sacred Oracle", "Solar Saint"],
};

export const SKILL_TREES = {
  sire: [
    { name: "Royal Ember", tier: 1, effect: "+5% fire skill power" },
    { name: "Crown Knight", tier: 2, effect: "Crown Oath also grants Shield" },
    { name: "Ashen King", tier: 3, effect: "Ultimate: Thronebreaker Ignition" },
  ],
  warden: [
    { name: "Oathwall", tier: 1, effect: "+8 Shield when guarding" },
    { name: "Iron Sentinel", tier: 2, effect: "Guard protects the active party" },
    { name: "Titan Guard", tier: 3, effect: "Ultimate: Bastion of the Fallen" },
  ],
  ranger: [
    { name: "Marked Prey", tier: 1, effect: "+6% crit against wounded enemies" },
    { name: "Shadow Hunter", tier: 2, effect: "Piercing Arrow ignores armor" },
    { name: "Phantom Archer", tier: 3, effect: "Ultimate: Moonveil Volley" },
  ],
  luminary: [
    { name: "Warm Light", tier: 1, effect: "Healing also restores MP" },
    { name: "Sacred Oracle", tier: 2, effect: "Radiant Nova cleanses poison and curse" },
    { name: "Solar Saint", tier: 3, effect: "Ultimate: Dawn Over Crownfire" },
  ],
};

export const COMBO_ATTACKS = [
  { name: "Crownwall", heroes: ["Sire", "Warden"], trigger: "Sire attacks while Warden has Guard", effect: "Fire damage plus party Shield." },
  { name: "Sunpiercer", heroes: ["Ranger", "Luminary"], trigger: "Ranger crits after Luminary heals", effect: "Holy arrow with armor penetration." },
  { name: "Ashen Crossfire", heroes: ["Sire", "Ranger"], trigger: "Enemy is Burned", effect: "Extra Fire and Bleed damage." },
  { name: "Sainted Bastion", heroes: ["Warden", "Luminary"], trigger: "Hero drops below 35% HP", effect: "Emergency Guard and heal." },
];

export const BOSS_MECHANICS = [
  { name: "Crown Guardian", phase: "50% HP", mechanic: "Raises Guard and punishes repeated basic attacks." },
  { name: "The True Sovereign", phase: "50% HP", mechanic: "Switches from duelist strikes to curse waves and silence." },
  { name: "Hollow King", phase: "Adds", mechanic: "Summons Hollowed retainers every third round." },
  { name: "Eclipse Dragon", phase: "Skyfall", mechanic: "Alternates Fire and Shadow resistance." },
  { name: "Ash Titan", phase: "Molten Core", mechanic: "Becomes slower but gains armor and burn aura." },
  { name: "The Nameless Queen", phase: "Memory Theft", mechanic: "Locks one hero skill until cleansed." },
];

export const LOOT_TIERS = [
  { rarity: "Common", color: "Stone", target: "Early survivability and basic upgrades." },
  { rarity: "Rare", color: "Sky", target: "Build direction and stat identity." },
  { rarity: "Epic", color: "Violet", target: "Elemental synergies and dungeon goals." },
  { rarity: "Legendary", color: "Amber", target: "Boss-defining power spikes." },
  { rarity: "Mythic", color: "Rose", target: "New Game+ chase items with unique rules." },
];

export const SOUND_EFFECTS = [
  "ui_click_soft",
  "ui_panel_open",
  "battle_start_stinger",
  "sword_crown_slash",
  "fire_crown_oath",
  "shield_guard_raise",
  "holy_radiant_heal",
  "arrow_piercing_release",
  "enemy_claw_hit",
  "critical_impact",
  "loot_drop_chime",
  "building_upgrade_hammer",
  "revival_bell_ring",
  "boss_phase_roar",
];

export const MUSIC_ATMOSPHERES = [
  { scene: "Village Day", mood: "low strings, hand drum, soft ember choir" },
  { scene: "Village Night", mood: "distant bells, cold pads, quiet lute" },
  { scene: "World Map", mood: "wind, war drums, solemn brass" },
  { scene: "Dungeon", mood: "sub-bass pulse, dripping stone, tense ostinato" },
  { scene: "Boss Intro", mood: "choir swell, reversed cymbal, crownfire burst" },
  { scene: "Final Choice", mood: "solo voice, cracked organ, fading fire" },
];

export const PROGRESSION_BALANCE = {
  sessionLength: "8-12 minutes per loop",
  earlyGame: "Levels 1-4 teach map, shop, revive, and building upgrades while village buildings use their base artwork.",
  midGame: "Levels 5-9 introduce elemental counters, combos, class evolution, and the first upgraded village image tier.",
  lateGame: "Levels 10+ focus on legendary gear, boss mechanics, New Game+, and final village building image tiers.",
  formulae: ["EXP to level = 70 + level * 35", "Building costs rise by level and resource tier", "Village building art swaps at levels 5 and 10 when an upgraded image exists", "Dungeon enemies scale from party level"],
};

export const PIXEL_ART_ASSET_LIST = [
  "Hero idle, attack, hit, ultimate, and defeated sprites",
  "Enemy faction sprite sheets and boss phase variants",
  "World map backgrounds and node icons",
  "Village map buildings render as large borderless image markers with hover-only names",
  "Village building visual tiers: base, level 5, and level 10 upgrade images",
  "Equipment icons for every rarity and slot",
  "Skill icons, ultimate overlays, and combo attack effects",
  "Weather layers, fog, ember particles, and UI frame plates",
];
