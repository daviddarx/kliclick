import * as content from '../content/pictures.json'

delete content.default;
const contentArray = Object.values(content);

// pictures
const Picture = function () {
  this.id = 0;
  this.imgURL = '';
  this.isLoaded = false;
  this.lightmode = 0;

  this.settings = {
    widthInit: 0,
    heightInit: 0,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    widthRatioToHeight: 0,
    heightRatioToWidth: 0,
    windowPadding: 0,
    windowWMax: 0,
    windowHMax: 0,
    stripesNumber: 10
  };

  this.refs = {
    $parent: undefined,
    $container: undefined,
    $stripes: undefined,
    $image: undefined,
    loadCompleteCallback: undefined,
    preloadCallback: undefined,
    displayTimeout: undefined,
  };


  this.init = (parent, id, imgURL, lightmode) => {
    this.refs.$parent = parent;
    this.id = id;
    this.imgURL = imgURL;
    this.lightmode = lightmode;

    this.refs.$container = document.createElement('div');
    this.refs.$container.classList.add('picture');
    this.refs.$parent.appendChild(this.refs.$container);

    if(this.id % 2 == 0){
      this.refs.$container.classList.add('is-even');
    }

    this.refs.$stripes = document.createElement('div');
    this.refs.$stripes.classList.add('picture__stripes');
    this.refs.$container.appendChild(this.refs.$stripes);

    for (let i = 0; i < this.settings.stripesNumber; i++) {
      const stripe = document.createElement('div');
            stripe.classList.add('picture__stripe');
      this.refs.$stripes.appendChild(stripe);
    }
  };

  this.load = (loadCompleteCallback, preloadCallback) => {
    this.refs.loadCompleteCallback = loadCompleteCallback;
    this.refs.preloadCallback = preloadCallback;
    this.createImage();
  };

  this.createImage = () => {
    this.refs.$image = new Image();
    this.refs.$image.load(this.imgURL);
    this.refs.$image.classList.add('picture__img');
    this.refs.$image.addEventListener('load', this.imageLoadComplete);
    this.refs.$container.appendChild(this.refs.$image);

    requestAnimationFrame(this.imagePreload);
  }

  this.imagePreload = () => {
    if (this.refs.preloadCallback) {
      this.refs.preloadCallback(this.refs.$image.completedPercentage);
    }

    if (this.refs.$image.completedPercentage < 100) {
      requestAnimationFrame(this.imagePreload);
    } else {
      this.refs.preloadCallback = undefined;
    }
  };

  this.imageLoadComplete = () => {
    this.isLoaded = true;

    if (this.refs.loadCompleteCallback) {
      this.refs.loadCompleteCallback();
      this.refs.loadCompleteCallback = undefined;
    }

    this.settings.widthInit = this.refs.$image.width;
    this.settings.heightInit = this.refs.$image.height;

    this.settings.widthRatioToHeight = this.settings.widthInit / this.settings.heightInit;
    this.settings.heightRatioToWidth = this.settings.heightInit / this.settings.widthInit;

    this.resize();
  };

  this.display = () => {
    this.refs.$container.classList.add('is-active');
    this.refs.$container.classList.add('is-on-top');

    this.clearDisplayTimeout();
    this.refs.displayTimeout = setTimeout(this.displayTimeoutListener, 100);
  }

  this.displayTimeoutListener = () => {
    this.refs.$container.classList.add('is-displayed');
  };

  this.clearDisplayTimeout = () => {
    if (this.refs.displayTimeout) {
      clearTimeout(this.refs.displayTimeout);
      this.refs.displayTimeout = undefined;
    }
  }

  this.hide = () => {
    this.refs.$container.remove.add('is-on-top');
  };

  this.setWindowPadding = (windowPadding) => {
    this.settings.windowPadding = windowPadding;
    this.settings.windowWMax = Math.floor(windowW - 2 * windowPadding);
    this.settings.windowHMax = Math.floor(windowH - 2 * windowPadding);
  }

  this.resize = () => {
    if (this.isLoaded == true) {
      this.settings.height = this.settings.windowHMax;
      this.settings.width = this.settings.height *  this.settings.widthRatioToHeight;
      this.settings.posX = Math.floor( this.settings.windowPadding + Math.random() * (this.settings.windowWMax - this.settings.width));
      this.settings.posY = this.settings.windowPadding;

      if (this.settings.width > this.settings.windowWMax) {
        this.settings.width = this.settings.windowWMax;
        this.settings.height = this.settings.width * this.settings.heightRatioToWidth;
        this.settings.posX = this.settings.windowPadding;
        this.settings.posY = Math.floor( this.settings.windowPadding + Math.random() * (this.settings.windowHMax - this.settings.height));
      }

      this.refs.$container.style.width = this.settings.width + 'px';
      this.refs.$container.style.height = this.settings.height + 'px';
      this.refs.$container.style.left = this.settings.posX + 'px';
      this.refs.$container.style.top = this.settings.posY + 'px';
    }
  };
};





