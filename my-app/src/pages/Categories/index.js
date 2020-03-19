import React, { useState, useEffect } from 'react';

import { Link, useParams } from 'react-router-dom';

import './styles.css';

import api from '../../services/api';

import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

import defaultImage from '../../assets/default-image.jpg';

function Categories() {
    const [ category, setCategory ] = useState([]);
    const [ prev, setPrev ] = useState('');
    const [ next, setNext ] = useState('');

    const [ load, setLoad ] = useState(true);

    const id = useParams().categoryId;

    useEffect(() => {
        async function load() {
            await api.get(`/browse/categories/${id}/playlists?country=br&limit=50`)
            .then(response => {
                setCategory(response.data.playlists.items);

                setPrev(response.data.playlists.previous);
                setNext(response.data.playlists.next);
            })
            .finally(() => {
                setLoad(false);
            })
        }

        load();
    }, [])

    async function loadPrevious() {
        const replacedEndpointURL = prev.replace('https://api.spotify.com/v1', '');

        await api.get(replacedEndpointURL)
        .then(response => {
            setCategory(response.data.playlists.items);
            setPrev(response.data.playlists.previous);
            setNext(response.data.playlists.next);
        })
        .finally(() => {
            setLoad(false);
        })
    }

    async function loadNext() {
        const replacedEndpointURL = next.replace('https://api.spotify.com/v1', '');

        await api.get(replacedEndpointURL)
        .then(response => {
            setCategory(response.data.playlists.items);
            setPrev(response.data.playlists.previous);
            setNext(response.data.playlists.next);
        })
        .finally(() => {
            setLoad(false);
        })
    }    

    return(
        <div id="categories" className="container">
            {load && <h1 className="loading">Carregando...</h1>}
            {!load && 
                <>                
                    <h1>{id}</h1>
                    <div className="page-header">                        
                        <h2>Playlists populares</h2>
                        <div className="pagination">
                            {prev !== null && <button onClick={loadPrevious}>
                                <IoIosArrowBack />
                            </button>}
                            {next !== null && <button onClick={loadNext}>
                                <IoIosArrowForward />
                            </button>}
                        </div>
                    </div>
                    <div className="category">
                        {category.map(data => (
                            <React.Fragment key={data.id}>
                                <Link to={`/playlist/id=${data.id}`}>
                                    <div className="category-item">
                                        <div className="category-image cover" style={{backgroundImage: `url(${data.images == 0 ? defaultImage : data.images[0].url})`}}></div>
                                        <div className="category-info">
                                            <span className="category-name">{data.name}</span>
                                            <span className="category-description">{data.description}</span>
                                        </div>
                                    </div>
                                </Link>
                            </React.Fragment>
                        ))}
                    </div>
                </>
            }
        </div>
    )
}

export default Categories;