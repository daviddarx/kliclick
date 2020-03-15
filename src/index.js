//pictures
const Picture = function () {

  this.settings = {
    id: 0,
    imgURL: '',
    imgWidth: 0,
    imgHeight: 0,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0,
    widthRatioToHeight: 0,
    heightRatioToWidth: 0,
    windowPadding: 0,
    windowWMax: 0,
    windowHMax: 0,
  };

  this.refs = {
    $div: undefined,
    $img: undefined,
    loadCompleteCallback: undefined
  };

  this.isLoaded = false;

  this.init = (picture, id, hd) => {
    this.settings.id = id;
    this.refs.$div = picture;
    this.refs.$img = picture.querySelector('img');

    const splittedURL = this.refs.$img.getAttribute('rel').split('.');
    this.settings.imgURL = splittedURL[0] + hd + '.' + splittedURL[1];
  };

  this.load = (loadCompleteCallback) => {
    this.refs.$img.setAttribute('src', this.settings.imgURL);
    this.refs.$img.addEventListener('load', this.loadComplete);
    this.refs.loadCompleteCallback = loadCompleteCallback;
  };

  this.loadComplete = () => {
    const $imageClone = this.refs.$img.cloneNode(true);
    this.refs.$img.parentNode.replaceChild($imageClone, this.refs.$img);
    this.refs.$img = $imageClone;

    setTimeout(() => { //safari debug naturalWidth
      this.settings.imgWidth = this.refs.$img.naturalWidth;
      this.settings.imgHeight = this.refs.$img.naturalHeight;

      this.settings.widthRatioToHeight = this.settings.imgWidth / this.settings.imgHeight;
      this.settings.heightRatioToWidth = this.settings.imgHeight / this.settings.imgWidth;

      this.refs.loadCompleteCallback();
      this.refs.loadCompleteCallback = undefined;

      this.isLoaded = true;
      this.resize();

      this.refs.$div.classList.add('is-loaded');
    }, 100);
  };

  this.setWindowPadding = (padding) => {
    this.settings.windowPadding = padding;
    this.settings.windowWMax = Math.floor(windowW - 2 * padding);
    this.settings.windowHMax = Math.floor(windowH - 2 * padding);
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

      this.refs.$div.style.width = this.settings.width + 'px';
      this.refs.$div.style.height = this.settings.height + 'px';
      this.refs.$div.style.left = this.settings.posX + 'px';
      this.refs.$div.style.top = this.settings.posY + 'px';
    }
  };
};

