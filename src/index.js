import * as PIXI from 'pixi.js'
import gsap from "gsap/all"
import * as content from '../content/pictures.json'

delete content.default;
const contentArray = Object.values(content);

//pictures
// const Picture = function () {

//   this.settings = {
//     id: 0,
//     thumbURL: '',
//     imgURL: '',
//     imgWidth: 0,
//     imgHeight: 0,
//     width: 0,
//     height: 0,
//     posX: 0,
//     posY: 0,
//     widthRatioToHeight: 0,
//     heightRatioToWidth: 0,
//     windowPadding: 0,
//     windowWMax: 0,
//     windowHMax: 0,
//   };

//   this.refs = {
//     $div: undefined,
//     $img: undefined,
//     loadCompleteCallback: undefined
//   };

//   this.isLoaded = false;

//   this.init = (picture, id, hd) => {
//     this.settings.id = id;
//     this.refs.$div = picture;
//     this.refs.$img = picture.querySelector('img');

//     const splittedURL = this.refs.$img.getAttribute('rel').split('/');
//     this.settings.imgURL = splittedURL[0] + '/' + hd + splittedURL[1];
//     this.settings.thumbURL = splittedURL[0] + '/' +  '_thumbs/' + splittedURL[1];
//   };

//   this.load = (loadCompleteCallback) => {
//     this.refs.$img.setAttribute('src', this.settings.imgURL);
//     this.refs.$img.addEventListener('load', this.loadComplete);
//     this.refs.loadCompleteCallback = loadCompleteCallback;
//   };

//   this.loadComplete = () => {
//     const $imageClone = this.refs.$img.cloneNode(true);
//     this.refs.$img.parentNode.replaceChild($imageClone, this.refs.$img);
//     this.refs.$img = $imageClone;

//     setTimeout(() => { //safari debug naturalWidth
//       this.settings.imgWidth = this.refs.$img.naturalWidth;
//       this.settings.imgHeight = this.refs.$img.naturalHeight;

//       this.settings.widthRatioToHeight = this.settings.imgWidth / this.settings.imgHeight;
//       this.settings.heightRatioToWidth = this.settings.imgHeight / this.settings.imgWidth;

//       this.refs.loadCompleteCallback();
//       this.refs.loadCompleteCallback = undefined;

//       this.isLoaded = true;
//       this.resize();

//       this.refs.$div.classList.add('is-loaded');
//     }, 100);
//   };

//   this.setWindowPadding = (padding) => {
//     this.settings.windowPadding = padding;
//     this.settings.windowWMax = Math.floor(windowW - 2 * padding);
//     this.settings.windowHMax = Math.floor(windowH - 2 * padding);
//   }

//   this.resize = () => {
//     if (this.isLoaded == true) {
//       this.settings.height = this.settings.windowHMax;
//       this.settings.width = this.settings.height *  this.settings.widthRatioToHeight;
//       this.settings.posX = Math.floor( this.settings.windowPadding + Math.random() * (this.settings.windowWMax - this.settings.width));
//       this.settings.posY = this.settings.windowPadding;

//       if (this.settings.width > this.settings.windowWMax) {
//         this.settings.width = this.settings.windowWMax;
//         this.settings.height = this.settings.width * this.settings.heightRatioToWidth;
//         this.settings.posX = this.settings.windowPadding;
//         this.settings.posY = Math.floor( this.settings.windowPadding + Math.random() * (this.settings.windowHMax - this.settings.height));
//       }

//       this.refs.$div.style.width = this.settings.width + 'px';
//       this.refs.$div.style.height = this.settings.height + 'px';
//       this.refs.$div.style.left = this.settings.posX + 'px';
//       this.refs.$div.style.top = this.settings.posY + 'px';
//     }
//   };
// };





