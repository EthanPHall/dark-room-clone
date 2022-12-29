import houseLoot from "../../config/loot-contents/houseLootContents.json";

export class HouseLootFactory{
    constructor(){

    }

    getLoot(rng, enemy){
        let loot;
        if(enemy){
            loot = houseLoot.filter(element => element.name === enemy.loot);
            if(loot.length === 0){
                loot = {...houseLoot[houseLoot.length - 1]};
            }else{
                loot = {...loot[0]};
            }

            loot.message = enemy.potentialAfterTexts[Math.floor(rng() * enemy.potentialAfterTexts.length)];
        }else{
            loot = {...houseLoot[Math.floor(rng() * houseLoot.length)]};
        }

        return loot;
    }
}