const Pictures = function () {
  this.settings = {
    loadCurrentID: 0,
    totalPictures: 0,
    currentID: 0,
    previousID: undefined,
    windowPaddingRatioToW: 0.025,
  };

  this.refs = {
    $picturesContainer: undefined,
    $pictures: undefined,
    picturesRep: undefined,
    $nav: undefined,
    $navPrev: undefined,
    $navNext: undefined,
    $lightmodeButton: undefined,
    $paginationCurrent: undefined,
    $paginationTotal: undefined,
    timeoutChangeLightmode: undefined,
    timeoutDisplayNextPicture: undefined,
    timeoutHidePreviousPicture: undefined,
    timeoutWheelDebounce: undefined,
    pictureToHide: undefined,
  };

  this.init = () => {
    this.refs.$picturesContainer = document.querySelector('.pictures');
    this.refs.$pictures = document.querySelectorAll('.picture');
    this.refs.picturesRep = [];

    this.refs.$nav = document.querySelector('.navigation');
    this.refs.$navPrev = document.querySelector('.navigation-button--prev');
    this.refs.$navNext = document.querySelector('.navigation-button--next');
    this.refs.$navPrev.addEventListener('click', this.navigateButton);
    this.refs.$navPrev.addEventListener('touchstart', this.navigateButton);
    this.refs.$navNext.addEventListener('click', this.navigateButton);
    this.refs.$navNext.addEventListener('touchstart', this.navigateButton);
    window.addEventListener('keydown', this.navigateKeyboard, false);

    this.refs.$lightmodeButton = document.querySelector('.lightmode-button');
    this.refs.$lightmodeButton.addEventListener('click', this.toggleLightmode);
    this.refs.$lightmodeButton.addEventListener('touchstart', this.toggleLightmode);

    const imgHDFormat = (windowW * window.devicePixelRatio > 1600) ? '_hd' : '';

    this.refs.$pictures.forEach((picture, i) => {
      picture.setAttribute('rel', i);
      if (i%2 == 0) {
        picture.classList.add('is-even');
      }
      const pictureItem = new Picture();
            pictureItem.init(picture, i, imgHDFormat);
      this.refs.picturesRep.push(pictureItem);
    });

    this.settings.totalPictures = this.refs.picturesRep.length;

    this.refs.$paginationCurrent = document.querySelector('.pagination__current');
    this.refs.$paginationTotal = document.querySelector('.pagination__total');
    this.refs.$paginationTotal.innerHTML = this.settings.totalPictures;
    this.updatePagination();


    this.refs.picturesRep[this.settings.loadCurrentID].load(this.loadComplete);

    // this.changePicture();
    this.changeLightmode(parseInt(this.refs.$pictures[this.settings.currentID].getAttribute('data-bg')));

    window.addEventListener('wheel', (e) => {
      if (this.refs.timeoutWheelDebounce) {
        clearTimeout(this.refs.timeoutWheelDebounce);
      }
      this.refs.timeoutWheelDebounce = setTimeout(()=> {
        this.navigateWheel(e.deltaY);
      }, 100);
    });
  };

  this.loadComplete = () => {
    this.settings.loadCurrentID ++;

    if(this.settings.loadCurrentID < this.refs.picturesRep.length) {
      this.refs.picturesRep[this.settings.loadCurrentID].load(this.loadComplete);
    }
  };

  this.changePicture = () => {
    this.updatePagination();

    this.refs.$navPrev.classList.remove('is-disabled');
    this.refs.$navNext.classList.remove('is-disabled');

    if (this.settings.currentID == 0) {
      this.refs.$navPrev.classList.add('is-disabled');
    } else if (this.settings.currentID == this.settings.totalPictures - 1) {
      this.refs.$navNext.classList.add('is-disabled');
    }

    this.refs.$pictures[this.settings.currentID].classList.add('is-on-top');
    this.refs.$pictures[this.settings.currentID].classList.add('is-active');

    this.changeLightmode(true);

    if (this.refs.timeoutDisplayNextPicture != undefined) {
      clearTimeout(this.refs.timeoutDisplayNextPicture);
    }
    this.refs.timeoutDisplayNextPicture = setTimeout(this.displayNextPicture, 100);

    if (this.settings.previousID != undefined) {
      this.refs.$pictures[this.settings.previousID].classList.remove('is-on-top');
      if (this.refs.timeoutHidePreviousPicture != undefined) {
        clearTimeout(this.refs.timeoutHidePreviousPicture);
        if (this.settings.currentID != parseInt(this.refs.pictureToHide.getAttribute("rel"))) { //to avoid overwriting bug if user go next/prev quickly
          this.deactivePreviousPicture();
        }
      }
      this.refs.pictureToHide = this.refs.$pictures[this.settings.previousID];
      this.refs.timeoutHidePreviousPicture = setTimeout(this.hidePreviousPicture, 1000);
    }
  };

  this.displayNextPicture = () => {
    this.refs.$pictures[this.settings.currentID].classList.add('is-displayed');
    this.refs.timeoutDisplayNextPicture = undefined;
  };

  this.hidePreviousPicture = () => {
    this.refs.pictureToHide.classList.remove('is-displayed');
    this.refs.timeoutHidePreviousPicture = setTimeout(this.deactivePreviousPicture, 1700);
  };

  this.deactivePreviousPicture = () => {
    this.refs.pictureToHide.classList.remove('is-displayed'); //for direct call to overwrite first animation out step
    this.refs.pictureToHide.classList.remove('is-active');
    this.refs.timeoutHidePreviousPicture = undefined;
  };

  this.setPicturePrev = () => {
    if (this.settings.currentID > 0 ) {
      this.settings.previousID = this.settings.currentID;
      this.settings.currentID--;
      this.changePicture();
    }
  };

  this.setPictureNext = () => {
    if (this.settings.currentID < this.settings.totalPictures - 1 ) {
      this.settings.previousID = this.settings.currentID;
      this.settings.currentID++;
      this.changePicture();
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

  this.navigateWheel = (delta) => {
    if (delta > 0) {
      this.setPictureNext();
    } else {
      this.setPicturePrev();
    }

    return false;
  };


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

  this.resize = () => {
    const padding = Math.floor(windowW * this.settings.windowPaddingRatioToW);

    this.refs.$nav.style.right = padding + 'px';
    this.refs.$nav.style.bottom = padding + 'px';

    this.refs.$lightmodeButton.style.right = padding + 'px';
    this.refs.$lightmodeButton.style.top = padding + 'px';

    this.refs.picturesRep.forEach((pictureItem) => {
      pictureItem.setWindowPadding(padding);
      pictureItem.resize();
    });
  };
};

let pictures = undefined;





//general
let windowW = 0;
let windowH = 0;

const resizeListener = () => {
  windowW = (window.innerWidth || screen.width);
  windowH = (window.innerHeight || screen.height);

  if(pictures) {
    pictures.resize();
  }
};



//init
const init = () => {
  resizeListener();

  pictures = new Pictures();
  pictures.init();

  window.addEventListener('resize', resizeListener);
  resizeListener();
};

init();
