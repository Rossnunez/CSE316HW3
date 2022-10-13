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
function EditSongModal() {
    const { store } = useContext(GlobalStoreContext);
    let title = ""
    let artist = ""
    let id = ""
    if (store.songToEdit) {
        title = store.songToEdit.title
        artist = store.songToEdit.artist
        id = store.songToEdit.youTubeId
    }

    function handleEditSong(event) {
        event.stopPropagation();
        store.editMarkedSong();
    }
    function handleCloseModal(event) {
        event.stopPropagation();
        store.hideEditSongModal();
    }

    return (
        <div
            className="modal"
            id="edit-song-modal"
            data-animation="slideInOutLeft">
            <div className="modal-dialog" id='verify-edit-song-root'>
                <header className="modal-header">
                    Edit Song?
                </header>
                <div className="modal-center">
                    <div className="modal-center-content">
                        <div style={{ paddingBottom: '10px' }}>
                            <label
                                //className='modal-footer'
                                style={{ float: 'left', fontSize: '25pt', fontWeight: 'bold' }} //"float: left; font-size: 25pt; font-weight: bold;" 
                                htmlFor="Title">Title:
                            </label>
                            <input
                                style={{ fontSize: '15pt', margin: '0px', float: 'right' }}//"font-size: 15pt; margin:0px; float: right;"
                                //className='song-card'
                                type='text'
                                id="Title"
                                name="Title"
                                defaultValue={title}
                            //onChange={e => this.changeTitle(e.target.value)}
                            />
                        </div>
                        <br />
                        <br />
                        <div style={{ paddingBottom: '10px' }}>
                            <label
                                //className='modal-footer'
                                style={{ float: 'left', fontSize: '25pt', fontWeight: 'bold' }} //"float: left; font-size: 25pt; font-weight: bold;" 
                                htmlFor="Artist">
                                Artist:
                            </label>
                            <input
                                style={{ fontSize: '15pt', margin: '0px', float: 'right' }} //"font-size: 15pt; margin:0px; float: right;" 
                                //className='song-card'
                                type='text'
                                id="Artist"
                                name="Artist"
                                defaultValue={artist}
                            //onChange={e => this.changeArtist(e.target.value)}
                            />
                        </div >
                        <br />
                        <br />
                        <div style={{ paddingBottom: '10px' }}>
                            <label
                                //className='modal-footer'
                                style={{ float: 'left', fontSize: '25pt', fontWeight: 'bold' }}//"float: left; font-size: 25pt; font-weight: bold;" 
                                htmlFor="Id">
                                YoutubeId:
                            </label>
                            <input
                                style={{ fontSize: '15pt', margin: '0px', float: 'right' }} //"font-size: 15pt; margin:0px; float: right;" 
                                //className='song-card'
                                type='text'
                                id="Id"
                                name="Id"
                                defaultValue={id}
                            //onChange={e => this.changeYTID(e.target.value)}
                            />
                        </div>
                        <br />
                    </div>
                </div>
                <div id="confirm-cancel-container">
                    <button
                        style={{ marginRight: '50px' }}
                        id="dialog-yes-button"
                        className="modal-button"
                        onClick={handleEditSong}
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

export default EditSongModal;