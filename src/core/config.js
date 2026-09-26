const STORAGE_KEY = 'poketaka-automation:config';
  const STATE_KEY = 'poketaka-automation:state';

  const DEFAULT_CONFIG = {
    enabled: false,
    intervalMs: 15000,
    jitterMs: 3500,
    autoClaimExpeditions: true,
    autoStartExpeditions: true,
    autoHeal: true,
    autoHarvest: true,
    autoIncubatorClaim: true,
    autoBreedingClaim: true,
    autoProgression: true,
    strategy: 'progression',
    minSuccessChance: 55,
    avoidLongLowValue: true,
    smartTeam: true,
    minTeamHpPercent: 45,
    maxRecommendedLevelDeficit: 2,
    rosterCacheMinutes: 30,
    missionBlockMinutes: 20,
    autoCapture: false,
    smartCapture: true,
    captureNewSpecies: true,
    captureRare: true,
    captureUnknownEncounters: false,
    minCaptureIvScore: 80,
    minBallReserve: 3,
    autoPlant: false,
    panelCollapsed: false,
    debug: true,
  };

  const MODULES = [
    { id: 'expeditions', label: 'Expéditions', keywords: ['expedition', 'expeditions', 'exploration'] },
    { id: 'healing', label: 'Soins', keywords: ['centre pokemon', 'pokemon center', 'soins', 'heal'] },
    { id: 'greenhouse', label: 'Serre', keywords: ['serre', 'greenhouse'] },
    { id: 'incubator', label: 'Incubateur', keywords: ['incubateur', 'incubator', 'oeufs', 'eggs', 'fossiles', 'fossils'] },
    { id: 'breeding', label: 'Pension', keywords: ['pension', 'daycare', 'elevage', 'breeding'] },
    { id: 'progression', label: 'Progression', keywords: ['arene', 'gym', 'ligue', 'league'] },
  ];

  const UNSAFE_WORDS = [
    'acheter', 'buy', 'purchase',
    'vendre', 'sell',
    'liberer', 'release',
    'supprimer', 'delete',
    'echanger', 'trade',
    'abandonner', 'abandon',
  ];

  const TYPE_CHART = {
    normal: { roche: 0.5, rock: 0.5, acier: 0.5, steel: 0.5, spectre: 0, ghost: 0 },
    feu: { plante: 2, grass: 2, glace: 2, ice: 2, insecte: 2, bug: 2, acier: 2, steel: 2, feu: 0.5, eau: 0.5, water: 0.5, roche: 0.5, rock: 0.5, dragon: 0.5 },
    eau: { feu: 2, sol: 2, ground: 2, roche: 2, rock: 2, eau: 0.5, plante: 0.5, grass: 0.5, dragon: 0.5 },
    electrik: { eau: 2, water: 2, vol: 2, flying: 2, electrik: 0.5, plante: 0.5, grass: 0.5, dragon: 0.5, sol: 0, ground: 0 },
    plante: { eau: 2, water: 2, sol: 2, ground: 2, roche: 2, rock: 2, feu: 0.5, plante: 0.5, poison: 0.5, vol: 0.5, flying: 0.5, insecte: 0.5, bug: 0.5, dragon: 0.5, acier: 0.5, steel: 0.5 },
    glace: { plante: 2, grass: 2, sol: 2, ground: 2, vol: 2, flying: 2, dragon: 2, feu: 0.5, eau: 0.5, water: 0.5, glace: 0.5, acier: 0.5, steel: 0.5 },
    combat: { normal: 2, glace: 2, roche: 2, rock: 2, tenebres: 2, dark: 2, acier: 2, steel: 2, poison: 0.5, vol: 0.5, flying: 0.5, psy: 0.5, psychic: 0.5, insecte: 0.5, bug: 0.5, fee: 0.5, fairy: 0.5, spectre: 0, ghost: 0 },
    poison: { plante: 2, grass: 2, fee: 2, fairy: 2, poison: 0.5, sol: 0.5, ground: 0.5, roche: 0.5, rock: 0.5, spectre: 0.5, ghost: 0.5, acier: 0, steel: 0 },
    sol: { feu: 2, electrik: 2, poison: 2, roche: 2, rock: 2, acier: 2, steel: 2, plante: 0.5, grass: 0.5, insecte: 0.5, bug: 0.5, vol: 0, flying: 0 },
    vol: { plante: 2, grass: 2, combat: 2, insecte: 2, bug: 2, electrik: 0.5, roche: 0.5, rock: 0.5, acier: 0.5, steel: 0.5 },
    psy: { combat: 2, poison: 2, psy: 0.5, psychic: 0.5, acier: 0.5, steel: 0.5, tenebres: 0, dark: 0 },
    insecte: { plante: 2, grass: 2, psy: 2, psychic: 2, tenebres: 2, dark: 2, feu: 0.5, combat: 0.5, poison: 0.5, vol: 0.5, flying: 0.5, spectre: 0.5, ghost: 0.5, acier: 0.5, steel: 0.5, fee: 0.5, fairy: 0.5 },
    roche: { feu: 2, glace: 2, vol: 2, flying: 2, insecte: 2, bug: 2, combat: 0.5, sol: 0.5, ground: 0.5, acier: 0.5, steel: 0.5 },
    spectre: { psy: 2, psychic: 2, spectre: 2, ghost: 2, tenebres: 0.5, dark: 0.5, normal: 0 },
    dragon: { dragon: 2, acier: 0.5, steel: 0.5, fee: 0, fairy: 0 },
    tenebres: { psy: 2, psychic: 2, spectre: 2, ghost: 2, combat: 0.5, tenebres: 0.5, dark: 0.5, fee: 0.5, fairy: 0.5 },
    acier: { glace: 2, roche: 2, rock: 2, fee: 2, fairy: 2, feu: 0.5, eau: 0.5, water: 0.5, electrik: 0.5, acier: 0.5, steel: 0.5 },
    fee: { combat: 2, dragon: 2, tenebres: 2, dark: 2, feu: 0.5, poison: 0.5, acier: 0.5, steel: 0.5 },
  };
