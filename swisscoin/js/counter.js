var digits = document.getElementsByClassName('digit-canvas');
var divs = [];
var lw;

var dateStart = new Date("12/15/2014");

var pi = Math.PI;
var pi2 = 2 * pi;
var pi_2 = pi / 2;

[].forEach.call(digits, function (item) {
	var div = item.parentNode.children[1];
	divs.push(div);
});

function update() {
	resize();
	var dateNow = new Date();
	var countDate = new Date(dateStart - dateNow);
	d = countDate.getDate();
	h = countDate.getHours();
	m = countDate.getMinutes();
	s = countDate.getSeconds();
	divs[0].innerText = d;
	divs[1].innerText = h;
	divs[2].innerText = m;
	divs[3].innerText = s;
	draw(digits[0], d / 30);
	draw(digits[1], h / 24);
	draw(digits[2], m / 60);
	draw(digits[3], s / 60);
}

function draw(item, value) {
	item.ctx.clearRect(0, 0, item.width, item.height);
	item.ctx.beginPath();
	item.ctx.strokeStyle = 'rgba(0,0,0,0.25)';
	item.ctx.arc(item.centerX+lw/2, item.centerY+lw/2, Math.max((item.size - lw*2)/2, 1),
		-pi_2, pi2);
	item.ctx.stroke();
	item.ctx.beginPath();
	item.ctx.strokeStyle = '#8f6000';
	item.ctx.arc(item.centerX, item.centerY, Math.max((item.size - lw*2)/2, 1),
		-pi_2, pi2);
	item.ctx.stroke();
	item.ctx.beginPath();
	item.ctx.strokeStyle = '#f6aa0c';
	value *= pi2;
	item.ctx.arc(item.centerX, item.centerY, Math.max((item.size - lw*2)/2, 1),
		-pi_2, value-pi_2);
	item.ctx.stroke();
}

function resize(evt) {
	lw = document.body.clientWidth / 100;
	[].forEach.call(digits, function (item, index) {
		var div = divs[index];
		item.style.display = "block";
		item.width = div.clientWidth;
		item.height = div.clientHeight;
		item.setAttribute('width', item.width);
		item.setAttribute('height', item.height);
		item.ctx = item.getContext('2d');
		item.ctx.lineWidth = lw;
		item.size = Math.min(item.width, item.height);
		item.centerX = item.width / 2;
		item.centerY = item.height / 2;
	});
}

window.addEventListener('resize', update);

setInterval(update, 1000);