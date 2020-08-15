var localStorage = require('./LocalStorage');
var isMobile = require('./MobileDetect');

// GameZoomManager is a singleton.

var ZOOM_LARGE = -1;
var ZOOM_DEFAULT = 0;
var ZOOM_SMALL = 1;
var ZOOM_TINY = 2;
var ZOOM_TINY2 = 3;

var ZOOM_THRESHOLD = 50.0;

var zoom;
resetZoomToDefault();
var wheel = 0;

var onZoomChanged;
var saveZoom = true;

function onWheel(e) {
    e.preventDefault();
    wheel += e.deltaY;
    if (Math.abs(wheel) > ZOOM_THRESHOLD) {
        if (wheel < 0) zoomIn();
        else zoomOut();
        wheel = 0;
    }
}

function zoomIn() {
    if (zoom > ZOOM_LARGE) {
        setZoom(zoom - 1);
    }
}

function zoomOut() {
    if (zoom < ZOOM_TINY) {
        setZoom(zoom + 1);
    }
}

function setZoom(z) {
    zoom = z;
    if (saveZoom) localStorage.lastZoom = z;
    if (onZoomChanged) onZoomChanged(z);
}

function zoomClass() {
    switch (zoom) {
        case ZOOM_LARGE: return 'large';
        case ZOOM_SMALL: return 'small';
        case ZOOM_TINY: return 'tiny';
        case ZOOM_TINY2: return 'tiny2';
        default: return 'small';
    }
}

function cellSize() {
    switch (zoom) {
        case ZOOM_TINY2: return 28;
        case ZOOM_TINY: return 32;
        case ZOOM_SMALL: return 40;
        case ZOOM_LARGE: return 60;
        default: return 50;
    }
}

function setOnZoomChanged(callback) {
    onZoomChanged = callback;
}

function setSaveZoom(save) {
    saveZoom = save;
}

function resetZoomToDefault() {
    zoom = !isNaN(localStorage.lastZoom) ? parseInt(localStorage.lastZoom) :
        isMobile ? ZOOM_TINY : ZOOM_DEFAULT;
}

module.exports = {
    ZOOM_LARGE: ZOOM_LARGE,
    ZOOM_DEFAULT: ZOOM_DEFAULT,
    ZOOM_SMALL: ZOOM_SMALL,
    ZOOM_TINY: ZOOM_TINY,
    ZOOM_TINY2: ZOOM_TINY2,
    zoom: zoom,
    setZoom: setZoom,
    setOnZoomChanged: setOnZoomChanged,
    setSaveZoom: setSaveZoom,
    resetZoomToDefault: resetZoomToDefault,
    zoomIn: zoomIn,
    zoomOut: zoomOut,
    onWheel: onWheel,
    zoomClass: zoomClass,
    cellSize: cellSize,
};