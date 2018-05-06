class GameTiles extends React.Component {
    render() {
        const tileWidth = Math.floor(game.tilesContainer.clientWidth / game.fieldSize - 5);
        const tileHeight = Math.floor(game.tilesContainer.clientHeight / game.fieldSize - 5);

        return <div className="tilesContent">{
            this.props.tiles.map(tile =>
                <div key={tile.id}
                    style={{ width: `${tileWidth}px`, height: `${tileHeight}px` }}
                    className={tile.destroyed ? 'destroyed' : tile.checked ? 'active' : ''}> {
                        <div onClick={e => {
                            var tileElement = e.target.parentElement;
                            nextMove(tile);

                            (tile.checked ? tileElement.classList.add : tileElement.classList.remove)('active');
                            if (tileElement.destroyed)
                                tileElement.classList.add('destroyed');
                        }}>{String.fromCharCode(game.symbols[tile.coupleId])}</div>
                    }</div>)
        }</div>
    }
}

class GameState extends React.Component {
    render() {
        var resultString = '';
        if (this.props.movesCount) resultString += 'You made ' + this.props.movesCount + ' moves';
        if (this.props.failsCount) resultString += ', ' + this.props.failsCount + ' times failed';
        if (this.props.failsCount && this.props.pairsCount) resultString += ' and';
        else if (this.props.pairsCount) resultString += ',';
        if (this.props.pairsCount) resultString += ' ' + this.props.pairsCount + ' pairs found';
        if (resultString.length) resultString += '.';

        return <a>{resultString}</a>;
    }
}


var game = {
    lastId: 0,
    waiting: false,
    fieldSize: 4, tiles: [], symbols: [],
    movesCount: 0, pairsCount: 0, failsCount: 0,

    tilesContainer: null, gameStateContainer: null, winContainer: null,

    reset: () => {
        game.movesCount = 0;
        game.pairsCount = 0;
        game.failsCount = 0;
        game.tiles = [];
    }
};

function initGame(fieldSize, btn) {
    if (game.winContainer) game.winContainer.classList.remove('active');
    else game.winContainer = document.getElementsByClassName('winContainer')[0];

    if (fieldSize) game.fieldSize = fieldSize;
    if (btn && btn.parentElement) {
        var gameModeButtons = btn.parentElement.children;
        for (var i = 0; i < gameModeButtons.length; i++)
            if (gameModeButtons[i] != btn) gameModeButtons[i].classList.remove('active');
            else gameModeButtons[i].classList.add('active');
    }

    var counter = 0;
    game.reset();

    for (var i = 0; i < Math.pow(game.fieldSize, 2); i += 2) {
        //I know about DRY, but there's just 2 similar lines
        game.tiles.push({ id: game.lastId++, coupleId: counter, checked: false },
            { id: game.lastId++, coupleId: counter, checked: false });
        counter++;
    }

    for (var i = 0x4e00; i <= 0x9faf; i++) game.symbols.push(i);

    shuffleArray(game.tiles);
    renderGame();
}

function nextMove(currentTile) {
    if (!game.waiting) {
        currentTile.checked = !currentTile.checked;
        var checkedTiles = game.tiles.filter(tile => tile.checked && !tile.destroyed);

        if (checkedTiles.length >= 2) {
            game.waiting = true;
            game.movesCount++;

            setTimeout(() => {
                if (checkedTiles[0].coupleId == checkedTiles[1].coupleId) {
                    checkedTiles[0].destroyed = checkedTiles[1].destroyed = true;

                    if (game.tiles.filter(function (tile) { return !tile.destroyed; }).length === 0)
                        game.winContainer.classList.add('active');

                    game.pairsCount++;
                }
                else {
                    checkedTiles[0].checked = checkedTiles[1].checked = false;
                    game.failsCount++;
                }
                renderGame();
                game.waiting = false;
            }, 500);
        }

        renderGame();
    }
}

function renderGame() {
    if (!game.tilesContainer) game.tilesContainer = document.getElementById('tilesRoot');
    if (!game.gameStateContainer) game.gameStateContainer = document.getElementById('gameStateRoot');
    ReactDOM.render(<GameTiles tiles={game.tiles} />, game.tilesContainer);
    ReactDOM.render(
        <GameState movesCount={game.movesCount} failsCount={game.failsCount} pairsCount={game.pairsCount} />
        , game.gameStateContainer
    );
}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}