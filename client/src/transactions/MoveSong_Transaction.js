import jsTPS_Transaction from "../common/jsTPS.js"

export default class MoveSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, initOldIndex, initNewIndex) {
        super();
        this.store = initStore;
        this.oldItemIndex = initOldIndex;
        this.newItemIndex = initNewIndex;
    }

    doTransaction() {
        this.store.moveSong(this.oldItemIndex, this.newItemIndex);
    }

    undoTransaction() {
        this.store.moveSong(this.newItemIndex, this.oldItemIndex);
    }
}