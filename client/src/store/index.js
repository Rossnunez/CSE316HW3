import { createContext, StrictMode, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import AddSong_Transaction from '../transactions/AddSong_Transaction';
import EditSong_Transaction from '../transactions/EditSong_Transaction';
import DeleteSong_Transaction from '../transactions/DeleteSong_Transaction';
export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla ------------------> DATA STORE MAINTAINS STATES OF THE APPLICATION
    AWAIT -> 
    API.FUNCTION(updatePlaylistById) THAT IS THE CLIENT SIDE API WHICH GENERATES MESSAGES TO SEND TO THE BKEND
    Send a request over to the server and await wants the code to sit there and wait for a response it can only be used if the method youre calling returns something like a PROMISE 
    PROMISE is a JS Object, if a function returns a promise we can AWAIT until its compoletely done(it will do it or tell you it failed)
    AWAIT basically will wait for that response
    WHEN YOU WANT TO SEND MESSAGES TO THE SERVER YOU HAVE TO WAIT, YOU DONT WANT THE CODE TO JUST GO
    IN JS THERE ARE ASYNC FUNCTION MEANS DONT WAIT FOR ME
    ASYNC means that code can be run in a seperate thread while the code keeps going
    the only time we call await to send a http req to the server
    the reason we call await in async function is so you can wait on another thread and not the main thread
    *this is **FLUX ARCHIECTURE** USED FOR UI LIBRARIES
    REDUCER IS AN ABSTRACT STATE UPDATE, it just returns a new state and you use that to update the state
    useCONtext allows the store to be shared with all react components
    Hooks let us avoid using lifecycle functions
    useState allows use to create a state? maybe idk
    use in the frontend is a hook function
    Reducer is purely functional prog, you give it an intial state and action and it will produce a new state, and abstract of updating the state
    reducer is usually called by a dispatch method
    reducer is good to know and used in many apis
    redux api would define reducer
    there is a useReducer hook, were not using useReducer 
    useEffect(another hook function)    
    ROUTER BACKEND IS REALLY MIDDLEWEAR AND the router deciders if a function is like thst send it so the handler
    FRONT END ROUTER IS ABOUT SELECTING WHICH REACT COMPONENETS SHOULD BE USED
    2 ways to get to ROUTE
    1. we might have a link, react router link(link object or dynamic link)
    2. GET THE useHistory HOOK, AND PUSH YOU TO ANOTHER LIKE(YOU WILL SEE IT DONE THIS WAY)
    run the program comment out that line see what happens, uncomment and see what happens youll see a difference 
    
*/


// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    MARK_SONG_FOR_EDIT: "MARK_SONG_FOR_EDIT",
    SET_BOOL_REDO: "SET_BOOL_REDO",
    SET_BOOL_UNDO: "SET_BOOL_UNDO",
    SET_MODAL_TRUE: "SET_MODAL_TRUE",
    SET_MODAL_FALSE: "SET_MODAL_FALSE",
    SET_LAST_LIST: "SET_LAST_LIST",
    DELETE_MARKED_LIST: "DELETE_MARKED_LIST"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    let lastList = null;
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        listMarkedForDeletion: null,
        nameOfDeletedList: null,
        songToEdit: null,
        indexOfSong: null,
        boolUndo: null,
        boolRedo: null,
        modalOpen: false,
        lastList: null
    });
    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload, index } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null
                });
            }

            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    nameOfDeletedList: null,
                    songToEdit: null
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listMarkedForDeletion: null
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    lastList: false
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: payload._id,
                    nameOfDeletedList: payload.name
                });
            }

            //DELETE MARKED LIST 
            case GlobalStoreActionType.DELETE_MARKED_LIST: {
                return setStore({
                    newListCounter: store.newListCounter - 1
                });
            }

            //PREPARE TO EDIT SONG
            case GlobalStoreActionType.MARK_SONG_FOR_EDIT: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    nameOfDeletedList: null,
                    songToEdit: payload,
                    indexOfSong: index,
                    modalOpen: true
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listMarkedForDeletion: null
                });
            }
            // FOR SETTING UNDO AND REDO BOOLEAN VALUES
            case GlobalStoreActionType.SET_BOOL_UNDO: {
                return setStore({
                    boolUndo: payload
                });
            }
            case GlobalStoreActionType.SET_BOOL_REDO: {
                return setStore({
                    boolRedo: payload
                });
            }
            case GlobalStoreActionType.SET_BOOL_REDO: {
                return setStore({
                    boolRedo: payload
                });
            }
            case GlobalStoreActionType.SET_MODAL_FALSE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    modalOpen: false
                });
            }
            case GlobalStoreActionType.SET_MODAL_TRUE: {
                return setStore({
                    modalOpen: true
                });
            }
            case GlobalStoreActionType.SET_LAST_LIST: {
                return setStore({
                    lastList: true
                });
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS-------------------------------------------------->
    function KeyPress(event) {
        if (event.ctrlKey && !store.modalOpen) {
            if (event.key === "z") {
                store.undo();
            }
            else if (event.key === "y") {
                store.redo();
            }
        }
    }
    document.onkeydown = (e) => KeyPress(e);

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }
    //THIS FUNCTION PROCESSES CREATING A NEW LIST
    store.createNewList = function () {
        async function asyncCreateNewList() {
            const name = "Untitled"
            const songs = []
            const payload = { name, songs }

            let response = await api.createPlaylist(payload);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.CREATE_NEW_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncCreateNewList();
    }
    //THESE FUNCTIONS ARE FOR EDITING A SONG WITH THE EDIT-SONG MODAL INCLUDED + TRANSACTIONS
    store.editSong = function (title, artist, id, index) {
        store.currentList.songs.splice(index, 1, { "title": title, "artist": artist, "youTubeId": id })
        let list = store.currentList
        async function updateList2(list) {
            let response = await api.updatePlaylistById(list._id, list);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: list
                });
                store.history.push("/playlist/" + list._id);
            }
        }
        updateList2(list);
    }
    store.markSongForEdit = function (song, index) {
        document.getElementById("Title").value = song.title
        document.getElementById("Artist").value = song.artist
        document.getElementById("Id").value = song.youTubeId
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG_FOR_EDIT,
            payload: song,
            index: index
        });
        store.showEditSongModal();
    }
    store.showEditSongModal = function () {
        store.modalOpen = true;
        let modal = document.getElementById("edit-song-modal");
        modal.classList.add("is-visible");
    }
    store.hideEditSongModal = function () {
        let modal = document.getElementById("edit-song-modal");
        modal.classList.remove("is-visible");
        storeReducer({
            type: GlobalStoreActionType.SET_MODAL_FALSE
        });
    }
    store.editSongTransaction = function () {
        let newTitle = document.getElementById("Title").value
        let newArtist = document.getElementById("Artist").value
        let newYouTubeId = document.getElementById("Id").value
        //getting old song values
        let oldTitle = store.songToEdit.title
        let oldArtist = store.songToEdit.artist
        let oldYouTubeId = store.songToEdit.youTubeId

        let transaction = new EditSong_Transaction(store, oldTitle, oldArtist, oldYouTubeId, newTitle, newArtist, newYouTubeId, store.indexOfSong);
        tps.addTransaction(transaction);
        store.hideEditSongModal();
    }
    //---------------------------------------------->END OF All EDIT SONG FUNCTIONS + TRANSACTIONS

    //THESE FUNCTIONS ARE FOR DELETING A SONG WITH THE DELETE-SONG MODAL INCLUDED + TRANSACTIONS
    store.markSongForDelete = function (song, index) {
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG_FOR_EDIT,
            payload: song,
            index: index
        });
        store.showDeleteSongModal();
    }
    store.showDeleteSongModal = function () {
        store.modalOpen = true;
        let modal = document.getElementById("delete-song-modal");
        modal.classList.add("is-visible");

    }
    store.hideDeleteSongModal = function () {
        let modal = document.getElementById("delete-song-modal");
        modal.classList.remove("is-visible");
        storeReducer({
            type: GlobalStoreActionType.SET_MODAL_FALSE
        });
    }
    store.deleteMarkedSong = function (index) {
        store.currentList.songs.splice(index, 1)
        let list = store.currentList
        async function updateList3(list) {
            let response = await api.updatePlaylistById(list._id, list);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: list
                });
                store.history.push("/playlist/" + list._id);
            }
        }
        updateList3(list);
    }
    store.addRemovedSong = function (song, index) {
        store.currentList.songs.splice(index, 0, song)
        let list = store.currentList
        async function updateList4(list) {
            let response = await api.updatePlaylistById(list._id, list);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: list
                });
                store.history.push("/playlist/" + list._id);
            }
        }
        updateList4(list);
    }
    store.deleteSongTransaction = function () {
        let transaction = new DeleteSong_Transaction(store, store.songToEdit, store.indexOfSong);
        tps.addTransaction(transaction);
        store.hideDeleteSongModal();
    }
    //------------------------------------------->END OF ALL DELETE SONG FUNCTIONS 

    //THESE FUNCTIONS ARE FOR DELETING A LIST WITH THE DELETE MODAL INCLUDED
    store.showDeleteListModal = function () {
        let modal = document.getElementById("delete-modal");
        modal.classList.add("is-visible");
        store.modalOpen = true
    }
    store.hideDeleteListModal = function () {
        let modal = document.getElementById("delete-modal");
        modal.classList.remove("is-visible");
        storeReducer({
            type: GlobalStoreActionType.SET_MODAL_FALSE
        });
    }
    store.markListForDeletion = function (id) {
        async function asyncSetDeleteList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                        payload: playlist
                    });
                    store.showDeleteListModal();
                }
            }
        }
        asyncSetDeleteList(id);
    }
    store.deleteMarkedList = function () {
        store.deleteList(store.listMarkedForDeletion);
        store.hideDeleteListModal();
    }
    store.deleteList = function (id) {
        async function processDelete(id) {
            let response = await api.deletePlaylistById(id);
            if (response.data.success) {
                store.loadIdNamePairs();
                store.history.push("/");
                const response = await api.getPlaylistPairs();
                if (response.data.success) {
                    let pairsArray = response.data.idNamePairs;
                    if (!pairsArray) {
                        document.location.reload();
                    }
                }
                //store.newListCounter -= 1;
                //console.log(store.newListCounter)
                // if (!store.newListCounter) {
                //     document.location.reload();
                // }
            }
        }
        processDelete(id);
    }
    //---------------------------------------->END OF ALL DELETE LIST FUNCTIONS

    //THESE FUNCTIONS ARE FOR ADDING A SONG TO A LIST + TRANSACTIONS
    store.addSongTransaction = function () {
        let transaction = new AddSong_Transaction(store);
        tps.addTransaction(transaction);
    }
    store.addSongToCurrentList = function () {
        async function asyncAddSong() {
            let id = store.currentList._id;
            let song = { "title": "Untitled", "artist": "Unknown", "youTubeId": "dQw4w9WgXcQ" };
            store.currentList.songs.push({ "title": "Untitled", "artist": "Unknown", "youTubeId": "dQw4w9WgXcQ" });
            let response = await api.addSongById(id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
                store.history.push("/playlist/" + id);
            }
        }
        asyncAddSong();
    }
    store.deleteLastSong = function () {
        async function asyncRemoveSong() {
            let id = store.currentList._id;
            store.currentList.songs.pop()
            let response = await api.addSongById(id, store.currentList);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
                store.history.push("/playlist/" + id);
            }
        }
        asyncRemoveSong();
    }
    //--------------------------------------->END OF ALL ADD SONG CARDS FUNCTIONS 

    //THESE FUNCTION ARE THE TRANSACTIONS FOR DRAG AND DROP OF SONG CARDS
    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    store.moveSong = function (start, end) {
        let list = store.currentList;

        let temp = list.songs[start];
        list.songs[start] = list.songs[end];
        list.songs[end] = temp;

        store.currentList = list
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_LIST,
            payload: store.currentList
        });
        store.history.push("/playlist/" + store.currentList._id);
    }
    store.updatePlaylist = function (list) {
        async function updateList6(list) {
            let response = await api.updatePlaylistById(list._id, list);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: list
                });
                store.history.push("/playlist/" + list._id);
            }
        }
        updateList6(list);
    }
    //-------------------------------------->END OF ALL DRAG AND DROP SONG CARDS TRANSACTIONS

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        tps.clearAllTransactions();
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }
    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                if (pairsArray) {
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: pairsArray
                    });
                }
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }
    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }
    store.getPlaylistSize = function () {
        return store.currentList.songs.length;
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.check4Redo = function () {
        if (tps.hasTransactionToRedo()) {
            store.boolRedo = true
        } else {
            store.boolRedo = false
        }
    }
    store.check4Undo = function () {
        if (tps.hasTransactionToUndo()) {
            store.boolUndo = true
        } else {
            store.boolUndo = false
        }
    }
    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setlistNameActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}