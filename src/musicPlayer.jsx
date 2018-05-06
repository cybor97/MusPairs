class PlayerComponent extends React.Component {
    render() {
        return <div>
            <div className="titleContainer">{this.props.currentItem.artistName} - {this.props.currentItem.trackName}</div>
            <div className="playerComponent">
                <div className="buttonsPanel">
                    <div className="button prevButton"></div>
                    <div className="button playButton"></div>
                    <div className="button pauseButton"></div>
                    <div className="button nextButton"></div>
                </div>
                <div className="timeline">
                    <div className="timelineLine" />
                </div>
                <div className="volume">
                    <div className="volumeLine" />
                </div>
            </div>
        </div>;
    }
}

class PlaylistComponent extends React.Component {
    constructor(props) {
        super(props);
        this.search = this.search.bind(this);
        this.state = { searchRequest: '' };
    }

    search(e) {
        this.setState({ searchRequest: e.target.value });
    }

    render() {
        const searchRequest = this.state.searchRequest;
        return <div>
            <input className="searchInput" placeholder="Search for artists and tracks"
                value={searchRequest} onChange={this.search} />
            <ul>{
                this.props.playlist
                    .filter(value => value.artistName.indexOf(searchRequest.trim())>=0 ||
                        value.trackName.indexOf(searchRequest.trim())>=0||
                        searchRequest.trim()=='')
                    .map(value => <li key={++player.nextId}>
                        <div className="titleContainer">
                            {value.artistName} - {value.trackName}
                        </div>
                        <div className="durationContainer">{value.duration}</div>
                    </li>)
            }</ul></div>;
    }
}

var player = {
    currentItem: {},
    playlist: {}, nextId: 0,
    playerContainer: null, playlistContainer: null
}

function initPlayer() {
    if (!player.playerContainer) player.playerContainer = document.getElementById('playerRoot');
    if (!player.playlistContainer) player.playlistContainer = document.getElementById('playlistRoot');
    ajax('playlist.json', function (result) {
        player.playlist = JSON.parse(result).tracks;
        if (player.playlist.length > 0) player.currentItem = player.playlist[0];
        ReactDOM.render(<PlayerComponent currentItem={player.currentItem} />, player.playerContainer);
        ReactDOM.render(<PlaylistComponent playlist={player.playlist} />, player.playlistContainer);
    }, null, null);

}

function ajax(url, callback) {
    try {
        let x = new (XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
        x.open('GET', url);
        x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        x.onreadystatechange = () => x.readyState > 3 && callback && callback(x.responseText);
        x.send();
    } catch (e) {
        window.console && console.log(e);
    }
};