//thumbs
const Thumb = function () {
  this.id = 0;
  this.imgURL = '';

  this.settings = {
    x: 0,
    y: 0,
    spriteX: 0,
    spriteY: 0,
    spriteXRandom: 0,
    spriteYRandom: 0,
    scale: 0,
    width: 0,
    height: 0,
    widthInit: 0,
    heightInit: 0,
    availableScale: 0.9,
    randomScaleMin: 0.2,
    randomScaleMax: 2,
    randomPositionMax: 0.1,
    scaleHover: 1,
    scaleMax: 0.9,
    scaleAnimationInDuration: 0.5,
    scaleAnimationInEase: "expo.out",
    scaleAnimationOutDuration: 0.25,
    scaleAnimationOutEase: "expo.inOut",
    maskAnimationOutDuration: 0.5,
    maskAnimationOutEase: "expo.inOut"
  };

  this.refs = {
    app: undefined,
    parent: undefined,
    container: undefined,
    image: undefined,
    mask: undefined,
    loadCompleteCallback: undefined,
    positionOnClick: undefined
  };

  this.isLoaded = false;

  this.init = (app, parent, id, imgURL) => {
    this.refs.app = app;
    this.refs.parent = parent;
    this.id = id;
    this.imgURL = imgURL;
  };

  this.load = (loadCompleteCallback) => {
    if (!PIXI.Loader.shared.resources[this.imgURL]) {
      PIXI.Loader.shared.add(this.imgURL).load(() => {
        this.createImage();
        loadCompleteCallback();
      });
    } else {
      this.createImage();
      loadCompleteCallback();
    }
  };

  this.createImage = () => {
    this.refs.container = new PIXI.Container();
    this.refs.parent.addChild(this.refs.container);

    this.refs.image = new PIXI.Sprite(PIXI.Loader.shared.resources[this.imgURL].texture);
    this.refs.image.anchor.set(0.5);
    this.refs.image.interactive = true;
    this.refs.image.buttonMode = true;
    this.refs.image.zIndex = this.id;
    this.refs.image.on('pointerdown', this.pointerDown);
    this.refs.image.on('pointerup', this.pointerUp);
    this.refs.image.on('pointerover', this.mouseOver);
    this.refs.image.on('pointerout', this.mouseOut);
    this.refs.image.on('pointerupoutside', this.mouseOut);
    this.refs.image.on('pointermove', this.move);
    this.refs.container.addChild(this.refs.image);
    this.settings.widthInit = this.refs.image.width;
    this.settings.heightInit = this.refs.image.height;

    this.refs.mask = new PIXI.Graphics();
    this.refs.mask.beginFill(this.refs.app.masksColor);
    this.refs.mask.drawRect(this.refs.image.width * -1, this.refs.image.height * -1, this.refs.image.width, this.refs.image.height);
    this.refs.mask.endFill();
    this.refs.mask.position.set(this.refs.image.width * 0.5,  this.refs.image.height * 0.5);
    this.refs.container.addChild(this.refs.mask);

    this.refs.mask.tween = gsap.to(this.refs.mask.scale, {
      duration: this.settings.maskAnimationOutDuration,
      x: 0,
      ease: this.settings.maskAnimationOutEase
    });
  };

  this.pointerDown = (event) => {
    this.refs.positionOnClick = {
      x: this.refs.container.x,
      y: this.refs.container.y
    };
    this.refs.container.data = event.data;
    this.refs.container.dragging = true;
  };

  this.pointerUp = () => {
    this.refs.container.dragging = false;
    if (this.refs.container.x == this.refs.positionOnClick.x && this.refs.container.y == this.refs.positionOnClick.y) {
      console.log(this.id);
    }
  };

  this.move = () => {
    if (this.refs.container.dragging) {
      const newPosition = this.refs.container.data.getLocalPosition(this.refs.container.parent);
      this.refs.container.x = newPosition.x;
      this.refs.container.y = newPosition.y;
    }
  };

  this.mouseOver = () => {
    this.refs.container.zIndex = 1000;
    this.refs.container.tween = gsap.to(this.refs.container.scale, {
      duration: this.settings.scaleAnimationInDuration,
      x: this.settings.scaleHover,
      y: this.settings.scaleHover,
      ease: this.settings.scaleAnimationInEase
    });
  };

  this.mouseOut = () => {
    this.refs.container.zIndex = this.id;
    if (this.refs.container.tween) {
      this.refs.container.tween.kill();
    }
    this.refs.container.tween = gsap.to(this.refs.container.scale, {
      duration: this.settings.scaleAnimationOutDuration,
      x: this.settings.scale,
      y: this.settings.scale,
      ease: this.settings.scaleAnimationOutEase
    });
  };

  this.setPosition = (x, y) => {
    this.settings.x = x;
    this.settings.y = y;

    const randomPositionMaxX = windowW * this.settings.randomPositionMax;
    const randomPositionMaxY = windowH * this.settings.randomPositionMax;

    this.settings.spriteXRandom = Math.random() * randomPositionMaxX * 2 - randomPositionMaxX;
    this.settings.spriteYRandom = Math.random() * randomPositionMaxY * 2 - randomPositionMaxY;
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
    this.settings.spriteX = width * 0.5;
    this.settings.spriteY = height * 0.5;
  }

  this.place = () => {
    this.refs.container.x = this.settings.x + this.settings.spriteX + this.settings.spriteXRandom;
    this.refs.container.y = this.settings.y + this.settings.spriteY + this.settings.spriteYRandom;

    this.refs.container.scale.x = this.settings.scale;
    this.refs.container.scale.y = this.settings.scale;
  };
}




