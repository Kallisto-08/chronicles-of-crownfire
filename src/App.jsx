import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Castle, RotateCcw, Sparkles, X } from "lucide-react";
import { LoadingScreen, NavBar, PixelImage } from "./components/GameChrome.jsx";
import ashWitchImg from "./assets/ash_witch.png";
import barracksImg from "./assets/barracks.png";
import blacksmithImg from "./assets/blacksmith.png";
import buildImg from "./assets/build.png";
import crownSlashImg from "./assets/crown_slash.png";
import crownfireImg from "./assets/crownfire.png";
import guardImg from "./assets/guard.png";
import hollowKnightImg from "./assets/hollow_knight.png";
import inventoryImg from "./assets/inventory.png";
import luminaryImg from "./assets/luminary.png";
import mageTowerImg from "./assets/mage_tower.png";
import mapImg from "./assets/map.png";
import marketImg from "./assets/market.png";
import questImg from "./assets/quest.png";
import radiantImg from "./assets/radiant.png";
import rangerImg from "./assets/ranger.png";
import relicAmuletImg from "./assets/relic_amulet.png";
import resourceEssenceImg from "./assets/resource_essence.png";
import resourceStoneImg from "./assets/resource_stone.png";
import resourceWoodImg from "./assets/resource_wood.png";
import shopArmorImg from "./assets/shop_armor.png";
import shopManaPotionImg from "./assets/shop_mana_potion.png";
import shopPotionImg from "./assets/shop_potion.png";
import shopSwordImg from "./assets/shop_sword.png";
import sireImg from "./assets/sire.png";
import uiLockImg from "./assets/ui_lock.png";
import uiStarImg from "./assets/ui_star.png";
import wardenImg from "./assets/warden.png";
import crownGuardianImg from "./assets/enemies/crown_guardian.png";
import flameRevenantImg from "./assets/enemies/flame_revenant.png";
import frostMageImg from "./assets/enemies/frost_mage.png";
import infernalCrownBeastImg from "./assets/enemies/infernal_crown_beast.png";
import plagueBringerImg from "./assets/enemies/plague_bringer.png";
import shadowAssassinImg from "./assets/enemies/shadow_assassin.png";
import stoneGolemImg from "./assets/enemies/stone_golem.png";
import trueSovereignImg from "./assets/enemies/true_sovereign.png";
import fireNodeImg from "./assets/maps/fire_node.png";
import iceNodeImg from "./assets/maps/ice_node.png";
import poisonNodeImg from "./assets/maps/poison_node.png";
import ruinsNodeImg from "./assets/maps/ruins_node.png";
import throneNodeImg from "./assets/maps/throne_node.png";

const assetModules = import.meta.glob(["./assets/**/*.{png,webp,svg}", "!./assets/_source/**/*"], {
  eager: true,
  query: "?url",
  import: "default",
});
const GENERATED_ASSETS = Object.fromEntries(
  Object.entries(assetModules).map(([path, url]) => [path.replace("./assets/", "").replace(/\.(png|webp|svg)$/i, ""), url])
);
const PUBLIC_ASSET_BASE = `${import.meta.env.BASE_URL || "/"}assets/`;
function publicAsset(path) {
  return `${PUBLIC_ASSET_BASE}${path}`;
}
const PUBLIC_ASSETS = {
  "crownfire_logo": publicAsset("crownfire_logo.webp"),
  "loading_screen": publicAsset("loading_screen.webp"),
  "village_background": publicAsset("village_background.webp"),
  "village_background_premium": publicAsset("village_background_premium.webp"),
  "ui/ui_panel": publicAsset("ui/ui_panel.webp"),
  "maps/ancient_ruins": publicAsset("maps/ancient_ruins.webp"),
  "maps/crownfire_throne": publicAsset("maps/crownfire_throne.webp"),
  "maps/ember_valley": publicAsset("maps/ember_valley.webp"),
  "maps/frost_hollow": publicAsset("maps/frost_hollow.webp"),
  "maps/shadow_marsh": publicAsset("maps/shadow_marsh.webp"),
  "maps/sunken_crypt": publicAsset("maps/sunken_crypt.webp"),
  "maps/crystal_cavern": publicAsset("maps/crystal_cavern.webp"),
  "maps/blood_chapel": publicAsset("maps/blood_chapel.webp"),
  "maps/sunspire_pass": publicAsset("maps/sunspire_pass.webp"),
  "maps/crownfire_catacombs": publicAsset("maps/crownfire_catacombs.webp"),
  "maps/crownfire_world_map_premium": publicAsset("maps/crownfire_world_map_premium.webp"),
};
function asset(key, fallback = "") {
  if (typeof key === "string" && key.startsWith("maps/battle/")) {
    return publicAsset(`${key}.jpg`);
  }
  return GENERATED_ASSETS[key] || PUBLIC_ASSETS[key] || fallback;
}

const SAVE_KEY = "chronicles-of-crownfire-save-v2";
const MAX_BUILDING_LEVEL = 10;
const VILLAGE_WORKER_SLOTS = 2;
const UPGRADE_MINUTE_MS = 60 * 1000;
const VALID_SCREENS = new Set(["battle", "map", "village", "inventory", "codex"]);
const LOADING_TIPS = [
  "Crownfire grows stronger with every battle.",
  "Upgrade the Blacksmith before fighting armored enemies.",
  "The Market unlocks potions and steadier campaign recovery.",
  "Guard can blunt a lethal enemy turn.",
];

const INTRO_STORY = [
  {
    title: "The Ashen Silence",
    text: "Long ago, Crownfire was not a ruin. Its banners burned gold above a kingdom that swore its crown would never fall.",
  },
  {
    title: "The Curse Beneath The Throne",
    text: "Then the royal flame curdled into a curse. Stone blackened, heirs vanished, and the throne began whispering through the dead.",
  },
  {
    title: "A Forgotten Name",
    text: "You awaken as Sire, a wanderer with no past, carrying only a blade, a scar of emberlight, and dreams of a burning crown.",
  },
  {
    title: "The First Road",
    text: "Beyond the Fallen Gate, the Hollowed gather. If Crownfire is to rise again, its forgotten heir must walk into the dark.",
  },
];

const EMPTY_CODEX_CONTENT = {
  BOSS_MECHANICS: [],
  CAMPAIGN_CHAPTERS: [],
  CLASS_EVOLUTIONS: {},
  COMBO_ATTACKS: [],
  LOOT_TIERS: [],
  MUSIC_ATMOSPHERES: [],
  NPC_DIALOGUE: [],
  PIXEL_ART_ASSET_LIST: [],
  PROGRESSION_BALANCE: { sessionLength: "", earlyGame: "", midGame: "", lateGame: "", formulae: [] },
  SIDE_QUESTS: [],
  SKILL_TREES: {},
  SOUND_EFFECTS: [],
  WORLD_LORE: { premise: "The Codex is being restored from the royal archive.", factions: [] },
};

const ASSETS = {
  heroes: {
    sire: asset("heroes/sire_refined", sireImg),
    warden: asset("heroes/warden_refined", wardenImg),
    ranger: asset("heroes/ranger_refined", rangerImg),
    luminary: asset("heroes/luminary_refined", luminaryImg),
    sire_crown_knight: asset("heroes/sire_crown_knight", sireImg),
    sire_ashen_king: asset("heroes/sire_ashen_king", sireImg),
    warden_iron_sentinel: asset("heroes/warden_iron_sentinel", wardenImg),
    warden_titan_guard: asset("heroes/warden_titan_guard", wardenImg),
    ranger_shadow_hunter: asset("heroes/ranger_shadow_hunter", rangerImg),
    ranger_phantom_archer: asset("heroes/ranger_phantom_archer", rangerImg),
    luminary_sacred_oracle: asset("heroes/luminary_sacred_oracle", luminaryImg),
    luminary_solar_saint: asset("heroes/luminary_solar_saint", luminaryImg),
  },
  enemies: {
    hollowKnight: hollowKnightImg,
    ashWitch: ashWitchImg,
    flameRevenant: flameRevenantImg,
    shadowAssassin: shadowAssassinImg,
    stoneGolem: stoneGolemImg,
    frostMage: frostMageImg,
    plagueBringer: plagueBringerImg,
    crownGuardian: crownGuardianImg,
    infernalCrownBeast: infernalCrownBeastImg,
    trueSovereign: trueSovereignImg,
  },
  skills: { crownSlash: crownSlashImg, crownfire: crownfireImg, guard: guardImg, radiant: radiantImg },
  ui: {
    battle: asset("icons/skill_crown_slash", crownSlashImg),
    worldMap: mapImg,
    inventory: inventoryImg,
    quest: questImg,
    map: mapImg,
    build: buildImg,
    panel: asset("ui/ui_panel"),
    loading: asset("loading_screen"),
    logo: asset("crownfire_logo"),
    village: asset("village_background_premium"),
    wood: resourceWoodImg,
    stone: resourceStoneImg,
    essence: resourceEssenceImg,
    lock: uiLockImg,
    star: uiStarImg,
  },
  intro: {
    background: asset("intro/prologue_background", asset("loading_screen")),
    logo: asset("intro/prologue_logo_mark", asset("crownfire_logo")),
    scroll: asset("intro/prologue_scroll_clean", asset("intro/prologue_scroll")),
    button: asset("intro/prologue_button_frame"),
  },
  audio: {
    click: publicAsset("audio/mouse-click.mp3"),
    equipmentUpgrade: publicAsset("audio/equipment-upgrade.mp3"),
    villageUpgrade: publicAsset("audio/village-upgrade.mp3"),
  },
  buildings: {
    blacksmith: blacksmithImg,
    mageTower: mageTowerImg,
    barracks: barracksImg,
    market: marketImg,
    chapel: asset("buildings/chapel"),
    alchemyLab: asset("buildings/alchemy_lab", mageTowerImg),
    relicForge: asset("buildings/relic_forge", blacksmithImg),
    trainingGround: asset("buildings/training_ground", barracksImg),
  },
  maps: {
    emberValley: asset("maps/ember_valley"),
    frostHollow: asset("maps/frost_hollow"),
    shadowMarsh: asset("maps/shadow_marsh"),
    ancientRuins: asset("maps/ancient_ruins"),
    crownfireThrone: asset("maps/crownfire_throne"),
  },
  nodes: { fire: fireNodeImg, ice: iceNodeImg, poison: poisonNodeImg, ruins: ruinsNodeImg, throne: throneNodeImg },
};

const HEROES = [
  { id: "sire", name: "Sire", role: "Balanced", element: "Fire", maxHp: 124, maxMp: 64, attack: 18, defense: 9, speed: 12, crit: 10, critDamage: 165, armorPen: 4, dodge: 4, shield: 0 },
  { id: "warden", name: "Warden", role: "Tank", element: "Holy", maxHp: 168, maxMp: 42, attack: 14, defense: 15, speed: 8, crit: 6, critDamage: 150, armorPen: 2, dodge: 2, shield: 8 },
  { id: "ranger", name: "Ranger", role: "High Damage", element: "Shadow", maxHp: 104, maxMp: 54, attack: 24, defense: 7, speed: 16, crit: 18, critDamage: 180, armorPen: 9, dodge: 12, shield: 0 },
  { id: "luminary", name: "Luminary", role: "Magic / Healer", element: "Holy", maxHp: 98, maxMp: 92, attack: 13, defense: 8, speed: 11, crit: 8, critDamage: 155, armorPen: 3, dodge: 6, shield: 3 },
];

const HERO_EVOLUTIONS = {
  sire: [
    { level: 1, className: "Forgotten Heir", assetKey: "sire" },
    { level: 10, className: "Crown Knight", assetKey: "sire_crown_knight" },
    { level: 20, className: "Ashen King", assetKey: "sire_ashen_king" },
  ],
  warden: [
    { level: 1, className: "Warden", assetKey: "warden" },
    { level: 10, className: "Iron Sentinel", assetKey: "warden_iron_sentinel" },
    { level: 20, className: "Titan Guard", assetKey: "warden_titan_guard" },
  ],
  ranger: [
    { level: 1, className: "Ranger", assetKey: "ranger" },
    { level: 10, className: "Shadow Hunter", assetKey: "ranger_shadow_hunter" },
    { level: 20, className: "Phantom Archer", assetKey: "ranger_phantom_archer" },
  ],
  luminary: [
    { level: 1, className: "Luminary", assetKey: "luminary" },
    { level: 10, className: "Sacred Oracle", assetKey: "luminary_sacred_oracle" },
    { level: 20, className: "Solar Saint", assetKey: "luminary_solar_saint" },
  ],
};

const AREA_ENEMY_POOLS = {
  fallenGate: [
    { name: "Hollow Knight", hp: 118, attack: 18, defense: 7, exp: 34, asset: "hollowKnight", minLevel: 1 },
    { name: "Gate Husk", hp: 104, attack: 17, defense: 6, exp: 30, asset: "gate_husk", minLevel: 1, behavior: "defensive" },
    { name: "Hollow Archer", hp: 94, attack: 21, defense: 4, exp: 32, asset: "hollow_archer", minLevel: 2, behavior: "aggressive" },
  ],
  ashwoodForest: [
    { name: "Ash Witch", hp: 132, attack: 20, defense: 6, exp: 44, asset: "ashWitch", minLevel: 2, behavior: "caster" },
    { name: "Ashwood Wolf", hp: 122, attack: 24, defense: 5, exp: 42, asset: "ashwood_wolf", minLevel: 2, behavior: "aggressive" },
    { name: "Briar Hexer", hp: 126, attack: 22, defense: 7, exp: 48, asset: "briar_hexer", minLevel: 3, behavior: "caster" },
  ],
  emberValley: [
    { name: "Flame Revenant", hp: 142, attack: 23, defense: 8, exp: 52, asset: "flameRevenant", minLevel: 2, behavior: "aggressive" },
    { name: "Ember Hound", hp: 136, attack: 27, defense: 7, exp: 54, asset: "ember_hound", minLevel: 3, behavior: "aggressive" },
    { name: "Cinder Cultist", hp: 132, attack: 25, defense: 8, exp: 56, asset: "cinder_cultist", minLevel: 3, behavior: "caster" },
  ],
  frostHollow: [
    { name: "Frost Mage", hp: 136, attack: 21, defense: 7, exp: 58, asset: "frostMage", minLevel: 3, behavior: "caster" },
    { name: "Icebound Guard", hp: 172, attack: 23, defense: 14, exp: 62, asset: "icebound_guard", minLevel: 3, behavior: "defensive" },
    { name: "Snow Wraith", hp: 128, attack: 28, defense: 6, exp: 66, asset: "snow_wraith", minLevel: 4, behavior: "caster" },
  ],
  shadowMarsh: [
    { name: "Plague Bringer", hp: 150, attack: 22, defense: 8, exp: 66, asset: "plagueBringer", minLevel: 4, behavior: "caster" },
    { name: "Bog Leech", hp: 166, attack: 24, defense: 12, exp: 68, asset: "bog_leech", minLevel: 4, behavior: "defensive" },
    { name: "Marsh Assassin", hp: 134, attack: 31, defense: 7, exp: 72, asset: "marsh_assassin", minLevel: 5, behavior: "assassin" },
  ],
  sunkenCrypt: [
    { name: "Bone Wraith", hp: 168, attack: 25, defense: 9, exp: 74, asset: "bone_wraith", minLevel: 4, behavior: "caster" },
    { name: "Drowned Skeleton", hp: 178, attack: 27, defense: 11, exp: 76, asset: "drowned_skeleton", minLevel: 5, behavior: "aggressive" },
    { name: "Crypt Candlebearer", hp: 154, attack: 30, defense: 8, exp: 82, asset: "crypt_candlebearer", minLevel: 5, behavior: "caster" },
  ],
  crystalCavern: [
    { name: "Crystal Golem", hp: 210, attack: 24, defense: 18, exp: 88, asset: "crystal_golem", minLevel: 5, behavior: "defensive" },
    { name: "Crystal Spider", hp: 174, attack: 33, defense: 12, exp: 90, asset: "crystal_spider", minLevel: 5, behavior: "assassin" },
    { name: "Gemstone Bat", hp: 150, attack: 35, defense: 9, exp: 92, asset: "gemstone_bat", minLevel: 6, behavior: "aggressive" },
  ],
  bloodChapel: [
    { name: "Blood Acolyte", hp: 176, attack: 30, defense: 10, exp: 96, asset: "blood_acolyte", minLevel: 5, behavior: "caster" },
    { name: "Blood Nun", hp: 184, attack: 32, defense: 11, exp: 100, asset: "blood_nun", minLevel: 6, behavior: "caster" },
    { name: "Chapel Gargoyle", hp: 232, attack: 30, defense: 18, exp: 106, asset: "chapel_gargoyle", minLevel: 6, behavior: "defensive" },
  ],
  sunspirePass: [
    { name: "Sunspire Paladin", hp: 225, attack: 32, defense: 16, exp: 112, asset: "sunspire_paladin", minLevel: 6, behavior: "defensive" },
    { name: "Solar Inquisitor", hp: 204, attack: 37, defense: 14, exp: 118, asset: "solar_inquisitor", minLevel: 6, behavior: "aggressive" },
    { name: "Crown Lancer", hp: 218, attack: 36, defense: 15, exp: 120, asset: "crown_lancer", minLevel: 7, behavior: "aggressive" },
  ],
  ruinedKeep: [
    { name: "Crown Guardian", hp: 186, attack: 26, defense: 14, exp: 82, asset: "crownGuardian", minLevel: 7, behavior: "defensive" },
    { name: "Ruin Watcher", hp: 224, attack: 34, defense: 18, exp: 124, asset: "ruin_watcher", minLevel: 7, behavior: "defensive" },
    { name: "Oathbreaker Knight", hp: 214, attack: 39, defense: 15, exp: 128, asset: "oathbreaker_knight", minLevel: 8, behavior: "aggressive" },
  ],
  crownfireThrone: [
    { name: "The True Sovereign", hp: 260, attack: 30, defense: 16, exp: 120, asset: "trueSovereign", minLevel: 8, behavior: "boss" },
    { name: "Sovereign Shade", hp: 238, attack: 42, defense: 14, exp: 140, asset: "sovereign_shade", minLevel: 8, behavior: "assassin" },
    { name: "Throne Warden", hp: 282, attack: 38, defense: 22, exp: 148, asset: "throne_warden", minLevel: 9, behavior: "defensive" },
  ],
  ashenCitadel: [
    { name: "Ash Titan", hp: 340, attack: 38, defense: 24, exp: 170, asset: "ash_titan", minLevel: 8, behavior: "boss" },
    { name: "Ash Legionnaire", hp: 270, attack: 43, defense: 20, exp: 154, asset: "ash_legionnaire", minLevel: 8, behavior: "aggressive" },
    { name: "Ash Warlock", hp: 238, attack: 47, defense: 14, exp: 162, asset: "ash_warlock", minLevel: 9, behavior: "caster" },
  ],
  moonveilCathedral: [
    { name: "The Nameless Queen", hp: 380, attack: 40, defense: 22, exp: 210, asset: "nameless_queen", minLevel: 9, behavior: "boss" },
    { name: "Moonveil Choir", hp: 272, attack: 45, defense: 16, exp: 176, asset: "moonveil_choir", minLevel: 9, behavior: "caster" },
    { name: "Royal Revenant", hp: 292, attack: 48, defense: 18, exp: 184, asset: "royal_revenant", minLevel: 10, behavior: "aggressive" },
  ],
  abyssalRift: [
    { name: "Eclipse Dragon", hp: 440, attack: 44, defense: 26, exp: 260, asset: "eclipse_dragon", minLevel: 10, behavior: "boss" },
    { name: "Rift Impaler", hp: 330, attack: 54, defense: 18, exp: 210, asset: "rift_impaler", minLevel: 10, behavior: "aggressive" },
    { name: "Void Seraph", hp: 360, attack: 52, defense: 20, exp: 228, asset: "void_seraph", minLevel: 11, behavior: "caster" },
  ],
};

