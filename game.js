var game = {
    lastId: 0,
    waiting: false,
    fieldSize: 4, tiles: [], symbols: [],
    movesCount: 0, pairsCount: 0, failsCount: 0,

    tilesContainer: null, gameStateContainer: null, winContainer: null
};

document.addEventListener('DOMContentLoaded', function (event) {
    initGame();
});

function initGame(fieldSize, btn) {
    if (!game.winContainer) game.winContainer = document.getElementsByClassName('winContainer')[0];
    game.winContainer.classList.toggle('active', false);

    if (fieldSize) game.fieldSize = fieldSize;
    if (btn) {
        var gameModeButtons = btn.parentElement.children;
        for (var i = 0; i < gameModeButtons.length; i++)
            if (gameModeButtons[i] != btn) gameModeButtons[i].classList.toggle('active', false);
            else gameModeButtons[i].classList.toggle('active', true);
    }

    var counter = 0;
    with (game) {
        movesCount = 0; pairsCount = 0; failsCount = 0;
    }

    game.tiles = [];
    for (var i = 0; i < Math.pow(game.fieldSize, 2); i += 2) {
        //I know about DRY, but there's just 2 similar lines
        game.tiles.push({ id: game.lastId++, coupleId: counter, checked: false });
        game.tiles.push({ id: game.lastId++, coupleId: counter, checked: false });
        counter++;
    }

    for (var i = 0x4e00; i <= 0x9faf; i++) game.symbols.push(i);

    shuffleArray(game.tiles);
    renderGame();
}

function nextMove(currentTile) {
    if (!game.waiting) {
        currentTile.checked = !currentTile.checked;
        var checkedTiles = game.tiles.filter(function (tile) { return tile.checked && !tile.destroyed; });

        if (checkedTiles.length >= 2) {
            waiting = true;
            game.movesCount++;

            setTimeout(function () {
                if (checkedTiles[0].coupleId == checkedTiles[1].coupleId) {
                    checkedTiles[0].destroyed = checkedTiles[1].destroyed = true;

                    if (game.tiles.filter(function (tile) { return !tile.destroyed; }).length === 0)
                        game.winContainer.classList.toggle('active', true);

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
    ReactDOM.render(React.createElement(GameTiles, { tiles: game.tiles }, null), game.tilesContainer);
    ReactDOM.render(React.createElement(GameState, {
        movesCount: game.movesCount,
        failsCount: game.failsCount,
        pairsCount: game.pairsCount
    }, null), game.gameStateContainer);
}

function GameTiles(props) {
    const tileWidth = Math.floor(game.tilesContainer.clientWidth / game.fieldSize - 4);
    const tileHeight = Math.floor(game.tilesContainer.clientHeight / game.fieldSize - 4);

    return React.createElement('div', {
        className: 'tilesContent'
    }, props.tiles.map(function (tile) {
        return React.createElement('div', {
            key: tile.id,
            style: {
                width: tileWidth + 'px',
                height: tileHeight + 'px'
            },
            className: tile.destroyed ? 'destroyed' : tile.checked ? 'active' : ''
        },
            React.createElement('div', {
                onClick: function (e) {
                    var tileElement = e.target.parentElement;
                    nextMove(tile);

                    tileElement.classList.toggle('active', tile.checked);
                    if (tileElement.destroyed)
                        tileElement.classList.add('destroyed');
                }
            }, String.fromCharCode(game.symbols[tile.coupleId])
            ));
    }));
}

function GameState(props) {
    var resultString = '';
    if (props.movesCount) resultString += 'You made ' + props.movesCount + ' moves';
    if (props.failsCount) resultString += ', ' + props.failsCount + ' times failed';
    if (props.failsCount && props.pairsCount) resultString += ' and';
    else if (props.pairsCount) resultString += ',';
    if (props.pairsCount) resultString += ' ' + props.pairsCount + ' pairs found';
    if (resultString.length) resultString += '.';

    return React.createElement('a', null, resultString);
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