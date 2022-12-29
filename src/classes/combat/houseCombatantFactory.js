import houseCombatants from "../../config/combatants/houseCombatants.json";

export class HouseCombatantFactory{
    constructor(){

    }

    getCombatant(rng){
        const combatant = {...houseCombatants[Math.floor(rng() * houseCombatants.length)]};
        combatant.flavorText = combatant
            .potentialFlavorTexts[Math.floor(rng() * combatant.potentialFlavorTexts.length)];
        combatant.afterText = combatant
            .potentialAfterTexts[Math.floor(rng() * combatant.potentialAfterTexts.length)];

        return combatant;
    }
}