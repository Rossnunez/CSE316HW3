/*
    This is our http api, which we use to send requests to
    our back-end API. Note we're using the Axios library
    for doing this, which is an easy to use AJAX-based
    library. We could (and maybe should) use Fetch, which
    is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it's a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/
import axios from 'axios'
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
})
// THESE ARE ALL THE REQUESTS WE'LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /playlist). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE CALL THE payload, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES
//WE NEED A CREATE REQUEST, USE POST REQUEST FOR CREATING
//WE NEED A DELETE REQUEST
//WERE MISSING A PUT FOR EDITNG OR UPDATING A LIST
//SOME OF THE THINGS WERE MISSING THE SERVERSIDE TELLS US HOW IT WORKS AS A LIL HINT
//MISSING 3 REQUEST TYPES ON THE CLIENT SIDE, WRITE ALL THE CODE FOR THE REACT STUFF
//WERE GONBNA USE AXIOS BUILT ON TOP OF AJAX, ITS A PROMISE BASED LIBRARY, SO YOU CAN MAKE FUNC CALLS TO DO SOMEONE IN THE BACKEND SERVR
//FIRST SEND THE CHANGE TO THE SERVER ALWAYS, AND ONLY WHEN THE SEVRER IS DONE DOING THAT, DO WE UPDATE THE STATE LOCALLY
//user interacts with react comp, we call a func in the store, and then we send that req to the server and we either get back yay it scucc and we update the state or nay and we return an error
//
export const getAllPlaylists = () => api.get(`/playlists`)
export const getPlaylistPairs = () => api.get('playlistpairs')
export const getPlaylistById = (id) => api.get(`/playlist/${id}`)
export const updatePlaylistById = (id, payload) => api.put(`/playlist/${id}`, payload)
export const createPlaylist = (payload) => api.post(`/playlist`, payload)
export const deletePlaylistById = (id) => api.delete(`/playlist/${id}`)
export const addSongById = (id, song) => api.put(`/playlist/${id}`, song)
// add new song

const apis = {
    getAllPlaylists,
    getPlaylistPairs,
    getPlaylistById,
    updatePlaylistById,
    createPlaylist,
    deletePlaylistById,
    addSongById
}

export default apis
