import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
/*
    This modal is shown when the user asks to delete a list. Note 
    that before this is shown a list has to be marked for deletion,
    which means its id has to be known so that we can retrieve its
    information and display its name in this modal. If the user presses
    confirm, it will be deleted.
    
    @author McKilla Gorilla
*/
function DeleteSongModal() {
    const { store } = useContext(GlobalStoreContext);
    let title = "";

    if (store.songToEdit) {
        title = store.songToEdit.title; //this will be title
    }

    function handleDeleteSong(event) {
        //store.deleteMarkedSong();
        store.deleteSongTransaction();
    }

    function handleCloseModal(event) {
        store.hideDeleteSongModal();
    }

    return (
        <div
            className="modal"
            id="delete-song-modal"
            data-animation="slideInOutLeft">
            <div className="modal-dialog">
                <header className="modal-header">
                    Are you sure you want to delete {title}?
                </header>
                <div id="confirm-cancel-container">
                    <button
                        style={{ marginRight: '50px' }}
                        id="dialog-yes-button"
                        className="modal-button"
                        onClick={handleDeleteSong}
                    >Confirm</button>
                    <button
                        id="dialog-no-button"
                        className="modal-button"
                        onClick={handleCloseModal}
                    >Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteSongModal;