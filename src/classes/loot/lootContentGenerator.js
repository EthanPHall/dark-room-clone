// import { ItemList } from "../items/itemList";
// import { LootFactory } from "./lootfactory";

// export class LootContentGenerator{
//     constructor(rng, location, enemy){
//         const lootFactory = new LootFactory(rng);
//         const loot = lootFactory.getLoot(location, enemy);

//         const itemList = new ItemList();

//         const actualLoot = [];

//         loot.potentialLoot.forEach(potential => {
//             const item = itemList.getItem(potential.name);

//             if(item.name === "default"){
//                 item.quantity = 1;
//                 actualLoot.push(item);
//             }

//             if(rng() < potential.chance){
//                 item.quantity = Math.floor(rng() * (potential.quantityMax - potential.quantityMin)) + potential.quantityMin;

//                 actualLoot.push(item);
//             }
//         });

//         this.lootContent = function (){
//             this.loot = actualLoot;
//             this.removeItem = function (name){
//                 let toRemoveIndex = -1;
//                 this.loot.forEach((item, index) => {
//                     if(item.name === name){
//                         toRemoveIndex = index;
//                     }
//                 });

//                 if(toRemoveIndex !== -1){
//                     this.loot.splice(toRemoveIndex, 1);
//                 }
//             }
//         }
//     }

//     generateLootContent(){
//         return (
//             <>
//                 {actualLoot.map(loot => {
//                     return (
//                         <>
//                             <button className="item" onClick={this.lootContent.removeItem} name={loot.name}></button>
//                         </>
//                     )
//                 })}
//             </>
//         );
//     }
// }