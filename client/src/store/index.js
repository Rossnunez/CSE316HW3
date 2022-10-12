import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
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
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        listMarkedForDeletion: null,
        nameOfDeletedList: null
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
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
                    listMarkedForDeletion: null
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
                    listMarkedForDeletion: null
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
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist; //bruh playlist was spelled wrong
                //console.log(playlist);
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

    //THESE FUNCTIONS ARE FOR DELETING A LIST WITH THE DELETE MODAL INCLUDED
    store.showDeleteListModal = function () {
        let modal = document.getElementById("delete-modal");
        modal.classList.add("is-visible");
    }

    store.hideDeleteListModal = function () {
        let modal = document.getElementById("delete-modal");
        modal.classList.remove("is-visible");
    }

    store.markListForDeletion = function (id) {
        async function asyncSetDeleteList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                //let name = playlist.name;
                //let newID = playlist._id;
                //store.nameOfDeletedList = name;
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
        store.deleteCurrentList(store.listMarkedForDeletion);
        store.hideDeleteListModal();
    }

    //THIS FUNCTION DELETES THE CURRENT LIST
    store.deleteCurrentList = function (id) {
        // storeReducer({
        //     type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
        //     payload: id
        // });
        //store.showDeleteListModal();
        async function processDelete(id) {
            console.log(id);
            let response = await api.deletePlaylistById(id);
            if (response.data.success) {
                store.loadIdNamePairs();
                store.history.push("/");
            }
        }
        processDelete(id);
    }
    //THIS FUNCTION ADDS SONG TO CURRENT PLAYLIST
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

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
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
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
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