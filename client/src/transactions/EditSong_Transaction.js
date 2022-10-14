import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * MoveItem_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
    
    @author McKilla Gorilla
 */
export default class EditSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, initOT, initOA, initOId, initNTitle, initNArtist, initNid, initIndex) {
        super();
        this.store = initStore;
        this.oT = initOT;
        this.oA = initOA;
        this.oId = initOId;
        //---->
        this.nTitle = initNTitle;
        this.nArtist = initNArtist;
        this.nId = initNid;
        //---->
        this.ii = initIndex;
    }

    doTransaction() {
        this.store.editSong(this.nTitle, this.nArtist, this.nId, this.ii);
    }

    undoTransaction() {
        this.store.editSong(this.oT, this.oA, this.oId, this.ii);
    }
}