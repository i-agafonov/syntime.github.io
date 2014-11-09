var i = 0;
var bg = document.getElementsByClassName('bg')[0];
var headerMiddle = document.getElementsByClassName('header-middle')[0];
var img;

var bgImgs = document.getElementsByClassName('bg-img');
var imgIndexes = [0, 0];

function resize(evt) {
	bg.style.height = Math.floor(0.3 * bg.clientWidth) + 'px';
	headerMiddle.style.top = (bg.clientHeight / 3) + 'px';
	scroll();
}

function scroll(evt) {
	var top  = window.pageYOffset || document.documentElement.scrollTop;
	var center = (bgImgs[0].clientWidth / 1920) * 640;
	bgImgs[0].style.top = (top * 0.4 - center) + 'px';
	bgImgs[1].style.top = (top * 0.4 - center) + 'px';
}

function getRandom(index) {
	var result;
	do {
		result = Math.floor(Math.random() * 14 + 1)
	} while (result == imgIndexes[0] || result == imgIndexes[1]);
	imgIndexes[index] = result;
	return result;
}

bgImgs[0].setAttribute('src',  'img/bg/' + getRandom(0) + '.jpg');
bgImgs[1].setAttribute('src',  'img/bg/' + getRandom(1) + '.jpg');

function imgSwitch() {
	bgImgs[i].setAttribute('src',  'img/bg/' + getRandom(i) + '.jpg');
	i = +!i;
	setTimeout(imgSwitch, 10000);
}

setTimeout(imgSwitch, 10000);

resize();

window.addEventListener('resize', resize);
window.addEventListener('scroll', scroll);