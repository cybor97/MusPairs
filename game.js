"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } _setPrototypeOf(subClass.prototype, superClass && superClass.prototype); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.getPrototypeOf || function _getPrototypeOf(o) { return o.__proto__; }; return _getPrototypeOf(o); }

var GameTiles =
/*#__PURE__*/
function (_React$Component) {
  function GameTiles() {
    _classCallCheck(this, GameTiles);

    return _possibleConstructorReturn(this, _getPrototypeOf(GameTiles).apply(this, arguments));
  }

  _createClass(GameTiles, [{
    key: "render",
    value: function render() {
      var tileWidth = Math.floor(game.tilesContainer.clientWidth / game.fieldSize - 5);
      var tileHeight = Math.floor(game.tilesContainer.clientHeight / game.fieldSize - 5);
      return React.createElement("div", {
        className: "tilesContent"
      }, this.props.tiles.map(function (tile) {
        return React.createElement("div", {
          key: tile.id,
          style: {
            width: "".concat(tileWidth, "px"),
            height: "".concat(tileHeight, "px")
          },
          className: tile.destroyed ? 'destroyed' : tile.checked ? 'active' : ''
        }, " ", React.createElement("div", {
          onClick: function onClick(e) {
            var tileElement = e.target.parentElement;
            nextMove(tile);
            (tile.checked ? tileElement.classList.add : tileElement.classList.remove)('active');
            if (tileElement.destroyed) tileElement.classList.add('destroyed');
          }
        }, String.fromCharCode(game.symbols[tile.coupleId])));
      }));
    }
  }]);

  _inherits(GameTiles, _React$Component);

  return GameTiles;
}(React.Component);

var GameState =
/*#__PURE__*/
function (_React$Component2) {
  function GameState() {
    _classCallCheck(this, GameState);

    return _possibleConstructorReturn(this, _getPrototypeOf(GameState).apply(this, arguments));
  }

  _createClass(GameState, [{
    key: "render",
    value: function render() {
      var resultString = '';
      if (this.props.movesCount) resultString += 'You made ' + this.props.movesCount + ' moves';
      if (this.props.failsCount) resultString += ', ' + this.props.failsCount + ' times failed';
      if (this.props.failsCount && this.props.pairsCount) resultString += ' and';else if (this.props.pairsCount) resultString += ',';
      if (this.props.pairsCount) resultString += ' ' + this.props.pairsCount + ' pairs found';
      if (resultString.length) resultString += '.';
      return React.createElement("a", null, resultString);
    }
  }]);

  _inherits(GameState, _React$Component2);

  return GameState;
}(React.Component);

var game = {
  lastId: 0,
  waiting: false,
  fieldSize: 4,
  tiles: [],
  symbols: [],
  movesCount: 0,
  pairsCount: 0,
  failsCount: 0,
  tilesContainer: null,
  gameStateContainer: null,
  winContainer: null,
  reset: function reset() {
    game.movesCount = 0;
    game.pairsCount = 0;
    game.failsCount = 0;
    game.tiles = [];
  }
};

function initGame(fieldSize, btn) {
  if (game.winContainer) game.winContainer.classList.remove('active');else game.winContainer = document.getElementsByClassName('winContainer')[0];
  if (fieldSize) game.fieldSize = fieldSize;

  if (btn && btn.parentElement) {
    var gameModeButtons = btn.parentElement.children;

    for (var i = 0; i < gameModeButtons.length; i++) {
      if (gameModeButtons[i] != btn) gameModeButtons[i].classList.remove('active');else gameModeButtons[i].classList.add('active');
    }
  }

  var counter = 0;
  game.reset();

  for (var i = 0; i < Math.pow(game.fieldSize, 2); i += 2) {
    //I know about DRY, but there's just 2 similar lines
    game.tiles.push({
      id: game.lastId++,
      coupleId: counter,
      checked: false
    }, {
      id: game.lastId++,
      coupleId: counter,
      checked: false
    });
    counter++;
  }

  for (var i = 0x4e00; i <= 0x9faf; i++) {
    game.symbols.push(i);
  }

  shuffleArray(game.tiles);
  renderGame();
}

function nextMove(currentTile) {
  if (!game.waiting) {
    currentTile.checked = !currentTile.checked;
    var checkedTiles = game.tiles.filter(function (tile) {
      return tile.checked && !tile.destroyed;
    });

    if (checkedTiles.length >= 2) {
      game.waiting = true;
      game.movesCount++;
      setTimeout(function () {
        if (checkedTiles[0].coupleId == checkedTiles[1].coupleId) {
          checkedTiles[0].destroyed = checkedTiles[1].destroyed = true;
          if (game.tiles.filter(function (tile) {
            return !tile.destroyed;
          }).length === 0) game.winContainer.classList.add('active');
          game.pairsCount++;
        } else {
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
  ReactDOM.render(React.createElement(GameTiles, {
    tiles: game.tiles
  }), game.tilesContainer);
  ReactDOM.render(React.createElement(GameState, {
    movesCount: game.movesCount,
    failsCount: game.failsCount,
    pairsCount: game.pairsCount
  }), game.gameStateContainer);
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