const MAP_NODES = [
  {
    id: "crownfire-catacombs",
    name: "Crownfire Catacombs",
    subtitle: "Repeatable dungeon for EXP and gold",
    x: "15%",
    y: "24%",
    difficulty: 1,
    recommendedLevel: 1,
    enemyType: "Scaled Dungeon",
    nodeIcon: asset("maps/catacombs_node", ASSETS.nodes.ruins),
    backgroundKey: "maps/battle/crownfire_catacombs_battle",
    battleBackgroundKey: "maps/battle/crownfire_catacombs_battle",
    rewards: { gold: 32, wood: 6, stone: 8, essence: 1 },
    repeatable: true,
    dungeon: true,
    enemyPool: [
      { name: "Cave Bat", hp: 78, attack: 13, defense: 3, exp: 22, asset: "cave_bat", minLevel: 1 },
      { name: "Grave Marauder", hp: 118, attack: 18, defense: 7, exp: 36, asset: "grave_marauder", minLevel: 2 },
      { name: "Ember Imp", hp: 104, attack: 21, defense: 5, exp: 42, asset: "ember_imp", minLevel: 3 },
      { name: "Arcane Slime", hp: 132, attack: 20, defense: 10, exp: 50, asset: "arcane_slime", minLevel: 3 },
      { name: "Mimic Chest", hp: 158, attack: 25, defense: 12, exp: 66, asset: "mimic_chest", minLevel: 4 },
      { name: "Dungeon Keeper", hp: 198, attack: 29, defense: 15, exp: 82, asset: "dungeon_keeper", minLevel: 5 },
      { name: "Crypt Stalker", hp: 148, attack: 26, defense: 8, exp: 58, asset: "crypt_stalker", minLevel: 4, behavior: "assassin" },
      { name: "Ashbound Brute", hp: 196, attack: 31, defense: 15, exp: 78, asset: "ashbound_brute", minLevel: 5, behavior: "aggressive" },
      { name: "Crownfire Lich", hp: 176, attack: 35, defense: 11, exp: 98, asset: "crownfire_lich", minLevel: 6, behavior: "caster" },
      { name: "Abyssal Hound", hp: 224, attack: 39, defense: 16, exp: 122, asset: "abyssal_hound", minLevel: 7, behavior: "aggressive" },
    ],
    enemy: { name: "Cave Bat", hp: 78, attack: 13, defense: 3, exp: 22, asset: "cave_bat" },
  },
  {
    id: "fallen-gate",
    name: "Fallen Gate",
    subtitle: "Bandits at the royal road",
    x: "12%",
    y: "66%",
    difficulty: 1,
    recommendedLevel: 1,
    enemyType: "Undead Knight",
    nodeIcon: ASSETS.nodes.ruins,
    backgroundKey: "maps/battle/fallen_gate_battle",
    battleBackgroundKey: "maps/battle/fallen_gate_battle",
    rewards: { gold: 42, wood: 16, stone: 8, essence: 1 },
    unlocks: ["ashwood-forest"],
    enemyPool: AREA_ENEMY_POOLS.fallenGate,
    enemy: { name: "Hollow Knight", hp: 118, attack: 18, defense: 7, exp: 34, asset: "hollowKnight" },
  },
  {
    id: "ashwood-forest",
    name: "Ashwood Forest",
    subtitle: "A witch-fire hunt",
    x: "28%",
    y: "38%",
    difficulty: 2,
    recommendedLevel: 2,
    enemyType: "Dark Sorceress",
    nodeIcon: ASSETS.nodes.poison,
    backgroundKey: "maps/battle/ashwood_forest_battle",
    battleBackgroundKey: "maps/battle/ashwood_forest_battle",
    requires: "fallen-gate",
    rewards: { gold: 55, wood: 22, stone: 10, essence: 2 },
    unlocks: ["ember-valley"],
    enemyPool: AREA_ENEMY_POOLS.ashwoodForest,
    enemy: { name: "Ash Witch", hp: 132, attack: 20, defense: 6, exp: 44, asset: "ashWitch" },
  },
  {
    id: "ember-valley",
    name: "Ember Valley",
    subtitle: "The road burns under old oaths",
    x: "46%",
    y: "58%",
    difficulty: 2,
    recommendedLevel: 2,
    enemyType: "Fire Revenant",
    nodeIcon: ASSETS.nodes.fire,
    backgroundKey: "maps/battle/ember_valley_battle",
    battleBackgroundKey: "maps/battle/ember_valley_battle",
    requires: "ashwood-forest",
    rewards: { gold: 64, wood: 12, stone: 18, essence: 3 },
    unlocks: ["frost-hollow"],
    enemyPool: AREA_ENEMY_POOLS.emberValley,
    enemy: { name: "Flame Revenant", hp: 142, attack: 23, defense: 8, exp: 52, asset: "flameRevenant" },
  },
  {
    id: "frost-hollow",
    name: "Frost Hollow",
    subtitle: "Blue fire sleeps beneath the ice",
    x: "60%",
    y: "25%",
    difficulty: 3,
    recommendedLevel: 3,
    enemyType: "Frost Caster",
    nodeIcon: ASSETS.nodes.ice,
    backgroundKey: "maps/battle/frost_hollow_battle",
    battleBackgroundKey: "maps/battle/frost_hollow_battle",
    requires: "ember-valley",
    rewards: { gold: 68, wood: 18, stone: 20, essence: 3 },
    unlocks: ["shadow-marsh"],
    enemyPool: AREA_ENEMY_POOLS.frostHollow,
    enemy: { name: "Frost Mage", hp: 136, attack: 21, defense: 7, exp: 58, asset: "frostMage" },
  },
  {
    id: "shadow-marsh",
    name: "Shadow Marsh",
    subtitle: "A poisoned mirror of the realm",
    x: "66%",
    y: "74%",
    difficulty: 3,
    recommendedLevel: 4,
    enemyType: "Plague Bringer",
    nodeIcon: ASSETS.nodes.poison,
    backgroundKey: "maps/battle/shadow_marsh_battle",
    battleBackgroundKey: "maps/battle/shadow_marsh_battle",
    requires: "frost-hollow",
    rewards: { gold: 74, wood: 24, stone: 12, essence: 4 },
    unlocks: ["sunken-crypt"],
    enemyPool: AREA_ENEMY_POOLS.shadowMarsh,
    enemy: { name: "Plague Bringer", hp: 150, attack: 22, defense: 8, exp: 66, asset: "plagueBringer" },
  },
  {
    id: "sunken-crypt",
    name: "Sunken Crypt",
    subtitle: "Old bones whisper below the marsh",
    x: "34%",
    y: "82%",
    difficulty: 3,
    recommendedLevel: 4,
    enemyType: "Bone Wraith",
    nodeIcon: asset("maps/bone_node", ASSETS.nodes.ruins),
    backgroundKey: "maps/battle/sunken_crypt_battle",
    battleBackgroundKey: "maps/battle/sunken_crypt_battle",
    requires: "shadow-marsh",
    rewards: { gold: 82, wood: 10, stone: 28, essence: 4 },
    unlocks: ["crystal-cavern"],
    enemyPool: AREA_ENEMY_POOLS.sunkenCrypt,
    enemy: { name: "Bone Wraith", hp: 168, attack: 25, defense: 9, exp: 74, asset: "bone_wraith" },
  },
  {
    id: "crystal-cavern",
    name: "Crystal Cavern",
    subtitle: "Mana sleeps in blue stone",
    x: "50%",
    y: "18%",
    difficulty: 3,
    recommendedLevel: 5,
    enemyType: "Crystal Golem",
    nodeIcon: asset("maps/crystal_node", ASSETS.nodes.ice),
    backgroundKey: "maps/battle/crystal_cavern_battle",
    battleBackgroundKey: "maps/battle/crystal_cavern_battle",
    requires: "sunken-crypt",
    rewards: { gold: 92, wood: 12, stone: 30, essence: 5 },
    unlocks: ["blood-chapel"],
    enemyPool: AREA_ENEMY_POOLS.crystalCavern,
    enemy: { name: "Crystal Golem", hp: 210, attack: 24, defense: 18, exp: 88, asset: "crystal_golem" },
  },
  {
    id: "blood-chapel",
    name: "Blood Chapel",
    subtitle: "A false altar drinks the flame",
    x: "72%",
    y: "82%",
    difficulty: 3,
    recommendedLevel: 5,
    enemyType: "Blood Acolyte",
    nodeIcon: asset("maps/blood_node", ASSETS.nodes.poison),
    backgroundKey: "maps/battle/blood_chapel_battle",
    battleBackgroundKey: "maps/battle/blood_chapel_battle",
    requires: "crystal-cavern",
    rewards: { gold: 104, wood: 16, stone: 20, essence: 6 },
    unlocks: ["sunspire-pass"],
    enemyPool: AREA_ENEMY_POOLS.bloodChapel,
    enemy: { name: "Blood Acolyte", hp: 176, attack: 30, defense: 10, exp: 96, asset: "blood_acolyte" },
  },
  {
    id: "sunspire-pass",
    name: "Sunspire Pass",
    subtitle: "The gate before the crown road",
    x: "84%",
    y: "25%",
    difficulty: 3,
    recommendedLevel: 6,
    enemyType: "Sunspire Paladin",
    nodeIcon: asset("maps/sun_node", ASSETS.nodes.throne),
    backgroundKey: "maps/battle/sunspire_pass_battle",
    battleBackgroundKey: "maps/battle/sunspire_pass_battle",
    requires: "blood-chapel",
    rewards: { gold: 118, wood: 18, stone: 26, essence: 7 },
    unlocks: ["ruined-keep"],
    enemyPool: AREA_ENEMY_POOLS.sunspirePass,
    enemy: { name: "Sunspire Paladin", hp: 225, attack: 32, defense: 16, exp: 112, asset: "sunspire_paladin" },
  },
  {
    id: "ruined-keep",
    name: "Ruined Keep",
    subtitle: "The crown shard waits",
    x: "80%",
    y: "46%",
    difficulty: 3,
    recommendedLevel: 3,
    enemyType: "Elite Undead",
    nodeIcon: ASSETS.nodes.ruins,
    backgroundKey: "maps/battle/ruined_keep_battle",
    battleBackgroundKey: "maps/battle/ruined_keep_battle",
    requires: "sunspire-pass",
    rewards: { gold: 72, wood: 14, stone: 24, essence: 4 },
    unlocks: ["crownfire-throne"],
    enemyPool: AREA_ENEMY_POOLS.ruinedKeep,
    enemy: { name: "Crown Guardian", hp: 186, attack: 26, defense: 14, exp: 82, asset: "crownGuardian" },
  },
  {
    id: "crownfire-throne",
    name: "Crownfire Throne",
    subtitle: "The last inheritance",
    x: "91%",
    y: "20%",
    difficulty: 3,
    recommendedLevel: 5,
    enemyType: "Final Boss",
    nodeIcon: ASSETS.nodes.throne,
    backgroundKey: "maps/battle/crownfire_throne_battle",
    battleBackgroundKey: "maps/battle/crownfire_throne_battle",
    requires: "ruined-keep",
    rewards: { gold: 140, wood: 20, stone: 34, essence: 8 },
    enemyPool: AREA_ENEMY_POOLS.crownfireThrone,
    enemy: { name: "The True Sovereign", hp: 260, attack: 30, defense: 16, exp: 120, asset: "trueSovereign" },
  },
  {
    id: "ashen-citadel",
    name: "Ashen Citadel",
    subtitle: "The empire that rose from Crownfire's ruin",
    x: "84%",
    y: "70%",
    difficulty: 3,
    recommendedLevel: 8,
    enemyType: "Ash Legion",
    nodeIcon: ASSETS.nodes.fire,
    backgroundKey: "maps/battle/ashen_citadel_battle",
    battleBackgroundKey: "maps/battle/ashen_citadel_battle",
    requires: "crownfire-throne",
    rewards: { gold: 164, wood: 18, stone: 38, essence: 10 },
    enemyPool: AREA_ENEMY_POOLS.ashenCitadel,
    enemy: { name: "Ash Titan", hp: 340, attack: 38, defense: 24, exp: 170, asset: "ash_titan" },
  },
  {
    id: "moonveil-cathedral",
    name: "Moonveil Cathedral",
    subtitle: "A holy ruin under a dead moon",
    x: "16%",
    y: "82%",
    difficulty: 3,
    recommendedLevel: 9,
    enemyType: "Forgotten Royalty",
    nodeIcon: ASSETS.nodes.ice,
    backgroundKey: "maps/battle/moonveil_cathedral_battle",
    battleBackgroundKey: "maps/battle/moonveil_cathedral_battle",
    requires: "ashen-citadel",
    rewards: { gold: 188, wood: 22, stone: 32, essence: 12 },
    enemyPool: AREA_ENEMY_POOLS.moonveilCathedral,
    enemy: { name: "The Nameless Queen", hp: 380, attack: 40, defense: 22, exp: 210, asset: "nameless_queen" },
  },
  {
    id: "abyssal-rift",
    name: "Abyssal Rift",
    subtitle: "Where the Crownfire Curse learned to speak",
    x: "50%",
    y: "90%",
    difficulty: 3,
    recommendedLevel: 10,
    enemyType: "Abyssal Boss",
    nodeIcon: ASSETS.nodes.throne,
    backgroundKey: "maps/battle/abyssal_rift_battle",
    battleBackgroundKey: "maps/battle/abyssal_rift_battle",
    requires: "moonveil-cathedral",
    rewards: { gold: 220, wood: 28, stone: 44, essence: 16 },
    enemyPool: AREA_ENEMY_POOLS.abyssalRift,
    enemy: { name: "Eclipse Dragon", hp: 440, attack: 44, defense: 26, exp: 260, asset: "eclipse_dragon" },
  },
];

const ITEMS = [
  { id: "iron-sword", name: "Iron Sword", rarity: "common", type: "equipment", slot: "weapon", attack: 4, defense: 0, price: 70, asset: asset("items/iron_sword", shopSwordImg) },
  { id: "crownfire-sword", name: "Crownfire Sword", rarity: "epic", type: "equipment", slot: "weapon", attack: 8, defense: 0, price: 125, asset: asset("items/crownfire_sword", shopSwordImg) },
  { id: "sovereign-blade", name: "Sovereign Blade", rarity: "legendary", type: "equipment", slot: "weapon", attack: 12, armorPen: 7, price: 240, asset: asset("items/sovereign_blade", shopSwordImg) },
  { id: "hunter-bow", name: "Hunter Bow", rarity: "rare", type: "equipment", slot: "weapon", attack: 6, defense: 0, speed: 2, price: 105, asset: asset("items/hunter_bow", shopSwordImg) },
  { id: "chain-armor", name: "Chain Armor", rarity: "common", type: "equipment", slot: "armor", attack: 0, defense: 4, price: 65, asset: asset("items/chain_armor", shopArmorImg) },
  { id: "warden-plate", name: "Warden Plate", rarity: "rare", type: "equipment", slot: "armor", attack: 0, defense: 7, price: 118, asset: asset("items/warden_plate", shopArmorImg) },
  { id: "eclipse-mail", name: "Eclipse Mail", rarity: "legendary", type: "equipment", slot: "armor", defense: 11, shield: 10, price: 230, asset: asset("items/eclipse_mail", shopArmorImg) },
  { id: "ember-relic", name: "Ember Relic", rarity: "epic", type: "equipment", slot: "relic", attack: 2, defense: 2, maxMp: 10, price: 145, asset: asset("items/ember_relic", relicAmuletImg) },
  { id: "chapel-charm", name: "Chapel Charm", rarity: "rare", type: "equipment", slot: "relic", attack: 0, defense: 3, maxMp: 14, price: 132, asset: asset("items/chapel_charm", relicAmuletImg) },
  { id: "moonveil-ring", name: "Moonveil Ring", rarity: "epic", type: "equipment", slot: "ring", crit: 5, dodge: 5, price: 150, asset: asset("items/moonveil_ring", relicAmuletImg) },
  { id: "royal-signet-ring", name: "Royal Signet Ring", rarity: "rare", type: "equipment", slot: "ring", crit: 3, maxHp: 8, price: 128, asset: asset("items/royal_signet_ring", relicAmuletImg) },
  { id: "nameless-artifact", name: "Nameless Artifact", rarity: "mythic", type: "equipment", slot: "artifact", attack: 5, defense: 5, maxMp: 18, critDamage: 20, price: 360, asset: asset("items/nameless_artifact", relicAmuletImg) },
  { id: "cursed-artifact", name: "Cursed Artifact", rarity: "legendary", type: "equipment", slot: "artifact", attack: 7, armorPen: 5, defense: -2, critDamage: 18, price: 310, asset: asset("items/cursed_artifact", relicAmuletImg) },
  { id: "potion", name: "Potion", rarity: "common", type: "consumable", effect: "heal", amount: 42, price: 28, asset: shopPotionImg },
  { id: "greater-potion", name: "Greater Potion", rarity: "rare", type: "consumable", effect: "heal", amount: 88, price: 58, asset: asset("items/greater_potion", shopPotionImg) },
  { id: "mana-potion", name: "Mana Potion", rarity: "rare", type: "consumable", effect: "mana", amount: 34, price: 30, asset: shopManaPotionImg },
  { id: "ether-crystal", name: "Ether Crystal", rarity: "epic", type: "consumable", effect: "mana", amount: 78, price: 76, asset: asset("items/ether_crystal", shopManaPotionImg) },
  { id: "revival-bell", name: "Revival Bell", rarity: "epic", type: "consumable", effect: "revive", amount: 45, price: 110, asset: asset("items/revival_bell", relicAmuletImg) },
];

const LOOT_TABLE = ["iron-sword", "chain-armor", "potion", "mana-potion", "hunter-bow", "greater-potion", "crownfire-sword", "warden-plate", "ember-relic", "chapel-charm", "royal-signet-ring", "moonveil-ring", "eclipse-mail", "sovereign-blade", "cursed-artifact"];

const CRAFTING_RECIPES = [
  { id: "craft-greater-potion", name: "Brew Greater Potion", itemId: "greater-potion", cost: { gold: 20, wood: 4, stone: 0, essence: 1 } },
  { id: "craft-chapel-charm", name: "Sanctify Chapel Charm", itemId: "chapel-charm", cost: { gold: 46, wood: 6, stone: 10, essence: 2 } },
  { id: "craft-moonveil-ring", name: "Forge Moonveil Ring", itemId: "moonveil-ring", cost: { gold: 72, wood: 8, stone: 14, essence: 3 } },
  { id: "craft-sovereign-blade", name: "Temper Sovereign Blade", itemId: "sovereign-blade", cost: { gold: 120, wood: 12, stone: 22, essence: 5 } },
  { id: "craft-cursed-artifact", name: "Bind Cursed Artifact", itemId: "cursed-artifact", cost: { gold: 140, wood: 6, stone: 28, essence: 6 } },
];

const BUILDINGS = {
  blacksmith: { name: "Blacksmith", buff: "+Attack", asset: ASSETS.buildings.blacksmith, bonus: 2, cost: { gold: 45, wood: 12, stone: 10, essence: 0 }, pos: { left: "20%", top: "22%" } },
  mageTower: { name: "Mage Tower", buff: "+MP and skill power", asset: ASSETS.buildings.mageTower, bonus: 7, cost: { gold: 50, wood: 10, stone: 16, essence: 1 }, pos: { left: "43%", top: "22%" } },
  barracks: { name: "Barracks", buff: "+HP and defense", asset: ASSETS.buildings.barracks, bonus: 10, cost: { gold: 52, wood: 18, stone: 14, essence: 0 }, pos: { left: "66%", top: "22%" } },
  market: { name: "Market", buff: "Shop and passive gold", asset: ASSETS.buildings.market, bonus: 8, cost: { gold: 40, wood: 18, stone: 6, essence: 0 }, pos: { left: "22%", top: "48%" } },
  chapel: { name: "Chapel", buff: "Heal and revive party", asset: ASSETS.buildings.chapel, bonus: 22, cost: { gold: 62, wood: 14, stone: 22, essence: 2 }, pos: { left: "51%", top: "77%" } },
  alchemyLab: { name: "Alchemy Lab", buff: "Better potions and poison resistance", asset: ASSETS.buildings.alchemyLab, bonus: 6, cost: { gold: 58, wood: 16, stone: 16, essence: 2 }, pos: { left: "22%", top: "78%" } },
  relicForge: { name: "Relic Forge", buff: "Relic crafting and crit damage", asset: ASSETS.buildings.relicForge, bonus: 5, cost: { gold: 80, wood: 14, stone: 28, essence: 3 }, pos: { left: "78%", top: "45%" } },
  trainingGround: { name: "Training Ground", buff: "EXP gain and party drills", asset: ASSETS.buildings.trainingGround, bonus: 5, cost: { gold: 66, wood: 20, stone: 18, essence: 1 }, pos: { left: "74%", top: "72%" } },
};

function buildingAsset(id, level = 0) {
  const building = BUILDINGS[id];
  if (!building) return ASSETS.ui.build;
  if (level >= 10) return asset(`buildings/${id}_lvl10`, building.asset);
  if (level >= 5) return asset(`buildings/${id}_lvl5`, building.asset);
  return building.asset;
}

function buildingVisualTier(level = 0) {
  if (level >= 10) return "Level 10 image tier";
  if (level >= 5) return "Level 5 image tier";
  return "Base image tier";
}

const BUILDING_NPCS = {
  blacksmith: {
    npc: "Master Orric",
    title: "Blacksmith",
    line: "Steel remembers every hand that failed it. Bring me ore and coin, and I will teach your blade to remember victory.",
  },
  mageTower: {
    npc: "Archivist Edran",
    title: "Mage Tower",
    line: "The Crownfire Curse is not only flame. It is a story told too often. Upgrade the tower and we can change the ending.",
  },
  barracks: {
    npc: "Captain Rusk",
    title: "Barracks",
    line: "A kingdom is not walls. It is who still stands when the walls are gone. Give me recruits, and I will give you survivors.",
  },
  market: {
    npc: "Mira of the Market",
    title: "Market",
    line: "Gold buys bread. Essence buys secrets. Upgrade the stalls and I will find you both.",
  },
  chapel: {
    npc: "Sister Maera",
    title: "Chapel",
    line: "Death is not a door here. It is a debt, and Crownfire always collects. Let the chapel pay part of it for you.",
  },
  alchemyLab: {
    npc: "Archivist Edran",
    title: "Alchemy Lab",
    line: "Every poison has a grammar. Learn it, and even the marsh curses become medicine.",
  },
  relicForge: {
    npc: "Master Orric",
    title: "Relic Forge",
    line: "A relic is a weapon with a memory older than its owner. Handle it carefully, or it will choose for you.",
  },
  trainingGround: {
    npc: "Captain Rusk",
    title: "Training Ground",
    line: "Do not ask the field to be kind. Ask your stance to be honest, your shield to be steady, and your next strike to matter.",
  },
};

const SKILLS = [
  { id: "attack", name: "Crown Slash", mp: 0, cd: 0, kind: "damage", power: 1, assetKey: "icons/skill_crown_slash", asset: ASSETS.skills.crownSlash, effect: "Weapon damage" },
  { id: "sire-oath", name: "Crown Oath", mp: 16, cd: 2, kind: "burn", power: 1.28, assetKey: "icons/skill_sire_oath", asset: ASSETS.skills.crownfire, effect: "Sire only: fire strike + Burn", heroIds: ["sire"] },
  { id: "warden-bulwark", name: "Iron Bulwark", mp: 10, cd: 2, kind: "guard", power: 0, assetKey: "icons/skill_warden_bulwark", asset: ASSETS.skills.guard, effect: "Warden only: Guard + MP", heroIds: ["warden"] },
  { id: "ranger-arrow", name: "Piercing Arrow", mp: 14, cd: 2, kind: "damage", power: 1.45, assetKey: "icons/skill_ranger_arrow", asset: ASSETS.skills.crownSlash, effect: "Ranger only: high damage shot", heroIds: ["ranger"] },
  { id: "luminary-nova", name: "Radiant Nova", mp: 24, cd: 3, kind: "heal", power: 1.35, assetKey: "icons/skill_luminary_nova", asset: ASSETS.skills.radiant, effect: "Luminary only: heal + cleanse Burn", heroIds: ["luminary"] },
  { id: "fire", name: "Crownfire", mp: 18, cd: 2, kind: "burn", power: 1.18, assetKey: "icons/skill_crownfire", asset: ASSETS.skills.crownfire, effect: "Damage + Burn" },
  { id: "guard", name: "Guard", mp: 6, cd: 1, kind: "guard", power: 0, assetKey: "icons/skill_guard", asset: ASSETS.skills.guard, effect: "Guard + MP" },
];

const HERO_TALENTS = {
  sire: [
    { id: "royal-ember", tier: 1, name: "Royal Ember", cost: 1, bonus: { attack: 2, critDamage: 5 }, text: "+2 ATK, +5% Crit Damage" },
    { id: "crown-temper", tier: 2, name: "Crown Temper", cost: 1, bonus: { maxHp: 12, armorPen: 2 }, text: "+12 HP, +2 Armor Pen" },
    { id: "ashen-command", tier: 3, name: "Ashen Command", cost: 2, bonus: { attack: 4, crit: 3 }, text: "+4 ATK, +3% Crit" },
  ],
  warden: [
    { id: "iron-vow", tier: 1, name: "Iron Vow", cost: 1, bonus: { defense: 2, shield: 5 }, text: "+2 DEF, +5 Shield" },
    { id: "bulwark-heart", tier: 2, name: "Bulwark Heart", cost: 1, bonus: { maxHp: 18, defense: 1 }, text: "+18 HP, +1 DEF" },
    { id: "titan-stance", tier: 3, name: "Titan Stance", cost: 2, bonus: { defense: 4, shield: 8 }, text: "+4 DEF, +8 Shield" },
  ],
  ranger: [
    { id: "quiet-string", tier: 1, name: "Quiet String", cost: 1, bonus: { speed: 2, crit: 2 }, text: "+2 SPD, +2% Crit" },
    { id: "shadow-quiver", tier: 2, name: "Shadow Quiver", cost: 1, bonus: { attack: 3, dodge: 3 }, text: "+3 ATK, +3 Dodge" },
    { id: "phantom-shot", tier: 3, name: "Phantom Shot", cost: 2, bonus: { crit: 5, armorPen: 4 }, text: "+5% Crit, +4 Armor Pen" },
  ],
  luminary: [
    { id: "soft-sun", tier: 1, name: "Soft Sun", cost: 1, bonus: { maxMp: 12, skillPower: 0.04 }, text: "+12 MP, +4% Skill Power" },
    { id: "oracle-flame", tier: 2, name: "Oracle Flame", cost: 1, bonus: { defense: 1, maxHp: 10 }, text: "+1 DEF, +10 HP" },
    { id: "solar-saint", tier: 3, name: "Solar Saint", cost: 2, bonus: { maxMp: 20, skillPower: 0.07 }, text: "+20 MP, +7% Skill Power" },
  ],
};

const QUESTS = [
  { id: "false-sovereign", name: "The False Sovereign", objective: "Reach Crownfire Throne", type: "clear", target: "crownfire-throne", goal: 1, reward: { gold: 120, wood: 20, stone: 20, essence: 4 } },
  { id: "catacomb-delver", name: "Catacomb Delver", objective: "Clear Crownfire Catacombs runs", type: "runs", target: "crownfire-catacombs", goal: 3, reward: { gold: 90, wood: 20, stone: 30, essence: 2 } },
  { id: "rebuild-crownfire", name: "Rebuild Crownfire", objective: "Raise total building levels", type: "buildingLevels", goal: 8, reward: { gold: 70, wood: 55, stone: 55, essence: 3 } },
  { id: "relic-hunter", name: "Relic Hunter", objective: "Collect equipment and relics", type: "inventory", goal: 6, reward: { gold: 80, wood: 0, stone: 20, essence: 5 } },
];

function clamp(value, max) {
  return Math.max(0, Math.min(max, Math.round(value)));
}

function itemById(id) {
  return ITEMS.find((item) => item.id === id);
}

function itemSummary(item) {
  if (!item) return "";
  if (item.type === "consumable") return `${item.effect} +${item.amount}`;
  return [
    ["attack", "ATK"],
    ["defense", "DEF"],
    ["maxHp", "HP"],
    ["maxMp", "MP"],
    ["speed", "SPD"],
    ["crit", "CRIT"],
    ["critDamage", "CDMG"],
    ["armorPen", "PEN"],
    ["dodge", "DODGE"],
    ["shield", "SHIELD"],
  ]
    .filter(([key]) => item[key])
    .map(([key, label]) => `${item[key] > 0 ? "+" : ""}${item[key]} ${label}`)
    .join(" / ");
}

function makeHero(template) {
  return {
    ...template,
    level: 1,
    exp: 0,
    hp: template.maxHp,
    mp: template.maxMp,
    classTier: 0,
    relationship: 0,
    skillPoints: 0,
    cooldowns: {},
    status: [],
    equipment: { weapon: null, armor: null, relic: null, ring: null, artifact: null },
    equipmentLevels: { weapon: 0, armor: 0, relic: 0, ring: 0, artifact: 0 },
    talents: [],
  };
}

function freshQuestState() {
  return Object.fromEntries(QUESTS.map((quest) => [quest.id, { completed: false }]));
}

function freshState() {
  return {
    screen: "map",
    resources: { gold: 120, wood: 35, stone: 25, essence: 2 },
    heroes: HEROES.map(makeHero),
    activeHeroId: "sire",
    inventory: [],
    buildings: { blacksmith: 0, mageTower: 0, barracks: 0, market: 0, chapel: 0, alchemyLab: 0, relicForge: 0, trainingGround: 0 },
    progress: { storyIntroSeen: false, buildingUpgrades: [] },
    quests: freshQuestState(),
    battle: null,
    log: ["The Crownfire banner rises over a broken realm."],
  };
}

function normalizeState(saved) {
  const base = freshState();
  if (!saved || typeof saved !== "object") return base;
  const heroes = Array.isArray(saved.heroes) && saved.heroes.length
    ? saved.heroes.map((hero) => ({
        ...hero,
        equipment: { weapon: null, armor: null, relic: null, ring: null, artifact: null, ...(hero.equipment || {}) },
        equipmentLevels: { weapon: 0, armor: 0, relic: 0, ring: 0, artifact: 0, ...(hero.equipmentLevels || {}) },
        talents: Array.isArray(hero.talents) ? hero.talents : [],
      }))
    : base.heroes;
  const restoredBattle = normalizeBattle(saved.battle);
  const savedScreen = VALID_SCREENS.has(saved.screen) ? saved.screen : "map";
  const restoredScreen = savedScreen === "battle" && restoredBattle ? "battle" : savedScreen === "battle" ? "map" : savedScreen;
  return {
    ...base,
    ...saved,
    resources: { ...base.resources, ...(saved.resources || {}), ...(Number.isFinite(saved.gold) ? { gold: saved.gold } : {}) },
    screen: restoredScreen,
    buildings: { ...base.buildings, ...(saved.buildings || {}) },
    heroes,
    inventory: Array.isArray(saved.inventory) ? saved.inventory : [],
    progress: { ...base.progress, ...(saved.progress || {}), buildingUpgrades: pendingBuildingUpgrades(saved.progress).filter((upgrade) => BUILDINGS[upgrade.id] && Number.isFinite(upgrade.finishAt)) },
    quests: { ...base.quests, ...(saved.quests || {}) },
    battle: restoredBattle,
  };
}