//app
const App = function () {
  this.settings = {
    loadCurrentID: 0,
    loadThumbsCurrentID: 0,
    totalPictures: 0,
    currentID: 0,
    previousID: undefined,
    windowPaddingRatioToW: 0.025,
    imagesFolderURL: '/images/',
    thumbsFolderURL: '_thumbs/',
    masksColorLight: 0xffffff,
    masksColorDark: 0x000000
  };

  this.refs = {
    $app: undefined,
    app: undefined,
    thumbsContainer: undefined,
    thumbsRep: undefined,
    thumbsPositions: undefined,
    stepsXNumber: undefined,
    stepsYNumber: undefined,
    stepXDist: undefined,
    stepYDist: undefined,
    picturesRep: undefined,
    $nav: undefined,
    $navPrev: undefined,
    $navNext: undefined,
    $lightmodeButton: undefined,
    $paginationCurrent: undefined,
    $paginationTotal: undefined,
    // timeoutChangeLightmode: undefined,
    // timeoutDisplayNextPicture: undefined,
    // timeoutHidePreviousPicture: undefined,
    // timeoutWheelDebounce: undefined,
    // pictureToHide: undefined,
  };

  this.init = () => {
    this.refs.$app = document.querySelector('.app');
    this.refs.app = new PIXI.Application({
      backgroundColor:0xffffff,
      antialias: true,
      transparent: false,
      resolution: 1,
    });
    this.refs.app.masksColor = this.settings.masksColorLight;
    this.refs.app.renderer.autoResize = true;
    this.refs.$app.appendChild(this.refs.app.view);

    this.refs.picturesRep = [];

    this.refs.thumbsContainer = new PIXI.Container();
    this.refs.thumbsContainer.sortableChildren = true;
    this.refs.app.stage.addChild(this.refs.thumbsContainer);
    this.refs.thumbsRep = [];
    this.refs.thumbsRepToRender = [];
    this.refs.thumbsPositions = [];

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

    const imgHDFolder = (windowW * window.devicePixelRatio > 1600) ? '_hd/' : '';

    contentArray.forEach((item, i) => {
      const thumbItem = new Thumb();
            thumbItem.init(
              this.refs.app,
              this.refs.thumbsContainer,
              i,
              this.settings.imagesFolderURL+this.settings.thumbsFolderURL+item[0]
            );
      this.refs.thumbsRep.push(thumbItem);

      // const pictureItem = new Picture();
      //       pictureItem.init(picture, i, imgHDFolder);
      // this.refs.picturesRep.push(pictureItem);
    });

    this.refs.thumbsRep[0].load(this.thumbsLoadCompleteListener);
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
  }

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
  }


  // this.loadComplete = () => {
  //   this.settings.loadCurrentID ++;

  //   if(this.settings.loadCurrentID < this.refs.picturesRep.length) {
  //     this.refs.picturesRep[this.settings.loadCurrentID].load(this.loadComplete);
  //   }
  // };

  // this.changePicture = () => {
  //   this.updatePagination();

  //   this.refs.$navPrev.classList.remove('is-disabled');
  //   this.refs.$navNext.classList.remove('is-disabled');

  //   if (this.settings.currentID == 0) {
  //     this.refs.$navPrev.classList.add('is-disabled');
  //   } else if (this.settings.currentID == this.settings.totalPictures - 1) {
  //     this.refs.$navNext.classList.add('is-disabled');
  //   }

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
    if (this.settings.currentID > 0 ) {
      this.settings.previousID = this.settings.currentID;
      this.settings.currentID--;
      this.updatePagination();
      // this.changePicture();
    }
  };

  this.setPictureNext = () => {
    if (this.settings.currentID < this.settings.totalPictures - 1 ) {
      this.settings.previousID = this.settings.currentID;
      this.settings.currentID++;
      this.updatePagination();
      // this.changePicture();
    }
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
    let current = this.settings.totalPictures - this.settings.currentID;

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
    if (this.refs.timeoutChangeLightmode != undefined) {
      clearTimeout(this.refs.timeoutChangeLightmode);
    }
    this.refs.timeoutChangeLightmode = setTimeout( () => {
      if (isLight == 1) {
        document.body.classList.add('is-inverted');
      }else {
        document.body.classList.remove('is-inverted');
      }
    }, 1000);
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
    const padding = Math.floor(windowW * this.settings.windowPaddingRatioToW);

    this.refs.$nav.style.right = padding + 'px';
    this.refs.$nav.style.bottom = padding + 'px';

    this.refs.$lightmodeButton.style.right = padding + 'px';
    this.refs.$lightmodeButton.style.top = padding + 'px';

    this.refs.app.renderer.resize(windowW, windowH);

    // this.refs.picturesRep.forEach((pictureItem) => {
    //   pictureItem.setWindowPadding(padding);
    //   pictureItem.resize();
    // });

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
};

init();
