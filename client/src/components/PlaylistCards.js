import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import SongCard from './SongCard.js'
import { GlobalStoreContext } from '../store'
import EditSongModal from './EditSongModal'
import DeleteSongModal from './DeleteSongModal'
import { KeyPress } from '../store/index'
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function PlaylistCards() {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();

    if (!store.currentList) {
        store.history.push("/");
        return null;
    } else {
        return (
            <div id="playlist-cards">
                {
                    store.currentList.songs.map((song, index) => (
                        <SongCard
                            id={'playlist-song-' + (index)}
                            key={'playlist-song-' + (index)}
                            index={index}
                            song={song}
                        />
                    ))
                }
                <EditSongModal />
                <DeleteSongModal />
            </div>
        )
    }
}

export default PlaylistCards;