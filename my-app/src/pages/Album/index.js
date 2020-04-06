import React, { useState, useEffect } from 'react';

import { Link, useParams } from 'react-router-dom';

import './styles.css';

import api from '../../services/api';

import { FaPlay, FaRegHeart, FaShareAlt, FaHeart } from 'react-icons/fa';

import { MdMusicNote } from 'react-icons/md';

import SpotifyButton from '../../components/SpotifyButton';

import defaultImage from '../../assets/default-image.jpg';

import millisToMinutesAndSeconds from '../../utils/millisToMinutesAndSeconds';

import { useDispatch } from 'react-redux';

function Album() {
    const [ album, setAlbum ] = useState([]);
    const [ albumImage, setAlbumImage ] = useState([]);
    const [ artists, setArtists ] = useState([]);
    const [ tracks, setTracks ] = useState([]);
    const [ copyrights, setCopyrights ] = useState([]);

    const [ save, setSave ] = useState('');

    const [ load, setLoad ] = useState(true);

    const id = useParams().albumId;    

    const dispatch = useDispatch();

    async function loadAlbum() {
        const response = await api.get(`albums/${id}`);
        
        setAlbum(response.data);
        setAlbumImage(response.data.images[0].url);
        setArtists(response.data.artists);
        setTracks(response.data.tracks.items);
        setCopyrights(response.data.copyrights);
        
        setLoad(false);
    }

    async function verifySaved() {
        const response = await api.get(`/me/albums/contains?ids=${id}`);

        setSave(response.data[0]);
    }

    useEffect(() => {        
        loadAlbum();
        verifySaved();
    }, []);

    const date = new Date(album.release_date);

    async function saveAlbum() {
        try {
            await api.put(`/me/albums?ids=${id}`);
    
            setSave(true);
        } catch (error) {
            alert("Ocorreu um erro ao salvar o àlbum.");
        }
    }

    async function removeAlbum() {
        try {
            await api.delete(`/me/albums?ids=${id}`);

            setSave(false);
        } catch (error) {
            alert("Ocorreu um erro ao remover o àlbum da sua biblioteca");
        }
    }

    function previewPlayerData(track, albumImage, artists) {
        dispatch({ type: 'PLAY_TRACK',  trackInfo: [track], trackImage: albumImage , trackArtists: artists})
    }

    return(
        <>
        {load && <h2 className="loading">Carregando...</h2>} 
        {!load && 
        <>            
            <div id="album" className="container">                    
                <div className="album-info">
                    <div className="album-image cover" style={{backgroundImage: `url(${albumImage == null ? defaultImage : albumImage})`}}></div>
                    <h2 className="album-title">{album.name}</h2>
                    <div className="album-artists">
                        {artists.map(artist => (
                            <Link to={`/artist/id=${artist.id}`} key={artist.id}>
                                <span>{artist.name}</span>
                            </Link>
                        ))}
                    </div>
                    <SpotifyButton id={album.id} type="album" />
                    <div className="album-options">
                        {!save && <FaRegHeart onClick={saveAlbum} size="1.8em" />}
                        {save && <FaHeart onClick={removeAlbum} size="1.8em" color="#1DB954" />}
                        <FaShareAlt size="1.8em" />
                    </div>
                    <div className="album-year">
                        <span>{String(date.getFullYear())}</span>
                        {album.total_tracks == 1 && 
                            <span>{album.total_tracks} música</span>
                        }
                        {album.total_tracks > 1 && 
                            <span>{album.total_tracks} músicas</span>
                        }
                    </div>
                </div>
                <div className="album-tracks tracks">
                    {tracks.map(data => (
                        <div key={data.id} className="track">
                            <div className="note-icon">
                                <MdMusicNote size="1em" />
                            </div>

                            <div className="play-icon" onClick={() => previewPlayerData(data, albumImage, artists)}>
                                <FaPlay size="1em" />
                            </div>
                            <div className="track-info">                                    
                                <span className="track-name">{data.name}</span>
                                <div className="track-artists">                                    
                                    {data.artists.map(artist => (
                                        <Link to={`/artist/id=${artist.id}`} key={artist.id}>
                                            <span>{artist.name}</span>
                                        </Link>
                                    ))}
                                </div> 
                            </div>
                            <div className="track-duration">
                                {millisToMinutesAndSeconds(data.duration_ms)}
                            </div>                           
                        </div>
                    ))}
                    <div className="copyright">
                        {copyrights.map(copyright => (
                            <span key={copyright.text}>{copyright.text}</span>
                        ))}
                    </div>
                </div>                        
            </div>
            </>
        }
        </>
    )
}

export default Album;