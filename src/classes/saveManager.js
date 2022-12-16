import { LocalStorageSaver } from "./save-management/localStorageSaver";

class SaveManager{
    constructor(){
        this.saver = new LocalStorageSaver();
    }

    write(key, value){
        this.saver.write(key, value);
    }

    read(key){
        return this.saver.read(key);
    }
}

export const manager = new SaveManager();