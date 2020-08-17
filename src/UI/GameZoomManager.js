var localStorage = require('./LocalStorage');
var isMobile = require('./MobileDetect');

// GameZoomManager is a singleton.

var ZOOM_THRESHOLD = 3.0;
var LARGE_THRESHOLD = 2.5;
var SMALL_THRESHOLD = 0.5;

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
    if (zoom < LARGE_THRESHOLD) {
        setZoom(zoom + 0.1);
    }
}

function zoomOut() {
    if (zoom > SMALL_THRESHOLD) {
        setZoom(zoom - 0.1);
    }
}

function setZoom(z) {
    zoom = z;
    if (saveZoom) localStorage.lastZoom = z;
    if (onZoomChanged) onZoomChanged(z);
}

function percentSize() {
    return zoom
}

function setOnZoomChanged(callback) {
    onZoomChanged = callback;
}

function setSaveZoom(save) {
    saveZoom = save;
}

function resetZoomToDefault() {
    zoom = !isNaN(localStorage.lastZoom) ? parseInt(localStorage.lastZoom) :
        isMobile ? 1 : 1;
}

module.exports = {
    zoom: zoom,
    percentSize: percentSize,
    setZoom: setZoom,
    setOnZoomChanged: setOnZoomChanged,
    setSaveZoom: setSaveZoom,
    resetZoomToDefault: resetZoomToDefault,
    zoomIn: zoomIn,
    zoomOut: zoomOut,
    onWheel: onWheel,
};