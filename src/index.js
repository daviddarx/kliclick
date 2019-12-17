//pictures
const Picture = function () {

  this.settings = {
    windowWMax: 0,
    windowHMax: 0,
    imgWidth: 0,
    imgHeight: 0,
    width: 0,
    widthRatioToHeight: 0,
    widthRatioToWindow: 0.8,
    height: 0,
    heightRatioToWidth: 0,
    heightRatioToWindow: 0.8
  };

  this.refs = {
    $div: undefined,
    $img: undefined,
    loadCompleteCallback: undefined
  };

  this.isLoaded = false;

  this.init = (picture) => {
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

    this.settings.imgWidth = this.refs.$img.naturalWidth;
    this.settings.imgHeight = this.refs.$img.naturalHeight;

    this.settings.widthRatioToHeight = this.settings.imgWidth / this.settings.imgHeight;
    this.settings.heightRatioToWidth = this.settings.imgHeight / this.settings.imgWidth;

    this.refs.loadCompleteCallback();
    this.refs.loadCompleteCallback = undefined;

    this.refs.$div.classList.add('is-loaded');

    this.isLoaded = true;
    this.resize();
  };

  this.setWindowSizes = (winW, winH) => {
    this.settings.windowWMax = winW;
    this.settings.windowHMax = winH;
  };

  this.resize = () => {
    if (this.isLoaded == true) {
      this.settings.width = this.settings.windowWMax * this.settings.widthRatioToWindow;
      this.settings.height = this.settings.width * this.settings.heightRatioToWidth;

      let maxHeight = this.settings.windowHMax * this.settings.heightRatioToWindow;

      console.log(maxHeight);

      if (this.settings.height > maxHeight) {
        this.settings.height = maxHeight;
        this.settings.width = this.settings.height* this.settings.widthRatioToHeight;
      }

      this.refs.$div.style.width = this.settings.width + 'px';
      this.refs.$div.style.height = this.settings.height + 'px';
    }
  };
}

const Pictures = function () {
  this.settings = {
    maxWindowWidth: 1440
  };

  this.refs = {
    $picturesContainer: undefined,
    $pictures: undefined,
    picturesRep: undefined,
  };

  this.currentID = 0;

  this.init = () => {
    this.refs.$picturesContainer = document.querySelector('.pictures');
    this.refs.$pictures = document.querySelectorAll('.picture');
    this.refs.picturesRep = [];

    this.refs.$pictures.forEach((picture) => {
      const pictureItem = new Picture();
            pictureItem.init(picture);
      this.refs.picturesRep.push(pictureItem);
    });

    this.refs.picturesRep[this.currentID].load(this.loadComplete);
  };

  this.loadComplete = () => {
    this.currentID ++;

    if(this.currentID < this.refs.picturesRep.length) {
      this.refs.picturesRep[this.currentID].load(this.loadComplete);
    }
  };

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
}

let pictures = undefined;



//lightmode
const $lightmodeButton = document.querySelector('.lightmode-button');

const toggleLightmode = () => {
  document.body.classList.toggle('is-inverted');
}

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
}

init();
