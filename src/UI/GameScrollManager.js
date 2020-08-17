// GameScrollManager is a singleton.

var isClick = true
var mouseDownLocation
var prevMouseLocation

var dragCallback
var clickCallback

function handleMouseDown (e) {
  isClick = true
  mouseDownLocation = {
    x: e.clientX,
    y: e.clientY
  }
  prevMouseLocation = mouseDownLocation
}

function handleMouseMove (e) {
  if (!mouseDownLocation || !prevMouseLocation) return

  // If still categorized as a click, check if far enough away to switch to drag now.
  if (isClick) {
    var distSquared =
			Math.pow(e.clientX - mouseDownLocation.x, 2) +
			Math.pow(e.clientY - mouseDownLocation.y, 2)
    if (distSquared >= 625) {
      isClick = false
    }
  }
  // Otherwise, it's a drag.
  else {
    if (dragCallback) dragCallback(e.clientX - prevMouseLocation.x, e.clientY - prevMouseLocation.y)
    prevMouseLocation = {
      x: e.clientX,
      y: e.clientY
    }
  }
}

function handleMouseUp () {
  if (isClick && clickCallback) {
    clickCallback()
  }
  prevMouseLocation = null
  mouseDownLocation = null
  isClick = null
}

// @param callback Takes params (dx, dy). Called when a mousedown ends up being a drag.
function setDragCallback (callback) {
  dragCallback = callback
}

// @param callback Takes params (). Called when a mousedown ends up being a click.
function setClickCallback (callback) {
  clickCallback = callback
}

module.exports = {
  handleMouseDown: handleMouseDown,
  handleMouseMove: handleMouseMove,
  handleMouseUp: handleMouseUp,
  setDragCallback: setDragCallback,
  setClickCallback: setClickCallback
}
