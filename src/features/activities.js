async function healTeam() {
    if (!config.autoHeal) return false;
    const button = findClickable([
      'tout soigner',
      'soigner equipe',
      'soigner l equipe',
      'heal all',
      'heal team',
      'soigner',
      'heal',
    ], document, { exclude: ['potion', 'objet', 'item', 'acheter', 'buy'] });
    return button ? clickElement(button, 'Soin équipe') : false;
  }

  async function harvestGreenhouse() {
    if (!config.autoHarvest) return false;
    const buttons = findAllClickables([
      'recolter',
      'harvest',
      'ramasser',
      'collect berries',
    ]);
    if (!buttons.length) return false;
    return clickElement(buttons[0], 'Récolte serre');
  }

  async function plantGreenhouse() {
    if (!config.autoPlant) return false;
    const button = findClickable(['planter', 'plant', 'semer', 'sow']);
    return button ? clickElement(button, 'Plantation serre') : false;
  }

  async function claimIncubator() {
    if (!config.autoIncubatorClaim) return false;
    const button = findClickable([
      'faire eclore',
      'eclore',
      'hatch',
      'recuperer oeuf',
      'collect egg',
      'extraire fossile',
      'restore fossil',
    ]);
    return button ? clickElement(button, 'Récupération incubateur') : false;
  }

  async function claimBreeding() {
    if (!config.autoBreedingClaim) return false;
    const button = findClickable([
      'recuperer l oeuf',
      'recuperer oeuf',
      'collect egg',
      'prendre l oeuf',
      'take egg',
    ]);
    return button ? clickElement(button, 'Récupération pension') : false;
  }
