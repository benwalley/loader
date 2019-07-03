var canvas, ctx;
var data = {
	dots: [],
	dotColor: "#1BF907",
	lineColor: "#1BF907",
	numberDots: 50,
	lineLen: 70,
	speed: .8,
	size: 2,
	lineWidth: .1,
	keyCounter: 0,
	uploadTime: 5,
	currentUpload: 2
}

function init() {
	canvas = document.getElementById('dot-canvas');
	ctx = canvas.getContext('2d');
	// resize canvas;
	canvas.width = canvas.getBoundingClientRect().width;
	canvas.height = canvas.getBoundingClientRect().height;

	initDots();
	draw();
}

function initDots() {
	for (var i = 0; i < data.numberDots; i++) {
		var newDot = {
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
			r: data.size,
			dx: (Math.random() - .5) * data.speed,
			dy: (Math.random() - .5) * data.speed
		}
		data.dots.push(newDot);
	}
}

function calculateChange() {
	for (var i = 0; i < data.dots.length; i++) {
		if(data.dots[i].x <= 0 || data.dots[i].x >= canvas.width) {
			data.dots[i].dx = data.dots[i].dx * -1;
		}
		if(data.dots[i].y <= 0 || data.dots[i].y >= canvas.height) {
			data.dots[i].dy = data.dots[i].dy * -1;
		}
		data.dots[i].x += data.dots[i].dx;
		data.dots[i].y += data.dots[i].dy;

	}
}

function drawDot(x, y, r) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2*Math.PI);
	ctx.fillStyle = data.dotColor;
	ctx.fill();
}

function drawLine(sx, sy, ex, ey) {
	ctx.beginPath();
	ctx.moveTo(sx, sy);
	ctx.lineTo(ex, ey);
	ctx.strokeStyle = data.lineColor;
	ctx.lineWidth = data.lineWidth;
	ctx.stroke();
}

function drawDots() {
	for (var i = 0; i < data.dots.length; i++) {
		drawDot(data.dots[i].x, data.dots[i].y, data.dots[i].r)
	}
}

function drawLines() {
	for (var i = 0; i < data.dots.length; i++) {
		// for each dot, check if other dot is close enough
		for (var j = 0; j < data.dots.length; j++) {
			var distX = Math.abs(data.dots[i].x - data.dots[j].x);
			var distY = Math.abs(data.dots[i].y - data.dots[j].y);
			if((distX + distY)/2 < data.lineLen) {
				drawLine(data.dots[i].x, data.dots[i].y, data.dots[j].x, data.dots[j].y)
			}
		}
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	calculateChange();
	drawDots();
	drawLines();
	window.requestAnimationFrame(draw);
}

function startLoader() {
	var bar = document.querySelector(".progress .bar")
	bar.style.width = data.currentUpload + "%";
	data.currentUpload += .5;
	var time = data.uploadTime*5

	if(data.currentUpload < 100) {
		setTimeout(function() {
			startLoader();
		}, time) 
	} else {
		var loader = document.querySelector(".loading-window");
		var complete = document.querySelector(".upload-complete-window");
		loader.style.display = "none";
		complete.style.display = "flex";
	}
}


document.addEventListener("keyup", function(e) {
	var main = document.querySelector(".main-wrapper");
	var window1 = document.querySelector(".window-1");
	var window2 = document.querySelector(".window-2");
	var loader = document.querySelector(".loading-window");
	var complete = document.querySelector(".upload-complete-window");
	if(e.key == "k") {
		if(data.keyCounter == 0) {
			main.style.display = "block";
			setTimeout(function() {
				window2.style.display = "block";
				init();
			}, 500)

			setTimeout(function() {
				window1.style.display = "block";
			}, 1500)
		}

		if(data.keyCounter == 1) {
			loader.style.display = "block";
			startLoader();
		}

		if(data.keyCounter == 2) {
			loader.style.display = "none";
			complete.style.display = "flex";
		}
		data.keyCounter = data.keyCounter + 1;
	}

})