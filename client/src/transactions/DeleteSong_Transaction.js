import jsTPS_Transaction from "../common/jsTPS.js"

export default class DeleteSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, initCSong, initIndex) {
        super();
        this.store = initStore;
        this.cSong = initCSong;
        this.index = initIndex;
    }

    doTransaction() {
        this.store.deleteMarkedSong(this.index);
    }
    
    undoTransaction() {
        this.store.addRemovedSong(this.cSong, this.index);
    }
}