function normalizeBattle(savedBattle) {
  if (!savedBattle || typeof savedBattle !== "object") return null;
  const node = MAP_NODES.find((item) => item.id === savedBattle.nodeId);
  if (!node || !savedBattle.enemy || savedBattle.finished) return null;
  const waves = Array.isArray(savedBattle.waves) && savedBattle.waves.length ? savedBattle.waves : [node.enemy];
  const enemy = {
    ...node.enemy,
    ...savedBattle.enemy,
    maxHp: savedBattle.enemy.maxHp || savedBattle.enemy.hp || node.enemy.hp,
    status: Array.isArray(savedBattle.enemy.status) ? savedBattle.enemy.status : [],
  };
  if (enemy.hp <= 0) return null;
  return {
    nodeId: node.id,
    waves,
    wave: Math.max(1, savedBattle.wave || 1),
    defeated: Array.isArray(savedBattle.defeated) ? savedBattle.defeated : [],
    turn: savedBattle.turn === "enemy" ? "enemy" : "player",
    enemy,
    round: Math.max(1, savedBattle.round || 1),
    floaters: [],
    hitSide: null,
    skillEffect: null,
    finished: false,
  };
}

function expNeeded(level) {
  return 70 + level * 35;
}

function talentBonus(hero, key) {
  return (HERO_TALENTS[hero.id] || [])
    .filter((talent) => (hero.talents || []).includes(talent.id))
    .reduce((sum, talent) => sum + (talent.bonus?.[key] || 0), 0);
}

function equipmentUpgradeBonus(hero, key) {
  const levels = { weapon: 0, armor: 0, relic: 0, ring: 0, artifact: 0, ...(hero.equipmentLevels || {}) };
  const upgradeMap = {
    maxHp: levels.armor * 8 + levels.artifact * 6,
    maxMp: levels.relic * 5 + levels.ring * 3 + levels.artifact * 5,
    attack: levels.weapon * 2 + levels.relic + levels.artifact * 2,
    defense: levels.armor * 2 + levels.relic + levels.artifact,
    speed: levels.ring,
    crit: levels.ring,
    critDamage: levels.weapon * 3 + levels.relic * 2,
    armorPen: levels.weapon,
    dodge: levels.ring,
    shield: levels.armor * 3,
    skillPower: levels.relic * 0.01 + levels.artifact * 0.01,
  };
  return upgradeMap[key] || 0;
}

function totalStats(hero, buildings) {
  const weapon = itemById(hero.equipment.weapon);
  const armor = itemById(hero.equipment.armor);
  const relic = itemById(hero.equipment.relic);
  const ring = itemById(hero.equipment.ring);
  const artifact = itemById(hero.equipment.artifact);
  const gear = [weapon, armor, relic, ring, artifact].filter(Boolean);
  const levelBonus = hero.level - 1;
  return {
    maxHp: hero.maxHp + levelBonus * 10 + buildings.barracks * BUILDINGS.barracks.bonus + gear.reduce((sum, item) => sum + (item.maxHp || 0), 0) + talentBonus(hero, "maxHp") + equipmentUpgradeBonus(hero, "maxHp"),
    maxMp: hero.maxMp + levelBonus * 5 + buildings.mageTower * BUILDINGS.mageTower.bonus + gear.reduce((sum, item) => sum + (item.maxMp || 0), 0) + talentBonus(hero, "maxMp") + equipmentUpgradeBonus(hero, "maxMp"),
    attack: hero.attack + levelBonus * 3 + buildings.blacksmith * BUILDINGS.blacksmith.bonus + gear.reduce((sum, item) => sum + (item.attack || 0), 0) + talentBonus(hero, "attack") + equipmentUpgradeBonus(hero, "attack"),
    defense: hero.defense + levelBonus * 2 + buildings.barracks * 2 + gear.reduce((sum, item) => sum + (item.defense || 0), 0) + talentBonus(hero, "defense") + equipmentUpgradeBonus(hero, "defense"),
    speed: (hero.speed || 10) + Math.floor(levelBonus / 2) + gear.reduce((sum, item) => sum + (item.speed || 0), 0) + talentBonus(hero, "speed") + equipmentUpgradeBonus(hero, "speed"),
    crit: (hero.crit || 8) + gear.reduce((sum, item) => sum + (item.crit || 0), 0) + talentBonus(hero, "crit") + equipmentUpgradeBonus(hero, "crit"),
    critDamage: (hero.critDamage || 150) + buildings.relicForge * 2 + gear.reduce((sum, item) => sum + (item.critDamage || 0), 0) + talentBonus(hero, "critDamage") + equipmentUpgradeBonus(hero, "critDamage"),
    armorPen: (hero.armorPen || 0) + gear.reduce((sum, item) => sum + (item.armorPen || 0), 0) + talentBonus(hero, "armorPen") + equipmentUpgradeBonus(hero, "armorPen"),
    dodge: (hero.dodge || 0) + gear.reduce((sum, item) => sum + (item.dodge || 0), 0) + talentBonus(hero, "dodge") + equipmentUpgradeBonus(hero, "dodge"),
    shield: (hero.shield || 0) + buildings.barracks * 2 + gear.reduce((sum, item) => sum + (item.shield || 0), 0) + talentBonus(hero, "shield") + equipmentUpgradeBonus(hero, "shield"),
    skillPower: 1 + buildings.mageTower * 0.05 + buildings.alchemyLab * 0.02 + talentBonus(hero, "skillPower") + equipmentUpgradeBonus(hero, "skillPower"),
  };
}

function equipmentUpgradeCost(level) {
  return { gold: 35 + level * 25, stone: 8 + level * 6, essence: level >= 2 ? level - 1 : 0 };
}

function buildingCost(id, level) {
  const base = BUILDINGS[id].cost;
  return Object.fromEntries(Object.entries(base).map(([resource, value]) => [resource, value + level * (resource === "essence" ? 1 : 8)]));
}

function buildingUpgradeDuration(level) {
  return (level + 1) * 2 * UPGRADE_MINUTE_MS;
}

function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function pendingBuildingUpgrades(progress) {
  return Array.isArray(progress?.buildingUpgrades) ? progress.buildingUpgrades : [];
}

function activeBuildingUpgrade(progress, id) {
  return pendingBuildingUpgrades(progress).find((upgrade) => upgrade.id === id);
}

function heroReviveGoldCost(hero) {
  return 36 + Math.max(1, hero?.level || 1) * 18;
}

function reviveFee(fallenHeroes) {
  return { gold: fallenHeroes.reduce((sum, hero) => sum + heroReviveGoldCost(hero), 0) };
}

function canPay(resources, cost) {
  return Object.entries(cost).every(([resource, value]) => (resources[resource] || 0) >= value);
}

function rarityClass(rarity) {
  if (rarity === "mythic") return "border-rose-300/80 bg-rose-950/30 text-rose-100";
  if (rarity === "legendary") return "border-amber-300/80 bg-amber-950/30 text-amber-100";
  if (rarity === "epic") return "border-violet-400/70 bg-violet-950/25 text-violet-100";
  if (rarity === "rare") return "border-sky-400/70 bg-sky-950/25 text-sky-100";
  return "border-stone-600 bg-black/25 text-stone-200";
}

function pay(resources, cost) {
  return Object.fromEntries(Object.entries(resources).map(([resource, value]) => [resource, value - (cost[resource] || 0)]));
}

function addResources(resources, gain) {
  return {
    gold: (resources.gold || 0) + (gain.gold || 0),
    wood: (resources.wood || 0) + (gain.wood || 0),
    stone: (resources.stone || 0) + (gain.stone || 0),
    essence: (resources.essence || 0) + (gain.essence || 0),
  };
}

function totalBuildingLevels(buildings) {
  return Object.values(buildings || {}).reduce((sum, level) => sum + (level || 0), 0);
}

function villageSupportReward(buildings, workerFocus = "balanced") {
  const levels = totalBuildingLevels(buildings);
  const reward = {
    gold: 80 + levels * 14 + (buildings.market || 0) * 34,
    wood: 26 + levels * 4 + (buildings.barracks || 0) * 6,
    stone: 22 + levels * 4 + (buildings.blacksmith || 0) * 7,
    essence: Math.max(1, Math.floor(levels / 4) + (buildings.mageTower || 0)),
  };
  if (workerFocus === "taxes") reward.gold += 70 + (buildings.market || 0) * 24;
  if (workerFocus === "construction") {
    reward.wood += 38 + (buildings.trainingGround || 0) * 8;
    reward.stone += 34 + (buildings.relicForge || 0) * 8;
  }
  if (workerFocus === "training") reward.essence += Math.max(1, Math.ceil((buildings.trainingGround || 0) / 2));
  return reward;
}

function villageDispatchReward(buildings, workerFocus = "balanced") {
  const levels = totalBuildingLevels(buildings);
  if (workerFocus === "taxes") {
    return { label: "Tax Caravan", text: "Tip: use Taxes when you need gold for Market gear, Chapel healing, or fast building upgrades.", reward: { gold: 110 + levels * 8 + (buildings.market || 0) * 42 } };
  }
  if (workerFocus === "construction") {
    return { label: "Builder Convoy", text: "Tip: use Construction before upgrading Blacksmith, Barracks, Chapel, and Relic Forge.", reward: { wood: 48 + levels * 5, stone: 42 + levels * 5 } };
  }
  if (workerFocus === "training") {
    return { label: "Drillmasters", text: "Tip: use Training after hard battles. It restores living heroes and gives essence for talents and crafting.", reward: { gold: 35 + levels * 3, essence: Math.max(1, 1 + (buildings.trainingGround || 0)) } };
  }
  return { label: "Balanced Dispatch", text: "Tip: Balanced gives every resource, useful when you are not sure what your next upgrade needs.", reward: { gold: 70 + levels * 5, wood: 24 + levels * 2, stone: 22 + levels * 2, essence: Math.max(1, Math.floor(levels / 5)) } };
}

function statusActive(actor, id) {
  return actor.status.some((effect) => effect.id === id);
}

function addStatus(actor, effect) {
  return { ...actor, status: [...actor.status.filter((item) => item.id !== effect.id), effect] };
}

function tickStatus(actor, maxHp, name) {
  let next = { ...actor, status: [...actor.status] };
  const log = [];
  if (statusActive(next, "burn")) {
    next.hp = clamp(next.hp - 8, maxHp);
    log.push(`${name} takes 8 burn damage.`);
  }
  next.status = next.status.map((effect) => ({ ...effect, turns: effect.turns - 1 })).filter((effect) => effect.turns > 0);
  return { actor: next, log };
}

function makeFloater(text, side, tone) {
  return { id: `${Date.now()}-${Math.random()}`, text, side, tone, createdAt: Date.now() };
}

function makeEffect(type, side) {
  return { id: `${Date.now()}-${Math.random()}`, type, side };
}

function skillEffectType(skill, crit = false) {
  if (crit) return "crit";
  if (skill.id === "sire-oath" || skill.kind === "burn") return "fire";
  if (skill.id === "warden-bulwark" || skill.kind === "guard") return "guard";
  if (skill.id === "ranger-arrow") return "arrow";
  if (skill.id === "luminary-nova" || skill.kind === "heal") return "heal";
  return "attack";
}

function effectSprite(type) {
  const sprites = {
    attack: "effects/pixel_crown_slash_burst",
    damage: "effects/pixel_crown_slash_burst",
    burn: "effects/pixel_crown_oath_burst",
    fire: "effects/pixel_crown_oath_burst",
    stun: "effects/pixel_poison_curse",
    guard: "effects/pixel_guard_pulse",
    heal: "effects/pixel_radiant_nova",
    arrow: "effects/pixel_piercing_arrow",
    enemy: "effects/pixel_enemy_claw",
    crit: "effects/pixel_critical_hit",
  };
  return asset(sprites[type] || "effects/hit_flash");
}

function statusIcon(id) {
  return asset(`icons/status_${id}`, ASSETS.skills.radiant);
}

