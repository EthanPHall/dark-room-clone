export class LocalStorageSaver{
    write(key, value){
        localStorage.setItem(key, JSON.stringify(value));
    }

    read(key){
        return JSON.parse(localStorage.getItem(key));
    }
}