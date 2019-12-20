import smoothscroll from 'smoothscroll-polyfill';
smoothscroll.polyfill();

//pictures
const Picture = function () {

  this.settings = {
    id: 0,
    windowWMax: 0,
    windowHMax: 0,
    imgWidth: 0,
    imgHeight: 0,
    width: 0,
    widthRatioToHeight: 0,
    widthRatioToWindow: 0.8,
    height: 0,
    heightRatioToWidth: 0,
    heightRatioToWindow: 0.9 // augmenter en fonction du ratio, pour ecrans très larges comme macboo?
  };

  this.refs = {
    $div: undefined,
    $img: undefined,
    loadCompleteCallback: undefined
  };

  this.isLoaded = false;

  this.init = (picture, id) => {
    this.settings.id = id;
    this.refs.$div = picture;
    this.refs.$img = picture.querySelector('img');
  };

  this.load = (loadCompleteCallback) => {
    this.refs.$img.setAttribute('src', this.refs.$img.getAttribute('rel'));
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

      console.log(this.settings.id);
      console.log(this.settings.imgWidth + " " + this.settings.imgHeight);
      console.log("----");

      this.settings.widthRatioToHeight = this.settings.imgWidth / this.settings.imgHeight;
      this.settings.heightRatioToWidth = this.settings.imgHeight / this.settings.imgWidth;

      this.refs.loadCompleteCallback();
      this.refs.loadCompleteCallback = undefined;

      this.isLoaded = true;
      this.resize();

      this.refs.$div.classList.add('is-loaded');
    }, 100);
  };

  this.setWindowSizes = (winW, winH) => {
    this.settings.windowWMax = winW;
    this.settings.windowHMax = winH;
  };

  this.resize = () => {
    if (this.isLoaded == true) {
      this.settings.width = this.settings.windowWMax * this.settings.widthRatioToWindow;
      this.settings.height = this.settings.width * this.settings.heightRatioToWidth;

      //console.log(this.settings.heightRatioToWidth);

      let maxHeight = this.settings.windowHMax * this.settings.heightRatioToWindow;

      if (this.settings.height > maxHeight) {
        this.settings.height = maxHeight;
        this.settings.width = this.settings.height * this.settings.widthRatioToHeight;
      }

      this.refs.$div.style.width = this.settings.width + 'px';
      this.refs.$div.style.height = this.settings.height + 'px';

      // console.log(this.settings.id);
      // console.log(maxHeight + " " + this.settings.height + " ");
      // console.log("----");
    }
  };
};

const Pictures = function () {
  this.settings = {
    maxWindowWidth: 1440,
    loadCurrentID: 0,
    totalPictures: 0,
    currentID: 0
  };

  this.refs = {
    $picturesContainer: undefined,
    $pictures: undefined,
    picturesRep: undefined,
    $navPrev: undefined,
    $navNext: undefined
  };

  this.init = () => {
    this.refs.$picturesContainer = document.querySelector('.pictures');
    this.refs.$pictures = document.querySelectorAll('.picture');
    this.refs.picturesRep = [];

    this.refs.$navPrev = document.querySelector('.navigation-button--prev');
    this.refs.$navNext = document.querySelector('.navigation-button--next');

    this.refs.$navPrev.addEventListener('click', this.navigateButton);
    this.refs.$navPrev.addEventListener('touchstart', this.navigateButton);
    this.refs.$navNext.addEventListener('click', this.navigateButton);
    this.refs.$navNext.addEventListener('touchstart', this.navigateButton);

    window.addEventListener('keydown', this.navigationKeyboard, false);

    this.refs.$pictures.forEach((picture, i) => {
      const pictureItem = new Picture();
            pictureItem.init(picture, i);
      this.refs.picturesRep.push(pictureItem);
    });

    this.settings.totalPictures = this.refs.picturesRep.length;

    this.refs.picturesRep[this.settings.loadCurrentID].load(this.loadComplete);
  };

  this.loadComplete = () => {
    this.settings.loadCurrentID ++;

    if(this.settings.loadCurrentID < this.refs.picturesRep.length) {
      this.refs.picturesRep[this.settings.loadCurrentID].load(this.loadComplete);
    }
  };

  this.scrollToPicture = () => {
    this.refs.$pictures[this.settings.currentID].scrollIntoView({ behavior: 'smooth'});
  }

  this.setPicturePrev = () => {
    if (this.settings.currentID > 0 ) {
      this.settings.currentID--;
    }
    this.scrollToPicture();
  }

  this.setPictureNext = () => {
    if (this.settings.currentID < this.settings.totalPictures - 1 ) {
      this.settings.currentID++;
    }
    this.scrollToPicture();
  }

  this.navigateButton = (e) => {
    if (e.currentTarget == this.refs.$navPrev) {
      this.setPicturePrev();
    } else {
      this.setPictureNext();
    }
  };

  this.navigationKeyboard = (e) => {
    const key = e.keyCode ? e.keyCode : e.which;

    if (key == 38) {
      this.setPicturePrev();
    } else if (key == 40) {
      this.setPictureNext();
    }

    if (key == 38 || key == 40) {
      e.preventDefault();
    }
  }

  this.resize = () => {
    const finalWindowW = (windowW < this.settings.maxWindowWidth) ? windowW : this.settings.maxWindowWidth;

    if(finalWindowW == this.settings.maxWindowWidth) {
      this.refs.$picturesContainer.style.width = finalWindowW + 'px';
    }else{
      this.refs.$picturesContainer.style.width = 'auto';
    }

    this.refs.picturesRep.forEach((pictureItem) => {
      pictureItem.setWindowSizes(finalWindowW, windowH);
      pictureItem.resize();
    });
  };
};

let pictures = undefined;



//lightmode
const $lightmodeButton = document.querySelector('.lightmode-button');

const toggleLightmode = () => {
  document.body.classList.toggle('is-inverted');
};

$lightmodeButton.addEventListener('click', toggleLightmode);
$lightmodeButton.addEventListener('touchstart', toggleLightmode);



//general
let windowW = 0;
let windowH = 0;

const resizeListener = () => {
  windowW = (window.innerWidth || screen.width);
  windowH = (window.innerHeight || screen.height);

  pictures.resize();
};



//init
const init = () => {
  pictures = new Pictures();
  pictures.init();

  window.addEventListener('resize', resizeListener);
  resizeListener();
};

init();
