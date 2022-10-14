import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    let enabledButtonClass = "playlister-button";

    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        history.push("/");
        store.closeCurrentList();
    }
    function handleAddSong() {
        store.addSongTransaction();
    }


    let undoStatus = false;
    let redoStatus = false;
    let songStatus = false;
    if (store.listNameActive) {
        undoStatus = true;
        redoStatus = true;
        songStatus = true;
    }

    store.check4Undo();
    store.check4Redo();
    if (!store.boolUndo) {
        undoStatus = true;
    }
    if (!store.boolRedo) {
        redoStatus = true;
    }

    if (!store.currentList) {
        undoStatus = true;
        redoStatus = true;
        songStatus = true;
    }

    if (store.modalOpen) {
        undoStatus = true;
        redoStatus = true;
        songStatus = true;
    }
    return (
        <span id="edit-toolbar">
            <input
                type="button"
                id='add-song-button'
                disabled={songStatus}
                value="+"
                className={enabledButtonClass}
                onClick={handleAddSong}
            />
            <input
                type="button"
                id='undo-button'
                disabled={undoStatus}
                value="⟲"
                className={enabledButtonClass}
                onClick={handleUndo}
            />
            <input
                type="button"
                id='redo-button'
                disabled={redoStatus}
                value="⟳"
                className={enabledButtonClass}
                onClick={handleRedo}
            />
            <input
                type="button"
                id='close-button'
                disabled={songStatus}
                value="&#x2715;"
                className={enabledButtonClass}
                onClick={handleClose}
            />
        </span>);
}

export default EditToolbar;