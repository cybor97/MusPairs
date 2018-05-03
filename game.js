var game = {
    fieldSize: 4,
    elements: [],//{id, checked}, id - unique for couple, checked - bool,
    tilesContainer: null,
    symbols:[]
};

document.addEventListener('DOMContentLoaded', function (event) {
    initGame();
});



function initGame(fieldSize) {
    if (fieldSize) game.fieldSize = fieldSize;
    var counter = 0;
    for (var i = 0; i < Math.pow(game.fieldSize, 2); i += 2) {
        game.elements.push({ id: counter, checked: false });
        game.elements.push({ id: counter, checked: false });
        counter++;
    }

    for(var i = 0x4e00; i<=0x9faf; i++) game.symbols.push(i);

    shuffleArray(game.elements);
    renderGameTiles();
}

function renderGameTiles(){
    if (!game.tilesContainer) game.tilesContainer = document.getElementById('tilesRoot');
    ReactDOM.render(
        React.createElement(GameTiles, { elements: game.elements }, null),
        game.tilesContainer
    );
}

function GameTiles(props) {
    const elementsHtml = props.elements.map(function (element, index) {
        const tileWidth = game.tilesContainer.clientWidth / game.fieldSize-4;
        const tileHeight = game.tilesContainer.clientHeight / game.fieldSize-4;
        return React.createElement('a', {
            key: index,
            style: {
                width: tileWidth + 'px',
                height: tileHeight + 'px'
            }
        }, String.fromCharCode(game.symbols[element.id]));
    });
    return React.createElement('div', {
        className: 'tilesContent'
    }, elementsHtml);
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