import jsTPS_Transaction from "../common/jsTPS.js"

export default class MoveSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, initOldIndex, initNewIndex) {
        super();
        this.store = initStore;
        this.oldItemIndex = initOldIndex;
        this.newItemIndex = initNewIndex;
    }

    doTransaction() {
        let song = this.store.currentList.songs[this.oldItemIndex];
        this.store.currentList.songs.splice(this.oldItemIndex, 1)
        this.store.currentList.songs.splice(this.newItemIndex, 0, song)
        this.store.updatePlaylist(this.store.currentList)
    }

    undoTransaction() {
        let song = this.store.currentList.songs[this.newItemIndex];
        this.store.currentList.songs.splice(this.newItemIndex, 1)
        this.store.currentList.songs.splice(this.oldItemIndex, 0, song)
        this.store.updatePlaylist(this.store.currentList)
    }
}