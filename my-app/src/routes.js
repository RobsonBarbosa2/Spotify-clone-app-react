import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Body from './components/Body';

import Login from './pages/Login';
import Home from './pages/Home';
import Search from './pages/Search';
import Collection from './pages/Collection';
import Album from './pages/Album';
import Playlist from './pages/Playlist';
import Categories from './pages/Categories';
import Artist from './pages/Artist';
import Profile from './pages/Profile';
import Recently from './pages/Recently';
import Liked from './pages/Liked';

import UserPlaylists from './pages/UserPlaylists';
import UserArtists from './pages/UserArtists';
import UserAlbums from './pages/UserAlbums';

import getHashParams from './utils/getHashParams';

const token = getHashParams().access_token;

function PrivateRoute({ component: Component, ...rest }) {
    return(
        <Route {...rest} 
            render={props => 
                    token !== undefined ? (<Component {...props} />
                ) : (
                    <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
                )
            } 
        />
    )
}

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route path="/login" component={Login} />     
            <Body>
                <PrivateRoute exact path="/" component={Home} />
                <PrivateRoute path="/search" component={Search} />      
                <PrivateRoute path="/profile" component={Profile} />          
                <PrivateRoute path="/recently-played" component={Recently} />
                <PrivateRoute path="/collection/tracks" component={Liked} />
                <PrivateRoute path="/collection/playlists" component={UserPlaylists} />
                <PrivateRoute path="/collection/podcasts" component={Collection} />
                <PrivateRoute path="/collection/artists" component={UserArtists} />
                <PrivateRoute path="/collection/albums" component={UserAlbums} />
                <Route path="/album/id=:albumId" component={Album} />
                <Route path="/playlist/id=:playlistId" component={Playlist} />
                <Route path="/genre/id=:categoryId" component={Categories} />
                <Route path="/artist/id=:artistId" component={Artist} />
            </Body>
        </Switch>
    </BrowserRouter>
)

export default Routes;