//thumbs
const Thumb = function () {
  this.id = 0;
  this.imgURL = '';

  this.settings = {
    x: 0,
    y: 0,
    posX: 0,
    posY: 0,
    posXRandom: 0,
    posYRandom: 0,
    scale: 0,
    width: 0,
    height: 0,
    widthInit: 0,
    heightInit: 0,
    availableScale: 0.9,
    randomScaleMin: 0.2,
    randomScaleMax: 2,
    randomPositionMax: 0.1,
    scaleMax: 0.8,
  };

  this.refs = {
    $parent: undefined,
    $container: undefined,
    $image: undefined,
    clickCallback: undefined,
    loadCompleteCallback: undefined,
  };

  this.isLoaded = false;

  this.init = (parent, id, imgURL, clickCallback) => {
    this.refs.$parent = parent;
    this.id = id;
    this.imgURL = imgURL;
    this.refs.clickCallback = clickCallback;

    this.refs.$container = document.createElement('div');
    this.refs.$container.classList.add('thumb');
    this.refs.$parent.appendChild(this.refs.$container);
  };

  this.load = (loadCompleteCallback) => {
    this.refs.loadCompleteCallback = loadCompleteCallback;
    this.createImage();
  };

  this.createImage = () => {
    this.refs.$image = document.createElement('img');
    this.refs.$image.setAttribute('src',  this.imgURL);
    this.refs.$image.classList.add('thumb__img');
    this.refs.$image.addEventListener('load', this.imageLoadComplete);
    this.refs.$container.appendChild(this.refs.$image);

    this.refs.$container.addEventListener('click', this.click);
    this.refs.$container.addEventListener('touchstart', this.click);
  };

  this.imageLoadComplete = () => {
    this.settings.widthInit = this.refs.$image.width;
    this.settings.heightInit = this.refs.$image.height;

    this.refs.loadCompleteCallback();
    this.refs.loadCompleteCallback = undefined;
  };

  this.click = () => {
    this.refs.clickCallback(this.id);
  };

  this.setPosition = (x, y) => {
    this.settings.x = x;
    this.settings.y = y;

    const randomPositionMaxX = windowW * this.settings.randomPositionMax;
    const randomPositionMaxY = windowH * this.settings.randomPositionMax;

    if (this.settings.x != 0 ) {
      this.settings.posXRandom = Math.random() * randomPositionMaxX * 2 - randomPositionMaxX;
    } else {
      this.settings.posXRandom = Math.random() * randomPositionMaxX;
    }

    if (this.settings.y != 0 ) {
      this.settings.posYRandom = Math.random() * randomPositionMaxY * 2 - randomPositionMaxY;
    } else {
      this.settings.posYRandom = Math.random() * randomPositionMaxY;
    }
  }

  this.setSize = (width, height) => {
    const availableWidth = width * this.settings.availableScale;
    const availableBHeight = height * this.settings.availableScale;

    this.settings.width = availableWidth;
    this.settings.scale = availableWidth / this.settings.widthInit;
    this.settings.height = this.settings.scale * this.settings.heightInit;

    if (this.settings.height > availableBHeight) {
      this.settings.height = availableBHeight;
      this.settings.scale = availableBHeight / this.settings.heightInit;
      this.settings.width = this.settings.scale * this.settings.widthInit;
    }

    this.settings.scale = this.settings.randomScaleMin + this.settings.scale * Math.random(this.settings.randomScaleMax);

    if (this.settings.scale > this.settings.scaleMax) {
      this.settings.scale = this.settings.scaleMax;
    }
    this.refs.$container.style.setProperty('--s-scale', this.settings.scale);
  }

  this.place = () => {
    this.refs.$container.style.left = this.settings.x + this.settings.posX + this.settings.posXRandom + 'px';
    this.refs.$container.style.top = this.settings.y + this.settings.posY + this.settings.posYRandom + 'px';

    if (this.isLoaded == false) {
      this.refs.$container.classList.add('loaded');
      this.isLoaded = true;
    }
  };
}