function slugKey(value) {
  return String(value)
    .toLowerCase()
    .replace(/the\s+/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function factionIcon(name) {
  const map = {
    "The Hollowed": "icons/faction_hollowed",
    "Crownfire Cult": "icons/faction_crownfire_cult",
    Frostborn: "icons/faction_frostborn",
    "Veiled Survivors": "icons/faction_veiled_survivors",
    "Ash Legion": "icons/faction_ash_legion",
    "Forgotten Royalty": "icons/faction_forgotten_royalty",
  };
  return asset(map[name] || `icons/faction_${slugKey(name)}`, ASSETS.ui.quest);
}

function npcPortrait(name) {
  const map = {
    "Master Orric": "portraits/npc_master_orric",
    "Sister Maera": "portraits/npc_sister_maera",
    "Archivist Edran": "portraits/npc_archivist_edran",
    "Captain Rusk": "portraits/npc_captain_rusk",
    "Mira of the Market": "portraits/npc_mira_market",
  };
  return asset(map[name] || `portraits/npc_${slugKey(name)}`, ASSETS.ui.quest);
}

function talentIcon(id) {
  return asset(`icons/talent_${id.replaceAll("-", "_")}`, ASSETS.skills.radiant);
}

function heroEvolution(hero) {
  const chain = HERO_EVOLUTIONS[hero.id] || [{ level: 1, className: hero.role, assetKey: hero.id }];
  return [...chain].reverse().find((stage) => hero.level >= stage.level) || chain[0];
}

function heroSprite(hero) {
  const stage = heroEvolution(hero);
  return ASSETS.heroes[stage.assetKey] || ASSETS.heroes[hero.id];
}

function heroClassTitle(hero) {
  return heroEvolution(hero).className;
}

function heroEvolutionTier(hero) {
  return hero.level >= 20 ? 2 : hero.level >= 10 ? 1 : 0;
}

function questIcon(quest, completed = false) {
  if (completed) return asset("icons/quest_complete", ASSETS.ui.quest);
  if (quest?.id === "false-sovereign") return asset("icons/quest_main", ASSETS.ui.quest);
  if (quest?.type === "runs") return asset("icons/dungeon_wave", ASSETS.ui.map);
  if (quest?.type === "inventory") return asset("icons/reward_chest", ASSETS.ui.inventory);
  return asset("icons/quest_side", ASSETS.ui.quest);
}

function villageTabIcon(id) {
  return asset(`icons/village_tab_${id}`, ASSETS.ui.build);
}

function enemyImage(assetId) {
  return ASSETS.enemies[assetId] || asset(`enemies/${assetId}`, ASSETS.enemies.hollowKnight);
}

function nextLivingHeroId(heroes, currentId) {
  return heroes.find((hero) => hero.id !== currentId && hero.hp > 0)?.id || null;
}

function partyLevel(heroes) {
  return Math.max(1, Math.round(heroes.reduce((sum, hero) => sum + hero.level, 0) / Math.max(1, heroes.length)));
}

function scaleEnemy(base, scale = 0) {
  return {
    ...base,
    hp: base.hp + scale * 22,
    attack: base.attack + scale * 4,
    defense: base.defense + Math.floor(scale * 1.75),
    exp: base.exp + scale * 12,
  };
}

function chooseNodeEnemy(node, state) {
  if (!node.enemyPool?.length) return { ...node.enemy };
  const level = partyLevel(state.heroes);
  const available = node.enemyPool.filter((enemy) => (enemy.minLevel || 1) <= level);
  const pool = available.length ? available : [node.enemyPool[0]];
  const seed = state.log.length + Object.keys(state.progress || {}).length + level;
  const base = pool[seed % pool.length];
  return scaleEnemy(base, Math.max(0, level - (base.minLevel || 1)));
}

function chooseDungeonWaves(node, state) {
  const level = partyLevel(state.heroes);
  const runCount = state.progress?.[`${node.id}:runs`] || 0;
  const waveCount = Math.min(6, 3 + Math.floor(runCount / 2) + Math.floor(level / 5));
  const available = node.enemyPool.filter((enemy) => (enemy.minLevel || 1) <= level + 1);
  const pool = available.length ? available : [node.enemyPool[0]];
  return Array.from({ length: waveCount }, (_, waveIndex) => {
    const base = pool[(runCount + level + waveIndex * 2) % pool.length];
    const scale = Math.max(0, level - (base.minLevel || 1)) + waveIndex + Math.floor(runCount / 2);
    return scaleEnemy(base, scale);
  });
}

function clearedAreaCount(progress) {
  return Object.keys(progress || {}).filter((key) => !key.includes(":")).length;
}

function campaignNodeCount() {
  return MAP_NODES.filter((node) => !node.repeatable).length;
}

function questProgressValue(state, quest) {
  if (quest.type === "clear") return state.progress?.[quest.target] ? 1 : 0;
  if (quest.type === "runs") return state.progress?.[`${quest.target}:runs`] || 0;
  if (quest.type === "buildingLevels") return Object.values(state.buildings || {}).reduce((sum, level) => sum + level, 0);
  if (quest.type === "inventory") {
    const equipped = (state.heroes || []).reduce((sum, hero) => sum + Object.values(hero.equipment || {}).filter(Boolean).length, 0);
    return (state.inventory?.length || 0) + equipped;
  }
  return 0;
}

function applyQuestCompletions(state) {
  let next = state;
  QUESTS.forEach((quest) => {
    if (next.quests?.[quest.id]?.completed) return;
    if (questProgressValue(next, quest) < quest.goal) return;
    next = {
      ...next,
      resources: {
        gold: next.resources.gold + (quest.reward.gold || 0),
        wood: next.resources.wood + (quest.reward.wood || 0),
        stone: next.resources.stone + (quest.reward.stone || 0),
        essence: next.resources.essence + (quest.reward.essence || 0),
      },
      quests: { ...next.quests, [quest.id]: { completed: true } },
      log: [`Quest complete: ${quest.name}. Rewards claimed.`, ...next.log].slice(0, 12),
    };
  });
  return next;
}

function enemyAura(enemy) {
  const name = `${enemy?.name || ""} ${enemy?.asset || ""}`.toLowerCase();
  if (name.includes("frost") || name.includes("ice")) return "shadow-[0_0_48px_rgba(125,211,252,0.36)] border-sky-300/40";
  if (name.includes("shadow") || name.includes("assassin")) return "shadow-[0_0_48px_rgba(168,85,247,0.28)] border-violet-300/40";
  if (name.includes("plague") || name.includes("poison")) return "shadow-[0_0_48px_rgba(74,222,128,0.26)] border-emerald-300/40";
  return "shadow-[0_0_54px_rgba(251,146,60,0.35)] border-orange-300/40";
}

function turnQueue(battle, hero) {
  if (!battle) return [];
  return [
    { id: "hero-now", label: hero.name, portrait: heroSprite(hero), active: battle.turn === "player" },
    { id: "enemy-now", label: battle.enemy.name, portrait: enemyImage(battle.enemy.asset), active: battle.turn === "enemy" },
    { id: "hero-next", label: hero.name, portrait: heroSprite(hero), active: false },
    { id: "enemy-next", label: battle.enemy.name, portrait: enemyImage(battle.enemy.asset), active: false },
  ];
}

function startBattleForNode(state, nodeId) {
  const node = MAP_NODES.find((item) => item.id === nodeId);
  const waves = node.dungeon ? chooseDungeonWaves(node, state) : [chooseNodeEnemy(node, state)];
  const enemy = waves[0];
  return {
    ...state,
    screen: "battle",
    battle: {
      nodeId,
      waves,
      wave: 1,
      defeated: [],
      turn: "player",
      enemy: { ...enemy, maxHp: enemy.hp, status: [] },
      round: 1,
      floaters: [],
      hitSide: null,
      skillEffect: null,
      finished: false,
    },
    log: [`${node.dungeon ? `Dungeon begins at ${node.name}. Wave 1/${waves.length}` : `Battle begins at ${node.name}`}: ${enemy.name} appears.`, ...state.log].slice(0, 12),
  };
}

function awardWin(state, nodeId) {
  const node = MAP_NODES.find((item) => item.id === nodeId);
  const defeatedEnemies = state.battle?.defeated?.length ? state.battle.defeated : [state.battle?.enemy || node.enemy];
  const runCount = state.progress?.[`${nodeId}:runs`] || 0;
  const lootId = LOOT_TABLE[(Object.keys(state.progress).length + node.name.length + runCount) % LOOT_TABLE.length];
  const loot = itemById(lootId);
  const defeatedExp = defeatedEnemies.reduce((sum, enemy) => sum + (enemy.exp || 0), 0);
  const expReward = defeatedExp + state.buildings.trainingGround * BUILDINGS.trainingGround.bonus;
  const heroes = state.heroes.map((hero) => {
    let exp = hero.exp + expReward;
    let level = hero.level;
    let hp = hero.hp;
    let mp = hero.mp;
    while (exp >= expNeeded(level)) {
      exp -= expNeeded(level);
      level += 1;
      hp += 10;
      mp += 5;
    }
    const stats = totalStats({ ...hero, level }, state.buildings);
    return { ...hero, level, exp, classTier: heroEvolutionTier({ ...hero, level }), skillPoints: (hero.skillPoints || 0) + (level - hero.level), relationship: Math.min(100, (hero.relationship || 0) + 2), hp: clamp(hp, stats.maxHp), mp: clamp(mp, stats.maxMp), cooldowns: {}, status: [] };
  });
  const evolutionLog = heroes
    .filter((hero) => heroEvolutionTier(hero) > heroEvolutionTier(state.heroes.find((entry) => entry.id === hero.id) || hero))
    .map((hero) => `${hero.name} awakens as ${heroClassTitle(hero)}.`);
  const rewards = node.rewards;
  const bonusGold = state.buildings.market * BUILDINGS.market.bonus;
  const dungeonBonus = node.repeatable ? Math.max(0, partyLevel(state.heroes) - node.recommendedLevel) : 0;

  const wonState = {
    ...state,
    resources: {
      gold: state.resources.gold + rewards.gold + bonusGold + dungeonBonus * 8,
      wood: state.resources.wood + rewards.wood,
      stone: state.resources.stone + rewards.stone,
      essence: state.resources.essence + rewards.essence,
    },
    heroes,
    inventory: [...state.inventory, { uid: `${loot.id}-${Date.now()}`, itemId: loot.id }],
    progress: node.repeatable ? { ...state.progress, [`${nodeId}:runs`]: runCount + 1 } : { ...state.progress, [nodeId]: true },
    battle: state.battle ? { ...state.battle, finished: true, turn: "player" } : state.battle,
    log: [...evolutionLog, `Victory at ${node.name}. Defeated ${defeatedEnemies.length} foe${defeatedEnemies.length > 1 ? "s" : ""}. Gained ${rewards.gold + bonusGold + dungeonBonus * 8} gold, ${rewards.wood} wood, ${rewards.stone} stone, ${rewards.essence} essence, ${loot.name}, and ${expReward} EXP.`, ...state.log].slice(0, 12),
  };
  return applyQuestCompletions(wonState);
}

function advanceAfterEnemyDefeat(state, defeatedEnemy) {
  const battle = state.battle;
  const defeated = [...(battle.defeated || []), defeatedEnemy];
  const waves = battle.waves || [];
  const nextWaveIndex = battle.wave || 1;
  if (waves.length && nextWaveIndex < waves.length) {
    const nextEnemy = waves[nextWaveIndex];
    return {
      ...state,
      battle: {
        ...battle,
        defeated,
        wave: nextWaveIndex + 1,
        enemy: { ...nextEnemy, maxHp: nextEnemy.hp, status: [] },
        turn: "player",
        finished: false,
        round: battle.round + 1,
        hitSide: null,
        skillEffect: null,
      },
      log: [`Wave ${nextWaveIndex + 1}/${waves.length}: ${nextEnemy.name} enters the dungeon.`, ...state.log].slice(0, 12),
    };
  }
  return awardWin({ ...state, battle: { ...battle, defeated, finished: true, turn: "player" } }, battle.nodeId);
}

function Bar({ label, value, max, tone }) {
  const percent = Math.max(0, Math.min(100, (value / max) * 100));
  const color = tone === "mp" ? "from-sky-600 to-cyan-200" : "from-red-800 via-red-500 to-amber-300";
  return (
    <div>
      <div className="mb-1 flex justify-between text-[11px] uppercase tracking-[0.16em] text-stone-400">
        <span>{label}</span>
        <span>{value}/{max}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-sm border border-stone-700 bg-black/50">
        <motion.div className={`h-full bg-gradient-to-r ${color}`} animate={{ width: `${percent}%` }} transition={{ duration: 0.35 }} />
      </div>
    </div>
  );
}

function StatusLine({ status }) {
  return (
    <div className="flex min-h-7 flex-wrap gap-1.5">
      {status.length ? (
        status.map((effect) => (
          <span key={effect.id} title={`${effect.name}: ${effect.turns} turns`} className="flex items-center gap-1 rounded-sm border border-amber-500/30 bg-black/35 px-2 py-1 text-xs text-amber-100">
            <PixelImage src={statusIcon(effect.id)} className="h-4 w-4" />
            {effect.name} {effect.turns}
          </span>
        ))
      ) : (
        <span className="py-1 text-xs text-stone-500">No effects</span>
      )}
    </div>
  );
}

function App() {
  const [game, setGame] = useState(() => {
    try {
      return normalizeState(JSON.parse(localStorage.getItem(SAVE_KEY)));
    } catch {
      return freshState();
    }
  });
  const clickAudioRef = useRef(null);
  const equipmentUpgradeAudioRef = useRef(null);
  const villageUpgradeAudioRef = useRef(null);
  const [enemyThinking, setEnemyThinking] = useState(false);
  const [loading, setLoading] = useState({ active: false, tip: LOADING_TIPS[0] });
  const [selectedBuilding, setSelectedBuilding] = useState("blacksmith");
  const [travelingTo, setTravelingTo] = useState(null);
  const [autoAttackEnabled, setAutoAttackEnabled] = useState(false);
  const [isAutoActing, setIsAutoActing] = useState(false);
  const [autoActionNonce, setAutoActionNonce] = useState(0);
  const [partyOpen, setPartyOpen] = useState(false);
  const [codexContent, setCodexContent] = useState(null);
  const [introPage, setIntroPage] = useState(0);
  const [now, setNow] = useState(Date.now());

  const activeHero = game.heroes.find((hero) => hero.id === game.activeHeroId) || game.heroes[0];
  const activeStats = totalStats(activeHero, game.buildings);
  const battle = game.battle;
  const battleNode = battle ? MAP_NODES.find((item) => item.id === battle.nodeId) : null;
  const usableSkills = SKILLS.filter((skill) => !skill.heroIds || skill.heroIds.includes(activeHero.id));
  const shopUnlocked = game.buildings.market > 0;
  const livingPartyCount = game.heroes.filter((hero) => hero.hp > 0).length;
  const battleEffectKey = battle ? [battle.hitSide || "", battle.skillEffect?.id || "", ...(battle.floaters || []).map((floater) => floater.id)].join("|") : "";
  const introActive = !game.progress?.storyIntroSeen;

  function playAudio(ref) {
    const audio = ref.current;
    if (!audio) return;
    audio.currentTime = 0;
    const playback = audio.play();
    if (playback?.catch) playback.catch(() => {});
  }

  useEffect(() => {
    const clickAudio = new Audio(ASSETS.audio.click);
    clickAudio.preload = "auto";
    clickAudio.volume = 0.45;
    clickAudioRef.current = clickAudio;

    const equipmentUpgradeAudio = new Audio(ASSETS.audio.equipmentUpgrade);
    equipmentUpgradeAudio.preload = "auto";
    equipmentUpgradeAudio.volume = 0.7;
    equipmentUpgradeAudioRef.current = equipmentUpgradeAudio;

    const villageUpgradeAudio = new Audio(ASSETS.audio.villageUpgrade);
    villageUpgradeAudio.preload = "auto";
    villageUpgradeAudio.volume = 0.7;
    villageUpgradeAudioRef.current = villageUpgradeAudio;
    return () => {
      clickAudioRef.current = null;
      equipmentUpgradeAudioRef.current = null;
      villageUpgradeAudioRef.current = null;
    };
  }, []);

  useEffect(() => {
    function playClickSound(event) {
      if (event.button !== undefined && event.button !== 0) return;
      const target = event.target instanceof Element ? event.target.closest("button,[role='button']") : null;
      if (!target || target.getAttribute("aria-disabled") === "true" || target.disabled) return;
      if (target.dataset.sound === "equipment-upgrade") return;
      if (target.dataset.sound === "village-upgrade") return;
      playAudio(clickAudioRef);
    }

    window.addEventListener("pointerdown", playClickSound, true);
    return () => window.removeEventListener("pointerdown", playClickSound, true);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(game));
    } catch (error) {
      console.warn("Crownfire save could not be written.", error);
    }
  }, [game]);

  useEffect(() => {
    function completeReadyUpgrades(timestamp = Date.now()) {
      setGame((current) => {
        const pending = pendingBuildingUpgrades(current.progress);
        const ready = pending.filter((upgrade) => upgrade.finishAt <= timestamp);
        if (!ready.length) return current;
        const buildings = { ...current.buildings };
        const completedNames = [];
        ready.forEach((upgrade) => {
          const currentLevel = buildings[upgrade.id] || 0;
          if (currentLevel < upgrade.targetLevel) {
            buildings[upgrade.id] = Math.min(MAX_BUILDING_LEVEL, upgrade.targetLevel);
            completedNames.push(`${BUILDINGS[upgrade.id].name} reached level ${buildings[upgrade.id]}`);
          }
        });
        return applyQuestCompletions({
          ...current,
          buildings,
          progress: { ...current.progress, buildingUpgrades: pending.filter((upgrade) => upgrade.finishAt > timestamp) },
          log: [...completedNames, ...current.log].slice(0, 12),
        });
      });
    }

    completeReadyUpgrades(now);
    const timer = window.setInterval(() => {
      const timestamp = Date.now();
      setNow(timestamp);
      completeReadyUpgrades(timestamp);
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (game.screen !== "codex" || codexContent) return undefined;
    let cancelled = false;
    import("./data/crownfireContent.js").then((module) => {
      if (!cancelled) setCodexContent(module);
    });
    return () => {
      cancelled = true;
    };
  }, [codexContent, game.screen]);

  useEffect(() => {
    if (!battle || battle.turn !== "enemy" || battle.finished || enemyThinking) return undefined;
    setEnemyThinking(true);
    const timer = window.setTimeout(() => {
      setGame((current) => resolveEnemyTurn(current));
      setEnemyThinking(false);
    }, 750);
    return () => window.clearTimeout(timer);
  }, [battle?.turn, battle?.round, battle?.finished]);

  useEffect(() => {
    if (!battle || (!battle.hitSide && !battle.skillEffect && !battle.floaters?.length)) return undefined;
    const timer = window.setTimeout(() => {
      setGame((current) => {
        if (!current.battle) return current;
        return {
          ...current,
          battle: {
            ...current.battle,
            hitSide: null,
            skillEffect: null,
            floaters: [],
          },
        };
      });
    }, 980);
    return () => window.clearTimeout(timer);
  }, [battleEffectKey]);

  useEffect(() => {
    const livingHeroes = game.heroes.filter((hero) => hero.hp > 0).length;
    const shouldStop =
      autoAttackEnabled &&
      (game.screen !== "battle" || !battle || battle.finished || livingHeroes <= 0 || battle.enemy.hp <= 0);

    if (!shouldStop) return;
    setAutoAttackEnabled(false);
    setIsAutoActing(false);
    setGame((current) => ({
      ...current,
      log: ["Auto Attack disabled.", ...current.log].slice(0, 12),
    }));
  }, [autoAttackEnabled, battle, game.heroes, game.screen]);

  useEffect(() => {
    const livingHeroes = game.heroes.filter((hero) => hero.hp > 0).length;
    if (
      !autoAttackEnabled ||
      isAutoActing ||
      enemyThinking ||
      game.screen !== "battle" ||
      !battle ||
      battle.turn !== "player" ||
      battle.finished ||
      battle.enemy.hp <= 0 ||
      livingHeroes <= 0
    ) {
      return undefined;
    }

    const delay = 800 + Math.round(Math.random() * 400);
    const timer = window.setTimeout(() => {
      setIsAutoActing(true);
      setGame((current) => {
        const command = chooseSmartAutoCommand(current);
        if (!command) return current;
        const hero = current.heroes.find((item) => item.id === command.heroId);
        const prepared =
          command.heroId !== current.activeHeroId
            ? { ...current, activeHeroId: command.heroId, log: [`Auto Battle shifts command to ${hero.name}.`, ...current.log].slice(0, 12) }
            : current;
        return resolveSkillUse(prepared, command.skill, command.heroId, "auto");
      });
      window.setTimeout(() => setIsAutoActing(false), 150);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [
    autoActionNonce,
    autoAttackEnabled,
    battle,
    enemyThinking,
    game.heroes,
    game.screen,
    isAutoActing,
  ]);

  function withLoading(nextTip, work) {
    setLoading({ active: true, tip: nextTip });
    window.setTimeout(() => {
      try {
        work();
      } catch (error) {
        console.error("Crownfire loading transition failed.", error);
        setGame((current) => ({
          ...current,
          screen: current.battle ? "battle" : "map",
          log: ["The route failed to load safely. Your campaign was kept intact.", ...current.log].slice(0, 12),
        }));
      } finally {
        window.setTimeout(() => setLoading((current) => ({ ...current, active: false })), 250);
      }
    }, 650);
  }

  function navigate(screen) {
    if (screen === game.screen) return;
    if (screen === "battle" && !game.battle) {
      setGame((current) => ({ ...current, screen: "map", log: ["Choose a world-map node to begin a battle.", ...current.log].slice(0, 12) }));
      return;
    }
    if (screen !== "battle" && autoAttackEnabled) {
      setAutoAttackEnabled(false);
      setIsAutoActing(false);
    }
    setPartyOpen(false);
    setGame((current) => ({ ...current, screen }));
  }

  function startNode(nodeId) {
    const node = MAP_NODES.find((item) => item.id === nodeId);
    if (!node) {
      setGame((current) => ({
        ...current,
        screen: "map",
        battle: null,
        log: ["That route could not be found, so the map was restored safely.", ...current.log].slice(0, 12),
      }));
      return;
    }
    if (node?.requires && !game.progress[node.requires]) {
      setGame((current) => ({ ...current, log: [`${node.name} is locked. Clear the previous route first.`, ...current.log].slice(0, 12) }));
      return;
    }
    const tip = LOADING_TIPS[Math.floor(Math.random() * LOADING_TIPS.length)];
    setTravelingTo(nodeId);
    withLoading(tip, () => setGame((current) => startBattleForNode(current, nodeId)));
    window.setTimeout(() => setTravelingTo(null), 1100);
  }

  function selectHero(heroId) {
    if (game.battle?.turn === "enemy") return;
    setGame((current) => {
      const hero = current.heroes.find((item) => item.id === heroId);
      if (!hero || hero.hp <= 0) {
        return { ...current, log: [`${hero?.name || "That hero"} cannot fight right now.`, ...current.log].slice(0, 12) };
      }
      return { ...current, activeHeroId: heroId };
    });
  }

  function resetBattle() {
    setEnemyThinking(false);
    setAutoAttackEnabled(false);
    setIsAutoActing(false);
    setGame((current) => ({ ...current, screen: "map", battle: null, log: ["Battle reset. Choose a map node.", ...current.log].slice(0, 12) }));
  }

  function resetSave() {
    localStorage.removeItem(SAVE_KEY);
    setEnemyThinking(false);
    setAutoAttackEnabled(false);
    setIsAutoActing(false);
    setIntroPage(0);
    setGame(freshState());
  }

  function finishIntro() {
    setGame((current) => ({
      ...current,
      screen: current.screen || "map",
      progress: { ...current.progress, storyIntroSeen: true },
      log: ["Sire steps onto the road to Crownfire.", ...current.log].slice(0, 12),
    }));
  }

  function toggleAutoAttack() {
    const next = !autoAttackEnabled;
    setAutoAttackEnabled(next);
    setIsAutoActing(false);
    setAutoActionNonce((value) => value + 1);
    setGame((current) => ({
      ...current,
      log: [next ? "Auto Attack enabled." : "Auto Attack disabled.", ...current.log].slice(0, 12),
    }));
  }

  function chooseSmartAutoCommand(current) {
    if (!current.battle || current.battle.turn !== "player" || current.battle.finished || current.battle.enemy.hp <= 0) return null;
    const enemy = current.battle.enemy;
    const enemyBurning = statusActive(enemy, "burn");
    const candidates = current.heroes
      .filter((hero) => hero.hp > 0)
      .map((hero) => {
        const stats = totalStats(hero, current.buildings);
        const readySkills = SKILLS
          .filter((skill) => !skill.heroIds || skill.heroIds.includes(hero.id))
          .filter((skill) => hero.mp >= skill.mp && (hero.cooldowns[skill.id] || 0) <= 0);
        if (!readySkills.length) return null;

        const hpRatio = hero.hp / Math.max(1, stats.maxHp);
        const attack = readySkills.find((skill) => skill.id === "attack");
        const heal = readySkills.find((skill) => skill.kind === "heal");
        const guard = readySkills.find((skill) => skill.kind === "guard");
        const bestDamage = [...readySkills]
          .filter((skill) => ["damage", "burn", "stun"].includes(skill.kind))
          .sort((a, b) => {
            const aScore = a.power * stats.attack + (a.kind === "burn" && !enemyBurning ? 14 : 0) + (a.kind === "stun" ? 10 : 0) - a.mp * 0.15;
            const bScore = b.power * stats.attack + (b.kind === "burn" && !enemyBurning ? 14 : 0) + (b.kind === "stun" ? 10 : 0) - b.mp * 0.15;
            return bScore - aScore;
          })[0];

        let skill = attack || readySkills[0];
        let score = stats.attack + stats.speed * 0.45 + stats.crit * 0.7 + (hero.id === current.activeHeroId ? 4 : 0);

        if (hpRatio <= 0.42 && heal) {
          skill = heal;
          score += 58;
        } else if (hpRatio <= 0.32 && guard) {
          skill = guard;
          score += 46;
        } else if (bestDamage && enemy.hp > Math.max(18, stats.attack * 1.15)) {
          skill = bestDamage;
          score += bestDamage.power * 16 + (bestDamage.kind === "burn" && !enemyBurning ? 18 : 0);
        } else if (attack) {
          skill = attack;
          score += 8;
        }

        if (hpRatio <= 0.22 && hero.id !== "warden") score -= 28;
        if (hero.id === "warden" && hpRatio > 0.28) score += 10;
        if (hero.id === "ranger" && enemy.hp <= stats.attack * 2.2) score += 18;
        return { heroId: hero.id, skill, score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score);
    return candidates[0] || null;
  }

  function resolveSkillUse(current, skill, heroId, source = "manual") {
      if (!current.battle || current.battle.turn !== "player" || current.battle.finished) return current;
      const hero = current.heroes.find((item) => item.id === heroId);
      if (!hero) return current;
      const stats = totalStats(hero, current.buildings);
      if (hero.mp < skill.mp || (hero.cooldowns[skill.id] || 0) > 0 || hero.hp <= 0) return current;
      let updatedHero = { ...hero, mp: clamp(hero.mp - skill.mp, stats.maxMp), cooldowns: { ...hero.cooldowns, [skill.id]: skill.cd } };
      let enemy = { ...current.battle.enemy, status: [...current.battle.enemy.status] };
      const log = [];
      const floaters = [];
      let hitSide = "enemy";
      let skillEffect = makeEffect(skillEffectType(skill), ["guard", "heal"].includes(skill.kind) ? "player" : "enemy");

      if (["damage", "burn", "stun"].includes(skill.kind)) {
        const magicBoost = skill.kind === "burn" ? stats.skillPower : 1;
        const variance = 0.86 + Math.random() * 0.28;
        const crit = Math.random() * 100 < stats.crit;
        const mitigatedDefense = Math.max(0, enemy.defense - stats.armorPen);
        const damage = Math.max(6, Math.round((stats.attack * skill.power * magicBoost * variance - mitigatedDefense * 0.45) * (crit ? stats.critDamage / 100 : 1)));
        enemy.hp = clamp(enemy.hp - damage, enemy.maxHp);
        skillEffect = makeEffect(skillEffectType(skill, crit), "enemy");
        floaters.push(makeFloater(`${crit ? "CRIT! " : ""}-${damage}`, "enemy", crit ? "crit" : "damage"));
        log.push(source === "auto" ? `${hero.name} auto attacks ${enemy.name}${crit ? " with a critical hit" : ""}.` : `${hero.name} uses ${skill.name} for ${damage} damage${crit ? " (CRIT)" : ""}.`);
      }

      if (skill.kind === "burn") {
        enemy = addStatus(enemy, { id: "burn", name: "Burn", turns: 3 });
        log.push(`${enemy.name} is burning.`);
      }

      if (skill.kind === "stun") {
        if (Math.random() > 0.32) {
          enemy = addStatus(enemy, { id: "stun", name: "Stun", turns: 1 });
          log.push(`${enemy.name} is stunned.`);
        } else {
          log.push(`${enemy.name} resists the stun.`);
        }
      }

      if (skill.kind === "guard") {
        updatedHero = addStatus(updatedHero, { id: "guard", name: "Guard", turns: 2 });
        updatedHero.mp = clamp(updatedHero.mp + 5, stats.maxMp);
        log.push(`${hero.name} guards and restores 5 MP.`);
        hitSide = "player";
      }

      if (skill.kind === "heal") {
        const heal = Math.round((stats.attack * 1.7 + 18) * stats.skillPower);
        updatedHero.hp = clamp(updatedHero.hp + heal, stats.maxHp);
        updatedHero.status = updatedHero.status.filter((effect) => effect.id !== "burn");
        floaters.push(makeFloater(`+${heal}`, "player", "heal"));
        log.push(`${hero.name} restores ${heal} HP.`);
        hitSide = "player";
      }

      let next = {
        ...current,
        activeHeroId: hero.id,
        heroes: current.heroes.map((item) => (item.id === hero.id ? updatedHero : item)),
        battle: { ...current.battle, enemy, turn: enemy.hp <= 0 ? "player" : "enemy", finished: enemy.hp <= 0, hitSide, skillEffect, floaters: [...current.battle.floaters, ...floaters].slice(-6) },
        log: [...log, ...current.log].slice(0, 12),
      };
      if (enemy.hp <= 0) next = advanceAfterEnemyDefeat(next, enemy);
      return next;
  }

  function useSkill(skill, source = "manual") {
    if (!battle || battle.turn !== "player" || battle.finished) return;
    if (activeHero.mp < skill.mp || (activeHero.cooldowns[skill.id] || 0) > 0 || activeHero.hp <= 0) return;
    if (source === "manual") setAutoActionNonce((value) => value + 1);

    setGame((current) => resolveSkillUse(current, skill, current.activeHeroId, source));
  }

  function resolveEnemyTurn(current) {
    if (!current.battle || current.battle.finished) return current;
    let battleState = { ...current.battle, enemy: { ...current.battle.enemy, status: [...current.battle.enemy.status] } };
    const hero = current.heroes.find((item) => item.id === current.activeHeroId);
    const stats = totalStats(hero, current.buildings);
    let updatedHero = { ...hero, status: [...hero.status] };
    const log = [];
    const floaters = [];

    const enemyTick = tickStatus(battleState.enemy, battleState.enemy.maxHp, battleState.enemy.name);
    battleState.enemy = enemyTick.actor;
    log.push(...enemyTick.log);

    if (battleState.enemy.hp <= 0) {
      return advanceAfterEnemyDefeat({ ...current, battle: { ...battleState, finished: true, turn: "player" }, log: [...log, ...current.log].slice(0, 12) }, battleState.enemy);
    }

    if (statusActive(battleState.enemy, "stun")) {
      battleState.enemy.status = battleState.enemy.status.filter((effect) => effect.id !== "stun");
      log.push(`${battleState.enemy.name} loses its turn to Stun.`);
    } else {
      if (Math.random() * 100 < stats.dodge) {
        floaters.push(makeFloater("DODGE", "player", "heal"));
        log.push(`${updatedHero.name} dodges ${battleState.enemy.name}'s attack.`);
      } else {
        const guarded = statusActive(updatedHero, "guard");
        const shieldBlock = Math.floor((stats.shield || 0) * 0.25);
        let damage = Math.max(1, Math.round(battleState.enemy.attack * (0.8 + Math.random() * 0.4) - stats.defense * 0.55 - shieldBlock));
        if (guarded) damage = Math.ceil(damage * 0.45);
        updatedHero.hp = clamp(updatedHero.hp - damage, stats.maxHp);
        floaters.push(makeFloater(`-${damage}`, "player", "damage"));
        log.push(`${battleState.enemy.name} attacks ${updatedHero.name} for ${damage} damage.`);
      }
      if (battleState.round % 3 === 0 && Math.random() > 0.45) {
        updatedHero = addStatus(updatedHero, { id: "burn", name: "Burn", turns: 2 });
        log.push(`${updatedHero.name} is burning.`);
      }
    }

    const heroTick = tickStatus(updatedHero, stats.maxHp, updatedHero.name);
    updatedHero = heroTick.actor;
    log.push(...heroTick.log);
    updatedHero.cooldowns = Object.fromEntries(Object.entries(updatedHero.cooldowns).map(([id, value]) => [id, Math.max(0, value - 1)]).filter(([, value]) => value > 0));
    updatedHero.mp = clamp(updatedHero.mp + 6, stats.maxMp);

    const defeated = updatedHero.hp <= 0;
    const heroes = current.heroes.map((item) => (item.id === updatedHero.id ? updatedHero : item));
    const nextHeroId = defeated ? nextLivingHeroId(heroes, updatedHero.id) : null;
    const partyDefeated = defeated && !nextHeroId;
    const defeatLog = partyDefeated
      ? `${updatedHero.name} has fallen. The party is defeated.`
      : defeated
        ? `${updatedHero.name} has fallen. ${heroes.find((item) => item.id === nextHeroId)?.name} takes the field.`
        : "Your turn.";
    return {
      ...current,
      activeHeroId: nextHeroId || current.activeHeroId,
      heroes,
      battle: { ...battleState, turn: "player", round: battleState.round + 1, finished: partyDefeated, hitSide: "player", skillEffect: makeEffect("enemy", "player"), floaters: [...battleState.floaters, ...floaters].slice(-6) },
      log: [defeatLog, ...log, ...current.log].slice(0, 12),
    };
  }

  function equip(uid, heroId) {
    setGame((current) => {
      const entry = current.inventory.find((item) => item.uid === uid);
      const item = itemById(entry?.itemId);
      if (!item || item.type !== "equipment") return current;
      const hero = current.heroes.find((candidate) => candidate.id === heroId);
      const equipment = { weapon: null, armor: null, relic: null, ring: null, artifact: null, ...(hero.equipment || {}) };
      const equipmentLevels = { weapon: 0, armor: 0, relic: 0, ring: 0, artifact: 0, ...(hero.equipmentLevels || {}) };
      const replacedItemId = equipment[item.slot];
      const returned = replacedItemId ? [{ uid: `${replacedItemId}-${Date.now()}`, itemId: replacedItemId }] : [];
      return applyQuestCompletions({
        ...current,
        heroes: current.heroes.map((candidate) => (candidate.id === heroId ? { ...candidate, equipment: { ...equipment, [item.slot]: item.id }, equipmentLevels: { ...equipmentLevels, [item.slot]: 0 } } : candidate)),
        inventory: [...current.inventory.filter((candidate) => candidate.uid !== uid), ...returned],
        log: [`${item.name} equipped by ${hero.name}.`, ...current.log].slice(0, 12),
      });
    });
  }

  function unequip(slot) {
    setGame((current) => {
      const hero = current.heroes.find((item) => item.id === current.activeHeroId);
      const equipment = { weapon: null, armor: null, relic: null, ring: null, artifact: null, ...(hero.equipment || {}) };
      const equipmentLevels = { weapon: 0, armor: 0, relic: 0, ring: 0, artifact: 0, ...(hero.equipmentLevels || {}) };
      const itemId = equipment[slot];
      if (!itemId) return current;
      const item = itemById(itemId);
      return {
        ...current,
        heroes: current.heroes.map((entry) => (entry.id === hero.id ? { ...entry, equipment: { ...equipment, [slot]: null }, equipmentLevels: { ...equipmentLevels, [slot]: 0 } } : entry)),
        inventory: [...current.inventory, { uid: `${itemId}-${Date.now()}`, itemId }],
        log: [`${item.name} unequipped.`, ...current.log].slice(0, 12),
      };
    });
  }

  function upgradeEquipped(slot) {
    const hero = game.heroes.find((item) => item.id === game.activeHeroId);
    const item = itemById(hero?.equipment?.[slot]);
    const equipmentLevels = { weapon: 0, armor: 0, relic: 0, ring: 0, artifact: 0, ...(hero?.equipmentLevels || {}) };
    const level = equipmentLevels[slot] || 0;
    if (item && level < 5 && canPay(game.resources, equipmentUpgradeCost(level))) {
      playAudio(equipmentUpgradeAudioRef);
    }

    setGame((current) => {
      const hero = current.heroes.find((item) => item.id === current.activeHeroId);
      const item = itemById(hero.equipment?.[slot]);
      if (!item) return { ...current, log: [`No ${slot} equipped to upgrade.`, ...current.log].slice(0, 12) };
      const equipmentLevels = { weapon: 0, armor: 0, relic: 0, ring: 0, artifact: 0, ...(hero.equipmentLevels || {}) };
      const level = equipmentLevels[slot] || 0;
      if (level >= 5) return { ...current, log: [`${item.name} is already fully upgraded.`, ...current.log].slice(0, 12) };
      const cost = equipmentUpgradeCost(level);
      if (!canPay(current.resources, cost)) return { ...current, log: [`Not enough resources to upgrade ${item.name}.`, ...current.log].slice(0, 12) };
      return {
        ...current,
        resources: pay(current.resources, cost),
        heroes: current.heroes.map((entry) => (entry.id === hero.id ? { ...entry, equipmentLevels: { ...equipmentLevels, [slot]: level + 1 } } : entry)),
        log: [`${item.name} upgraded to +${level + 1}.`, ...current.log].slice(0, 12),
      };
    });
  }

  function useConsumable(uid) {
    setGame((current) => {
      const entry = current.inventory.find((item) => item.uid === uid);
      const item = itemById(entry?.itemId);
      if (!item || item.type !== "consumable") return current;
      const hero = current.heroes.find((candidate) => candidate.id === current.activeHeroId);
      const stats = totalStats(hero, current.buildings);
      if (item.effect === "revive") {
        const fallen = current.heroes.find((candidate) => candidate.hp <= 0);
        if (!fallen) return { ...current, log: ["No fallen heroes need revival.", ...current.log].slice(0, 12) };
        const fallenStats = totalStats(fallen, current.buildings);
        return {
          ...current,
          activeHeroId: fallen.id,
          heroes: current.heroes.map((candidate) => (candidate.id === fallen.id ? { ...candidate, hp: clamp(item.amount, fallenStats.maxHp), mp: Math.max(candidate.mp, Math.ceil(fallenStats.maxMp * 0.25)) } : candidate)),
          inventory: current.inventory.filter((candidate) => candidate.uid !== uid),
          battle: current.battle?.finished ? { ...current.battle, finished: false, turn: "player" } : current.battle,
          log: [`${fallen.name} is revived by ${item.name}.`, ...current.log].slice(0, 12),
        };
      }
      const nextHero = item.effect === "heal" ? { ...hero, hp: clamp(hero.hp + item.amount, stats.maxHp) } : { ...hero, mp: clamp(hero.mp + item.amount, stats.maxMp) };
      return {
        ...current,
        heroes: current.heroes.map((candidate) => (candidate.id === hero.id ? nextHero : candidate)),
        inventory: current.inventory.filter((candidate) => candidate.uid !== uid),
        log: [`${hero.name} uses ${item.name}.`, ...current.log].slice(0, 12),
      };
    });
  }

  function healAtChapel() {
    setGame((current) => {
      const level = current.buildings.chapel || 0;
      if (level <= 0) return { ...current, log: ["Upgrade the Chapel to heal your party.", ...current.log].slice(0, 12) };
      const needsHealing = current.heroes.some((hero) => {
        const stats = totalStats(hero, current.buildings);
        return hero.hp < stats.maxHp || hero.mp < stats.maxMp || hero.status.length > 0;
      });
      if (!needsHealing) return { ...current, log: ["The party is already fully restored.", ...current.log].slice(0, 12) };
      const cost = { gold: 18 + level * 8, essence: level >= 3 ? 1 : 0 };
      if (!canPay(current.resources, cost)) return { ...current, log: ["Not enough gold or essence for Chapel healing.", ...current.log].slice(0, 12) };
      const heroes = current.heroes.map((hero) => {
        const stats = totalStats(hero, current.buildings);
        return hero.hp <= 0
          ? hero
          : { ...hero, hp: stats.maxHp, mp: stats.maxMp, status: [] };
      });
      return {
        ...current,
        resources: pay(current.resources, cost),
        heroes,
        log: ["Chapel light restores the living party.", ...current.log].slice(0, 12),
      };
    });
  }

  function reviveAtChapel() {
    setGame((current) => {
      const fallen = current.heroes.filter((hero) => hero.hp <= 0);
      const level = current.buildings.chapel || 0;
      if (level <= 0) return { ...current, log: ["Upgrade the Chapel to revive fallen heroes.", ...current.log].slice(0, 12) };
      if (!fallen.length) return { ...current, log: ["No fallen heroes need the Chapel.", ...current.log].slice(0, 12) };
      const cost = reviveFee(fallen);
      if (!canPay(current.resources, cost)) return { ...current, log: [`Not enough gold for Chapel rites. Need ${cost.gold} gold.`, ...current.log].slice(0, 12) };
      const heroes = current.heroes.map((hero) => {
        if (hero.hp > 0) return hero;
        const stats = totalStats(hero, current.buildings);
        return { ...hero, hp: clamp(BUILDINGS.chapel.bonus + level * 16, stats.maxHp), mp: Math.max(hero.mp, Math.ceil(stats.maxMp * 0.35)), status: [] };
      });
      return {
        ...current,
        resources: pay(current.resources, cost),
        activeHeroId: heroes.find((hero) => hero.hp > 0)?.id || current.activeHeroId,
        heroes,
        battle: current.battle?.finished ? { ...current.battle, finished: false, turn: "player" } : current.battle,
        log: [`Chapel rites revive ${fallen.length} hero${fallen.length > 1 ? "es" : ""} for ${cost.gold} gold.`, ...current.log].slice(0, 12),
      };
    });
  }

  function upgradeBuilding(id) {
    const level = game.buildings[id] || 0;
    const pending = pendingBuildingUpgrades(game.progress);
    if (level < MAX_BUILDING_LEVEL && !activeBuildingUpgrade(game.progress, id) && pending.length < VILLAGE_WORKER_SLOTS && canPay(game.resources, buildingCost(id, level))) {
      playAudio(villageUpgradeAudioRef);
    }

    setGame((current) => {
      const level = current.buildings[id] || 0;
      const cost = buildingCost(id, level);
      const pending = pendingBuildingUpgrades(current.progress);
      if (level >= MAX_BUILDING_LEVEL) return current;
      if (activeBuildingUpgrade(current.progress, id)) return { ...current, log: [`${BUILDINGS[id].name} is already being upgraded.`, ...current.log].slice(0, 12) };
      if (pending.length >= VILLAGE_WORKER_SLOTS) return { ...current, log: ["Both village workers are busy.", ...current.log].slice(0, 12) };
      if (!canPay(current.resources, cost)) return current;
      const duration = buildingUpgradeDuration(level);
      const targetLevel = level + 1;
      return {
        ...current,
        resources: pay(current.resources, cost),
        progress: {
          ...current.progress,
          buildingUpgrades: [...pending, { id, targetLevel, startedAt: Date.now(), finishAt: Date.now() + duration, duration }],
        },
        log: [`${BUILDINGS[id].name} upgrade started: level ${targetLevel} in ${formatDuration(duration)}.`, ...current.log].slice(0, 12),
      };
    });
  }

  function buyItem(itemId) {
    setGame((current) => {
      const item = itemById(itemId);
      if (!item || current.resources.gold < item.price || current.buildings.market <= 0) return current;
      return applyQuestCompletions({
        ...current,
        resources: { ...current.resources, gold: current.resources.gold - item.price },
        inventory: [...current.inventory, { uid: `${item.id}-${Date.now()}`, itemId: item.id }],
        log: [`Purchased ${item.name} for ${item.price} gold.`, ...current.log].slice(0, 12),
      });
    });
  }

  function craftItem(recipeId) {
    setGame((current) => {
      const recipe = CRAFTING_RECIPES.find((entry) => entry.id === recipeId);
      const item = itemById(recipe?.itemId);
      if (!recipe || !item || !canPay(current.resources, recipe.cost)) return current;
      return applyQuestCompletions({
        ...current,
        resources: pay(current.resources, recipe.cost),
        inventory: [...current.inventory, { uid: `${item.id}-${Date.now()}`, itemId: item.id }],
        log: [`Crafted ${item.name}.`, ...current.log].slice(0, 12),
      });
    });
  }

  function unlockTalent(heroId, talentId) {
    setGame((current) => {
      const hero = current.heroes.find((item) => item.id === heroId);
      const talent = (HERO_TALENTS[heroId] || []).find((item) => item.id === talentId);
      if (!hero || !talent || (hero.talents || []).includes(talentId)) return current;
      if ((hero.skillPoints || 0) < talent.cost) return { ...current, log: [`${hero.name} needs more skill points.`, ...current.log].slice(0, 12) };
      return {
        ...current,
        heroes: current.heroes.map((entry) => (entry.id === heroId ? { ...entry, skillPoints: (entry.skillPoints || 0) - talent.cost, talents: [...(entry.talents || []), talentId] } : entry)),
        log: [`${hero.name} unlocked ${talent.name}.`, ...current.log].slice(0, 12),
      };
    });
  }

  function collectVillageSupport() {
    setGame((current) => {
      const today = new Date().toLocaleDateString("en-CA");
      if (current.progress?.villageSupportClaimed === today) {
        return { ...current, log: ["Daily support already collected today.", ...current.log].slice(0, 12) };
      }
      const focus = current.progress?.workerFocus || "balanced";
      const reward = villageSupportReward(current.buildings, focus);
      return {
        ...current,
        resources: addResources(current.resources, reward),
        progress: { ...current.progress, villageSupportClaimed: today },
        log: [`Daily support collected: ${reward.gold || 0} gold, ${reward.wood || 0} wood, ${reward.stone || 0} stone, ${reward.essence || 0} essence.`, ...current.log].slice(0, 12),
      };
    });
  }

  function activateWorkerDispatch() {
    setGame((current) => {
      const today = new Date().toLocaleDateString("en-CA");
      if (current.progress?.villageDispatchUsed === today) {
        return { ...current, log: ["Worker dispatch already used today.", ...current.log].slice(0, 12) };
      }
      const focus = current.progress?.workerFocus || "balanced";
      const dispatch = villageDispatchReward(current.buildings, focus);
      const heroes = focus === "training"
        ? current.heroes.map((hero) => {
            if (hero.hp <= 0) return hero;
            const stats = totalStats(hero, current.buildings);
            return {
              ...hero,
              hp: clamp(hero.hp + Math.ceil(stats.maxHp * 0.25), stats.maxHp),
              mp: clamp(hero.mp + Math.ceil(stats.maxMp * 0.25), stats.maxMp),
              relationship: Math.min(100, (hero.relationship || 0) + 1),
            };
          })
        : current.heroes;
      return {
        ...current,
        resources: addResources(current.resources, dispatch.reward),
        heroes,
        progress: { ...current.progress, villageDispatchUsed: today },
        log: [`${dispatch.label} completed.`, ...current.log].slice(0, 12),
      };
    });
  }

  function setWorkerFocus(focus) {
    setGame((current) => ({
      ...current,
      progress: { ...current.progress, workerFocus: focus },
      log: [`Workers assigned to ${focus}.`, ...current.log].slice(0, 12),
    }));
  }

  function claimVillageChest() {
    setGame((current) => {
      const today = new Date().toLocaleDateString("en-CA");
      if (current.progress?.villageChestClaimed === today) {
        return { ...current, log: ["Village chest already claimed today.", ...current.log].slice(0, 12) };
      }
      const totalLevels = Object.values(current.buildings).reduce((sum, level) => sum + level, 0);
      const reward = {
        gold: 60 + totalLevels * 12,
        wood: 18 + totalLevels * 4,
        stone: 14 + totalLevels * 3,
        essence: Math.max(1, Math.floor(totalLevels / 4)),
      };
      return {
        ...current,
        resources: {
          gold: current.resources.gold + reward.gold,
          wood: current.resources.wood + reward.wood,
          stone: current.resources.stone + reward.stone,
          essence: current.resources.essence + reward.essence,
        },
        progress: { ...current.progress, villageChestClaimed: today },
        log: [`Village chest claimed: ${reward.gold} gold, ${reward.wood} wood, ${reward.stone} stone, ${reward.essence} essence.`, ...current.log].slice(0, 12),
      };
    });
  }

  const center = (
    <AnimatePresence mode="wait">
      {game.screen === "village" ? (
        <VillageScreen key="village" buildings={game.buildings} resources={game.resources} heroes={game.heroes} progress={game.progress} now={now} quests={game.quests} questProgress={(quest) => questProgressValue(game, quest)} selectedBuilding={selectedBuilding} onSelectBuilding={setSelectedBuilding} onUpgrade={upgradeBuilding} onCollect={collectVillageSupport} onDispatch={activateWorkerDispatch} onClaimChest={claimVillageChest} onSetWorkerFocus={setWorkerFocus} onHeal={healAtChapel} onRevive={reviveAtChapel} shopUnlocked={shopUnlocked} onBuy={buyItem} />
      ) : game.screen === "inventory" ? (
        <InventoryScreen key="inventory" inventory={game.inventory} resources={game.resources} activeHero={activeHero} onEquip={equip} onUse={useConsumable} onUnequip={unequip} onUpgrade={upgradeEquipped} onCraft={craftItem} />
      ) : game.screen === "map" ? (
        <WorldMapPage key="map" progress={game.progress} quests={game.quests} questProgress={(quest) => questProgressValue(game, quest)} active={battle?.nodeId} travelingTo={travelingTo} onStart={startNode} />
      ) : game.screen === "codex" ? (
        <CodexScreen key="codex" heroes={game.heroes} buildings={game.buildings} progress={game.progress} content={codexContent} onUnlockTalent={unlockTalent} />
      ) : (
        <BattleScreen key="battle" battle={battle} node={battleNode} activeHero={activeHero} activeStats={activeStats} skills={usableSkills} enemyThinking={enemyThinking} autoAttackEnabled={autoAttackEnabled} isAutoActing={isAutoActing} onToggleAutoAttack={toggleAutoAttack} onUseSkill={useSkill} onResetBattle={resetBattle} />
      )}
    </AnimatePresence>
  );
  const clearedAreas = MAP_NODES.filter((node) => game.progress[node.id] || game.progress[`${node.id}:runs`]).length;
  const screenLabel = game.screen === "map" ? "World Map" : game.screen.charAt(0).toUpperCase() + game.screen.slice(1);
  const currentAreaName = game.screen === "battle" ? battleNode?.name || "Awaiting Battle" : screenLabel;
  const campaignProgress = `${clearedAreas}/${MAP_NODES.length} areas`;

  return (
    <main className="bg-crownfire h-dvh overflow-auto p-2 font-body text-stone-100 xl:overflow-hidden">
      <LoadingScreen loading={loading.active} tip={loading.tip} logo={ASSETS.ui.logo} background={ASSETS.ui.loading} />
      {introActive ? (
        <StoryIntroScreen page={introPage} logo={ASSETS.intro.logo} background={ASSETS.intro.background} scroll={ASSETS.intro.scroll} button={ASSETS.intro.button} onPage={setIntroPage} onBegin={finishIntro} />
      ) : (
        <section className="relative flex h-full min-h-[640px] w-full min-w-0 flex-col overflow-y-auto rounded-md border border-amber-500/25 bg-[#0c090b] p-2 shadow-blood xl:min-h-0 xl:overflow-hidden">
          <NavBar
            screen={game.screen}
            resources={game.resources}
            currentArea={currentAreaName}
            campaignProgress={campaignProgress}
            onNavigate={navigate}
            onNewCampaign={resetSave}
            onOpenParty={() => setPartyOpen((value) => !value)}
            partyOpen={partyOpen}
            partySummary={`${livingPartyCount}/${game.heroes.length}`}
            icons={ASSETS.ui}
          />
          <PartyPopover open={partyOpen} heroes={game.heroes} activeId={game.activeHeroId} buildings={game.buildings} onSelect={(heroId) => { selectHero(heroId); setPartyOpen(false); }} onClose={() => setPartyOpen(false)} />
          {center}
        </section>
      )}
    </main>
  );
}

function StoryIntroScreen({ page, logo, background, scroll, button, onPage, onBegin }) {
  const current = INTRO_STORY[page] || INTRO_STORY[0];
  const lastPage = page >= INTRO_STORY.length - 1;
  return (
    <section className="story-intro relative grid h-full min-h-[720px] overflow-hidden rounded-md border border-amber-500/25 bg-[#080607] shadow-blood">
      <div className="absolute inset-0 bg-cover bg-center opacity-95 brightness-[1.14] saturate-[1.08]" style={{ backgroundImage: `url(${background})` }} />
      <div className="ascension-embers" />
      <div className="ascension-fog" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(245,158,11,0.18),transparent_22rem),linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.46)_42%,rgba(0,0,0,0.9))]" />
      <div className="story-glow-orbit pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      <motion.div
        className="relative z-10 mx-auto grid h-full w-full max-w-6xl content-center items-center gap-3 px-4 py-5 md:gap-4 md:px-10"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="story-logo-lockup mx-auto grid place-items-center">
          <PixelImage src={logo} className="h-40 w-40 md:h-56 md:w-56" />
        </div>

        <motion.article
          key={page}
          className="story-scroll mx-auto -mt-24 grid w-full max-w-4xl place-items-center px-6 py-8 text-stone-900 md:-mt-32 md:px-12 md:py-10"
          initial={{ opacity: 0, y: 18, rotateX: -5 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.42, ease: "easeOut" }}
        >
          <PixelImage src={scroll} className="pointer-events-none absolute inset-0 h-full w-full object-contain" />
          <div className="story-scroll-copy relative z-10 mx-auto w-[min(66%,620px)] pt-1 text-center">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-red-950/65">Royal Archive Fragment {page + 1}/{INTRO_STORY.length}</p>
            <h2 className="font-display text-3xl font-black text-red-950 md:text-5xl">{current.title}</h2>
            <div className="mx-auto my-4 h-px max-w-xs bg-gradient-to-r from-transparent via-red-950/35 to-transparent" />
            <p className="story-narration mx-auto text-center font-display text-xl leading-relaxed text-[#2a120b] md:text-3xl">
              {current.text}
            </p>
          </div>
        </motion.article>

        <div className="mx-auto flex flex-wrap items-center justify-center gap-3">
          {INTRO_STORY.map((entry, index) => (
            <span
              key={entry.title}
              className={`h-2.5 rounded-full transition-all ${index === page ? "w-10 bg-amber-300 shadow-ember" : "w-2.5 bg-stone-500/60 hover:bg-amber-200"}`}
            />
          ))}
        </div>

        <div className="mx-auto flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => (lastPage ? onBegin() : onPage(Math.min(page + 1, INTRO_STORY.length - 1)))}
            className="story-command-button px-8 py-4 text-sm font-black uppercase tracking-[0.14em] text-amber-100 transition-transform hover:scale-[1.03] md:text-base"
            style={button ? { "--story-button-image": `url(${button})` } : undefined}
          >
            {lastPage ? "Begin The Journey" : "Continue"}
          </button>
          <button
            type="button"
            onClick={onBegin}
            className="story-command-button story-command-button-muted px-8 py-4 text-sm font-bold uppercase tracking-[0.12em] text-stone-200 transition-transform hover:scale-[1.03] md:text-base"
            style={button ? { "--story-button-image": `url(${button})` } : undefined}
          >
            Skip Prologue
          </button>
        </div>
      </motion.div>
    </section>
  );
}

function PartyPopover({ open, heroes, activeId, buildings, onSelect, onClose }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="absolute right-4 top-[5.25rem] z-40 w-[min(390px,calc(100%-2rem))] overflow-hidden rounded-md border border-amber-500/35 bg-[#120a0c]/95 p-3 shadow-blood backdrop-blur-md"
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
        >
          <div className="mb-3 flex items-center justify-between gap-3 border-b border-amber-500/20 pb-3">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-amber-300">Party</p>
              <h2 className="font-display text-xl text-amber-100">Crownfire Companions</h2>
            </div>
            <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-sm border border-stone-700 bg-black/35 text-stone-200 transition-colors hover:border-amber-400 hover:text-amber-100" aria-label="Close party panel">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-2">
            {heroes.map((hero) => {
              const stats = totalStats(hero, buildings);
              const selected = activeId === hero.id;
              return (
                <button
                  key={hero.id}
                  type="button"
                  onClick={() => onSelect(hero.id)}
                  className={`rounded-sm border p-2 text-left transition-colors ${
                    selected ? "border-amber-300 bg-amber-500/15" : "border-stone-700 bg-black/30 hover:border-amber-500/45"
                  }`}
                >
                  <div className="mb-2 flex min-w-0 items-center gap-3">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-sm border border-amber-500/25 bg-black/45">
                      <PixelImage src={heroSprite(hero)} className="h-10 w-10" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-display text-lg text-amber-100">{hero.name}</p>
                        <span className="shrink-0 text-xs text-amber-200">Lv {hero.level}</span>
                      </div>
                      <p className="truncate text-xs text-stone-400">{heroClassTitle(hero)}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Bar label="HP" value={hero.hp} max={stats.maxHp} tone="hp" />
                    <Bar label="MP" value={hero.mp} max={stats.maxMp} tone="mp" />
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Header() {
  return (
    <div className="mb-4 flex items-center gap-3 border-b border-amber-500/20 pb-4">
      <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-sm bg-amber-500/15 text-amber-200">
        <PixelImage src={ASSETS.ui.logo} className="h-16 w-16 object-cover" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-amber-300/80">Chronicles of</p>
        <h1 className="font-display text-2xl font-black leading-none text-amber-100">Crownfire</h1>
      </div>
    </div>
  );
}

function WorldMapPage({ progress, quests, questProgress, active, travelingTo, onStart }) {
  const firstAvailable = MAP_NODES.find((node) => !node.requires || progress[node.requires])?.id || MAP_NODES[0].id;
  const [selectedId, setSelectedId] = useState(active || firstAvailable);
  const selectedNode = MAP_NODES.find((node) => node.id === selectedId) || MAP_NODES[0];
  const locked = selectedNode.requires && !progress[selectedNode.requires];
  const cleared = clearedAreaCount(progress);
  const total = campaignNodeCount();
  const progressPercent = Math.round((cleared / Math.max(1, total)) * 100);
  const activeQuest = QUESTS.find((quest) => !quests?.[quest.id]?.completed) || QUESTS[0];
  const activeQuestProgress = questProgress ? questProgress(activeQuest) : 0;
  return (
    <motion.div className="min-h-[620px] flex-1 overflow-y-auto rounded-md border border-amber-500/20 bg-[#050506] xl:min-h-0 xl:overflow-hidden" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
      <div className="grid min-h-full grid-cols-1 gap-2 p-2 xl:h-full xl:min-h-0 xl:grid-cols-[190px_minmax(0,1fr)_270px] 2xl:grid-cols-[210px_minmax(0,1fr)_290px]">
        <aside className="flex min-h-0 flex-col gap-2 overflow-y-auto pr-1">
          <MapPanel title="Map Legend">
            {[
              ["Main Area", "maps/ruins_node", "text-amber-200"],
              ["Dungeon", "maps/catacombs_node", "text-violet-200"],
              ["Boss Area", "maps/throne_node", "text-red-200"],
              ["Locked Area", "ui_lock", "text-stone-400"],
              ["Completed", "ui_star", "text-emerald-200"],
            ].map(([label, key, color]) => (
              <div key={label} className={`flex items-center gap-2 text-xs ${color}`}>
                <PixelImage src={asset(key, ASSETS.ui.lock)} className="h-5 w-5" />
                {label}
              </div>
            ))}
          </MapPanel>
          <MapPanel title="World Progress">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full border-4 border-amber-400/80 bg-black/60 shadow-[0_0_28px_rgba(245,158,11,0.25)]">
              <div className="text-center">
                <p className="font-display text-xl text-amber-100">{progressPercent}%</p>
                <p className="text-[10px] uppercase tracking-[0.15em] text-stone-400">{cleared}/{total}</p>
              </div>
            </div>
            <p className="mt-2 text-center text-xs text-stone-400">Areas Cleared</p>
          </MapPanel>
          <MapPanel title="Active Quest">
            <div className="flex items-start gap-3">
              <PixelImage src={questIcon(activeQuest, quests?.[activeQuest.id]?.completed)} className="h-9 w-9 shrink-0" />
              <div>
                <p className="font-display text-base text-amber-100">{activeQuest.name}</p>
                <p className="mt-1 text-xs leading-4 text-stone-400">{activeQuest.objective}</p>
                <p className="mt-1.5 text-xs text-amber-200">{Math.min(activeQuest.goal, activeQuestProgress)} / {activeQuest.goal}</p>
              </div>
            </div>
          </MapPanel>
          <MapPanel title="World Events">
            <div className="rounded-sm border border-violet-500/30 bg-violet-950/25 p-2">
              <p className="text-xs text-violet-200">Next Event In</p>
              <p className="font-display text-lg text-violet-100">03:45:12</p>
            </div>
          </MapPanel>
        </aside>

        <WorldMap progress={progress} active={active} selectedId={selectedId} travelingTo={travelingTo} onSelect={setSelectedId} />

        <aside className="flex min-h-0 flex-col gap-2 overflow-y-auto pr-1">
          <MapPanel title="Region Info">
            <div className="mb-2 overflow-hidden rounded-sm border border-amber-500/20 bg-black/70">
              <img src={asset(selectedNode.backgroundKey, asset("maps/crownfire_world_map_premium"))} alt="" className="h-28 w-full object-contain [image-rendering:pixelated] 2xl:h-32" />
            </div>
            <h2 className="font-display text-xl text-amber-100 2xl:text-2xl">{selectedNode.name}</h2>
            <p className="mt-1 text-xs leading-4 text-stone-400">{selectedNode.subtitle}</p>
            <div className="mt-2 grid gap-1.5 text-xs">
              <InfoRow label="Region Level" value={`Lv. ${selectedNode.recommendedLevel}`} tone="text-emerald-300" />
              <InfoRow label="Difficulty" value={"*".repeat(selectedNode.difficulty).padEnd(3, "-")} tone="text-amber-300" />
              <InfoRow label="Enemy Type" value={selectedNode.enemyType} tone="text-red-200" />
              <InfoRow label="Battle Format" value={selectedNode.dungeon ? "Scaling Waves" : "Single Encounter"} tone="text-violet-200" />
              <InfoRow label="Status" value={locked ? "Locked" : progress[selectedNode.id] ? "Completed" : selectedNode.repeatable ? "Repeatable" : "Open"} tone={locked ? "text-stone-400" : "text-emerald-300"} />
            </div>
            <div className="mt-3">
              <p className="mb-1.5 text-xs uppercase tracking-[0.18em] text-amber-300">Enemies</p>
              <div className="grid grid-cols-5 gap-1">
                {(selectedNode.enemyPool || [selectedNode.enemy]).slice(0, 10).map((enemy) => (
                  <div key={enemy.name} title={enemy.name} className="grid aspect-square place-items-center rounded-sm border border-stone-700 bg-black/40">
                    <PixelImage src={enemyImage(enemy.asset)} className="h-7 w-7 2xl:h-8 2xl:w-8" />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3">
              <p className="mb-1.5 text-xs uppercase tracking-[0.18em] text-amber-300">Rewards</p>
              <CostLine cost={selectedNode.rewards} />
            </div>
            <button type="button" disabled={locked} onClick={() => onStart(selectedNode.id)} className="mt-3 w-full rounded-sm border-2 border-amber-100 bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-300 px-3 py-2.5 font-display text-lg font-black uppercase tracking-[0.12em] text-stone-950 shadow-[0_0_28px_rgba(251,191,36,0.58),inset_0_1px_rgba(255,255,255,0.65)] transition hover:scale-[1.015] hover:from-yellow-200 hover:via-amber-100 hover:to-orange-200 hover:shadow-[0_0_38px_rgba(251,191,36,0.78)] disabled:scale-100 disabled:border-stone-700 disabled:bg-none disabled:bg-stone-900 disabled:text-stone-500 disabled:shadow-none">
              {locked ? "Locked" : "Enter Area"}
            </button>
          </MapPanel>

          <MapPanel title="Area Completion">
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {[
                ["Story", progress[selectedNode.id] ? "100%" : "0%"],
                ["Side Quests", selectedNode.repeatable ? "Repeat" : progress[selectedNode.id] ? "75%" : "0%"],
                ["Treasures", progress[selectedNode.id] ? "60%" : "0%"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-sm border border-stone-700 bg-black/35 p-2">
                  <p className="text-stone-400">{label}</p>
                  <p className="mt-2 font-display text-lg text-amber-100">{value}</p>
                </div>
              ))}
            </div>
          </MapPanel>
        </aside>
      </div>
    </motion.div>
  );
}

function MapPanel({ title, children }) {
  return (
    <section className="rounded-md border border-amber-500/20 bg-black/55 p-2.5 shadow-[inset_0_1px_rgba(255,225,170,0.06)]">
      <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-amber-300">{title}</p>
      {children}
    </section>
  );
}

function InfoRow({ label, value, tone }) {
  return (
    <div className="flex items-center justify-between border-b border-stone-800 pb-1">
      <span className="text-stone-400">{label}</span>
      <span className={tone}>{value}</span>
    </div>
  );
}

function UpgradeQueueSummary({ upgrades, now, availableWorkers }) {
  return (
    <div className="grid gap-2 text-xs">
      <InfoRow label="Available Workers" value={`${availableWorkers} / ${VILLAGE_WORKER_SLOTS}`} tone={availableWorkers > 0 ? "text-emerald-300" : "text-amber-200"} />
      {upgrades.length ? upgrades.map((upgrade) => (
        <div key={`${upgrade.id}-${upgrade.finishAt}`} className="rounded-sm border border-sky-500/25 bg-sky-950/20 p-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-stone-300">{BUILDINGS[upgrade.id].name} Lv. {upgrade.targetLevel}</span>
            <span className="text-sky-300">{formatDuration(upgrade.finishAt - now)}</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-sm bg-black/60">
            <div className="h-full bg-gradient-to-r from-sky-600 to-amber-300" style={{ width: `${Math.min(100, Math.max(0, ((now - upgrade.startedAt) / Math.max(1, upgrade.duration)) * 100))}%` }} />
          </div>
        </div>
      )) : <p className="text-stone-400">Both builders are ready.</p>}
    </div>
  );
}

function WorldMap({ progress, active, selectedId, onSelect }) {
  return (
    <section className="relative min-h-0 overflow-hidden rounded-md border border-amber-500/15 bg-[#070607]">
      <div className="absolute inset-0">
        <PixelImage src={asset("maps/crownfire_world_map_premium", ASSETS.maps.ancientRuins)} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/35" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_0,rgba(0,0,0,0.18)_62%,rgba(0,0,0,0.46)_100%)]" />
      </div>
      <div className="relative h-full min-h-[660px]">
        {MAP_NODES.map((node, index) => {
          const locked = node.requires && !progress[node.requires];
          const completed = progress[node.id] || progress[`${node.id}:runs`];
          const selected = selectedId === node.id;
          const live = active === node.id;
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => onSelect(node.id)}
              className="absolute flex w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center transition-transform hover:scale-[1.03]"
              style={{ left: node.x, top: node.y }}
            >
              <span
                className={`relative grid h-8 w-8 place-items-center rounded-full border font-display text-sm shadow-[0_4px_14px_rgba(0,0,0,0.55)] ${
                  locked
                    ? "border-stone-700 bg-black/80 text-stone-500"
                    : selected
                      ? "border-amber-200 bg-amber-500 text-black"
                      : completed
                        ? "border-emerald-300/70 bg-emerald-950/80 text-emerald-100"
                        : node.repeatable
                          ? "border-violet-300/70 bg-violet-950/80 text-violet-100"
                          : "border-amber-400/70 bg-black/80 text-amber-100"
                }`}
              >
                {index + 1}
                {live ? <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.9)]" /> : null}
              </span>
              <span
                className={`mt-1 w-full rounded-sm border px-2 py-1 text-[10px] leading-tight shadow-[0_6px_18px_rgba(0,0,0,0.38)] backdrop-blur-[1px] ${
                  locked
                    ? "border-stone-700/65 bg-black/55 text-stone-500"
                    : selected
                      ? "border-amber-200 bg-amber-950/80 text-amber-100"
                      : completed
                        ? "border-emerald-400/40 bg-black/55 text-emerald-100"
                        : node.repeatable
                          ? "border-violet-400/40 bg-black/55 text-violet-100"
                          : "border-amber-500/35 bg-black/55 text-amber-100"
                }`}
              >
                <span className="block truncate font-display text-[12px]">{node.name}</span>
                <span className="mt-0.5 flex items-center justify-center gap-1 text-[9px] text-stone-400">
                  <PixelImage src={locked ? ASSETS.ui.lock : node.nodeIcon} className={`h-3.5 w-3.5 ${locked ? "opacity-60" : ""}`} />
                  {locked ? "Locked" : node.repeatable ? `Runs ${progress[`${node.id}:runs`] || 0}` : `Lv ${node.recommendedLevel}`}
                </span>
                <span className="mt-0.5 flex justify-center gap-0.5">
                  {Array.from({ length: 3 }).map((_, starIndex) => (
                    <PixelImage key={starIndex} src={ASSETS.ui.star} className={`h-2.5 w-2.5 ${starIndex < node.difficulty && !locked ? "" : "grayscale opacity-25"}`} />
                  ))}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function LegacyWorldMap({ progress, active, travelingTo, onStart }) {
  return (
    <section className="rounded-md border border-stone-700 bg-[#111015] p-3">
      <p className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-300">
        <PixelImage src={ASSETS.ui.map} className="h-5 w-5" /> World Map
      </p>
      <div className="relative h-[min(760px,calc(100vh-190px))] min-h-[620px] overflow-hidden rounded-sm border border-amber-500/10 bg-gradient-to-br from-black/80 via-red-950/20 to-black/80">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(251,191,36,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,.08)_1px,transparent_1px)] [background-size:36px_36px]" />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <motion.polyline
            points="15,24 12,66 28,38 46,58 60,25 66,74 34,82 50,18 72,82 84,25 80,46 91,20"
            fill="none"
            stroke="rgba(251,191,36,.32)"
            strokeWidth="0.8"
            strokeDasharray="3 2"
            animate={{ strokeDashoffset: travelingTo ? [10, 0] : 0 }}
            transition={{ repeat: travelingTo ? Infinity : 0, duration: 0.9, ease: "linear" }}
          />
        </svg>
        {MAP_NODES.map((node) => {
          const locked = node.requires && !progress[node.requires];
          return (
          <button
            key={node.id}
            type="button"
            onClick={() => onStart(node.id)}
            className={`absolute w-32 -translate-x-1/2 -translate-y-1/2 rounded-md border p-2 text-center text-[11px] transition-colors ${
              locked ? "border-stone-800 bg-black/75 text-stone-500" : active === node.id ? "border-amber-300 bg-amber-500/20" : node.repeatable ? "border-emerald-500/45 bg-emerald-950/25" : "border-stone-600 bg-black/65"
            }`}
            style={{ left: node.x, top: node.y }}
          >
            <span className="relative mx-auto mb-1 grid h-10 w-10 place-items-center rounded-full border border-amber-500/20 bg-black/50">
              <PixelImage src={locked ? ASSETS.ui.lock : node.nodeIcon} className={`h-8 w-8 ${locked ? "opacity-70" : ""}`} />
            </span>
            <span className={`block leading-tight ${progress[node.id] || progress[`${node.id}:runs`] ? "text-emerald-300" : "text-amber-100"}`}>{node.name}</span>
            <span className="mt-1 flex justify-center gap-0.5">
              {Array.from({ length: 3 }).map((_, index) => (
                <PixelImage key={index} src={ASSETS.ui.star} className={`h-3.5 w-3.5 ${index < node.difficulty && !locked ? "" : "grayscale opacity-30"}`} />
              ))}
            </span>
            <span className="mt-1 block text-[10px] text-stone-400">{node.repeatable ? `Runs ${progress[`${node.id}:runs`] || 0}` : `Lv ${node.recommendedLevel}`}</span>
            <span className="block truncate text-[10px] text-stone-500">{node.enemyType}</span>
          </button>
        );})}
      </div>
    </section>
  );
}

function CostLine({ cost }) {
  return (
    <span className="flex flex-wrap justify-end gap-1 text-[11px]">
      {Object.entries(cost).filter(([, value]) => value > 0).map(([resource, value]) => (
        <span key={resource} className="inline-flex items-center gap-0.5">
          {ASSETS.ui[resource] ? <PixelImage src={ASSETS.ui[resource]} className="h-4 w-4" /> : null}
          {value}
        </span>
      ))}
    </span>
  );
}

function KingdomPanel({ buildings, resources, onUpgrade }) {
  return (
    <section className="mb-4 rounded-md border border-amber-500/20 bg-black/25 p-3">
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-amber-300">Kingdom Panel</p>
      <div className="grid gap-2">
        {Object.entries(BUILDINGS).map(([id, building]) => {
          const level = buildings[id] || 0;
          const cost = buildingCost(id, level);
          return (
            <button key={id} type="button" data-sound="village-upgrade" onClick={() => onUpgrade(id)} disabled={level >= MAX_BUILDING_LEVEL || !canPay(resources, cost)} className="flex items-center justify-between gap-2 rounded-sm border border-stone-700 bg-black/25 px-3 py-2 text-sm transition-colors disabled:opacity-45">
              <span className="flex items-center gap-2">
                <PixelImage src={buildingAsset(id, level)} className="h-8 w-8" /> {building.name}
              </span>
              <span>{level >= MAX_BUILDING_LEVEL ? "Max" : <CostLine cost={cost} />}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function BattleScreen({
  battle,
  node,
  activeHero,
  activeStats,
  skills,
  enemyThinking,
  autoAttackEnabled,
  isAutoActing,
  onToggleAutoAttack,
  onUseSkill,
  onResetBattle,
}) {
  return (
    <BattleShell
      battle={battle}
      node={node}
      activeHero={activeHero}
      activeStats={activeStats}
      skills={skills}
      enemyThinking={enemyThinking}
      autoAttackEnabled={autoAttackEnabled}
      isAutoActing={isAutoActing}
      onToggleAutoAttack={onToggleAutoAttack}
      onUseSkill={onUseSkill}
      onResetBattle={onResetBattle}
    />
  );
}

function BattleShell({
  battle,
  node,
  activeHero,
  activeStats,
  skills,
  enemyThinking,
  autoAttackEnabled,
  isAutoActing,
  onToggleAutoAttack,
  onUseSkill,
  onResetBattle,
}) {
  const queue = turnQueue(battle, activeHero);
  const locked = !battle || battle.turn !== "player" || battle.finished || enemyThinking;
  const lowHp = activeHero.hp > 0 && activeHero.hp / Math.max(1, activeStats.maxHp) <= 0.3;

  return (
    <motion.div
      className={`crownfire-ascension relative h-[calc(100%-5.25rem)] min-h-0 overflow-y-auto rounded-lg border border-amber-500/20 bg-[#070506] p-3 shadow-blood xl:overflow-hidden ${lowHp ? "ascension-low-hp" : ""}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
    >
      <div className="ascension-embers" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(251,146,60,0.16),transparent_32rem),linear-gradient(180deg,rgba(0,0,0,0.16),rgba(18,6,4,0.82))]" />

      <div className="relative grid min-h-full gap-3 xl:h-full xl:min-h-0 xl:grid-cols-[minmax(240px,320px)_minmax(0,1fr)_minmax(250px,330px)] xl:grid-rows-[minmax(0,1fr)_auto]">
        <HeroStatusCard hero={activeHero} stats={activeStats} />

        <div className="min-h-[360px] xl:min-h-0">
          <BattleStage
            battle={battle}
            node={node}
            activeHero={activeHero}
            activeStats={activeStats}
            enemyThinking={enemyThinking}
            onResetBattle={onResetBattle}
          />
        </div>

        <EnemyStatusCard battle={battle} enemyThinking={enemyThinking} />

        <section className="ascension-panel xl:col-span-3">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/15 pb-3">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.28em] text-amber-300">Crownfire Ascension</p>
              <h2 className="truncate font-display text-xl text-amber-100">{node ? node.name : "Choose a Battlefield"}</h2>
            </div>
            <div className="flex items-center gap-2">
              {battle?.waves?.length > 1 ? (
                <span className="rounded-sm border border-violet-400/30 bg-violet-950/30 px-3 py-2 text-xs font-bold text-violet-100">
                  Wave {battle.wave}/{battle.waves.length}
                </span>
              ) : null}
              <button
                type="button"
                onClick={onResetBattle}
                className="grid h-10 w-10 place-items-center rounded-sm border border-amber-500/30 bg-black/35 text-amber-100 transition hover:border-amber-300"
                aria-label="Reset battle"
                title="Reset battle"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid gap-3 xl:grid-cols-[minmax(240px,0.9fr)_minmax(0,1.65fr)]">
            <TurnTimeline queue={queue} battle={battle} activeHero={activeHero} />
            <SkillCommandBar
              skills={skills}
              hero={activeHero}
              locked={locked}
              canToggleAuto={Boolean(battle && !battle.finished)}
              autoAttackEnabled={autoAttackEnabled}
              isAutoActing={isAutoActing}
              onToggleAutoAttack={onToggleAutoAttack}
              onUse={onUseSkill}
            />
          </div>
        </section>
      </div>
    </motion.div>
  );
}

function BattleStage({ battle, node, activeHero, activeStats, enemyThinking, onResetBattle }) {
  const enemySprite = battle ? enemyImage(battle.enemy.asset) : null;
  const isBoss = battle?.enemy.maxHp >= 220 || battle?.enemy.asset?.toLowerCase().includes("beast") || battle?.enemy.asset?.toLowerCase().includes("sovereign");
  const battleBackdrop = node?.battleBackgroundKey || node?.backgroundKey;

  return (
    <section className="ascension-stage relative h-full min-h-[360px] overflow-hidden rounded-lg">
      {battleBackdrop ? <img src={asset(battleBackdrop)} alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-85 [image-rendering:pixelated]" /> : null}
      {!battleBackdrop ? <PixelImage src={asset("maps/crownfire_world_map_premium", ASSETS.maps.ancientRuins)} className="absolute inset-0 h-full w-full object-cover opacity-35" /> : null}
      <div className="ascension-fog" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_68%,rgba(251,146,60,0.2),transparent_20rem),radial-gradient(circle_at_76%_60%,rgba(127,29,29,0.24),transparent_21rem),linear-gradient(180deg,rgba(0,0,0,0.28),rgba(0,0,0,0.08)_45%,rgba(0,0,0,0.72))]" />
      <div className="absolute inset-x-[10%] bottom-[18%] h-px bg-gradient-to-r from-transparent via-amber-200/45 to-transparent" />
      <div className="absolute inset-x-[18%] bottom-[16%] h-10 rounded-full bg-black/40 blur-xl" />

      {!battle ? (
        <div className="relative grid h-full place-items-center px-6 text-center">
          <div>
            <PixelImage src={ASSETS.ui.map} className="mx-auto h-12 w-12 opacity-85" />
            <p className="mt-4 text-xs uppercase tracking-[0.34em] text-amber-300">Awaiting Orders</p>
            <h2 className="mt-2 font-display text-4xl text-amber-100">Select An Area</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-stone-300">Open the World Map and choose a Crownfire battleground to begin the duel.</p>
          </div>
        </div>
      ) : (
        <div className="relative grid h-full min-w-0 grid-cols-[minmax(120px,1fr)_84px_minmax(120px,1fr)] items-end gap-2 px-3 pb-8 pt-5 sm:px-6 lg:px-9">
          <CharacterCombatFrame
            side="player"
            name={activeHero.name}
            subtitle={`${heroClassTitle(activeHero)} | Lv ${activeHero.level}`}
            sprite={heroSprite(activeHero)}
            hp={activeHero.hp}
            maxHp={activeStats.maxHp}
            status={activeHero.status}
            hit={battle.hitSide === "player"}
            effect={battle.skillEffect}
            floaters={battle.floaters || []}
          />

          <div className="mb-16 grid place-items-center self-center">
            <motion.div
              className="relative grid h-16 w-16 place-items-center rounded-full border border-amber-300/40 bg-black/55 font-display text-xl text-amber-100 shadow-ember"
              animate={{ scale: battle.turn === "player" ? [1, 1.06, 1] : 1 }}
              transition={{ repeat: battle.turn === "player" ? Infinity : 0, duration: 1.6 }}
            >
              <span className="absolute inset-1 rounded-full border border-red-500/20" />
              VS
            </motion.div>
            <p className="mt-3 text-center text-[10px] uppercase tracking-[0.18em] text-stone-300">{enemyThinking ? "Enemy Turn" : battle.finished ? "Resolved" : "Your Turn"}</p>
          </div>

          <CharacterCombatFrame
            side="enemy"
            name={battle.enemy.name}
            subtitle={battle.turn === "enemy" ? "Enemy Acting" : "Current Target"}
            sprite={enemySprite}
            hp={battle.enemy.hp}
            maxHp={battle.enemy.maxHp}
            status={battle.enemy.status}
            hit={battle.hitSide === "enemy"}
            effect={battle.skillEffect}
            floaters={battle.floaters || []}
            boss={isBoss}
            enemy={battle.enemy}
          />

          {battle.finished ? <BattleResultOverlay battle={battle} onContinue={onResetBattle} /> : null}
        </div>
      )}
    </section>
  );
}

function CharacterCombatFrame({ side, name, subtitle, sprite, hp, maxHp, status, hit, effect, floaters, boss = false, enemy }) {
  const isEnemy = side === "enemy";
  const defeated = hp <= 0;
  return (
    <motion.div
      className={`relative flex min-w-0 flex-col items-center ${isEnemy ? "text-right" : "text-left"}`}
      animate={hit ? { x: isEnemy ? [0, 16, -10, 0] : [0, -16, 10, 0], scale: [1, 1.04, 1] } : { y: [0, -5, 0] }}
      transition={hit ? { duration: 0.34 } : { repeat: Infinity, duration: isEnemy ? 2.35 : 2.7, ease: "easeInOut" }}
    >
      <div className={`absolute bottom-9 h-36 w-36 rounded-full blur-2xl ${isEnemy ? "bg-red-700/25" : "bg-amber-500/25"}`} />
      <div className={`ascension-aura relative grid place-items-center rounded-full border bg-black/30 p-5 ${isEnemy ? enemyAura(enemy) : "border-amber-300/35 shadow-[0_0_52px_rgba(251,146,60,0.28)]"}`}>
        <PixelImage src={sprite} className={`${boss ? "h-48 w-48 md:h-56 md:w-56" : "h-36 w-36 md:h-44 md:w-44"} object-contain ${defeated ? "grayscale opacity-55" : ""}`} />
        {hit ? <motion.div className="absolute inset-0 rounded-full bg-white/40 mix-blend-screen" initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} transition={{ duration: 0.28 }} /> : null}
        <PixelSkillEffect effect={effect} side={side} />
        <Floaters side={side} floaters={floaters} />
      </div>
      <div className={`mt-3 w-full max-w-[230px] rounded-md border bg-black/50 p-2 backdrop-blur-sm ${isEnemy ? "border-red-500/25" : "border-amber-500/25"}`}>
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className={`truncate font-display text-lg ${isEnemy ? "text-red-100" : "text-amber-100"}`}>{name}</p>
            <p className="truncate text-[10px] uppercase tracking-[0.16em] text-stone-400">{subtitle}</p>
          </div>
          <span className={`shrink-0 rounded-sm border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.12em] ${isEnemy ? "border-red-400/30 text-red-200" : "border-amber-400/30 text-amber-200"}`}>
            {isEnemy ? "Target" : "Active"}
          </span>
        </div>
        <AscensionMeter label="HP" value={hp} max={maxHp} tone="hp" compact />
        <AscensionStatusIcons status={status} compact />
      </div>
    </motion.div>
  );
}

function HeroStatusCard({ hero, stats }) {
  return (
    <aside className="ascension-panel flex min-h-0 flex-col">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.26em] text-amber-300">Active Hero</p>
          <h2 className="font-display text-3xl leading-tight text-amber-100">{hero.name}</h2>
          <p className="text-xs uppercase tracking-[0.18em] text-stone-400">{heroClassTitle(hero)} | Level {hero.level}</p>
        </div>
        <span className="rounded-sm border border-emerald-400/30 bg-emerald-950/25 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-200">Ready</span>
      </div>

      <div className="relative mb-4 grid min-h-[150px] place-items-center rounded-md border border-amber-500/20 bg-gradient-to-b from-black/25 to-red-950/20">
        <div className="absolute inset-5 rounded-full bg-amber-500/10 blur-xl" />
        <PixelImage src={heroSprite(hero)} className="relative h-36 w-36 object-contain" />
      </div>

      <div className="space-y-3">
        <AscensionMeter label="HP" value={hero.hp} max={stats.maxHp} tone="hp" />
        <AscensionMeter label="MP" value={hero.mp} max={stats.maxMp} tone="mp" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <StatRune icon="icons/icon_attack" label="ATK" value={stats.attack} />
        <StatRune icon="icons/icon_defense" label="DEF" value={stats.defense} />
        <StatRune icon="icons/icon_speed" label="SPD" value={stats.speed} />
        <StatRune icon="icons/icon_crit" label="CRIT" value={`${stats.crit}%`} />
      </div>

      <div className="mt-4 border-t border-amber-500/15 pt-3">
        <AscensionStatusIcons status={hero.status} />
      </div>
    </aside>
  );
}

function EnemyStatusCard({ battle, enemyThinking }) {
  if (!battle) {
    return (
      <aside className="ascension-panel grid min-h-[220px] place-items-center text-center">
        <div>
          <PixelImage src={ASSETS.ui.map} className="mx-auto h-10 w-10 opacity-70" />
          <p className="mt-3 text-xs uppercase tracking-[0.24em] text-amber-300">No Target</p>
          <p className="mt-2 text-sm text-stone-400">Select a map node to reveal the enemy.</p>
        </div>
      </aside>
    );
  }

  const enemy = battle.enemy;
  const phaseTwo = enemy.hp <= enemy.maxHp * 0.5;
  const elite = enemy.maxHp >= 220 || enemy.asset?.toLowerCase().includes("guardian") || enemy.asset?.toLowerCase().includes("sovereign");

  return (
    <aside className={`ascension-panel flex min-h-0 flex-col ${elite ? "border-red-400/35" : ""}`}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.26em] text-red-200">Current Target</p>
          <h2 className="truncate font-display text-2xl leading-tight text-red-100">{enemy.name}</h2>
          <p className="text-xs uppercase tracking-[0.16em] text-stone-400">{elite ? "Elite Crowned Foe" : "Cursed Enemy"}</p>
        </div>
        <span className={`shrink-0 rounded-sm border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${enemyThinking ? "border-red-300/40 bg-red-950/35 text-red-100" : "border-stone-700 bg-black/35 text-stone-300"}`}>
          {enemyThinking ? "Acting" : "Target"}
        </span>
      </div>

      <div className="relative mb-4 grid min-h-[136px] place-items-center overflow-hidden rounded-md border border-red-500/20 bg-black/35">
        <div className={`absolute inset-8 rounded-full blur-2xl ${phaseTwo ? "bg-red-600/25" : "bg-amber-500/12"}`} />
        <PixelImage src={enemyImage(enemy.asset)} className={`${elite ? "h-36 w-36" : "h-28 w-28"} relative object-contain`} />
      </div>

      <AscensionMeter label="Enemy HP" value={enemy.hp} max={enemy.maxHp} tone="hp" />
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <StatRune icon="icons/icon_attack" label="ATK" value={enemy.attack} />
        <StatRune icon="icons/icon_defense" label="DEF" value={enemy.defense} />
      </div>
      <div className="mt-4 rounded-sm border border-red-500/20 bg-red-950/15 p-3">
        <p className="text-[10px] uppercase tracking-[0.18em] text-red-200">Phase</p>
        <p className="mt-1 font-display text-lg text-amber-100">{phaseTwo ? "Crownfire Wrath" : "Opening Stance"}</p>
      </div>
      <div className="mt-4 border-t border-amber-500/15 pt-3">
        <AscensionStatusIcons status={enemy.status} />
      </div>
    </aside>
  );
}

function SkillCommandBar({ skills, hero, locked, canToggleAuto, autoAttackEnabled, isAutoActing, onToggleAutoAttack, onUse }) {
  const priority = ["attack", "sire-oath", "fire", "guard"];
  const ordered = [
    ...priority.map((id) => skills.find((skill) => skill.id === id)).filter(Boolean),
    ...skills.filter((skill) => !priority.includes(skill.id)),
  ].slice(0, 4);

  return (
    <div className="min-w-0">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.26em] text-amber-300">Skill Command</p>
          <p className="text-xs text-stone-400">Crownfire techniques and guard stances</p>
        </div>
        <AutoBattleToggle
          enabled={autoAttackEnabled}
          acting={isAutoActing}
          disabled={!canToggleAuto || !hero}
          onToggle={onToggleAutoAttack}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {ordered.map((skill) => {
          const cd = hero.cooldowns[skill.id] || 0;
          const disabled = locked || cd > 0 || hero.mp < skill.mp || hero.hp <= 0;
          const formula = `${skill.name}: ${Math.max(1, Math.round((hero.attack || 0) * skill.power))} projected power. ${skill.effect}`;
          return (
            <button
              key={skill.id}
              type="button"
              aria-label={`Use ${skill.name}`}
              title={`${formula}. MP ${skill.mp}. Cooldown ${skill.cd}.`}
              disabled={disabled}
              onClick={() => onUse(skill)}
              className={`group relative min-h-[86px] overflow-hidden rounded-md border bg-black/35 p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-45 ${
                disabled ? "border-stone-700" : "border-amber-500/30 hover:border-amber-200 hover:shadow-ember"
              }`}
            >
              <span className="absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.2),transparent_62%)]" />
              <span className="relative flex min-w-0 items-start gap-3">
                <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full border border-amber-500/25 bg-black/50">
                  <PixelImage src={asset(skill.assetKey, skill.asset)} className={`h-8 w-8 ${cd ? "grayscale" : ""}`} />
                  <span className="absolute inset-0 rounded-full border border-amber-300/15" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-base text-amber-100">{skill.name}</span>
                  <span className="mt-1 block text-xs text-stone-400">{skill.mp} MP</span>
                  {hero.mp < skill.mp ? <span className="mt-1 block text-[10px] uppercase tracking-[0.12em] text-red-200">Mana low</span> : null}
                </span>
              </span>
              <span className="absolute bottom-2 right-2 grid h-8 w-8 place-items-center rounded-full border border-amber-500/25 bg-black/55 text-xs font-bold text-amber-100">
                {cd || "R"}
              </span>
              {cd ? <span className="absolute inset-0 grid place-items-center bg-black/60 font-display text-3xl text-amber-100">{cd}</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TurnTimeline({ queue, battle, activeHero }) {
  const units = queue.length ? queue : [{ id: activeHero.id, name: activeHero.name, portrait: heroSprite(activeHero), active: true, status: activeHero.status }];
  return (
    <div className="min-w-0">
      <p className="mb-3 text-[10px] uppercase tracking-[0.26em] text-amber-300">Turn Timeline</p>
      <div className="flex min-w-0 items-center gap-3 overflow-x-auto pb-2">
        {units.slice(0, 6).map((unit, index) => {
          const active = unit.active || (battle?.turn === "player" && unit.id === activeHero.id);
          return (
            <div key={`${unit.id}-${index}`} className="flex shrink-0 items-center gap-3">
              <div className={`relative grid h-20 w-20 place-items-center rounded-full border bg-black/45 md:h-24 md:w-24 ${active ? "active-turn-glow border-amber-200" : "border-stone-700 opacity-75"}`}>
                <PixelImage src={unit.portrait} className="h-16 w-16 md:h-20 md:w-20" />
                {unit.status?.length ? (
                  <span className="absolute -bottom-1 -right-1 flex rounded-full border border-amber-500/30 bg-black/85 p-1">
                    <PixelImage src={statusIcon(unit.status[0].id)} className="h-5 w-5" />
                  </span>
                ) : null}
              </div>
              {index < units.slice(0, 6).length - 1 ? <span className="font-display text-xl text-amber-500/45">&gt;</span> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AutoBattleToggle({ enabled, acting, disabled, onToggle }) {
  return (
    <button
      type="button"
      aria-label={`Auto Battle ${enabled ? "on" : "off"}`}
      onClick={onToggle}
      disabled={disabled}
      className={`relative overflow-hidden rounded-sm border px-3 py-2 text-xs font-black uppercase tracking-[0.14em] transition disabled:opacity-45 ${
        enabled ? "auto-battle-on border-amber-200 bg-amber-500/20 text-amber-100" : "border-stone-700 bg-black/40 text-stone-300 hover:border-amber-500/60"
      }`}
    >
      {enabled ? <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(251,191,36,0.18),transparent)]" /> : null}
      <span className="relative">{enabled ? (acting ? "AUTO CASTING" : "AUTO ON") : "AUTO OFF"}</span>
    </button>
  );
}

function AscensionMeter({ label, value, max, tone, compact = false }) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  const toneClass = tone === "mp" ? "ascension-meter-fill-mp" : "ascension-meter-fill-hp";
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.14em]">
        <span className={tone === "mp" ? "text-sky-200" : "text-red-100"}>{label}</span>
        <span className="text-stone-200">{Math.max(0, Math.round(value))} / {Math.round(max)}</span>
      </div>
      <div className={`ascension-meter ${compact ? "h-2" : "h-3"}`} role="meter" aria-label={label} aria-valuenow={Math.max(0, Math.round(value))} aria-valuemin="0" aria-valuemax={Math.round(max)}>
        <motion.div className={`h-full ${toneClass}`} animate={{ width: `${pct}%` }} transition={{ duration: 0.35, ease: "easeOut" }} />
      </div>
    </div>
  );
}

function StatRune({ icon, label, value }) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-sm border border-amber-500/15 bg-black/30 px-2 py-2">
      <PixelImage src={asset(icon)} className="h-5 w-5 shrink-0" />
      <span className="min-w-0 truncate text-stone-400">{label}</span>
      <span className="ml-auto shrink-0 font-bold text-amber-100">{value}</span>
    </div>
  );
}

function AscensionStatusIcons({ status = [], compact = false }) {
  if (!status.length) return <p className={`${compact ? "mt-2 text-[10px]" : "text-xs"} text-stone-400`}>No active status effects</p>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {status.map((item) => (
        <span key={`${item.id}-${item.turns}`} title={`${item.id}: ${item.turns} turns`} className="inline-flex items-center gap-1 rounded-sm border border-amber-500/20 bg-black/40 px-1.5 py-1 text-[10px] uppercase tracking-[0.1em] text-stone-200">
          <PixelImage src={statusIcon(item.id)} className="h-4 w-4" />
          <span>{item.id}</span>
          <span className="text-amber-200">{item.turns}</span>
        </span>
      ))}
    </div>
  );
}

function BattleResultOverlay({ battle, onContinue }) {
  const victory = battle.enemy.hp <= 0;
  return (
    <motion.div className="absolute inset-0 z-30 grid place-items-center bg-black/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="w-[min(420px,90%)] rounded-md border border-amber-500/35 bg-[#10090a] p-5 text-center shadow-blood">
        <PixelImage src={victory ? asset("icons/reward_chest", ASSETS.ui.inventory) : asset("icons/dungeon_wave", ASSETS.ui.map)} className="mx-auto mb-2 h-14 w-14" />
        <p className="text-xs uppercase tracking-[0.28em] text-amber-300">{victory ? "Victory" : "Defeat"}</p>
        <h3 className="mt-2 font-display text-3xl text-amber-100">{victory ? "Enemy Vanquished" : "The Party Falls"}</h3>
        <p className="mt-3 text-sm text-stone-300">{victory ? "Rewards and progress have been claimed." : "Return to the map and recover before trying again."}</p>
        <button type="button" onClick={onContinue} className="mt-5 rounded-sm border border-amber-500/40 bg-amber-950/40 px-4 py-2 text-sm font-bold text-amber-100">
          Continue
        </button>
      </div>
    </motion.div>
  );
}

const VILLAGE_TABS = [
  { id: "overview", label: "Overview" },
  { id: "buildings", label: "Buildings" },
  { id: "workers", label: "Workers" },
  { id: "storage", label: "Storage" },
  { id: "quests", label: "Quests" },
  { id: "chest", label: "Chest" },
];

const VILLAGE_TRIVIA = [
  "Balanced gives every resource, useful when you are not sure what your next upgrade needs.",
  "Taxes are best when you need gold for Market gear, Chapel healing, or fast building upgrades.",
  "Construction helps most before upgrading Blacksmith, Barracks, Chapel, and Relic Forge.",
  "Training restores living heroes through dispatch and gives essence for talents and crafting.",
  "Upgrade the Market to unlock the village shop and improve gold support.",
  "Training Ground increases EXP gain, making repeatable Catacombs runs more valuable.",
  "Chapel upgrades make healing and reviving more reliable after difficult battles.",
  "Relic Forge improves crit damage and supports stronger equipment progression.",
];

function VillageScreen({ buildings, resources, heroes, progress, now, quests, questProgress, selectedBuilding, onSelectBuilding, onUpgrade, onCollect, onDispatch, onClaimChest, onSetWorkerFocus, onHeal, onRevive, shopUnlocked, onBuy }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [shopOpen, setShopOpen] = useState(false);
  const [dialogueBuildingId, setDialogueBuildingId] = useState(null);
  const cycle = new Date().getHours() >= 18 || new Date().getHours() < 6 ? "Night" : "Day";
  const activeBuilding = BUILDINGS[selectedBuilding];
  const activeLevel = buildings[selectedBuilding] || 0;
  const activeCost = buildingCost(selectedBuilding, activeLevel);
  const villageLevel = Math.max(1, Math.round(Object.values(buildings).reduce((sum, level) => sum + level, 0) / 2) + 1);
  const prosperity = 6250 + Object.values(buildings).reduce((sum, level) => sum + level * 180, 0);
  const today = new Date().toLocaleDateString("en-CA");
  const chestClaimed = progress?.villageChestClaimed === today;
  const workerFocus = progress?.workerFocus || "balanced";
  const supportReward = villageSupportReward(buildings, workerFocus);
  const supportClaimed = progress?.villageSupportClaimed === today;
  const dispatch = villageDispatchReward(buildings, workerFocus);
  const dispatchUsed = progress?.villageDispatchUsed === today;
  const upgrades = pendingBuildingUpgrades(progress);
  const availableWorkers = Math.max(0, VILLAGE_WORKER_SLOTS - upgrades.length);
  const fallenCount = heroes.filter((hero) => hero.hp <= 0).length;
  const woundedCount = heroes.filter((hero) => {
    const stats = totalStats(hero, buildings);
    return hero.hp > 0 && (hero.hp < stats.maxHp || hero.mp < stats.maxMp || hero.status.length > 0);
  }).length;
  const dialogue = dialogueBuildingId ? BUILDING_NPCS[dialogueBuildingId] : null;
  function selectBuildingWithDialogue(id) {
    onSelectBuilding(id);
    setDialogueBuildingId(id);
  }
  return (
    <motion.div className="min-h-[760px] overflow-y-auto rounded-md border border-amber-500/20 bg-[#050607] xl:h-[calc(100%-5.25rem)] xl:min-h-0 xl:overflow-hidden" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
      <div className="grid min-h-full grid-cols-1 gap-2 p-2 xl:h-full xl:grid-cols-[230px_minmax(0,1fr)_310px]">
        <aside className="flex min-h-0 flex-col gap-2 overflow-hidden">
          <MapPanel title="Crownfire Village">
            <div className="flex items-center gap-3">
              <PixelImage src={ASSETS.ui.logo} className="h-12 w-12" />
              <div>
                <p className="font-display text-xl text-amber-100">Lv. {villageLevel}</p>
                <p className="text-xs text-stone-400">{cycle} Kingdom Hub</p>
              </div>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-sm border border-stone-700 bg-black/50">
              <motion.div className="h-full bg-gradient-to-r from-sky-700 to-amber-300" animate={{ width: `${Math.min(100, villageLevel * 12)}%` }} />
            </div>
          </MapPanel>
          <MapPanel title="Village Effects">
            {[
              ["Gold Gain", `+${buildings.market * 4}%`],
              ["EXP Gain", `+${buildings.trainingGround * 5}%`],
              ["Hero HP", `+${buildings.barracks * 2}%`],
              ["Hero ATK", `+${buildings.blacksmith * 2}%`],
              ["Skill Power", `+${buildings.mageTower * 5}%`],
            ].map(([label, value]) => (
              <div key={label} className="mb-2 flex justify-between text-sm">
                <span className="text-stone-300">{label}</span>
                <span className="text-emerald-300">{value}</span>
              </div>
            ))}
          </MapPanel>
          <MapPanel title="Prosperity">
            <div className="mx-auto grid h-28 w-28 place-items-center rounded-full border-4 border-amber-400/70 bg-black/50 text-center">
              <div>
                <p className="font-display text-2xl text-amber-100">{prosperity.toLocaleString()}</p>
                <p className="text-xs text-emerald-300">+{Math.max(50, buildings.market * 80)} / hr</p>
              </div>
            </div>
          </MapPanel>
          <MapPanel title="Daily Support">
            <DailySupportPanel reward={supportReward} claimed={supportClaimed} onCollect={onCollect} />
          </MapPanel>
          <MapPanel title="Worker Dispatch">
            <WorkerDispatchPanel dispatch={dispatch} used={dispatchUsed} focus={workerFocus} onDispatch={onDispatch} />
          </MapPanel>
        </aside>

        <section className="relative min-h-0 overflow-hidden rounded-md border border-amber-500/20 bg-black">
          <img src={ASSETS.ui.village} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90 [image-rendering:pixelated]" />
          <div className={`absolute inset-0 ${cycle === "Night" ? "bg-blue-950/20" : "bg-amber-500/5"}`} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/55" />
          <div className="relative h-full min-h-[650px]">
            {Object.entries(BUILDINGS).map(([id, building]) => {
              const level = buildings[id] || 0;
              return (
                <button
                  key={id}
                  type="button"
                  aria-label={`${building.name}: ${buildingVisualTier(level)}`}
                  title={building.name}
                  onClick={() => selectBuildingWithDialogue(id)}
                  className="group absolute grid h-32 w-32 -translate-x-1/2 -translate-y-1/2 place-items-center border-0 bg-transparent p-0 text-center outline-none transition focus-visible:ring-2 focus-visible:ring-amber-200"
                  style={building.pos}
                >
                  <span className={`absolute inset-2 rounded-full bg-amber-300/0 blur-xl transition ${selectedBuilding === id ? "bg-amber-300/18" : "group-hover:bg-amber-300/12"}`} />
                  <PixelImage src={buildingAsset(id, level)} className={`relative h-24 w-24 object-contain drop-shadow-[0_12px_16px_rgba(0,0,0,0.75)] transition duration-200 group-hover:scale-110 md:h-28 md:w-28 ${selectedBuilding === id ? "brightness-125" : ""}`} />
                  <span className="pointer-events-none absolute top-full mt-1 max-w-36 rounded-sm border border-amber-400/30 bg-black/80 px-2 py-1 font-display text-xs uppercase tracking-[0.08em] text-amber-100 opacity-0 shadow-[0_10px_22px_rgba(0,0,0,0.5)] transition group-hover:opacity-100 group-focus-visible:opacity-100">
                    {building.name}
                  </span>
                </button>
              );
            })}
          </div>
          <NpcDialogueScene dialogue={dialogue} onClose={() => setDialogueBuildingId(null)} />
          <div className="absolute bottom-3 left-1/2 grid w-[min(760px,calc(100%-32px))] -translate-x-1/2 grid-cols-3 gap-2 rounded-md border border-amber-500/20 bg-black/65 p-2 sm:grid-cols-6">
            {VILLAGE_TABS.map((tab) => (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`flex items-center justify-center gap-2 rounded-sm border px-2 py-2 text-xs uppercase tracking-[0.1em] transition-colors ${activeTab === tab.id ? "border-amber-300 bg-amber-500/20 text-amber-100" : "border-stone-700 bg-black/30 text-stone-400 hover:border-amber-500/45 hover:text-amber-100"}`}>
                <PixelImage src={villageTabIcon(tab.id)} className="h-5 w-5 shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </div>
        </section>

        <aside className="flex min-h-0 flex-col gap-2 overflow-y-auto">
          <VillageTabContent
            tab={activeTab}
            buildings={buildings}
            resources={resources}
            heroes={heroes}
            quests={quests}
            questProgress={questProgress}
            selectedBuilding={selectedBuilding}
            activeBuilding={activeBuilding}
            activeLevel={activeLevel}
            activeCost={activeCost}
            progress={progress}
            now={now}
            upgrades={upgrades}
            availableWorkers={availableWorkers}
            woundedCount={woundedCount}
            fallenCount={fallenCount}
            chestClaimed={chestClaimed}
            workerFocus={workerFocus}
            supportReward={supportReward}
            supportClaimed={supportClaimed}
            dispatch={dispatch}
            dispatchUsed={dispatchUsed}
            onSelectBuilding={selectBuildingWithDialogue}
            onUpgrade={onUpgrade}
            onCollect={onCollect}
            onDispatch={onDispatch}
            onClaimChest={onClaimChest}
            onSetWorkerFocus={onSetWorkerFocus}
            onHeal={onHeal}
            onRevive={onRevive}
            shopUnlocked={shopUnlocked}
            onOpenShop={() => setShopOpen(true)}
          />
        </aside>
      </div>
      <ShopPanel open={shopOpen} unlocked={shopUnlocked} resources={resources} onBuy={onBuy} onClose={() => setShopOpen(false)} />
    </motion.div>
  );
}

function NpcDialogueScene({ dialogue, onClose }) {
  return (
    <AnimatePresence>
      {dialogue ? (
        <motion.div
          className="pointer-events-none absolute inset-x-4 bottom-16 z-20 flex items-end gap-3 lg:gap-5"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <motion.div
            className="hidden h-52 w-40 shrink-0 items-end justify-center overflow-hidden rounded-t-md border border-amber-500/25 border-b-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent lg:flex xl:h-64 xl:w-48"
            initial={{ x: -18, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -16, opacity: 0 }}
          >
            <PixelImage src={npcPortrait(dialogue.npc)} className="h-full w-full object-contain object-bottom drop-shadow-[0_0_18px_rgba(245,158,11,0.25)]" />
          </motion.div>

          <motion.div
            className="pointer-events-auto relative min-w-0 flex-1 rounded-sm border-2 border-amber-950 bg-[#f2cf8f] p-4 text-stone-950 shadow-[0_0_0_3px_rgba(12,8,5,0.9),0_18px_36px_rgba(0,0,0,0.55)]"
            initial={{ scale: 0.985 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.985 }}
          >
            <div className="absolute -top-8 left-4 flex min-w-44 items-center gap-2 rounded-sm border-2 border-amber-950 bg-[#3a2517] px-4 py-1.5 text-amber-100 shadow-[0_0_0_2px_rgba(12,8,5,0.9)]">
              <PixelImage src={npcPortrait(dialogue.npc)} className="h-8 w-8 rounded-sm border border-amber-500/30 bg-black/25 lg:hidden" />
              <div className="min-w-0">
                <p className="truncate font-display text-lg leading-none">{dialogue.npc}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-amber-300">{dialogue.title}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-sm border border-stone-900/30 bg-stone-950/10 text-stone-950 transition-colors hover:bg-stone-950/20"
              aria-label="Close dialogue"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="pr-9 pt-2 font-display text-xl leading-8 text-stone-950 md:text-2xl md:leading-9">{dialogue.line}</p>
            <button type="button" onClick={onClose} className="absolute bottom-3 right-4 text-stone-950" aria-label="Continue dialogue">
              <span className="block h-0 w-0 border-x-[9px] border-t-[12px] border-x-transparent border-t-stone-950" />
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function DailySupportPanel({ reward, claimed, onCollect }) {
  return (
    <div className="grid gap-2 text-sm text-stone-300">
      <CostLine cost={reward} />
      <button
        type="button"
        onClick={onCollect}
        disabled={claimed}
        className="rounded-sm border border-amber-500/40 bg-amber-950/40 px-3 py-2 text-amber-100 transition-colors hover:border-amber-300 hover:bg-amber-500/20 disabled:border-stone-700 disabled:bg-stone-950 disabled:text-stone-500"
      >
        {claimed ? "Collected Today" : "Collect All"}
      </button>
    </div>
  );
}

function WorkerDispatchPanel({ dispatch, used, focus, onDispatch }) {
  const [triviaIndex, setTriviaIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTriviaIndex((index) => (index + 1) % VILLAGE_TRIVIA.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="grid gap-2 text-sm">
      <div className="rounded-sm border border-stone-700 bg-black/30 p-2">
        <p className="font-display text-base text-amber-100">{dispatch.label}</p>
        <AnimatePresence mode="wait">
          <motion.p
            key={`${focus}-${triviaIndex}`}
            className="mt-1 min-h-12 text-xs leading-4 text-stone-400"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
          >
            Tip: {VILLAGE_TRIVIA[triviaIndex]}
          </motion.p>
        </AnimatePresence>
        <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-emerald-300">Focus: {focus}</p>
      </div>
      <CostLine cost={dispatch.reward} />
      <button
        type="button"
        onClick={onDispatch}
        disabled={used}
        className="rounded-sm border border-emerald-500/40 bg-emerald-950/35 px-3 py-2 text-emerald-100 transition-colors hover:border-emerald-300 hover:bg-emerald-500/20 disabled:border-stone-700 disabled:bg-stone-950 disabled:text-stone-500"
      >
        {used ? "Dispatch Used" : "Send Dispatch"}
      </button>
    </div>
  );
}

function VillageTabContent({ tab, buildings, resources, heroes, quests, questProgress, selectedBuilding, activeBuilding, activeLevel, activeCost, progress, now, upgrades, availableWorkers, woundedCount, fallenCount, chestClaimed, workerFocus, supportReward, supportClaimed, dispatch, dispatchUsed, onSelectBuilding, onUpgrade, onCollect, onDispatch, onClaimChest, onSetWorkerFocus, onHeal, onRevive, shopUnlocked, onOpenShop }) {
  const fallenHeroes = heroes.filter((hero) => hero.hp <= 0);
  const reviveCost = reviveFee(fallenHeroes);

  if (tab === "buildings") {
    return (
      <>
        <MapPanel title="Building Registry">
          <div className="grid gap-2">
            {Object.entries(BUILDINGS).map(([id, building]) => {
              const level = buildings[id] || 0;
              const cost = buildingCost(id, level);
              const upgrading = activeBuildingUpgrade(progress, id);
              return (
                <button key={id} type="button" onClick={() => onSelectBuilding(id)} className={`rounded-sm border p-2 text-left ${selectedBuilding === id ? "border-amber-300 bg-amber-950/45" : "border-stone-700 bg-black/30"}`}>
                  <div className="flex items-center gap-2">
                    <PixelImage src={buildingAsset(id, level)} className="h-9 w-9" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-amber-100">{building.name}</p>
                      <p className="text-xs text-stone-400">Lv {level}/{MAX_BUILDING_LEVEL} - {building.buff}</p>
                      {upgrading ? <p className="text-xs text-sky-300">Upgrading: {formatDuration(upgrading.finishAt - now)}</p> : null}
                    </div>
                  </div>
                  {level < MAX_BUILDING_LEVEL ? <div className="mt-2"><CostLine cost={cost} /></div> : <p className="mt-2 text-xs text-emerald-300">Max level reached.</p>}
                </button>
              );
            })}
          </div>
        </MapPanel>
        <MapPanel title="Upgrade Selected">
          <UpgradeQueueSummary upgrades={upgrades} now={now} availableWorkers={availableWorkers} />
          <button type="button" data-sound="village-upgrade" onClick={() => onUpgrade(selectedBuilding)} disabled={activeLevel >= MAX_BUILDING_LEVEL || activeBuildingUpgrade(progress, selectedBuilding) || availableWorkers <= 0 || !canPay(resources, activeCost)} className="mt-3 w-full rounded-sm border border-amber-500/40 bg-amber-950/40 px-3 py-3 text-sm text-amber-100 disabled:opacity-45">
            {activeBuildingUpgrade(progress, selectedBuilding) ? "Upgrade In Progress" : `Upgrade ${activeBuilding.name}`}
          </button>
        </MapPanel>
        <MapPanel title="Available Workers">
          <InfoRow label="Builder 1" value={upgrades[0] ? `${BUILDINGS[upgrades[0].id].name} ${formatDuration(upgrades[0].finishAt - now)}` : "Available"} tone={upgrades[0] ? "text-sky-300" : "text-emerald-300"} />
          <InfoRow label="Builder 2" value={upgrades[1] ? `${BUILDINGS[upgrades[1].id].name} ${formatDuration(upgrades[1].finishAt - now)}` : "Available"} tone={upgrades[1] ? "text-sky-300" : "text-emerald-300"} />
        </MapPanel>
      </>
    );
  }

  if (tab === "workers") {
    const focuses = [
      ["balanced", "Balanced", "All village systems progress evenly."],
      ["taxes", "Taxes", "+Gold focus from Market routes."],
      ["construction", "Construction", "+Wood and Stone for upgrades."],
      ["training", "Training", "+EXP support from drills."],
    ];
    return (
      <>
        <MapPanel title="Workers">
          <div className="grid gap-2">
            {focuses.map(([id, label, text]) => (
              <button key={id} type="button" onClick={() => onSetWorkerFocus(id)} className={`rounded-sm border p-3 text-left ${workerFocus === id ? "border-amber-300 bg-amber-950/45 text-amber-100" : "border-stone-700 bg-black/30 text-stone-300"}`}>
                <p className="font-display text-base">{label}</p>
                <p className="mt-1 text-xs text-stone-400">{text}</p>
              </button>
            ))}
          </div>
        </MapPanel>
        <MapPanel title="Population">
          <InfoRow label="Village Workers" value={`${availableWorkers} / ${VILLAGE_WORKER_SLOTS} available`} tone={availableWorkers > 0 ? "text-emerald-300" : "text-amber-200"} />
          <InfoRow label="Current Focus" value={workerFocus} tone="text-emerald-300" />
        </MapPanel>
        <MapPanel title="Upgrade Queue">
          <UpgradeQueueSummary upgrades={upgrades} now={now} availableWorkers={availableWorkers} />
        </MapPanel>
      </>
    );
  }

  if (tab === "storage") {
    return (
      <>
        <MapPanel title="Storage">
          <div className="grid gap-2">
            {Object.entries(resources).map(([resource, value]) => (
              <div key={resource} className="rounded-sm border border-stone-700 bg-black/30 p-2">
                <InfoRow label={resource} value={value.toLocaleString()} tone="text-amber-200" />
                <div className="mt-2 h-2 overflow-hidden rounded-sm bg-black/60">
                  <div className="h-full bg-gradient-to-r from-amber-700 to-amber-200" style={{ width: `${Math.min(100, value / 30)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </MapPanel>
        <MapPanel title="Daily Support">
          <DailySupportPanel reward={supportReward} claimed={supportClaimed} onCollect={onCollect} />
        </MapPanel>
        <MapPanel title="Worker Dispatch">
          <WorkerDispatchPanel dispatch={dispatch} used={dispatchUsed} focus={workerFocus} onDispatch={onDispatch} />
        </MapPanel>
      </>
    );
  }

  if (tab === "quests") {
    return (
      <MapPanel title="Village Quests">
        <div className="grid gap-2">
          {QUESTS.map((quest) => {
            const completed = quests?.[quest.id]?.completed;
            const progress = questProgress ? questProgress(quest) : 0;
            return (
              <div key={quest.id} className={`rounded-sm border p-2 ${completed ? "border-emerald-400/45 bg-emerald-950/20" : "border-stone-700 bg-black/30"}`}>
                <div className="flex items-start gap-2">
                  <PixelImage src={questIcon(quest, completed)} className="h-9 w-9" />
                  <div>
                    <p className="text-sm text-amber-100">{quest.name}</p>
                    <p className="text-xs text-stone-400">{quest.objective}</p>
                    <p className="mt-1 text-xs text-amber-200">{Math.min(quest.goal, progress)} / {quest.goal}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </MapPanel>
    );
  }

  if (tab === "chest") {
    return (
      <>
        <MapPanel title="Village Chest">
          <PixelImage src={villageTabIcon("chest")} className="mx-auto h-24 w-24" />
          <div className="mt-3 h-3 overflow-hidden rounded-sm border border-stone-700 bg-black/50">
            <div className={`h-full bg-gradient-to-r ${chestClaimed ? "from-stone-700 to-stone-500" : "from-emerald-700 to-amber-300"}`} style={{ width: chestClaimed ? "100%" : "86%" }} />
          </div>
          <p className="mt-2 text-sm text-stone-300">{chestClaimed ? "Today's chest has been claimed." : "Village support chest is ready."}</p>
          <button type="button" onClick={onClaimChest} disabled={chestClaimed} className="mt-3 w-full rounded-sm border border-amber-500/40 bg-amber-950/40 px-3 py-3 text-sm text-amber-100 disabled:opacity-45">
            Claim Chest
          </button>
        </MapPanel>
        <MapPanel title="Available Workers">
          <InfoRow label="Builder 1" value={upgrades[0] ? `${BUILDINGS[upgrades[0].id].name} ${formatDuration(upgrades[0].finishAt - now)}` : "Available"} tone={upgrades[0] ? "text-sky-300" : "text-emerald-300"} />
          <InfoRow label="Builder 2" value={upgrades[1] ? `${BUILDINGS[upgrades[1].id].name} ${formatDuration(upgrades[1].finishAt - now)}` : "Available"} tone={upgrades[1] ? "text-sky-300" : "text-emerald-300"} />
        </MapPanel>
      </>
    );
  }

  return (
    <>
      <MapPanel title="Upgrade Focus">
        <div className="flex items-center gap-3">
          <PixelImage src={buildingAsset(selectedBuilding, activeLevel)} className="h-16 w-16 object-contain" />
          <div>
            <p className="font-display text-xl text-amber-100">{activeBuilding.name}</p>
            <p className="text-xs text-stone-400">{activeBuilding.buff}</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-stone-300">Level {activeLevel}/{MAX_BUILDING_LEVEL}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-amber-300">{buildingVisualTier(activeLevel)}</p>
        {activeBuildingUpgrade(progress, selectedBuilding) ? (
          <p className="mt-2 text-xs text-sky-300">Upgrade completes in {formatDuration(activeBuildingUpgrade(progress, selectedBuilding).finishAt - now)}</p>
        ) : (
          <p className="mt-2 text-xs text-stone-400">Upgrade time: {formatDuration(buildingUpgradeDuration(activeLevel))}</p>
        )}
        <div className="mt-3 rounded-sm border border-stone-700 bg-black/35 p-2">
          <p className="mb-1 text-xs uppercase tracking-[0.18em] text-amber-300">Upgrade Cost</p>
          <CostLine cost={activeCost} />
        </div>
        <button type="button" data-sound="village-upgrade" onClick={() => onUpgrade(selectedBuilding)} disabled={activeLevel >= MAX_BUILDING_LEVEL || activeBuildingUpgrade(progress, selectedBuilding) || availableWorkers <= 0 || !canPay(resources, activeCost)} className="mt-3 w-full rounded-sm border border-amber-500/40 bg-amber-950/40 px-3 py-3 text-sm text-amber-100 disabled:opacity-45">
          {activeBuildingUpgrade(progress, selectedBuilding) ? "Upgrade In Progress" : availableWorkers <= 0 ? "Workers Busy" : "Start Upgrade"}
        </button>
        {selectedBuilding === "market" ? (
          <button type="button" onClick={onOpenShop} disabled={!shopUnlocked} className="mt-2 w-full rounded-sm border border-emerald-500/40 bg-emerald-950/35 px-3 py-3 text-sm text-emerald-100 disabled:border-stone-700 disabled:text-stone-500 disabled:opacity-55">
            {shopUnlocked ? "Open Shop" : "Market Lv. 1 Required"}
          </button>
        ) : null}
      </MapPanel>

      <MapPanel title="Chapel Support">
        <p className="text-sm text-stone-300">Living wounded: {woundedCount}. Fallen heroes: {fallenCount}.</p>
        {fallenCount > 0 ? (
          <div className="mt-2 rounded-sm border border-stone-700 bg-black/35 p-2">
            <p className="mb-1 text-xs uppercase tracking-[0.18em] text-amber-300">Revive Fee</p>
            <CostLine cost={reviveCost} />
            <div className="mt-2 space-y-1 border-t border-stone-800 pt-2">
              {fallenHeroes.map((hero) => (
                <p key={hero.id} className="flex justify-between gap-2 text-xs text-stone-400">
                  <span>{hero.name} Lv {hero.level}</span>
                  <span className="text-amber-200">{heroReviveGoldCost(hero)}g</span>
                </p>
              ))}
            </div>
          </div>
        ) : null}
        <div className="mt-3 grid gap-2">
          <button type="button" onClick={onHeal} className="flex items-center gap-3 rounded-sm border border-amber-500/35 bg-amber-950/35 p-2 text-left text-amber-100">
            <PixelImage src={asset("icons/chapel_heal_party", ASSETS.skills.radiant)} className="h-10 w-10" />
            <span><span className="block font-display">Heal Party</span><span className="text-xs text-stone-400">Restore HP, MP, and cleanse effects.</span></span>
          </button>
          <button type="button" onClick={onRevive} className="flex items-center gap-3 rounded-sm border border-amber-500/35 bg-amber-950/35 p-2 text-left text-amber-100">
            <PixelImage src={asset("icons/chapel_revive_party", ASSETS.skills.radiant)} className="h-10 w-10" />
            <span><span className="block font-display">Revive Party</span><span className="text-xs text-stone-400">Bring fallen heroes back to battle.</span></span>
          </button>
        </div>
      </MapPanel>

      <MapPanel title="Village Chest">
        <div className="h-3 overflow-hidden rounded-sm border border-stone-700 bg-black/50">
          <div className={`h-full bg-gradient-to-r ${chestClaimed ? "from-stone-700 to-stone-500" : "from-emerald-700 to-amber-300"}`} style={{ width: chestClaimed ? "100%" : "68%" }} />
        </div>
        <p className="mt-2 text-xs text-stone-400">{chestClaimed ? "Chest claimed today." : "68 / 100 support supplies gathered."}</p>
      </MapPanel>
      <MapPanel title="Available Workers">
        <InfoRow label="Builder 1" value={upgrades[0] ? `${BUILDINGS[upgrades[0].id].name} ${formatDuration(upgrades[0].finishAt - now)}` : "Available"} tone={upgrades[0] ? "text-sky-300" : "text-emerald-300"} />
        <InfoRow label="Builder 2" value={upgrades[1] ? `${BUILDINGS[upgrades[1].id].name} ${formatDuration(upgrades[1].finishAt - now)}` : "Available"} tone={upgrades[1] ? "text-sky-300" : "text-emerald-300"} />
      </MapPanel>
    </>
  );
}

function ShopPanel({ open, unlocked, resources, onBuy, onClose }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-40 grid place-items-center bg-black/70 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
          <motion.section
            className="relative flex max-h-[min(780px,calc(100vh-48px))] w-[min(980px,calc(100vw-48px))] flex-col overflow-hidden rounded-md border border-amber-500/35 bg-[#10090a] shadow-blood"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-amber-500/20 bg-black/35 p-4">
              <div className="flex min-w-0 items-center gap-3">
                <PixelImage src={ASSETS.buildings.market} className="h-14 w-14 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.24em] text-amber-300">Crownfire Market</p>
                  <h3 className="truncate font-display text-3xl text-amber-100">Village Shop</h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-sm border border-amber-500/30 bg-amber-950/25 px-3 py-2 text-sm text-amber-100">Gold {resources.gold}</div>
                <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-sm border border-stone-700 bg-black/35 text-stone-200 hover:border-amber-400 hover:text-amber-100">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {!unlocked ? (
              <div className="m-4 rounded-sm border border-red-500/35 bg-red-950/30 p-3 text-sm text-red-100">
                Upgrade the Market to level 1 to unlock buying.
              </div>
            ) : null}

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-3">
                {ITEMS.map((item) => {
                  const affordable = unlocked && resources.gold >= item.price;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={!affordable}
                      onClick={() => onBuy(item.id)}
                      className={`group min-h-36 rounded-md border p-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${rarityClass(item.rarity)} hover:border-amber-300 hover:bg-amber-950/25`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-sm border border-black/40 bg-black/35">
                          <PixelImage src={item.asset} className="h-11 w-11" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-display text-lg text-amber-100">{item.name}</p>
                          <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-stone-400">{item.rarity} {item.slot || item.type}</p>
                        </div>
                      </div>
                      <p className="mt-3 min-h-8 text-xs leading-4 text-stone-300">{itemSummary(item)}</p>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-amber-200">{item.price}g</span>
                        <span className={`rounded-sm border px-2 py-1 text-xs ${affordable ? "border-emerald-500/40 bg-emerald-950/35 text-emerald-100" : "border-stone-700 bg-black/35 text-stone-500"}`}>
                          {affordable ? "Buy" : "Locked"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function CodexScreen({ heroes, buildings, progress, content, onUnlockTalent }) {
  const {
    BOSS_MECHANICS,
    CAMPAIGN_CHAPTERS,
    CLASS_EVOLUTIONS,
    COMBO_ATTACKS,
    LOOT_TIERS,
    MUSIC_ATMOSPHERES,
    NPC_DIALOGUE,
    PIXEL_ART_ASSET_LIST,
    PROGRESSION_BALANCE,
    SIDE_QUESTS,
    SKILL_TREES,
    SOUND_EFFECTS,
    WORLD_LORE,
  } = content || EMPTY_CODEX_CONTENT;
  const cleared = clearedAreaCount(progress);
  return (
    <motion.div className="h-[calc(100%-5.25rem)] overflow-y-auto pr-1" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
      <div className="mb-4 flex items-start justify-between gap-4 rounded-md border border-amber-500/20 bg-black/30 p-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-amber-300">Crownfire Codex</p>
          <h2 className="font-display text-3xl font-black text-amber-100">Commercial Game Blueprint</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-300">{WORLD_LORE.premise}</p>
          {!content ? <p className="mt-2 text-xs uppercase tracking-[0.18em] text-amber-300">Restoring Codex archive...</p> : null}
        </div>
        <div className="rounded-sm border border-amber-500/25 bg-amber-950/20 px-3 py-2 text-right text-xs text-stone-300">
          <p className="uppercase tracking-[0.18em] text-amber-300">Campaign</p>
          <p>{cleared}/{campaignNodeCount()} routes cleared</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        <CodexCard title="Main Story" items={CAMPAIGN_CHAPTERS.map((chapter) => `Act ${chapter.act}: ${chapter.title} - ${chapter.reveal}`)} />
        <FactionCodex factions={WORLD_LORE.factions} />
        <CodexCard title="Side Quests" items={SIDE_QUESTS.map((quest) => `${quest.name}: ${quest.objective}`)} />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-4">
        {heroes.map((hero) => {
          const path = CLASS_EVOLUTIONS[hero.id] || [hero.name];
          return (
            <section key={hero.id} className="stone-panel rounded-md p-4">
              <div className="flex items-center gap-3">
                <PixelImage src={heroSprite(hero)} className="h-12 w-12" />
                <div>
                  <p className="font-display text-lg text-amber-100">{hero.name}</p>
                  <p className="text-xs uppercase tracking-[0.14em] text-stone-400">{path.join(" > ")}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-stone-300">Relationship {hero.relationship || 0}/100 | Skill Points {hero.skillPoints || 0}</p>
              <div className="mt-3 space-y-2">
                {(HERO_TALENTS[hero.id] || []).map((node) => {
                  const unlocked = (hero.talents || []).includes(node.id);
                  return (
                  <div key={node.id} className={`rounded-sm border p-2 text-xs ${unlocked ? "border-emerald-400/50 bg-emerald-950/20" : "border-stone-700 bg-black/25"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 items-start gap-2">
                        <PixelImage src={talentIcon(node.id)} className="h-9 w-9 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-amber-200">Tier {node.tier}: {node.name}</p>
                          <p className="mt-1 text-stone-400">{node.text}</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => onUnlockTalent(hero.id, node.id)} disabled={unlocked || (hero.skillPoints || 0) < node.cost} className="shrink-0 rounded-sm border border-amber-500/35 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-amber-100 disabled:opacity-40">
                        {unlocked ? "Unlocked" : `${node.cost} SP`}
                      </button>
                    </div>
                  </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-3">
        <CodexCard title="Combo Attacks" items={COMBO_ATTACKS.map((combo) => `${combo.name}: ${combo.heroes.join(" + ")} - ${combo.effect}`)} />
        <CodexCard title="Boss Mechanics" items={BOSS_MECHANICS.map((boss) => `${boss.name}: ${boss.phase} - ${boss.mechanic}`)} />
        <NpcDialogueCard entries={NPC_DIALOGUE} />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-3">
        <CodexCard title="Loot Tiers" items={LOOT_TIERS.map((tier) => `${tier.rarity}: ${tier.target}`)} />
        <CodexCard title="Audio SFX" items={SOUND_EFFECTS} />
        <CodexCard title="Music Atmosphere" items={MUSIC_ATMOSPHERES.map((track) => `${track.scene}: ${track.mood}`)} />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-3">
        <CodexCard title="Pixel Art Roadmap" items={PIXEL_ART_ASSET_LIST} />
        <CodexCard title="Progression Balance" items={[PROGRESSION_BALANCE.sessionLength, PROGRESSION_BALANCE.earlyGame, PROGRESSION_BALANCE.midGame, PROGRESSION_BALANCE.lateGame, ...PROGRESSION_BALANCE.formulae]} />
        <CodexCard title="Skill Trees" items={Object.entries(SKILL_TREES).map(([hero, tree]) => `${hero}: ${tree.map((node) => node.name).join(" > ")}`)} />
        <CodexCard title="Village Systems" items={Object.entries(BUILDINGS).map(([id, building]) => {
          const level = buildings[id] || 0;
          return `${building.name}: Lv ${level}/${MAX_BUILDING_LEVEL} - ${building.buff}. Village map art is image-first and borderless; hover the building for its name. Current visual: ${buildingVisualTier(level)}.`;
        })} />
      </div>
    </motion.div>
  );
}

function FactionCodex({ factions }) {
  return (
    <section className="stone-panel min-h-0 rounded-md p-4">
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-amber-300">Factions</p>
      <div className="grid gap-2">
        {factions.map((faction) => (
          <div key={faction.name} className="flex min-w-0 items-start gap-3 rounded-sm border border-stone-800 bg-black/25 p-2">
            <PixelImage src={factionIcon(faction.name)} className="h-12 w-12 shrink-0" />
            <div className="min-w-0">
              <p className="truncate text-sm text-amber-100">{faction.name}</p>
              <p className="text-[10px] uppercase tracking-[0.14em] text-stone-500">{faction.element}</p>
              <p className="mt-1 text-xs leading-5 text-stone-300">{faction.motive}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function NpcDialogueCard({ entries }) {
  return (
    <section className="stone-panel min-h-0 rounded-md p-4">
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-amber-300">NPC Dialogue</p>
      <div className="space-y-2">
        {entries.map((entry) => (
          <div key={`${entry.npc}-${entry.location}`} className="flex min-w-0 gap-3 rounded-sm border border-stone-800 bg-black/25 p-2">
            <PixelImage src={npcPortrait(entry.npc)} className="h-14 w-14 shrink-0 rounded-sm border border-amber-500/25 bg-black/35" />
            <div className="min-w-0">
              <p className="truncate text-sm text-amber-100">{entry.npc}</p>
              <p className="text-[10px] uppercase tracking-[0.14em] text-stone-500">{entry.location}</p>
              <p className="mt-1 text-xs leading-5 text-stone-300">&quot;{entry.line}&quot;</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CodexCard({ title, items }) {
  return (
    <section className="stone-panel min-h-0 rounded-md p-4">
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-amber-300">{title}</p>
      <div className="space-y-2">
        {items.map((item) => (
          <p key={item} className="rounded-sm border border-stone-800 bg-black/25 p-2 text-xs leading-5 text-stone-300">{item}</p>
        ))}
      </div>
    </section>
  );
}

function InventoryScreen({ inventory, resources, activeHero, onEquip, onUse, onUnequip, onUpgrade, onCraft }) {
  return (
    <motion.div className="h-[calc(100%-5.25rem)] overflow-y-auto" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
      <div className="mb-4 flex items-center gap-3">
        <PixelImage src={ASSETS.ui.inventory} className="h-10 w-10" />
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Inventory</p>
          <h2 className="font-display text-3xl font-black text-amber-100">Armory and Satchel</h2>
        </div>
      </div>
      <HeroEquipment hero={activeHero} onUnequip={onUnequip} onUpgrade={onUpgrade} resources={resources} />
      <CraftingPanel resources={resources} onCraft={onCraft} />
      <InventoryGrid inventory={inventory} activeHero={activeHero} onEquip={onEquip} onUse={onUse} tall />
    </motion.div>
  );
}

function PixelSkillEffect({ effect, side }) {
  if (!effect || effect.side !== side) return null;
  return (
    <motion.div
      key={effect.id}
      className="pointer-events-none absolute inset-0 z-20 grid place-items-center"
      initial={{ opacity: 0, scale: 0.55, rotate: side === "enemy" ? -16 : 10 }}
      animate={{ opacity: [0, 1, 0], scale: [0.55, 1.18, 1.45], rotate: side === "enemy" ? [-16, 8, 18] : [10, -8, -18] }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <PixelImage src={effectSprite(effect.type)} className="h-32 w-32 object-contain mix-blend-screen drop-shadow-[0_0_18px_rgba(251,191,36,0.5)]" />
    </motion.div>
  );
}

function Floaters({ side, floaters }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <AnimatePresence>
        {floaters.filter((floater) => floater.side === side).map((floater, index) => (
          <motion.span
            key={floater.id}
            initial={{ opacity: 0, y: 18, scale: 0.82, filter: "blur(1px)" }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: [18, -18 - index * 8, -48 - index * 10, -70 - index * 12],
              scale: floater.tone === "crit" ? [0.9, 1.55, 1.42, 1.25] : [0.85, 1.18, 1.12, 1],
              filter: ["blur(1px)", "blur(0px)", "blur(0px)", "blur(2px)"],
            }}
            exit={{ opacity: 0, y: -82 - index * 10, scale: 0.95, transition: { duration: 0.16 } }}
            transition={{ duration: floater.tone === "crit" ? 1.05 : 0.9, ease: "easeOut", times: [0, 0.18, 0.72, 1] }}
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 whitespace-nowrap rounded-sm px-2 py-1 font-display ${floater.tone === "crit" ? "text-3xl text-red-200 drop-shadow-[0_0_10px_rgba(248,113,113,0.8)]" : "text-xl"} font-black ${floater.tone === "heal" ? "text-emerald-200" : floater.tone === "crit" ? "" : "text-amber-100"}`}
          >
            {floater.text}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}

function HeroEquipment({ hero, onUnequip, onUpgrade, resources }) {
  return (
    <section className="stone-panel mb-4 rounded-md p-4">
      <p className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-300">
        <PixelImage src={asset("icons/upgrade_hammer", ASSETS.buildings.blacksmith)} className="h-7 w-7" />
        {hero.name}'s Equipment
      </p>
      <div className="grid grid-cols-5 gap-2 text-sm">
        {["weapon", "armor", "relic", "ring", "artifact"].map((slot) => {
          const item = itemById(hero.equipment?.[slot]);
          const level = hero.equipmentLevels?.[slot] || 0;
          const cost = equipmentUpgradeCost(level);
          const canUpgrade = item && level < 5 && canPay(resources, cost);
          return (
            <div key={slot} className="rounded-sm border border-stone-700 bg-black/25 p-3 text-left">
              {item ? <PixelImage src={item.asset} className="mb-2 h-8 w-8" /> : null}
              <p className="capitalize text-amber-100">{slot}: {item?.name || "None"}</p>
              {item ? <p className="mt-1 text-xs text-stone-400">Upgrade +{level}/5</p> : <p className="mt-1 text-xs text-stone-500">Empty slot</p>}
              {item ? (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button type="button" data-sound="equipment-upgrade" onClick={() => onUpgrade(slot)} disabled={!canUpgrade} className="rounded-sm border border-amber-500/35 px-2 py-1 text-xs text-amber-100 disabled:opacity-40">
                    + Forge
                  </button>
                  <button type="button" onClick={() => onUnequip(slot)} className="rounded-sm border border-stone-600 px-2 py-1 text-xs text-stone-200">
                    Unequip
                  </button>
                </div>
              ) : null}
              {item && level < 5 ? <div className="mt-2"><CostLine cost={cost} /></div> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CraftingPanel({ resources, onCraft }) {
  return (
    <section className="stone-panel mb-4 rounded-md p-4">
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-amber-300">Crafting</p>
      <div className="grid grid-cols-4 gap-2">
        {CRAFTING_RECIPES.map((recipe) => {
          const item = itemById(recipe.itemId);
          return (
            <button key={recipe.id} type="button" onClick={() => onCraft(recipe.id)} disabled={!canPay(resources, recipe.cost)} className="rounded-sm border border-stone-700 bg-black/25 p-3 text-left transition-colors hover:border-amber-400 disabled:opacity-45">
              <PixelImage src={item.asset} className="h-9 w-9" />
              <p className="mt-2 truncate text-sm text-amber-100">{recipe.name}</p>
              <p className="text-xs text-stone-400">{item.name}</p>
              <CostLine cost={recipe.cost} />
            </button>
          );
        })}
      </div>
    </section>
  );
}

function InventoryPanel({ inventory, activeHero, onEquip, onUse }) {
  return (
    <section className="stone-panel rounded-md p-4">
      <p className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-300">
        <PixelImage src={ASSETS.ui.inventory} className="h-5 w-5" /> Inventory
      </p>
      <InventoryGrid inventory={inventory} activeHero={activeHero} onEquip={onEquip} onUse={onUse} compact />
    </section>
  );
}

function InventoryGrid({ inventory, activeHero, onEquip, onUse, compact = false, tall = false }) {
  return (
    <div className={`${compact ? "max-h-40 grid-cols-2" : tall ? "max-h-[480px] grid-cols-6" : "grid-cols-4"} grid gap-2 overflow-y-auto`}>
      {inventory.length === 0 ? <p className="text-sm text-stone-500">Win battles or buy from the Market to fill the satchel.</p> : null}
      {inventory.map((entry) => {
        const item = itemById(entry.itemId);
        if (!item) return null;
        const action = item.type === "equipment" ? () => onEquip(entry.uid, activeHero.id) : () => onUse(entry.uid);
        return (
          <button key={entry.uid} type="button" title={`${item.name} (${item.rarity})`} onClick={action} className={`relative grid aspect-square place-items-center rounded-sm border p-1 text-xs transition hover:border-amber-300 ${rarityClass(item.rarity)}`}>
            <PixelImage src={item.asset} className={compact ? "h-8 w-8" : "h-10 w-10"} />
            <span className="absolute bottom-1 left-1 right-1 truncate text-[10px]">{compact ? item.slot || "use" : item.name}</span>
          </button>
        );
      })}
    </div>
  );
}

function BattleLog({ log }) {
  return (
    <section className="stone-panel min-h-0 flex-1 rounded-md p-4">
      <p className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-300">
        <PixelImage src={ASSETS.ui.quest} className="h-5 w-5" /> Battle Log
      </p>
      <div className="max-h-full space-y-2 overflow-y-auto">
        {log.map((entry, index) => (
          <p key={`${entry}-${index}`} className={`rounded-sm border px-3 py-2 text-sm ${index === 0 ? "border-amber-500/30 bg-amber-950/25 text-amber-100" : "border-stone-700 bg-black/25 text-stone-300"}`}>
            {entry}
          </p>
        ))}
      </div>
    </section>
  );
}

export default App;
