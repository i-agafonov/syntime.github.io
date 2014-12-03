var i = 0;
var bg = document.getElementsByClassName('bg')[0];
var headerMiddle = document.getElementsByClassName('header-middle')[0];
var inouts = document.getElementsByClassName('inout-container');

var bgImgs = document.getElementsByClassName('bg-img');
var imgIndexes = [0, 0];

var mainMenu = document.getElementsByClassName('menu-main-container')[0];
var mainMenuFixed = document.getElementsByClassName('menu-main-fixed-container')[0];

function resize(evt) {
	bg.style.height = Math.floor(0.3 * bg.clientWidth) + 'px';
	headerMiddle.style.top = (bg.clientHeight / 3) + 'px';
	scroll();
}

function scroll(evt) {
	var top  = window.pageYOffset || document.documentElement.scrollTop;
	var bottom  = top + window.innerHeight;
	var center = (bgImgs[0].clientWidth / 1920) * 640;
	bgImgs[0].style.top = (top * 0.4 - center) + 'px';
	bgImgs[1].style.top = (top * 0.4 - center) + 'px';

	[].forEach.call(inouts, function (container) {
		var node = container.getElementsByClassName('inout')[0];
		var center = container.offsetTop + container.clientHeight / 2;
		if (top <= center && center <= bottom) {
            setTimeout(function () {
                node.classList.add('in');
                node.classList.remove('out');
            }, 250);
		} else {
			node.classList.remove('in');
			node.classList.add('out');
		}
	});

    mainMenu.classList.add('in');
    mainMenu.classList.remove('out');

    if (mainMenu.offsetTop <= top) {
        mainMenuFixed.style.display = 'block';
    } else {
        mainMenuFixed.style.display = 'none';
    }
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