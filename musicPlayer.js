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

var PlayerComponent =
/*#__PURE__*/
function (_React$Component) {
  function PlayerComponent() {
    _classCallCheck(this, PlayerComponent);

    return _possibleConstructorReturn(this, _getPrototypeOf(PlayerComponent).apply(this, arguments));
  }

  _createClass(PlayerComponent, [{
    key: "render",
    value: function render() {
      return React.createElement("div", null, React.createElement("div", {
        className: "titleContainer"
      }, this.props.currentItem.artistName, " - ", this.props.currentItem.trackName), React.createElement("div", {
        className: "playerComponent"
      }, React.createElement("div", {
        className: "buttonsPanel"
      }, React.createElement("div", {
        className: "button prevButton"
      }), React.createElement("div", {
        className: "button playButton"
      }), React.createElement("div", {
        className: "button pauseButton"
      }), React.createElement("div", {
        className: "button nextButton"
      })), React.createElement("div", {
        className: "timeline"
      }, React.createElement("div", {
        className: "timelineLine"
      })), React.createElement("div", {
        className: "volume"
      }, React.createElement("div", {
        className: "volumeLine"
      }))));
    }
  }]);

  _inherits(PlayerComponent, _React$Component);

  return PlayerComponent;
}(React.Component);

var PlaylistComponent =
/*#__PURE__*/
function (_React$Component2) {
  function PlaylistComponent(props) {
    var _this;

    _classCallCheck(this, PlaylistComponent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PlaylistComponent).call(this, props));
    _this.search = _this.search.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.state = {
      searchRequest: ''
    };
    return _this;
  }

  _createClass(PlaylistComponent, [{
    key: "search",
    value: function search(e) {
      this.setState({
        searchRequest: e.target.value
      });
    }
  }, {
    key: "render",
    value: function render() {
      var searchRequest = this.state.searchRequest;
      return React.createElement("div", null, React.createElement("input", {
        className: "searchInput",
        placeholder: "Search for artists and tracks",
        value: searchRequest,
        onChange: this.search
      }), React.createElement("ul", null, this.props.playlist.filter(function (value) {
        return value.artistName.indexOf(searchRequest.trim()) >= 0 || value.trackName.indexOf(searchRequest.trim()) >= 0 || searchRequest.trim() == '';
      }).map(function (value) {
        return React.createElement("li", {
          key: ++player.nextId
        }, React.createElement("div", {
          className: "titleContainer"
        }, value.artistName, " - ", value.trackName), React.createElement("div", {
          className: "durationContainer"
        }, value.duration));
      })));
    }
  }]);

  _inherits(PlaylistComponent, _React$Component2);

  return PlaylistComponent;
}(React.Component);

var player = {
  currentItem: {},
  playlist: {},
  nextId: 0,
  playerContainer: null,
  playlistContainer: null
};

function initPlayer() {
  if (!player.playerContainer) player.playerContainer = document.getElementById('playerRoot');
  if (!player.playlistContainer) player.playlistContainer = document.getElementById('playlistRoot');
  ajax('playlist.json', function (result) {
    player.playlist = JSON.parse(result).tracks;
    if (player.playlist.length > 0) player.currentItem = player.playlist[0];
    ReactDOM.render(React.createElement(PlayerComponent, {
      currentItem: player.currentItem
    }), player.playerContainer);
    ReactDOM.render(React.createElement(PlaylistComponent, {
      playlist: player.playlist
    }), player.playlistContainer);
  }, null, null);
}

function ajax(url, callback) {
  try {
    var x = new (XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
    x.open('GET', url);
    x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    x.onreadystatechange = function () {
      return x.readyState > 3 && callback && callback(x.responseText);
    };

    x.send();
  } catch (e) {
    window.console && console.log(e);
  }
}

;