import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

import './styles.css';

import api from '../../services/api';

import previewPlayerData from '../../utils/previewPlayerData';

function Recently() {
    const [ recently, setRecently ] = useState([]);

    const [ load, setLoad ] = useState(true);

    async function loadRecently() {
        const response = await api.get('/me/player/recently-played?limit=50');

        setRecently(response.data.items);
        
        setLoad(false);
    }

    useEffect(() => {
        loadRecently();
    }, []);

    return(
        <>
            {load && <h2 className="loading">Carregando...</h2>}
            {!load &&
                <div id="recently" className="container">
                    <h2>Tocadas recentemente</h2>
                    <div className="grid-template">
                        {recently.map(data => (
                            <div className="track" key={data.played_at}>
                                <div className="cover" style={{backgroundImage: `url(${data.track.album.images[0].url})`}} onClick={() => previewPlayerData(data.track, data.track.album.images[0].url, data.track.artists)}></div>
                                <span className="track-name">{data.track.name}</span>
                                <div className="artist-and-album">
                                    <span>
                                        <Link to={`/artist/id=${data.track.artists[0].id}`}>{data.track.artists[0].name}</Link>
                                    </span>
                                    <span>
                                        <Link to={`/album/id=${data.track.album.id}`}>{data.track.album.name}</Link>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </>
    )
}

export default Recently;