//app
const App = function () {
  this.settings = {
    loadThumbsCurrentID: 0,
    totalPictures: 0,
    currentID: undefined,
    windowPaddingRatioToW: 0.025,
    imagesFolderURL: '/images/',
    imagesHDFolderURL: '_hd/',
    thumbsFolderURL: '_thumbs/',
    areThumbsDisplayed: true,
    changeLightModeTimeoutDuration: 1000,
    isPictureCalledFromThumbs: false,
    lightmodeChangeAdditionalThumbsDelay: 750
  };

  this.refs = {
    $logo: undefined,
    $thumbsContainer: undefined,
    $thumbsButton: undefined,
    thumbsRep: undefined,
    thumbsRepToRender: undefined,
    stepsXNumber: undefined,
    stepsYNumber: undefined,
    stepXDist: undefined,
    stepYDist: undefined,
    $picturesContainer: undefined,
    picturesRep: undefined,
    currentPicture: undefined,
    previousPicture: undefined,
    $nav: undefined,
    $navPrev: undefined,
    $navNext: undefined,
    $lightmodeButton: undefined,
    $paginationCurrent: undefined,
    $paginationTotal: undefined,
    timeoutChangeLightmode: undefined,
    // timeoutDisplayNextPicture: undefined,
    // timeoutHidePreviousPicture: undefined,
    // timeoutWheelDebounce: undefined,
    // pictureToHide: undefined,
  };

  this.init = () => {
    this.refs.$logo = document.querySelector('.logo');

    this.refs.$nav = document.querySelector('.navigation');
    this.refs.$navPrev = document.querySelector('.navigation-button--prev');
    this.refs.$navNext = document.querySelector('.navigation-button--next');
    this.refs.$navPrev.addEventListener('click', this.navigateButton);
    this.refs.$navPrev.addEventListener('touchstart', this.navigateButton);
    this.refs.$navNext.addEventListener('click', this.navigateButton);
    this.refs.$navNext.addEventListener('touchstart', this.navigateButton);

    this.refs.$lightmodeButton = document.querySelector('.lightmode-button');
    this.refs.$lightmodeButton.addEventListener('click', this.toggleLightmode);
    this.refs.$lightmodeButton.addEventListener('touchstart', this.toggleLightmode);

    this.settings.totalPictures = contentArray.length;

    this.refs.$paginationCurrent = document.querySelector('.pagination__current');
    this.refs.$paginationTotal = document.querySelector('.pagination__total');
    this.refs.$paginationTotal.innerHTML = this.settings.totalPictures;
    this.updatePagination();

    window.addEventListener('keydown', this.navigateKeyboard, false);
    // window.addEventListener('wheel', (e) => {
    //   if (this.refs.timeoutWheelDebounce) {
    //     clearTimeout(this.refs.timeoutWheelDebounce);
    //   }
    //   this.refs.timeoutWheelDebounce = setTimeout(()=> {
    //     this.navigateWheel(e.deltaY);
    //   }, 100);
    // });

    this.refs.$picturesContainer = document.querySelector('.pictures');
    this.refs.$thumbsContainer = document.querySelector('.thumbs');
    this.refs.$thumbsButton = document.querySelector('.thumbs-button');
    this.refs.$thumbsButton.addEventListener('click', this.toggleThumbs);
    this.refs.$thumbsButton.addEventListener('touchstart', this.toggleThumbs);

    const imgHDFolder = (windowW * window.devicePixelRatio > 1600) ? this.settings.imagesHDFolderURL : '';

    this.refs.picturesRep = [];
    this.refs.thumbsRep = [];
    this.refs.thumbsRepToRender = [];

    contentArray.forEach((item, i) => {
      const thumbItem = new Thumb();
            thumbItem.init(
              this.refs.$thumbsContainer,
              i,
              this.settings.imagesFolderURL+this.settings.thumbsFolderURL+item[0],
              this.thumbsClickListener
            );
      this.refs.thumbsRep.push(thumbItem);

      const pictureItem = new Picture();
            pictureItem.init(
              this.refs.$picturesContainer,
              i,
              this.settings.imagesFolderURL+imgHDFolder+item[0],
              item[1]
            );
      this.refs.picturesRep.push(pictureItem);
    });

    this.refs.thumbsRep[0].load(this.thumbsLoadCompleteListener);
    this.refs.picturesRep[0].load();
    this.refs.picturesRep[this.refs.picturesRep.length - 1].load();
  };

  this.thumbsLoadCompleteListener = () => {
    const item = this.refs.thumbsRep[this.settings.loadThumbsCurrentID];
    this.placeThumb(item);
    this.refs.thumbsRepToRender.push(item);

    if (this.settings.loadThumbsCurrentID < this.settings.totalPictures-1) {
      this.settings.loadThumbsCurrentID++;
      this.refs.thumbsRep[this.settings.loadThumbsCurrentID].load(this.thumbsLoadCompleteListener);
    }
  };

  this.calculateThumbsPosition = () => {
    const totalThumbs = this.refs.thumbsRep.length;

    this.settings.stepsXNumber = Math.ceil(Math.sqrt(totalThumbs));
    this.settings.stepsYNumber = Math.ceil(Math.sqrt(totalThumbs));

    if(windowW/windowH > 1.25){
      this.settings.stepsXNumber++;
      this.settings.stepsYNumber = Math.ceil(totalThumbs / this.settings.stepsXNumber);
    } else if(windowW/windowH < 0.8){
      this.settings.stepsXNumber--;
      this.settings.stepsYNumber = Math.ceil(totalThumbs / this.settings.stepsXNumber);
    }

    this.settings.stepXDist = windowW / this.settings.stepsXNumber;
    this.settings.stepYDist = windowH / this.settings.stepsYNumber;
  };

  this.placeThumb = (thumbItem) => {
    const lineID = Math.floor(thumbItem.id/this.settings.stepsXNumber);

    thumbItem.setPosition(
      thumbItem.id * this.settings.stepXDist - lineID * windowW,
      Math.floor(thumbItem.id/this.settings.stepsXNumber) * this.settings.stepYDist
    );
    thumbItem.setSize(
      this.settings.stepXDist,
      this.settings.stepYDist
    );
    thumbItem.place();
  };

  this.toggleThumbs = () => {
    if (this.settings.areThumbsDisplayed == true) {
      document.body.classList.remove('thumbs-displayed');
      this.settings.areThumbsDisplayed = false;
    } else {
      document.body.classList.add('thumbs-displayed');
      this.settings.areThumbsDisplayed = true;
    }
  };

  this.thumbsClickListener = (id) => {
    this.settings.isPictureCalledFromThumbs = true;
    this.displayImage(id);
  };

  this.displayImage = (id) => {
    this.settings.currentID = id;
    this.refs.previousPicture = this.refs.currentPicture;
    this.refs.currentPicture = this.refs.picturesRep[this.settings.currentID];

    if (this.refs.currentPicture.isLoaded == false) {
      this.refs.currentPicture.load(this.imageLoadCompleteListener, this.imagePreloadListener);
      document.body.classList.remove('is-loaded');
      document.body.classList.add('is-loading');
    } else {
      this.imageLoadCompleteListener();
    }
  };

  this.imagePreloadListener = (completedPercentage) => {
    this.refs.$logo.style.setProperty('--s-loaded', completedPercentage / 100);
  };

  this.imageLoadCompleteListener = () => {
    document.body.classList.add('is-loaded');
    document.body.classList.remove('is-loading');

    if(this.refs.previousPicture){
      this.refs.previousPicture.hide();
    }

    this.refs.currentPicture.display();

    if (this.settings.areThumbsDisplayed == true) {
      this.toggleThumbs();
      this.changeLightmode(this.refs.currentPicture.lightmode, this.settings.lightmodeChangeAdditionalThumbsDelay);
    } else {
      this.changeLightmode(this.refs.currentPicture.lightmode, 0);
    }
  };

  // this.changePicture = () => {
  //   this.refs.$pictures[this.settings.currentID].classList.add('is-on-top');
  //   this.refs.$pictures[this.settings.currentID].classList.add('is-active');

  //   this.changeLightmode(true);

  //   if (this.refs.timeoutDisplayNextPicture != undefined) {
  //     clearTimeout(this.refs.timeoutDisplayNextPicture);
  //   }
  //   this.refs.timeoutDisplayNextPicture = setTimeout(this.displayNextPicture, 100);

  //   if (this.settings.previousID != undefined) {
  //     this.refs.$pictures[this.settings.previousID].classList.remove('is-on-top');
  //     if (this.refs.timeoutHidePreviousPicture != undefined) {
  //       clearTimeout(this.refs.timeoutHidePreviousPicture);
  //       if (this.settings.currentID != parseInt(this.refs.pictureToHide.getAttribute("rel"))) { //to avoid overwriting bug if user go next/prev quickly
  //         this.deactivePreviousPicture();
  //       }
  //     }
  //     this.refs.pictureToHide = this.refs.$pictures[this.settings.previousID];
  //     this.refs.timeoutHidePreviousPicture = setTimeout(this.hidePreviousPicture, 1000);
  //   }
  // };

  // this.displayNextPicture = () => {
  //   this.refs.$pictures[this.settings.currentID].classList.add('is-displayed');
  //   this.refs.timeoutDisplayNextPicture = undefined;
  // };

  // this.hidePreviousPicture = () => {
  //   this.refs.pictureToHide.classList.remove('is-displayed');
  //   this.refs.timeoutHidePreviousPicture = setTimeout(this.deactivePreviousPicture, 1700);
  // };

  // this.deactivePreviousPicture = () => {
  //   this.refs.pictureToHide.classList.remove('is-displayed'); //for direct call to overwrite first animation out step
  //   this.refs.pictureToHide.classList.remove('is-active');
  //   this.refs.timeoutHidePreviousPicture = undefined;
  // };

  this.setPicturePrev = () => {
    if (this.settings.currentID == undefined) {
      this.settings.currentID = this.refs.picturesRep.length - 1;
    } else {
      if (this.settings.currentID > 0 ) {
        this.settings.currentID--;
      } else {
        this.settings.currentID = this.refs.picturesRep.length - 1;
      }
    }
    this.displayImage(this.settings.currentID);
  };

  this.setPictureNext = () => {
    if (this.settings.currentID == undefined) {
      this.settings.currentID = 0;
    } else {
      if (this.settings.currentID < this.settings.totalPictures - 1 ) {
        this.settings.currentID++;
      } else {
        this.settings.currentID = 0;
      }
    }
    console.log(this.settings.currentID);
    this.displayImage(this.settings.currentID);
  };

  this.navigateButton = (e) => {
    if (e.currentTarget == this.refs.$navPrev) {
      this.setPicturePrev();
    } else {
      this.setPictureNext();
    }
  };

  this.navigateKeyboard = (e) => {
    const key = e.keyCode ? e.keyCode : e.which;

    if (key == 38) {
      this.setPicturePrev();
    } else if (key == 40) {
      this.setPictureNext();
    } else if (key == 66) {
      this.toggleLightmode();
    }

    if (key == 38 || key == 40 | key == 66) {
      e.preventDefault();
    }
  }

  this.updatePagination = () => {
    let zero = '';
    let current = (this.settings.currentID == undefined) ? 0 : this.settings.totalPictures - this.settings.currentID;

    if (this.settings.totalPictures >= 10 && current < 10) {
      zero = '0';
    } else if (this.settings.totalPictures >= 100 && current < 100) {
      zero = '00';
    }

    this.refs.$paginationCurrent.innerHTML = zero + current;
  }

  this.toggleLightmode = () => {
    if (this.refs.timeoutChangeLightmode != undefined) {
      clearTimeout(this.refs.timeoutChangeLightmode);
    }
    document.body.classList.toggle('is-inverted');
  };

  this.changeLightmode = (isLight) => {
    let additionalDelay = 0;

    if (this.settings.isPictureCalledFromThumbs == true) {
      additionalDelay = this.settings.lightmodeChangeAdditionalThumbsDelay;
      this.settings.isPictureCalledFromThumbs = false;
    }

    if (this.refs.timeoutChangeLightmode != undefined) {
      clearTimeout(this.refs.timeoutChangeLightmode);
    }

    this.refs.timeoutChangeLightmode = setTimeout( () => {
      if (isLight == 0) {
        document.body.classList.add('is-inverted');
      }else {
        document.body.classList.remove('is-inverted');
      }
    }, this.settings.changeLightModeTimeoutDuration + additionalDelay);
  }

  // this.navigateWheel = (delta) => {
  //   if (delta > 0) {
  //     this.setPictureNext();
  //   } else {
  //     this.setPicturePrev();
  //   }

  //   return false;
  // };

  this.resize = () => {
    const windowPadding = Math.floor(windowW * this.settings.windowPaddingRatioToW);

    this.refs.$nav.style.right = windowPadding + 'px';
    this.refs.$nav.style.bottom = windowPadding + 'px';

    this.refs.$lightmodeButton.style.left = windowPadding + 'px';
    this.refs.$lightmodeButton.style.top = windowPadding + 'px';

    this.refs.$thumbsButton.style.right = windowPadding + 'px';
    this.refs.$thumbsButton.style.top = windowPadding + 'px';

    this.refs.picturesRep.forEach((pictureItem) => {
      pictureItem.setWindowPadding(windowPadding);
      pictureItem.resize();
    });

    this.calculateThumbsPosition();

    this.refs.thumbsRepToRender.forEach(item => {
      this.placeThumb(item);
    });
  };
};

let app = undefined;





//general
let windowW = 0;
let windowH = 0;

const resizeListener = () => {
  windowW = (window.innerWidth || screen.width);
  windowH = (window.innerHeight || screen.height);

  if(app) {
    app.resize();
  }
};



//init
const init = () => {
  resizeListener();

  app = new App();
  app.init();

  window.addEventListener('resize', resizeListener);
  resizeListener();

  document.body.classList.add('is-computed');
};




//utils
Image.prototype.load = function(url){
  var thisImg = this;
  var xmlHTTP = new XMLHttpRequest();
  xmlHTTP.open('GET', url,true);
  xmlHTTP.responseType = 'arraybuffer';
  xmlHTTP.onload = function(e) {
    var blob = new Blob([this.response]);
    thisImg.src = window.URL.createObjectURL(blob);
  };
  xmlHTTP.onprogress = function(e) {
    thisImg.completedPercentage = parseInt((e.loaded / e.total) * 100);
  };
  xmlHTTP.onloadstart = function() {
    thisImg.completedPercentage = 0;
  };
  xmlHTTP.send();
};

Image.prototype.completedPercentage = 0;



init();
