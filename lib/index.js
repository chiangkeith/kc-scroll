import "babel-polyfill";

export function currentYPosition() {
  // Firefox, Chrome, Opera, Safari
  if (self.pageYOffset) {
    return self.pageYOffset;
  }
  // Internet Explorer 6 - standards mode
  if (document.documentElement && document.documentElement.scrollTop) {
    return document.documentElement.scrollTop;
  }
  // Internet Explorer 6, 7 and 8
  if (document.body.scrollTop) {
    return document.body.scrollTop;
  }
  return 0;
}

export function elmYPosition(eID) {
  let elm = document.querySelector(eID);
  if (!elm) { 
    console.log('cannot find element', eID)
    return
  }
  let y = elm.offsetTop;
  let node = elm;
  while (node.offsetParent && node.offsetParent != document.body) {
      node = node.offsetParent;
      y += node.offsetTop;
  } return y;
}

export function smoothScroll(eID, yPos, steps) {
  let startY = currentYPosition();
  let stopY = (yPos !== null && yPos !== undefined) ? yPos : elmYPosition(eID);
  let distance = stopY > startY ? stopY - startY : startY - stopY;
  if (distance < 100) { 
    scrollTo(0, stopY); 
    return;
  }
  let speed = Math.round(distance / 50);
  //do scrollTo after every single 'speed'
  if (speed > 20) speed = 20;
  if (speed < 10) speed = 10;

  let _stepTimes = (steps !== null && steps !== undefined) ? steps : 25
  let step = Math.round(distance / _stepTimes);
  //do scrollTo for every 'step'px for 25 times
  let leapY = stopY > startY ? startY + step : startY - step;
  let timer = 1;
  if (stopY > startY) {
      for (let i = startY; i < stopY; i += step) {
          setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
          leapY += step; 
          if (leapY > stopY) leapY = stopY; 
          timer += 1;
      }
      return;
  }
  for ( let i = startY; i > stopY; i -= step ) {
      setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
      leapY -= step;
      if (leapY < stopY) leapY = stopY; 
      timer += 1;
  }
}