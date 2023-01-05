import items from "../../config/items/items.json";

export class ItemList{
    getItem(name){
        const item = items.filter(i => i.name === name);
        if(item.length === 0){
            return items[items.length - 1];
        }else{
            return item[0];
        }
    }
}