// main.js

console.log("Yo, I am alive!");


// Grab the div where we will put our Raphael paper
var centerDiv = document.getElementById("main-container");

// Create the Raphael paper that we will use for drawing and creating graphical objects
var paper = new Raphael(centerDiv);

// put the width and heigth of the canvas into variables for our own convenience
var pWidth = paper.width;
var pHeight = paper.height;
console.log("pWidth is " + pWidth + ", and pHeight is " + pHeight);
var pageLoadTime = Date.now(); // (in miliseconds since 1970)
var gamesEndTime;
var snekTotalTime;
var bubbleTotalTime;
var scopeTotalTime;
var playerAvatar;


//---------------------------------------------------------------------

// Just create a nice black background
var bgRect = paper.rect(0,0,pWidth, pHeight);
bgRect.attr({"fill": "url('resources/Many Slices of Lemons.png')"});

// 𝑑𝑖𝑠𝑡𝑎𝑛𝑐𝑒 = 𝑠𝑞𝑟𝑡(𝑥2 − 𝑥1)^2 + (𝑦2 − 𝑦1)^2)

let distance = function(p1, p2){
    return Math.sqrt(Math.pow(p2.x-p1.x,2)+Math.pow(p2.y-p1.y,2));
};

// maps x in  the interval [a,b] into the interval [m, n]
let map =function (x, a, b, m, n){
    let range = n-m;
    // x is 'proportion' of the way from a to b
    // e.g. if a=10, b=20, and x=15, x is half (.5) of the way from a to b
    let proportion = (x-a)/(b-a); 
    return (m + proportion*range);
};

// commentary set-up
var commentary = document.getElementById("commentary");

let commentaryAnimation = function (){
	commentary.animate({'opacity' : 0}, 500, function(ev){this.animate({'opacity' : 1}, 1000);});
};

var chapterHeader = paper.text(pWidth/2, pHeight/10, "Prologue: Today, A Lemon Talked to Me About Patents.").attr({"font-size": 20, "fill": "#000000", "opacity": 0});

commentary.innerHTML = `[${new Date().toLocaleTimeString()}] <b>The Talking Lemon</b>: Hello! You are now listening to <i>The Talking Lemon</i>. Today is ${new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}, and I will be talking about patents (and other random things). Read my grandiose speech here from time to time to find out what the lemon is going on above!
<br><br>

       Here, you will experience an interactive story (with some mini-games!). Various principles relating to patents and patent law will be illustrated.<br><br>Leaving me alone here while you go to another tab or window will make me become wonky. Hope you will stay till the end, take away something from here, and enjoy!
<hr>      If the above interface is not showing correctly, maximise your window before pressing the button below:<br><br><input class="styled"
       type="button" onClick="window.location.href=window.location.href"
       value="Reload">
              		<br><br>If you had previously enjoyed Act V and want to experience it again:<br><br><input class="styled"
       type="button" onClick=window.open("https://lenon-ong.github.io/The-Floating-Lemon-Slice-Game/")
       value="Enter Act 0">  
<hr>This webpage is powered by HTML5, CSS, and purely by the Javascript library, Raphaël.<br><br>All audio and SVG line paths are extracted from works that are in the public domain (sources: freesound.org and freesvg.org). The image files used are created by yours truly.<br><br> Copyright © 2021, <a href='https://www.linkedin.com/in/lenon-ong/' target= '_blank'><span class='underline'>Lenon Ong</span></a><br><a href='https://creativecommons.org/licenses/by/3.0/' target= '_blank'><span class='underline'>Available under the Creative Commons Attribution 3.0 Unported License.</span></a><hr>`;
commentaryAnimation();

//************VARIABLES            
game00State = "true";
game01State = "false";
game02State = "false";
game03State = "false";
game04State = "false";
searchingMode = "true";
bulletSpotX = pWidth/2;
bulletSpotY = pHeight/4*3.5;
ammoTextX = pWidth/2*1.1;
ammoTextY = pHeight/4*3.6;
MCTextX = pWidth/2;
MCTextY = pHeight/4*3

var sentences = [
    'grape soju',
    'tteokbokki',
    'kimchi',
    'Korean fried chicken',
];

// Creating multiple disks and the mouse icon
let numCircles = 50;
var numCleared = numCircles;
let circlesList = [];
let counter = 0; // for array
while (counter<numCircles) {
    circlesList[counter] = paper.circle(pWidth/2, pHeight/2, 15);
    circlesList[counter].hsl = `hsl(${Math.random()},0.7,0.7)`;
    circlesList[counter].attr({"fill": circlesList[counter].hsl, "opacity": 0.7});
    circlesList[counter].xpos=pWidth/2;
    circlesList[counter].ypos=pHeight/2;
    circlesList[counter].xrate=map(Math.random(),0,1,-10,10);
    circlesList[counter].yrate=map(Math.random(),0,1,-10,10);
	circlesList[counter].hitstate="false";
	circlesList[counter].hide();
    counter++;
};

//path to draw mouse  --> credit: https://freesvg.org/cordless-mouse-vector-drawing (CC0 1.0 Universal (CC0 1.0) Public Domain Dedication)
mousePathString1 = "m184.17 224.17c16.667-57.5 169.17-153.33 318.33-100 167.8 59.996 294.09 222.65 183.33 336.67-85.544 88.059-240.64-30.071-292.5-69.167-54.167-40.833-215-120-209.17-167.5z";
mousePathString2 = "m186.67 219.67c21.11-56.02 166.66-148.84 315.83-95.5 167.8 59.99 300.8 256.31 163.33 305-67.89 24.04-189.74-62.69-270.83-102.5-100.16-49.186-213-84.806-208.33-107z";
mousePathString3 = "m189.17 217.17c34.622-61.323 107.8-102.59 253.63-58.427-25.984 14.784-53.461 37.814-72.81 55.074-26.032 23.221-52.604 51.52-60.529 72.122-102.51-44.1-128.55-54.16-120.29-68.77z";
mousePathString4 = "m249.46 156.78c80.663-51.74 179.64-58.3 254.64-31.216-17.644 4.8918-43.237 18.748-60.233 32.316-122.72-37.632-178.22-7.9042-194.4-1.1001z";
mousePathString5 = "m285.73 150.1c0.41667 3.125 60.642 8.8685 76.146-3.2292s-13.226-10.699-18.542-10.833c-43.326-1.0946-58.021 10.937-57.604 14.062z";
mousePathString6 = "m287.49 150.93c-0.0901 0.0332 54.099 10.162 75.882-5.7797-2.2218-9.362-17.714-19.866-36.46-19.422-34.04 0.80607-39.422 25.202-39.422 25.202z";

var mouseMain1 = paper.path(mousePathString1);
var mouseMain2 = paper.path(mousePathString2);
var mouseMain3 = paper.path(mousePathString3);
var mouseMain4 = paper.path(mousePathString4);
var mouseMain5 = paper.path(mousePathString5);
var mouseMain6 = paper.path(mousePathString6);
mouseMain1.attr({

	"stroke-width": 1,
	"stroke": "black",
	"opacity": 0.5,
});
mouseMain2.attr({
	"stroke-width": 1,
	"stroke": "black",
	"opacity": 0.5,
});	
mouseMain3.attr({
	"stroke-width": 1,
	"stroke": "black",
	"opacity": 0.5,
});
mouseMain4.attr({

	"stroke-width": 1,
	"stroke": "black",
	"opacity": 0.5,
});
mouseMain5.attr({

	"stroke-width": 1,
	"stroke": "black",
	"opacity": 0.5,
});	
mouseMain6.attr({

	"stroke-width": 1,
	"stroke": "black",
	"opacity": 0.5,
});

mouseMain1.animate({opacity: 0.5}, 1000);
var mouseMain1_transformedPath = Raphael.transformPath(mousePathString1, `T${pWidth/4},${pHeight/100}`);
mouseMain1.animate({path: mouseMain1_transformedPath}, 1000);

mouseMain2.animate({opacity: 0.5}, 1000);
var mouseMain2_transformedPath = Raphael.transformPath(mousePathString2, `T${pWidth/4},${pHeight/100}`);
mouseMain2.animate({path: mouseMain2_transformedPath}, 1000);

mouseMain3.animate({opacity: 0.5}, 1000);
var mouseMain3_transformedPath = Raphael.transformPath(mousePathString3, `T${pWidth/4},${pHeight/100}`);
mouseMain3.animate({path: mouseMain3_transformedPath}, 1000);

mouseMain4.animate({opacity: 0.5}, 1000);
var mouseMain4_transformedPath = Raphael.transformPath(mousePathString4, `T${pWidth/4},${pHeight/100}`);
mouseMain4.animate({path: mouseMain4_transformedPath}, 1000);

mouseMain5.animate({opacity: 0.5}, 1000);
var mouseMain5_transformedPath = Raphael.transformPath(mousePathString5, `T${pWidth/4},${pHeight/100}`);
mouseMain5.animate({path: mouseMain5_transformedPath}, 1000);

mouseMain6.animate({opacity: 0.5}, 1000);
var mouseMain6_transformedPath = Raphael.transformPath(mousePathString6, `T${pWidth/4},${pHeight/100}`);
mouseMain6.animate({path: mouseMain6_transformedPath}, 1000);

var mouseText1 = paper.text(pWidth/4, pHeight/4*1.3, "For the best experience, use a mouse, a laptop/desktop, headphones, \nand close all other tabs or programs.\n \nPlease also check the volume level of your system.\n(Recommended Level: 20%)\n↓\nYou can make various things happen here\nwith a mouse...\n \nAfter reading what the talking lemon has to say below, \nclick the left mouse button.").attr({"font-size": 15, "fill": "#000", "font-family": "Arial", "opacity": 0});
mouseText1.animate({opacity: 1}, 1000);

var titleText = paper.text(pWidth/2, pHeight/4*3.5, "Prologue: Today, A Lemon Talked to Me About Patents.").attr({"font-size": 30, "fill": "#000", "font-family": "Arial", "opacity": 0});
titleText.animate({opacity: 1}, 1000);

var mousePrompt = "true";
var mouseText1_transformedPath = Raphael.transformPath(mouseText1, `T${pWidth*3/4},${pHeight*3/4}`);

// sound files (all audio files are in the public domain)
let startAudio = document.getElementById("startAudio");
let finalAudio = document.getElementById("finalAudio");
let hitAudio = [];
hitAudio[0] = new Audio("resources/362328__josepharaoh99__platform-jump.mp3");
hitAudio[1] = new Audio("resources/350866__cabled-mess__blip-c-06.wav");
hitAudio[2] = new Audio("resources/256555__skiggz__donald-duck-1.wav");
hitAudio[3] = new Audio("resources/146723__leszek-szary__coin-object.wav");
hitAudio[4] = new Audio("resources/462089__newagesoup__ethereal-woosh.wav");
hitAudio[5] = new Audio("resources/418231__kierankeegan__ui-back-sound.wav");
hitAudio[6] = new Audio("resources/452998__breviceps__blip-wave.wav");
var audioCount1 = 0;

// Drawing function
let draw = function(){

	counter = 0 //this should be before the while loop if not counter will forever be 0	
	if (game00State === "false" && mousePrompt === "true"){
		scopeStartTime = Date.now();
		startAudio.pause();
		startAudio.currentTime = 2;
		startAudio.play();
		startAudio.loop = true;
		mouseMain1.animate({opacity:0}, 1000, function(){this.remove();});
		mouseMain2.animate({opacity:0}, 1000, function(){this.remove();});
		mouseMain3.animate({opacity:0}, 2000, function(){this.remove();});
		mouseMain4.animate({opacity:0}, 1000, function(){this.remove();});
		mouseMain5.animate({opacity:0}, 1000, function(){this.remove();});
		mouseMain6.animate({opacity:0}, 1000, function(){this.remove();});
		mouseMain3.attr({"fill": "#32CD32"});
		mouseText1.attr({"text": "Remember, use your mouse!"});
		bgRect.attr({"fill": "black"});
		mouseText1.animate({"opacity":0, "font-size": 35}, 3000, function(){this.remove();});
		titleText.attr({"text": "Wait... Why is there a talking lemon???", "fill": "white", "y": pHeight/4*3});
		titleText.animate({"opacity":0}, 3000, function(){this.remove();});
		hitAudio[3].pause();
        hitAudio[3].currentTime = 0;
        hitAudio[3].play();
		counter = 0; // for array
		while (counter<numCircles) {
			circlesList[counter].show();
		    counter++;
		};
		mousePrompt = "false";
		var chapterHeader = paper.text(pWidth/2, pHeight/2, "Act I: Novelty, Prior Art, & the Patent Search Process.").attr({"font-size": 20, "fill": "#FFFFFF", "opacity": 0}).animate({"y": pHeight/10, "opacity": 1},5000, function(ev){this.animate({"opacity":0},2000, function(ev){this.remove()})});
		commentary.innerHTML = `[${new Date().toLocaleTimeString()}] <b>The Talking Lemon</b>: The bouncing discs are the embodiment of prior art, and they are to be "analysed" using your cursor's scope to see if your imaginary invention is <b>novel</b> (one of the three requirements for patentability). The small scope represents how voluminous the patent search process is (and we are going to file an imaginary patent application)!
			<hr>This webpage is powered by HTML5, CSS, and purely by the Javascript library, Raphaël.<br><br>All audio and SVG line paths are extracted from works that are in the public domain (sources: freesound.org and freesvg.org). The image files used are created by yours truly.<br><br> © 2021, <a href='https://www.linkedin.com/in/lenon-ong/' target= '_blank'><span class='underline'>Lenon Ong</span></a><br><a href='https://creativecommons.org/licenses/by/3.0/' target= '_blank'><span class='underline'>Available under the Creative Commons Attribution 3.0 Unported License.</span></a><hr>`;
		counter = 0;
	};
    if (game01State === "true" || game02State === "true"){

	    while(counter<numCircles){
	    circlesList[counter].xpos += circlesList[counter].xrate;
	    circlesList[counter].ypos += circlesList[counter].yrate;
	    circlesList[counter].attr({
	        "cx": circlesList[counter].xpos, 
	        "cy": circlesList[counter].ypos
	    });

	    // Rebounding code
	    if (circlesList[counter].xpos > pWidth) {
	        circlesList[counter].xrate = -circlesList[counter].xrate;
	    };
	    if (circlesList[counter].ypos > pHeight) {
	        circlesList[counter].yrate = -circlesList[counter].yrate;
	    };
	    if (circlesList[counter].xpos < 0) {
	        circlesList[counter].xrate = -circlesList[counter].xrate;
	    };
	    if (circlesList[counter].ypos < 0) {
	        circlesList[counter].yrate = - circlesList[counter].yrate;
	    };
	    
	    // Cursor Scope code
	    var cursorScope = distance(state,{'x':circlesList[counter].xpos,'y':circlesList[counter].ypos})
	    if (state.pushed && cursorScope<30 && circlesList[counter].hitstate==="false" && numCleared>0) {
	        circlesList[counter].attr({
	        "fill": "black",
		    "stroke-width":1,
		    "stroke": "#FFF"
	        });
		    hitAudio[1].pause();
	        hitAudio[1].currentTime = 0;
	        hitAudio[1].play();
	        circlesList[counter].hitstate = true;
	        hitText.show();
	        hitText.attr({"opacity":1});
			hitText.animate({opacity:0}, 1000);
	        console.log(circlesList.hitstate);
	        numCleared--;
	    	hitText.attr({"text": numCleared});
	    };
	    if (numCleared===0) {
	    	hitText.hide();
	    	commentary.innerHTML = `[${new Date().toLocaleTimeString()}] <b>The Talking Lemon</b>: Well done! I would say we have gone through 99.9% of prior art (disclaimer: this is an exaggeration). We can assume that our imaginary invention is novel! Push that red pulsing circle - we are going to make a patent application upon considering all the prior art!
	    		<hr>This webpage is powered by HTML5, CSS, and purely by the Javascript library, Raphaël.<br><br>All audio and SVG line paths are extracted from works that are in the public domain (sources: freesound.org and freesvg.org). The image files used are created by yours truly.<br><br> © 2021, <a href='https://www.linkedin.com/in/lenon-ong/' target= '_blank'><span class='underline'>Lenon Ong</span></a><br><a href='https://creativecommons.org/licenses/by/3.0/' target= '_blank'><span class='underline'>Available under the Creative Commons Attribution 3.0 Unported License.</span></a><hr>`;
		    if (audioCount1===0){	    	
		    	hitAudio[3].pause();
	        	hitAudio[3].currentTime = 3;
	        	hitAudio[3].play();
	        	audioCount1++;
	        };
	    	endGame01();
	    };

	    if (game02State === "true"){
	    	circlesList[counter].attr({
	        "fill": "#000000",
		    "stroke-width":1,
		    "stroke": "orange",
	        });
	        bulletCollector.show();
	        scopeTotalTime = Math.round((Date.now()-scopeStartTime)).toFixed(2)/1000;
	    };

	    counter++; // to break out of the while loop

	    };
	};
};


// Creating cursorTarget, an overlay and event listeners
var cursorTarget = paper.circle(bulletSpotX,bulletSpotY,20).attr({
    "stroke-width":4,
    "stroke": "#FFF"
});
var cursorTarget2 = paper.circle(bulletSpotX,bulletSpotY,20).attr({
    "stroke-width":2,
    "stroke": "#000"
});
var cursorTarget2_2 = paper.path(`M${bulletSpotX-19},${bulletSpotY},L${bulletSpotX+19},${bulletSpotY}`).attr({
    "stroke-width":1,
    "stroke": "#FFF"
});
var cursorTarget2_3 = paper.path(`M${bulletSpotX},${bulletSpotY-19},L${bulletSpotX},${bulletSpotY+19}`).attr({
    "stroke-width":1,
    "stroke": "#FFF"
});

let cursorInitialRipple = paper.circle(bulletSpotX,bulletSpotY,20).attr({
    "stroke-width":1,
    "stroke": "#FFF"
});


let cursorRippleAnimation = function(){
	cursorInitialRipple.animate({
		"r": 200,
		"opacity": 0
	}, 1000);
	if (game01State === "true" || game02State === "true" || game03State === "true"){
		cursorInitialRipple = paper.circle(bulletSpotX,bulletSpotY,20).attr({
		    "stroke-width":1,
		    "stroke": "#FFF"
			});
		};

	if (game04State === "true"){
		cursorInitialRipple = paper.circle(bulletSpotX,bulletSpotY,20).attr({
		    "stroke-width":1,
		    "stroke": "#000"
			});
		};
	cursorInitialRipple.hide();
};

cursorTarget.hide();
cursorTarget2.hide();
cursorTarget2_2.hide();
cursorTarget2_3.hide();
cursorInitialRipple.hide();

var overlay = paper.rect(0,0,pWidth,pHeight).attr({
    "fill":"#FFFFFF", 
    "fill-opacity": 0}
    );
var state = {
    "pushed":false, 
    "x":0, 
    "y":0
};

var globeMouseState = "up";

overlay.node.addEventListener("mousedown", function(ev){
    state.pushed = true;
    //globeMouseState = "down"
    cursorTarget.show();
    cursorTarget2.show();
    cursorTarget2_2.show();
    cursorTarget2_3.show();
});
overlay.node.addEventListener("mousemove", function(ev){
    state.x = ev.offsetX;
    state.y = ev.offsetY;
    cursorTarget.attr({
        "cx": state.x,
        "cy": state.y
    });
    cursorTarget2.attr({
        "cx": state.x,
        "cy": state.y
    });
    cursorTarget2_2.attr({"path": `M${state.x-19},${state.y},L${state.x+19},${state.y}`});
	cursorTarget2_3.attr({"path": `M${state.x},${state.y-19},L${state.x},${state.y+19}`});
});
overlay.node.addEventListener("mouseup", function(ev){
    state.pushed=false;
    globeMouseState = "up"
    cursorTarget.hide();
    cursorTarget2.hide();
    cursorTarget2_2.hide();
    cursorTarget2_3.hide();
    if (game00State === "true"){
		game00State = "false";
		game01State = "true";
	};
});
overlay.node.addEventListener("click", function(ev){
	cursorInitialRipple.attr({
        "cx": state.x,
        "cy": state.y
    });
    console.log("overlay clicked")
    cursorInitialRipple.show();
	cursorRippleAnimation();
	hitAudio[5].pause();
    hitAudio[5].currentTime = 0;
    hitAudio[5].play();
});

// Creating the text
var hitText = paper.text(pWidth/2, 5.3*pHeight/6, numCleared).attr({"font-size": 20, "fill": "#FFFFFF"});
hitText.hide();

//endGame01 function and setting up game02
var bulletCollectorActivate = 0;

var bulletCollector = paper.circle(pWidth/2,pHeight/4*3.5,20).attr({
    "fill": "#000",
    "stroke-width":3,
    "stroke": "red"
});

var bulletCollectorGlow = bulletCollector.glow({ 'width': 10, 'fill': false, 'opacity': 0.8, 'color': 'orange'});
var bulletCollectorGlowGreen = bulletCollector.glow({ 'width': 50, 'fill': "black", 'opacity': 0.8, 'color': 'green'});
var bulletCollectorGlowRed = bulletCollector.glow({ 'width': 50, 'fill': "black", 'opacity': 0.8, 'color': 'red'});


bulletCollector.hide();
bulletCollectorGlow.hide();
bulletCollectorGlowGreen.hide();
bulletCollectorGlowRed.hide();


let endGame01 = function(){
	if (game01State === "true"){
	/*hitText.animate({
		x: ammoTextX,
		y: ammoTextY
    }, 3000);*/
    game01State = "false"; //ensures function only runs once
	};
    game02State = "true";
	//hitText.attr({"text": "Ammo count: "+numCircles});
    //backgroundAudio.pause();
    //backgroundAudio.currentTime = 0;
    //numClicks = 0;
    //initialise disc position

};

// Call draw() periodically
// We start the animation last thing as the module loads
let timer = setInterval(draw, 20);
//let timer02 = setInterval(endGame01, 20);
//clearInterval(timer02);



////*******************

//GAME 02

////*******************

var ammoText = paper.text(ammoTextX, ammoTextY, bulletCollectorActivate).attr({"font-size": 20, "fill": "#FFFFFF"});
ammoText.hide();

var halfPromptText = paper.text(MCTextX, MCTextY, "Keep clicking!").attr({"font-size": 20, "fill": "#FFFFFF"});
halfPromptText.hide();

var almostThereText = paper.text(MCTextX, MCTextY, "Almost there!").attr({"font-size": 20, "fill": "#FFFFFF"});
almostThereText.hide();

let snakeSpawn = 0;


// creating green bullet on top of shooter that appears when bulletCollectorActivate = 20

var bullet = paper.circle(bulletSpotX, bulletSpotY, bulletCollector.attr("r")).attr({
    "stroke-width" : 1,
    "fill" : "#98FB98",
    "stroke" : "#98FB98",
    "opacity" : 1,
});
bullet.xrate = 0;
bullet.yrate = 0;
bullet.posx = bulletSpotX;
bullet.posy = bulletSpotY;

bullet.hide();


// shoot bullet function
	//let Seconds;

let loadAndShoot = function(){
    bullet.show();
    starttime = Date.now(); // (in miliseconds since 1970)
    console.log("time = " + starttime);
    bullet.node.addEventListener("mousemove", function(ev){
	bullet.node.style.cursor="pointer";
});
    bullet.node.addEventListener("click", function(ev){
	    bullet.yrate = -30;      // negative so that the bullet shoots up
		ammoText.attr({"text": bulletCollectorActivate});
		bulletCollectorGlowGreen.hide();
		bulletCollectorGlowRed.show();
		commentary.innerHTML = `[${new Date().toLocaleTimeString()}] <b>The Talking Lemon</b>: If you missed, don't worry! Let's charge up with another patent to overwhelm the enemy!
			    		<hr>This webpage is powered by HTML5, CSS, and purely by the Javascript library, Raphaël.<br><br>All audio and SVG line paths are extracted from works that are in the public domain (sources: freesound.org and freesvg.org). The image files used are created by yours truly.<br><br> © 2021, <a href='https://www.linkedin.com/in/lenon-ong/' target= '_blank'><span class='underline'>Lenon Ong</span></a><br><a href='https://creativecommons.org/licenses/by/3.0/' target= '_blank'><span class='underline'>Available under the Creative Commons Attribution 3.0 Unported License.</span></a><hr>`;
	    hitAudio[3].pause();
        hitAudio[3].currentTime = 0;
        hitAudio[3].play();
	    //return bulletCollectorActivate;
	});
};

bulletCollector.node.addEventListener("click", function(ev){
	bulletInitialRipple.show();
	bulletRippleAnimation();
	bulletCollector.show();
	console.log("bulletCollector clicked");
	bulletCollectorActivate++;
	ammoText.attr({"text": bulletCollectorActivate});
	ammoText.attr({"opacity":1});
	ammoText.animate({opacity:0}, 1000);
	bulletCollector.attr({"fill":"red", "opacity":0.3});
	bulletCollector.animate({"fill":"black", "opacity":0.99}, 100);
	bulletCollectorGlow.show();
	ammoText.show();
	hitAudio[1].pause();
    hitAudio[1].currentTime = 0;
    hitAudio[1].play();
	gatherBullets();
	if (bulletCollectorActivate ===1 && snakeSpawn===0){
		commentary.innerHTML = `[${new Date().toLocaleTimeString()}] <b>The Talking Lemon</b>: I heard patents are granted as fast as 6 months in Singapore. Typically, patents are granted 2-4 years after the date of the filing of patent application (also known as the priority date). Once granted, a patent is granted for TWENTY years from the priority date as the inventor has revealed the invention to the public.<br>
			    		<hr>This webpage is powered by HTML5, CSS, and purely by the Javascript library, Raphaël.<br><br>All audio and SVG line paths are extracted from works that are in the public domain (sources: freesound.org and freesvg.org). The image files used are created by yours truly.<br><br> © 2021, <a href='https://www.linkedin.com/in/lenon-ong/' target= '_blank'><span class='underline'>Lenon Ong</span></a><br><a href='https://creativecommons.org/licenses/by/3.0/' target= '_blank'><span class='underline'>Available under the Creative Commons Attribution 3.0 Unported License.</span></a><hr>`;
		var chapterHeader = paper.text(pWidth/2, pHeight/2, "Act II: Friends of Novelty - The Patent Application & The Priority Date.").attr({"font-size": 20, "fill": "#FFFFFF", "opacity": 0}).animate({"y":pHeight/10, "opacity": 1},5000, function(ev){this.animate({"opacity":0},2000, function(ev){this.remove()})});
		hitAudio[3].pause();
        hitAudio[3].currentTime = 0;
        hitAudio[3].play();
	};

	if (bulletCollectorActivate ===10){
		halfPromptText.show();
		halfPromptText.attr({"opacity":1});
		halfPromptText.animate({opacity:0}, 1000);		
		bulletCollectorGlow.show();
		bulletCollector.attr({
		    "stroke": "red"
		});
		bulletCollectorGlowGreen.hide();
	};
	if (bulletCollectorActivate ===17 && snakeSpawn===0){
		almostThereText.show();
		almostThereText.attr({"opacity":1});
		almostThereText.animate({opacity:0}, 1000);		
		bulletCollectorGlow.show();
		bulletCollector.attr({
		    "stroke": "red"
		});
		bulletCollectorGlowGreen.hide();
	};
	if (bulletCollectorActivate <20){
		bulletCollectorGlow.show();
		bulletCollector.attr({
		    "stroke": "red"
		});
		bulletCollectorGlowGreen.hide();
	};
	if (bulletCollectorActivate ===20 && snakeSpawn>=1){
		bullet.yrate = 0; //initialising bullet
		bullet.posx = bulletSpotX;
		bullet.posy = bulletSpotY;
		bulletCollectorGlowRed.hide();
		bulletCollectorGlowGreen.show();
		loadAndShoot();
		bulletCollector.attr({
		    "stroke": "black"
		});
		bulletCollectorGlow.hide();
		bulletCollectorActivate = 0;
	};
	if (bulletCollectorActivate ===20 && snakeSpawn===0){
		snakeSpawn++;
		var chapterHeader = paper.text(pWidth/2, pHeight/2, "Act III: The Twenty-Year Patent Duration, Public Domain, & Competitors.").attr({"font-size": 20, "fill": "#FFFFFF", "opacity": 0}).animate({"y": pHeight/10, "opacity": 1},5000, function(ev){this.animate({"opacity":0},2000, function(ev){this.remove()})});
		commentary.innerHTML = `[${new Date().toLocaleTimeString()}] <b>The Talking Lemon</b>: <b>Our patent has been <i>supercharged</i> green!</b> This represents the expiry of patent protection after 20 years, and now the patent goes into the public domain. It's now a free-for-all battle to defeat the competitors out there who have banded together: having a branding strategy helps to <i>supercharge</i> a patented product or process by differentiating the "original" from the rest! 
		Aim for that snake-looking thing's head, and fire by clicking on the green orb!!
			    		<hr>This webpage is powered by HTML5, CSS, and purely by the Javascript library, Raphaël.<br><br>All audio and SVG line paths are extracted from works that are in the public domain (sources: freesound.org and freesvg.org). The image files used are created by yours truly.<br><br> © 2021, <a href='https://www.linkedin.com/in/lenon-ong/' target= '_blank'><span class='underline'>Lenon Ong</span></a><br><a href='https://creativecommons.org/licenses/by/3.0/' target= '_blank'><span class='underline'>Available under the Creative Commons Attribution 3.0 Unported License.</span></a><hr>`;
		hitAudio[3].pause();
        hitAudio[3].currentTime = 0;
        hitAudio[3].play();
		var snekSpawnTime = Date.now();
		var snekTimeLapsed = paper.text(pWidth/10, pHeight/10, `${Date.now()-snekSpawnTime}`).attr({"font-size": 20, "fill": "#FFFFFF", "opacity": 0});
		var snekCountryText = paper.text(pWidth/2, pHeight/2*1.5, "You need to aim for its head.").attr({"font-size": 20, "fill": "#FFFFFF", "opacity": 0});
		snekCountryText.animate({"opacity": 1}, 2000, function(ev){this.animate({"opacity": 0}, 2000, function(ev){this.remove()})});
		bulletCollectorGlowGreen.show();
		loadAndShoot();
		bulletCollector.attr({
		    "stroke": "black"
		});
		bulletCharged = 0;
		bulletReadyToCharge = 0;
		bulletCollectorActivate = 0;
		console.log("round 2");

				////*****************

				//SNAKE MONSTER SPAWN

				////*****************

				// creating all the "counter" variables here
				count = 0;
				contactPointX = 0;
				contactPointY = 0;

				let frameLength=10; // in ms, used for the interval at which we call the draw() function
				let time = 0;      // time since the page was loaded into the browser; incremented in draw()
				let hitWindow = 15; // radius of nd

				// Find and get paper dimensions
				let dimX = paper.width;
				let dimY = paper.height;


				let disk = paper.circle(dimX/2, dimY/2, 50).attr({"fill": "black", "stroke":"white"});
				//disk.hide();
				disk.animate({opacity:0}, 1000);
				let diskglow = disk.glow({ 'width': 60, 'fill': true, 'opacity': 0.5, 'color': 'white'});
				//diskglow.hide();
				diskglow.animate({opacity:0}, 1000, function(){this.remove();});

				// preparing for clash ripple effect

				let clashInitialRipple = paper.circle(disk.Xpos,disk.Ypos,40).attr({
				    "stroke-width":2,
				    "stroke": "yellow"
				});

				clashInitialRipple.hide();


				let clashRippleAnimation = function(){
					clashInitialRipple.show();
					clashInitialRipple.animate({
						"r": 400,
						"opacity": 0
					}, 2000);
				};

				disk.Xpos = disk.attr("cx");
				disk.Ypos = disk.attr("cy");

				disk.Xrate = 5;
				disk.Yrate = 1;

				let slide = function(){
					//snekTimeLapsed.attr({text: `${(Math.round((Date.now()-snekSpawnTime))/1000).toFixed(2)}`});
					var nd = paper.circle(dimX/2,3*dimY/4,hitWindow).attr({"fill":"url('resources/just_lemon5.png')", "stroke":"white"});
					var nEye = paper.ellipse(dimX/2,3*dimY/4,hitWindow/3, hitWindow/2).attr({"fill":"black", "stroke":"black"});

				/* Update disk.xpos and disk.ypos by adding disk.xrate and disk.yrate to them each time in
				'draw'. That is, the disk.xrate and disk.yrate numbers represent the number of pixels in
				each dimension that we will move the disk each time draw() is called. */
					disk.Xpos += disk.Xrate;
					disk.Ypos += disk.Yrate;
					//console.log(disk.Xpos);
					//console.log(disk.Ypos);

					nd.attr({"cx": disk.Xpos, "cy": disk.Ypos});
					nEye.attr({"cx": disk.Xpos, "cy": disk.Ypos});

				// the 4 "if" conditions to rebound the trail when the trail hits the 4 walls

					if (disk.Xpos >= dimX-disk.attr("r")){
						disk.Xrate = -5;
						disk.Yrate *= -1; //makes the yellow snake's movement more randomised //math.random not used cos it causes lag										
						contactPointX = disk.Xpos+hitWindow;
						contactPointY = disk.Ypos+hitWindow;
						cursorInitialRipple.attr({
					        "cx": contactPointX,
					        "cy": contactPointY
					    });
					    cursorInitialRipple.show();
						cursorRippleAnimation();
					};
					/*console.log(dimY-20)
					console.log(disk.attr("cy"))*/ 
					//this shows that we cannot use === cos the numbers will not be exactly the same and then the if statement will not work
					if (disk.Ypos >= 3*dimY/4-disk.attr("r")){
						disk.Yrate = -5;
						contactPointX = disk.Xpos+hitWindow;
						contactPointY = disk.Ypos+hitWindow;
						cursorInitialRipple.attr({
					        "cx": contactPointX,
					        "cy": contactPointY
					    });
					    cursorInitialRipple.show();
						cursorRippleAnimation();											
					};

					if (disk.Xpos <= 0+disk.attr("r")){
						disk.Xrate = 5;
						disk.Yrate *= -1; //makes the yellow snake's movement more randomised //math.random not used cos it causes lag										
						contactPointX = disk.Xpos+hitWindow;
						contactPointY = disk.Ypos+hitWindow;
						cursorInitialRipple.attr({
					        "cx": contactPointX,
					        "cy": contactPointY
					    });
					    cursorInitialRipple.show();
						cursorRippleAnimation();												
					};

					if (disk.Ypos <= 0+disk.attr("r")){
						disk.Yrate = 5;
						contactPointX = disk.Xpos+hitWindow;
						contactPointY = disk.Ypos+hitWindow;
						cursorInitialRipple.attr({
					        "cx": contactPointX,
					        "cy": contactPointY
					    });
					    cursorInitialRipple.show();
						cursorRippleAnimation();												
					};

				// 12. Using Raphael's animate function to remove the circle from the paper after 1 second, and making the circle transparent over 1 second.
					nd.animate({r:hitWindow/10, opacity:0}, 750, function(ev){this.remove();});
					nEye.animate({r:hitWindow/10, opacity:0, "stroke":"green", "fill":"green"}, 50, function(ev){this.remove();});					

				// 13. Bullet x Headshot code
					bullet.posx += bullet.xrate;
			        bullet.posy += bullet.yrate;
			        bullet.attr({ cx : bullet.posx, cy : bullet.posy});

			        bulletBump(nd, bullet)
			        if (bulletBump(nd, bullet)){
			            clashInitialRipple.attr({
			            	"cx": disk.Xpos,
			            	"cy": disk.Ypos
			            });
			            clashRippleAnimation();
			            clearInterval(timer02);
			           	var chapterHeader = paper.text(pWidth/2, pHeight/2, "Act IV: The Territoriality Principle & Computers.").attr({"font-size": 20, "fill": "#FFFFFF", "opacity": 0}).animate({"y": pHeight/10, "opacity": 1},5000, function(ev){this.animate({"opacity":0},2000, function(ev){this.remove()})});
			            commentary.innerHTML = `[${new Date().toLocaleTimeString()}] <b>The Talking Lemon</b>: You defeated it! Now we are entering the territory of the <i>territorality</i> principle. Patent protection is granted by jurisdiction. To obtain patent protection <b>outside of the boundaries</b> of, say, my home country (Singapore!), patent applications have to be made overseas.
			            	    		<hr>This webpage is powered by HTML5, CSS, and purely by the Javascript library, Raphaël.<br><br>All audio and SVG line paths are extracted from works that are in the public domain (sources: freesound.org and freesvg.org). The image files used are created by yours truly.<br><br> © 2021, <a href='https://www.linkedin.com/in/lenon-ong/' target= '_blank'><span class='underline'>Lenon Ong</span></a><br><a href='https://creativecommons.org/licenses/by/3.0/' target= '_blank'><span class='underline'>Available under the Creative Commons Attribution 3.0 Unported License.</span></a><hr>`;
			            hitAudio[2].pause();
				        hitAudio[2].currentTime = 0;
        				hitAudio[2].play();
			            endGame02();
			            diskglow.hide();
			            disk.hide();
			        } else {
			            {disk.attr({"fill":"#000000"})}
			        };

				};


				//02.5 function for bullet bumping with head


				function bulletBump(c1,c2){
				    c1 = {
				        "x" : c1.attr("cx"),
				        "y" : c1.attr("cy"),
				    };
				    c2 = {
				        "x" : c2.attr("cx"),
				        "y" : c2.attr("cy"),
				    };
				    let d = distance(c1,c2)

				    if (d < hitWindow + bullet.attr("r")){
				        bullet.hide();
				        snekTotalTime = Math.round((Date.now()-snekSpawnTime)).toFixed(2)/1000;
						snekTimeLapsed.attr({"opacity": 1});
						snekTimeLapsed.attr({text: `You took ${Math.round((Date.now()-snekSpawnTime)).toFixed(2)/1000} seconds.`});
				        snekTimeLapsed.animate({"x": pWidth/5, "opacity": 0}, 5000, function(ev){this.remove()});
				        bullet.posx = -100;
				        bullet.posy = -100;
				        bullet.yrate = 0;
				        return true
				    }
				    else {
				        bullet.show();
				        return false
				    }
				};


		let timer02 = setInterval(slide, frameLength);

	};
	
});

bulletCollector.node.addEventListener("mousemove", function(ev){
	bulletCollector.node.style.cursor="pointer";
});

let bulletInitialRipple = paper.circle(bulletSpotX,bulletSpotY,200).attr({
    "stroke-width":1,
    "stroke": "orange"
});

bulletInitialRipple.hide();

let bulletCharged = 0;
let bulletReadyToCharge = 0;

let bulletRippleAnimation = function(){
	bulletInitialRipple.animate({
		"r": 20,
		"opacity": 0
	}, 1000);
	bulletInitialRipple = paper.circle(bulletSpotX,bulletSpotY,400).attr({
    "stroke-width":1,
    "stroke": "#orange"
	});
	bulletInitialRipple.hide();
	clearInterval(timer);
	bulletReadyToCharge++;
};


let gatherBullets = function(){
	if (bulletReadyToCharge === 1){
		bulletCharged++;
		console.log(bulletCharged + " bullet charged round")
		counter = 0;
		while(counter<numCircles){

			circlesList[counter].animate({
				"cx": bulletSpotX,
				"cy": bulletSpotY,
				"stroke": "white",
			}, 3000)

			counter++;
		};
};
};

//*************

//Loop for circle resize

//*************


let bigBulletCollector = function(loop){
	bulletCollector.animate({
		"r" : bulletCollector.attr("r")+10,
		"fill" : "black"
	}, 1500, smallBulletCollector)
}

let smallBulletCollector = function(loop){
	bulletCollector.animate({
		"r" : bulletCollector.attr("r")-10,
		"fill" : "black"
	}, 1500, bigBulletCollector)
}

bigBulletCollector(bigBulletCollector);


let bigBullet = function(loop){
	bullet.animate({
		"r" : bullet.attr("r")+10,
		"fill" : "#98FB98"
	}, 1500, smallBullet)
}

let smallBullet = function(loop){
	bullet.animate({
		"r" : bullet.attr("r")-10,
		"fill" : "black"
	}, 1500, bigBullet)
}

bigBullet(bigBullet);


////*******************

var timer03;

let endGame02 = function(){
	if (game02State === "true"){
	bulletCollectorGlowRed.animate({'opacity':0, 'width':200}, 2000, function(ev){this.remove()});
	bulletCollector.remove();
	bulletCollectorGlow.remove();
	bulletCollectorGlowGreen.remove();
	bulletInitialRipple.remove();
	bullet.remove();
	ammoText.remove();
	halfPromptText.remove();
	almostThereText.remove();
    game02State = "false"; //ensures function only runs once
	};
    game03State = "true";
    counter = 0;
    	while(counter<numCircles){
    		circlesList[counter].remove();
    		counter++;
	//hitText.attr({"text": "Ammo count: "+numCircles});
    //backgroundAudio.pause();
    //backgroundAudio.currentTime = 0;

	};
		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>initialising countries' svg for game03
	var promptCountryText = paper.text(MCTextX, MCTextY, "Find something to click on. (It's thin!)").attr({"font-size": 20, "fill": "#FFFFFF", "opacity": 0});
	promptCountryText.animate({"opacity":1}, 3000);

	//FIRST UP: SINGAPORE --> credit: https://freesvg.org/simple-map-of-singapore (CC0 1.0 Universal (CC0 1.0) Public Domain Dedication)
	singaporeMainPathString = "m -59.266666,165.2375 11.641667,11.1125 7.937499,0.52917 2.116667,6.87916 v 4.7625 l 7.408333,5.82084 14.816667,-4.7625 11.1124997,-3.175 24.8708333,-4.23334 20.108333,8.99584 7.408333,-5.82084 7.9375,10.05417 20.108333,11.1125 14.2875,11.64167 17.991671,5.29166 17.4625,-3.70416 8.46666,1.05833 3.175,-20.10833 8.99583,-12.17084 5.29167,-4.23333 2.64583,6.35 6.87917,2.64583 16.40417,-1.05833 13.22916,-8.46667 17.99167,-4.23333 24.87083,-8.46667 12.17084,-15.34583 8.46666,-20.6375 11.64167,-9.525 0.52917,-11.1125 -7.9375,-4.7625 h -15.34584 l -6.87916,7.40833 -14.2875,1.5875 -19.05,-8.99583 -10.58334,-1.5875 3.70417,-7.9375 -7.40833,-11.641666 -2.64584,-4.7625 -4.7625,-0.529167 -6.35,10.583333 -6.35,-6.879166 -8.99583,-0.529167 -3.70417,-4.233333 h -11.1125 l -8.99583,11.112499 4.7625,-13.758333 2.11667,-7.408333 v 0 l -5.29167,-15.875 -14.2875,-10.054166 -17.99166,-8.466667 -16.404171,2.645833 -25.929166,19.05 L 56.091666,68.4 40.216666,66.283334 39.158333,72.104167 38.1,73.691667 31.75,59.933334 24.341666,57.816667 v 0 L 6.8791666,59.933334 -6.3499999,73.691667 -22.225,78.983334 -25.4,92.741667 l -6.35,3.175 -4.7625,20.637503 10.054167,3.70416 -7.9375,2.64584 -2.116667,3.70416 -5.291666,-3.70416 -3.704167,4.7625 3.704167,3.175 -0.529167,3.70416 -10.583333,2.64584 2.116667,7.9375 -6.879167,4.7625 4.7625,5.82083 -6.35,2.11667 z";
	var singaporeMain = paper.path(singaporeMainPathString);
	singaporeMain.attr({
		//"fill": "black",
		"stroke-width": 5,
		"stroke": "white",
		"opacity": 0,
		"xpos": pWidth/2,
		"ypos": pHeight/2
	});
	singaporeMain.transform('S1,1', 1000);

	singaporeMain.animate({opacity: 1}, 1000);
	var _transformedPath = Raphael.transformPath(singaporeMainPathString, `T560,50`);
	singaporeMain.animate({path: _transformedPath}, 1000);
	singaporeMain.node.addEventListener("click", function myFunction(ev){
		singaporeMain.node.removeEventListener("click", myFunction);
		var _transformedPath = Raphael.transformPath(singaporeMainPathString, `T860,10`);
		singaporeMain.animate({"opacity": 0, "color": "white", "path": _transformedPath}, 1500, function(ev){this.remove()});
		promptCountryText.animate({"opacity": 0}, 3000, function(ev){this.remove()});
		singaporeMain.node.style.cursor="pointer";
		commentary.innerHTML = `[${new Date().toLocaleTimeString()}] <b>The Talking Lemon</b>: What do the animated lines of binary code represent? Well, apart from them looking rather cool (for me at least) and to make it harder for you to click on the necessary element to proceed, they serve as a reminder of how computer programs have brought about challenges on deciding whether something is patentable. Ohh, that's Africa! 
			    		<hr>This webpage is powered by HTML5, CSS, and purely by the Javascript library, Raphaël.<br><br>All audio and SVG line paths are extracted from works that are in the public domain (sources: freesound.org and freesvg.org). The image files used are created by yours truly.<br><br> © 2021, <a href='https://www.linkedin.com/in/lenon-ong/' target= '_blank'><span class='underline'>Lenon Ong</span></a><br><a href='https://creativecommons.org/licenses/by/3.0/' target= '_blank'><span class='underline'>Available under the Creative Commons Attribution 3.0 Unported License.</span></a><hr>`;
		hitAudio[3].pause();
        hitAudio[3].currentTime = 0;
        hitAudio[3].play();
		createAfricaMain();
    });

	singaporeMain.node.addEventListener("mousemove", function(ev){
		singaporeMain.node.style.cursor="pointer";
    });    

//all strings are from https://freesvg.org/ (CC0 1.0 Universal (CC0 1.0) Public Domain Dedication) - also converted to a single string using GIMP and Microsoft Word
	africaMainPathString1 = "M 316.18,330.10 C 316.27,331.26 315.86,332.87 316.59,333.60 316.73,333.74 317.07,333.67 317.21,333.81 317.31,333.90 317.15,334.30 317.21,334.43 317.46,334.93 317.64,335.07 317.83,335.25 318.03,335.45 317.77,336.22 318.03,336.49 318.13,336.58 318.32,336.43 318.45,336.49 318.86,336.70 318.85,336.89 319.06,337.11 319.44,337.48 320.75,336.93 321.12,337.31 321.26,337.44 321.12,338.17 321.12,338.14 321.12,337.33 321.19,337.87 320.92,338.14 320.87,338.18 320.76,338.09 320.71,338.14 320.67,338.18 320.92,340.01 320.92,340.40 320.92,340.49 320.86,340.97 320.92,341.02 321.07,341.17 321.54,341.23 321.74,341.43 321.79,341.48 321.69,341.59 321.74,341.64 321.84,341.73 322.03,341.58 322.15,341.64 322.33,341.72 322.76,342.05 322.57,342.05 322.50,342.05 322.57,341.78 322.57,341.84 322.57,342.28 322.68,342.93 322.98,343.08 323.48,343.33 323.14,344.07 323.39,344.32 323.44,344.36 323.60,344.38 323.60,344.32 323.60,344.22 323.39,344.01 323.39,344.11 323.39,344.26 323.55,344.38 323.60,344.52 323.71,344.85 323.60,345.41 323.60,345.76 323.60,346.81 323.76,347.78 324.42,348.44 324.90,348.91 325.88,348.87 326.07,349.05 326.45,349.43 326.79,349.98 327.10,350.29 327.38,350.57 329.47,349.98 329.57,350.08 329.71,350.22 329.88,350.60 329.98,350.70 330.10,350.82 330.69,351.00 330.81,351.12 330.91,351.22 330.71,351.63 330.81,351.73 330.87,351.80 331.43,352.11 331.43,352.15 331.43,352.21 331.22,352.08 331.22,352.15 331.22,352.57 331.51,352.23 331.63,352.35 331.90,352.62 332.05,352.98 332.25,353.18 332.33,353.26 332.95,353.18 333.07,353.18 333.21,353.18 333.84,353.33 333.90,353.38 333.95,353.43 333.85,353.54 333.90,353.59 334.07,353.76 334.76,353.42 334.93,353.59 335.03,353.69 335.03,353.90 335.13,354.00 335.31,354.17 335.79,354.03 335.96,354.21 336.06,354.31 336.06,354.51 336.17,354.62 336.23,354.69 336.51,354.55 336.58,354.62 336.82,354.86 336.95,355.20 337.20,355.44 337.24,355.49 337.35,355.39 337.40,355.44 337.54,355.58 337.47,355.92 337.61,356.06 337.68,356.13 337.95,355.99 338.02,356.06 338.07,356.11 337.97,356.22 338.02,356.27 338.36,356.61 339.74,355.92 340.08,356.27 340.18,356.37 340.18,356.57 340.29,356.68 340.47,356.86 343.88,357.50 344.41,357.50 347.04,357.50 345.03,355.34 346.05,355.85 346.18,355.92 345.99,356.14 346.05,356.27 346.25,356.65 346.72,356.56 346.88,356.88 347.10,357.34 346.96,358.41 347.08,358.53 347.13,358.58 347.24,358.48 347.29,358.53 347.39,358.64 347.19,359.05 347.29,359.15 347.34,359.20 347.45,359.10 347.50,359.15 347.60,359.25 347.39,359.67 347.50,359.77 347.55,359.82 347.65,359.72 347.70,359.77 347.76,359.82 347.70,360.30 347.70,360.39 347.70,360.46 347.77,360.59 347.70,360.59 347.65,360.59 347.91,360.28 347.91,360.80 347.91,362.55 348.12,362.04 349.14,363.06 349.30,363.22 349.35,364.67 349.35,364.30 349.35,363.09 349.20,364.82 349.14,364.92 348.72,365.78 349.16,364.70 348.73,365.13 348.55,365.31 349.34,366.37 348.94,366.77 348.84,366.88 348.42,366.67 348.32,366.77 348.27,366.82 348.37,366.93 348.32,366.98 348.25,367.05 347.98,366.91 347.91,366.98 347.83,367.06 347.53,367.84 347.70,368.01 347.75,368.06 347.86,367.96 347.91,368.01 347.98,368.08 347.84,368.35 347.91,368.42 347.96,368.47 348.07,368.37 348.11,368.42 348.16,368.47 348.07,368.58 348.11,368.63 348.16,368.67 349.49,368.76 349.76,369.04 349.87,369.15 349.47,370.81 350.38,371.72 350.43,371.76 352.74,371.72 353.06,371.72 353.32,371.72 353.72,372.17 353.88,372.34 353.98,372.43 355.26,372.40 355.33,372.34 355.75,371.91 354.67,372.35 355.53,371.92 355.70,371.84 355.99,372.01 356.15,371.92 357.01,371.50 355.93,371.94 356.36,371.51 356.49,371.38 357.01,371.60 357.18,371.51 357.23,371.49 357.43,371.15 357.59,371.31 357.64,371.35 357.54,371.46 357.59,371.51 357.79,371.71 358.66,371.55 358.83,371.72 359.22,372.11 359.14,372.90 359.65,373.16 360.17,373.42 361.73,372.76 362.12,373.16 362.17,373.21 362.08,373.32 362.12,373.37 362.18,373.42 363.31,373.42 363.36,373.37 363.51,373.22 363.60,371.92 363.77,371.92 363.84,371.92 363.70,372.13 363.77,372.13 363.96,372.13 364.09,371.77 364.39,371.92 364.91,372.18 364.87,372.56 365.42,372.75 365.63,372.82 368.33,373.14 368.51,372.95 368.56,372.91 368.46,372.80 368.51,372.75 368.58,372.68 368.86,372.82 368.92,372.75 368.99,372.68 368.86,372.40 368.92,372.34 368.97,372.29 369.08,372.38 369.13,372.34 369.23,372.24 369.07,372.05 369.13,371.92 369.27,371.64 369.61,371.65 369.75,371.51 369.85,371.42 369.65,371.20 369.75,371.10 369.85,371.00 370.06,371.20 370.16,371.10 370.29,370.97 370.16,370.25 370.16,370.28 370.16,371.11 370.60,370.04 370.78,369.86 370.79,369.85 371.50,370.07 371.81,370.07 372.29,370.07 373.87,369.25 374.28,369.66 374.33,369.71 374.23,369.82 374.28,369.86 374.38,369.96 374.60,369.77 374.69,369.86 374.90,370.07 375.49,370.91 375.93,370.69 376.28,370.51 376.33,370.48 376.75,370.48 376.84,370.48 377.32,370.54 377.37,370.48 377.42,370.43 377.32,370.32 377.37,370.28 377.44,370.21 377.71,370.34 377.78,370.28 377.83,370.23 377.73,370.12 377.78,370.07 378.15,369.70 378.76,369.97 379.02,369.45 379.38,368.72 378.75,369.22 379.02,368.42 379.03,368.40 380.43,368.46 380.67,368.22 380.77,368.11 380.77,367.91 380.87,367.80 381.00,367.68 381.35,367.67 381.49,367.39 381.58,367.22 381.90,366.79 381.90,366.98 381.90,367.05 381.63,366.98 381.70,366.98 381.95,366.98 384.56,367.00 384.58,366.98 384.85,366.71 385.14,365.80 385.41,365.54 385.46,365.49 385.56,365.59 385.61,365.54 385.71,365.44 385.52,365.22 385.61,365.13 385.66,365.08 385.77,365.17 385.82,365.13 385.92,365.02 385.72,364.61 385.82,364.51 386.13,364.20 386.54,363.99 386.85,363.68 386.88,363.65 386.82,363.06 386.85,363.06 386.92,363.06 386.85,363.34 386.85,363.27 386.85,362.28 386.80,363.22 386.44,362.86 386.33,362.76 386.33,362.55 386.23,362.45 385.01,362.30 383.58,362.18 385.57,361.82 384.62,359.23 385.72,361.65 384.62,359.88 384.41,359.55 384.52,360.22 384.52,359.67 384.52,359.42 384.63,359.49 384.52,359.28 384.40,359.04 384.70,358.26 384.58,358.02 384.43,357.71 385.53,355.34 385.23,354.73 385.01,354.29 385.53,353.43 385.26,352.90 385.04,352.45 384.38,351.76 384.01,351.39 383.96,351.35 382.44,350.94 382.37,350.92 382.02,350.78 382.50,350.49 382.38,350.57 381.27,351.27 381.10,350.14 381.05,350.09 380.86,349.90 380.99,348.95 380.99,348.50 380.99,347.49 380.78,346.84 381.23,346.40 379.95,345.18 380.62,344.88 381.20,343.49 381.43,343.25 380.28,342.69 380.26,342.67 380.21,342.62 379.38,342.41 379.23,342.26 378.83,341.33 379.26,339.92 379.43,339.37 379.57,339.23 379.29,338.68 379.43,338.55 379.87,338.64 379.57,337.98 379.64,337.72 380.10,337.70 380.12,336.89 380.26,336.49 380.26,336.36 380.34,335.74 380.26,335.66 380.13,335.54 379.55,335.28 379.43,335.04 379.48,334.53 379.00,334.76 378.81,334.63 378.72,334.54 378.88,334.34 378.81,334.22 378.65,333.88 378.17,333.78 377.99,333.60 377.79,333.40 379.01,333.20 378.71,332.90 378.61,332.80 379.09,331.84 378.99,331.73 378.76,331.50 378.13,331.55 377.98,331.25 377.77,330.84 377.02,331.04 377.23,330.62 377.70,329.68 376.43,328.16 376.55,328.04 376.68,327.90 376.62,327.56 376.75,327.42 377.69,326.50 376.98,329.32 376.69,326.51 376.95,326.85 376.68,325.60 376.63,325.34 376.71,325.18 375.75,323.61 376.34,323.61 376.70,323.62 376.52,322.33 376.30,321.87 375.96,321.20 375.97,321.25 376.96,319.97 377.91,318.74 377.18,319.36 377.11,319.29 376.68,318.86 376.91,319.13 376.55,318.77 376.50,318.72 376.60,318.61 376.55,318.56 376.31,318.32 375.68,317.90 375.31,317.53 375.00,317.22 374.80,316.81 374.49,316.50 374.39,316.40 374.17,316.60 374.07,316.50 374.03,316.45 374.12,316.34 374.07,316.30 373.92,316.15 373.45,316.09 373.25,315.88 373.20,315.84 373.30,315.73 373.25,315.68 373.15,315.57 372.56,315.61 372.43,315.47 372.36,315.40 372.50,315.13 372.43,315.06 372.25,314.89 371.98,314.82 371.81,314.65 371.71,314.55 371.91,314.33 371.81,314.24 371.38,313.81 371.83,314.89 371.40,314.03 371.34,313.91 371.49,313.71 371.40,313.62 371.35,313.57 371.24,313.67 371.19,313.62 371.07,313.50 370.90,312.91 370.78,312.79 370.73,312.74 370.62,312.84 370.57,312.79 370.26,312.48 370.68,311.45 370.37,311.15 370.32,311.10 370.21,311.19 370.16,311.15 370.06,311.04 370.17,308.47 369.95,308.26 369.82,308.12 369.27,308.40 369.13,308.26 369.08,308.21 369.18,308.10 369.13,308.05 369.03,307.95 368.62,308.16 368.51,308.05 368.46,308.01 368.56,307.90 368.51,307.85 368.33,307.67 367.94,307.77 367.69,307.64 367.23,307.41 367.62,307.51 367.48,307.23 367.34,306.95 367.00,306.95 366.86,306.82 366.77,306.72 366.93,306.53 366.86,306.41 366.83,306.34 366.47,305.80 366.45,305.79 366.35,305.69 366.14,305.69 366.04,305.58 365.64,305.19 365.46,304.79 365.22,304.55 364.91,304.24 363.67,304.86 363.36,304.55 363.31,304.50 363.41,304.39 363.36,304.35 363.26,304.24 362.85,304.45 362.74,304.35 362.34,303.94 361.81,303.21 361.30,302.70 361.10,302.50 359.65,302.48 359.45,302.29 359.38,302.22 359.52,301.94 359.45,301.87 359.38,301.81 358.90,301.74 358.83,301.67 358.78,301.62 358.88,301.51 358.83,301.46 358.78,301.41 358.67,301.51 358.62,301.46 358.57,301.41 358.67,301.30 358.62,301.26 358.57,301.21 358.48,301.29 358.42,301.26 358.14,301.12 358.13,300.76 358.00,300.64 357.96,300.59 357.85,300.69 357.80,300.64 357.75,300.59 357.85,300.48 357.80,300.43 357.38,300.01 356.67,299.51 356.15,298.99 356.10,298.94 356.20,298.83 356.15,298.78 356.08,298.71 355.81,298.85 355.74,298.78 355.64,298.69 355.84,298.47 355.74,298.37 355.69,298.32 355.58,298.42 355.53,298.37 355.43,298.27 355.43,298.06 355.33,297.96 355.15,297.79 354.67,297.92 354.50,297.75 354.33,297.58 354.26,297.31 354.09,297.13 353.91,296.95 353.24,296.70 353.06,296.52 352.77,296.23 352.64,295.90 352.24,295.69 351.58,295.37 348.51,295.68 348.32,295.49 348.14,295.31 348.05,294.87 347.70,294.87 347.45,294.87 346.75,294.74 346.67,294.66 346.62,294.61 346.72,294.51 346.67,294.46 346.51,294.29 345.86,294.56 345.64,294.46 345.29,294.28 344.97,294.22 344.61,294.04 343.97,293.72 340.77,294.04 339.87,294.04 339.29,294.04 338.91,294.00 338.43,293.84 337.58,293.55 332.10,293.84 330.81,293.84 330.81,293.84 325.45,293.84 325.45,293.84 325.45,293.84 323.19,293.84 323.19,293.84 323.19,293.84 322.16,293.84 322.16,293.84 322.09,293.84 321.95,293.91 321.95,293.84 321.95,293.77 322.11,293.79 322.16,293.84 322.26,293.94 322.05,294.35 322.16,294.46 322.26,294.56 322.46,294.56 322.57,294.66 322.64,294.73 322.50,295.01 322.57,295.07 322.62,295.12 322.72,295.03 322.77,295.07 322.88,295.18 322.88,295.38 322.98,295.49 323.42,295.93 324.38,296.24 324.83,297.13 324.99,297.44 324.82,298.35 325.04,298.58 325.09,298.63 325.20,298.53 325.25,298.58 325.62,298.95 324.87,300.47 325.25,300.84 325.29,300.89 325.40,300.79 325.45,300.84 325.68,301.07 325.45,302.75 325.45,303.11 325.45,303.25 325.55,303.42 325.45,303.52 325.19,303.78 324.05,303.49 323.80,303.73 323.44,304.09 323.88,305.09 323.60,305.38 323.38,305.59 323.19,305.58 322.98,305.99 322.92,306.12 323.08,306.31 322.98,306.41 322.80,306.58 322.30,306.52 322.16,306.82 322.00,307.14 321.36,307.59 321.33,307.64 321.23,307.85 321.30,308.49 321.12,308.67 321.06,308.74 320.82,308.88 320.92,308.88 321.15,308.88 321.27,308.52 321.33,308.47 321.40,308.40 321.67,308.54 321.74,308.47 321.79,308.42 321.69,308.31 321.74,308.26 322.13,307.87 322.92,307.72 323.19,307.85 323.49,308.00 323.46,308.12 323.60,308.26 323.69,308.36 323.91,308.16 324.01,308.26 324.06,308.31 323.96,308.42 324.01,308.47 324.11,308.57 324.52,308.36 324.63,308.47 324.84,308.67 325.67,309.90 325.25,310.32 325.22,310.35 323.40,310.51 322.98,310.94 322.91,311.01 323.05,311.28 322.98,311.35 322.93,311.40 322.82,311.30 322.77,311.35 322.20,311.92 323.27,313.12 322.77,313.62 322.35,314.04 321.34,314.64 320.92,315.06 320.65,315.32 320.77,316.03 320.51,316.30 320.46,316.34 320.35,316.25 320.30,316.30 320.20,316.40 320.40,316.81 320.30,316.91 319.93,317.28 319.41,317.18 319.27,317.33 319.13,317.47 318.85,318.16 318.45,318.56 318.15,318.86 317.64,318.94 317.42,319.39 317.39,319.45 317.46,319.54 317.42,319.59 317.28,319.73 316.73,319.45 316.59,319.59 316.54,319.64 316.64,319.75 316.59,319.80 316.50,319.89 315.93,320.13 315.77,320.21 315.65,320.27 315.29,320.21 315.15,320.21 315.08,320.21 314.94,320.28 314.94,320.21 314.94,320.14 315.15,320.14 315.15,320.21 315.15,320.62 314.69,320.37 315.15,320.83 315.47,321.15 315.56,322.35 315.56,322.89 315.56,323.37 315.51,322.79 315.77,323.30 315.79,323.34 315.56,323.83 315.56,324.12 315.56,324.78 315.35,327.19 315.56,327.63 315.59,327.69 315.72,327.58 315.77,327.63 315.86,327.71 315.77,329.20 316.18,330.10 316.18,330.10 316.18,330.10 316.18,330.10 316.18,330.10 316.18,330.10 316.18,330.10 Z M 138.09,240.42 C 145.30,240.70 153.43,239.38 155.73,241.68 156.94,242.89 155.37,247.62 156.99,249.24 157.58,249.83 158.91,248.65 159.51,249.24 160.56,250.29 160.98,251.97 162.03,253.02 164.13,255.13 170.85,251.20 170.85,251.76 170.85,252.18 169.17,251.76 169.59,251.76 172.39,251.76 173.41,253.02 177.15,253.02 178.13,253.02 182.82,252.39 183.45,253.02 184.04,253.61 183.07,254.79 183.45,255.54 186.07,260.78 183.36,254.19 185.97,256.80 186.81,257.64 186.39,259.74 187.23,260.58 187.52,260.88 188.19,260.28 188.49,260.58 189.38,261.47 188.49,265.62 188.49,264.36 188.49,264.36 188.49,261.84 188.49,261.84 188.49,261.84 188.49,268.14 188.49,268.14 188.49,268.56 188.91,269.40 188.49,269.40 188.07,269.40 188.49,267.72 188.49,268.14 188.49,269.40 189.75,271.92 188.49,271.92 188.07,271.92 188.91,270.66 188.49,270.66 187.55,270.66 186.63,271.26 185.97,271.92 185.15,272.74 186.70,278.22 185.97,278.22 185.55,278.22 186.27,276.66 185.97,276.96 183.02,279.90 183.45,283.27 183.45,288.30 183.45,293.03 179.51,294.28 180.93,297.12 182.81,300.87 185.99,302.18 188.49,304.68 188.57,304.76 190.93,312.16 191.01,312.24 191.60,312.83 192.93,311.64 193.53,312.24 194.12,312.83 192.93,314.16 193.53,314.76 193.82,315.06 194.49,314.46 194.79,314.76 197.50,317.47 195.12,317.61 197.31,319.80 198.82,321.31 201.69,320.10 203.61,321.06 204.36,321.43 203.61,322.74 203.61,323.58 203.61,324.42 204.45,326.10 203.61,326.10 203.19,326.10 203.61,324.42 203.61,324.84 203.61,326.52 205.29,329.88 203.61,329.88 203.19,329.88 203.19,328.62 203.61,328.62 204.20,328.62 204.60,329.35 204.87,329.88 205.39,330.93 204.07,334.12 204.87,334.92 205.16,335.21 205.83,334.62 206.13,334.92 207.19,335.98 206.63,345.50 207.39,346.26 207.68,346.55 208.35,345.96 208.65,346.26 211.60,349.21 204.77,346.26 207.39,346.26 210.68,346.26 210.54,353.19 209.91,353.82 209.57,354.15 206.65,353.82 206.13,353.82 205.71,353.82 204.87,354.24 204.87,353.82 204.87,352.12 206.90,357.11 208.65,358.86 208.94,359.15 209.61,358.56 209.91,358.86 210.54,359.49 209.28,362.01 209.91,362.64 210.34,363.07 214.27,365.16 211.17,365.16 210.75,365.16 210.75,363.90 211.17,363.90 213.79,363.90 211.67,365.66 212.43,366.42 212.72,366.71 213.39,366.12 213.69,366.42 213.77,366.49 214.05,379.56 212.43,382.80 212.07,383.52 211.72,381.89 209.91,382.80 209.53,382.98 210.20,383.76 209.91,384.06 208.86,385.11 205.92,384.27 204.87,385.32 204.28,385.90 202.94,397.32 201.09,399.18 200.79,399.47 200.12,398.88 199.83,399.18 199.10,399.91 198.57,410.42 198.57,413.04 198.57,413.04 198.57,419.34 198.57,419.34 198.57,419.76 198.99,420.60 198.57,420.60 198.15,420.60 198.57,418.92 198.57,419.34 198.57,422.81 199.65,421.50 201.09,424.38 202.01,426.22 200.73,429.05 202.35,430.68 203.17,431.50 205.26,431.46 206.13,433.19 206.51,433.96 205.55,436.39 206.13,436.97 206.76,437.60 208.02,437.60 208.65,438.23 210.59,440.18 208.42,445.57 209.91,447.05 210.20,447.35 210.87,446.76 211.17,447.05 211.75,447.64 210.79,450.07 211.17,450.83 212.08,452.65 212.78,454.06 213.69,455.87 214.07,456.63 213.11,459.07 213.69,459.65 213.98,459.95 214.65,459.36 214.95,459.65 216.37,461.07 213.90,469.32 214.95,473.51 215.48,475.64 217.47,477.03 217.47,478.55 217.47,478.57 218.53,482.13 218.73,482.33 219.02,482.63 219.69,482.04 219.99,482.33 220.62,482.96 219.36,485.48 219.99,486.11 220.28,486.41 220.95,485.82 221.25,486.11 222.35,487.21 220.87,496.69 222.51,499.97 222.77,500.50 225.85,499.53 226.29,499.97 226.92,500.60 226.92,501.86 227.55,502.49 227.84,502.79 228.51,502.20 228.81,502.49 229.40,503.09 228.21,504.42 228.81,505.01 229.40,505.61 230.73,504.42 231.33,505.01 231.92,505.61 230.73,506.94 231.33,507.53 232.66,508.86 233.83,508.76 235.11,511.31 235.29,511.69 235.40,512.87 235.11,512.57 234.44,511.91 233.85,509.11 233.85,510.05 233.85,511.38 234.78,512.54 235.11,513.83 235.28,514.51 234.65,517.15 235.11,517.61 235.40,517.91 236.07,517.32 236.37,517.61 237.21,518.45 235.53,521.81 236.37,522.65 236.66,522.95 237.33,522.36 237.63,522.65 238.22,523.25 237.63,526.01 237.63,525.17 237.63,525.17 237.63,522.65 237.63,522.65 237.63,523.91 238.03,525.24 237.63,526.43 237.49,526.83 236.37,526.85 236.37,526.43 236.37,526.01 237.92,526.14 237.63,526.43 236.76,527.30 231.27,530.16 233.85,532.73 234.14,533.03 234.81,532.44 235.11,532.73 235.70,533.33 234.51,534.66 235.11,535.25 236.39,536.54 237.56,533.87 238.89,536.51 239.41,537.55 239.40,538.28 240.15,539.03 240.74,539.63 242.07,538.44 242.67,539.03 243.49,539.86 243.30,543.44 243.93,544.07 244.56,544.70 247.08,543.44 247.71,544.07 248.00,544.37 247.41,545.04 247.71,545.33 249.00,546.62 255.57,546.29 256.53,545.33 258.09,543.77 257.07,539.03 257.79,539.03 258.21,539.03 257.37,540.29 257.79,540.29 258.38,540.29 258.48,539.22 259.05,539.03 262.69,537.82 282.76,540.52 284.25,539.03 284.54,538.74 283.95,538.07 284.25,537.77 284.88,537.14 287.40,538.40 288.03,537.77 288.73,537.07 290.06,534.87 291.81,533.99 292.56,533.62 293.73,534.59 294.33,533.99 294.62,533.70 294.03,533.03 294.33,532.73 295.17,531.89 297.27,532.31 298.11,531.47 298.95,530.62 298.77,529.88 300.63,528.95 301.38,528.58 302.55,529.55 303.14,528.95 303.44,528.66 302.85,527.99 303.14,527.69 304.56,526.28 308.20,525.13 309.44,522.65 310.42,520.71 310.89,518.68 311.96,517.61 314.57,515.01 311.86,521.60 314.48,516.35 315.31,514.71 318.24,511.33 319.52,510.05 320.12,509.46 321.45,510.65 322.04,510.05 323.09,509.01 324.16,504.15 324.56,503.75 324.86,503.46 325.53,504.05 325.82,503.75 326.74,502.84 327.10,499.96 328.34,498.71 329.93,497.13 333.17,495.15 334.64,493.67 335.27,493.04 334.01,490.52 334.64,489.89 334.94,489.60 335.61,490.19 335.90,489.89 337.26,488.54 334.62,474.82 335.90,472.26 338.15,467.75 348.16,469.16 352.28,460.92 353.95,457.57 352.28,440.42 352.28,435.72 352.28,432.94 347.67,432.76 349.76,430.68 350.39,430.05 351.65,430.05 352.28,429.42 352.58,429.12 351.99,428.45 352.28,428.16 352.91,427.52 356.50,427.72 357.32,426.90 358.37,425.85 358.79,424.17 359.84,423.12 360.44,422.52 361.77,423.71 362.36,423.12 364.97,420.51 358.38,423.22 363.62,420.60 364.37,420.22 365.55,421.19 366.14,420.60 369.10,417.64 362.26,420.60 364.88,420.60 367.77,420.60 369.61,415.87 371.18,414.30 371.60,413.88 374.54,413.46 374.96,413.04 376.01,411.99 376.43,410.31 377.48,409.26 380.56,406.18 384.37,403.62 387.56,400.44 388.16,399.84 386.97,398.51 387.56,397.92 389.52,395.96 392.24,394.87 393.86,391.62 396.48,386.37 390.49,383.20 388.82,381.54 388.19,380.91 389.45,378.39 388.82,377.76 388.53,377.46 387.86,378.05 387.56,377.76 385.74,375.94 388.76,368.81 387.56,366.42 386.94,365.17 386.44,361.52 386.30,361.38 386.01,361.08 385.34,361.67 385.04,361.38 383.63,359.97 385.97,354.42 385.04,352.56 384.17,350.82 382.09,350.86 381.26,350.04 380.00,348.78 382.52,343.74 381.26,342.48 380.97,342.18 380.30,342.78 380.00,342.48 378.74,341.22 381.26,336.18 380.00,334.92 379.71,334.62 379.04,335.22 378.74,334.92 378.11,334.29 379.37,331.77 378.74,331.14 378.45,330.84 377.78,331.44 377.48,331.14 377.26,330.91 375.92,321.67 376.22,321.06 376.90,319.69 380.47,315.55 381.26,314.76 381.86,314.16 383.19,315.35 383.78,314.76 384.41,314.13 383.15,311.61 383.78,310.98 384.38,310.38 385.71,311.57 386.30,310.98 387.35,309.93 387.77,308.25 388.82,307.20 389.12,306.90 389.78,307.50 390.08,307.20 390.68,306.60 389.49,305.27 390.08,304.68 391.55,303.21 393.65,302.37 395.12,300.90 396.38,299.64 395.12,295.86 396.38,294.60 397.85,293.13 399.95,292.29 401.42,290.82 402.02,290.23 400.83,288.89 401.42,288.30 401.72,288.00 402.38,288.60 402.68,288.30 403.92,287.06 404.28,284.18 405.20,283.26 407.46,281.00 412.52,280.86 415.28,279.48 416.34,278.95 416.74,277.49 417.80,276.96 420.89,275.41 423.77,277.29 426.62,274.44 427.21,273.85 426.25,272.67 426.62,271.92 427.49,270.17 429.70,268.84 430.40,268.14 430.82,267.72 429.98,266.04 430.40,265.62 431.17,264.85 433.34,264.79 434.18,263.10 434.56,262.34 433.60,259.90 434.18,259.32 434.48,259.02 435.14,259.62 435.44,259.32 436.03,258.73 434.85,257.39 435.44,256.80 436.29,255.95 437.03,256.14 437.96,254.28 438.85,252.50 437.82,248.13 439.22,246.72 440.27,245.67 441.95,245.25 443.00,244.20 443.58,243.62 442.62,241.18 443.00,240.42 443.93,238.57 444.67,238.75 445.52,237.90 445.94,237.48 445.10,235.80 445.52,235.38 445.82,235.08 446.48,235.68 446.78,235.38 447.41,234.75 446.15,232.23 446.78,231.60 447.08,231.30 447.74,231.90 448.04,231.60 448.91,230.73 448.43,226.17 449.30,225.30 449.60,225.00 450.26,225.60 450.56,225.30 450.64,225.22 453.00,217.82 453.08,217.74 453.38,217.44 454.04,218.04 454.34,217.74 454.97,217.11 453.71,214.59 454.34,213.96 454.64,213.66 455.30,214.26 455.60,213.96 456.33,213.23 456.86,202.72 456.86,200.10 456.86,198.84 455.60,196.32 456.86,196.32 457.28,196.32 457.28,197.58 456.86,197.58 455.83,197.58 450.97,194.65 449.30,196.32 449.00,196.62 449.60,197.28 449.30,197.58 448.71,198.18 447.37,196.99 446.78,197.58 446.48,197.88 447.08,198.54 446.78,198.84 446.19,199.44 444.85,198.25 444.26,198.84 443.67,199.44 444.85,200.77 444.26,201.36 443.67,201.96 442.49,200.99 441.74,201.36 440.68,201.89 440.28,203.35 439.22,203.88 437.46,204.76 408.38,207.06 407.72,206.40 407.30,205.98 406.88,203.04 406.46,202.62 406.16,202.32 405.50,202.92 405.20,202.62 403.10,200.52 406.04,195.90 403.94,193.80 403.64,193.51 402.98,194.10 402.68,193.80 401.76,192.88 402.66,188.75 401.42,187.50 397.67,183.75 392.76,182.63 388.82,178.68 388.23,178.09 389.42,176.76 388.82,176.16 388.19,175.53 386.93,175.53 386.30,174.90 385.71,174.31 386.90,172.98 386.30,172.38 383.19,169.28 379.02,166.36 376.22,163.56 375.63,162.97 376.82,161.64 376.22,161.04 375.37,160.19 374.63,160.38 373.70,158.52 373.32,157.76 374.28,155.33 373.70,154.74 373.07,154.11 371.81,154.11 371.18,153.48 370.13,152.43 370.97,149.49 369.92,148.44 369.63,148.15 368.96,148.74 368.66,148.44 367.82,147.60 368.24,145.50 367.40,144.66 367.11,144.37 366.44,144.96 366.14,144.66 365.27,143.79 365.76,139.24 364.88,138.36 364.59,138.07 363.92,138.66 363.62,138.36 362.57,137.31 364.67,133.11 363.62,132.06 363.33,131.77 362.66,132.36 362.36,132.06 360.47,130.17 364.25,122.61 362.36,120.72 361.54,119.90 359.45,119.94 358.58,118.20 357.61,116.26 357.13,114.23 356.06,113.16 355.01,112.11 352.07,112.95 351.02,111.90 350.20,111.08 350.24,108.99 348.50,108.12 348.13,107.94 347.54,108.42 347.24,108.12 346.74,107.62 344.74,96.81 344.72,96.78 344.43,96.49 343.76,97.08 343.46,96.78 342.46,95.78 344.12,91.81 343.46,90.48 342.50,88.56 340.62,87.32 339.68,85.44 339.31,84.69 340.28,83.52 339.68,82.92 339.05,82.30 337.79,82.30 337.16,81.66 336.32,80.83 338.00,77.47 337.16,76.63 336.53,76.00 335.27,76.00 334.64,75.37 334.05,74.77 335.24,73.44 334.64,72.85 334.05,72.25 332.72,73.44 332.12,72.85 331.07,71.80 330.65,70.12 329.60,69.07 329.31,68.77 328.64,69.36 328.34,69.07 322.81,61.37 327.15,67.21 324.15,60.27 325.65,57.21 326.72,58.86 323.88,55.27 314.22,51.21 314.04,55.49 303.14,55.21 301.54,55.21 294.08,56.23 293.06,55.21 292.77,54.91 293.36,54.24 293.06,53.95 292.47,53.35 291.30,54.32 290.54,53.95 289.48,53.41 289.09,51.96 288.02,51.43 286.96,50.89 280.27,50.89 279.20,51.43 278.59,51.73 276.61,53.87 275.42,52.69 275.01,52.27 275.84,50.59 275.42,50.17 274.03,48.77 271.03,46.08 269.12,45.13 268.08,44.60 264.88,45.93 264.08,45.13 263.79,44.83 264.38,44.16 264.08,43.87 263.74,43.53 259.88,42.61 259.05,42.61 250.85,42.61 249.39,42.18 245.19,46.39 244.23,47.34 246.45,53.79 246.45,53.95 246.45,54.46 246.11,57.39 246.45,57.73 246.87,58.15 248.30,58.99 247.71,58.99 247.29,58.99 247.71,57.31 247.71,57.73 247.71,59.05 246.63,65.47 243.93,62.77 243.63,62.47 244.22,61.80 243.93,61.51 243.33,60.91 242.16,61.88 241.41,61.51 239.55,60.58 239.73,59.83 238.89,58.99 237.14,57.24 223.81,59.03 222.51,57.73 219.49,54.71 222.70,46.58 221.25,45.13 219.83,43.71 214.28,46.05 212.43,45.13 209.94,43.88 197.79,44.35 197.31,43.87 196.25,42.81 194.72,40.02 193.53,38.83 191.76,37.06 185.92,37.51 184.71,36.31 183.72,35.32 185.80,34.11 185.97,33.79 186.35,33.03 185.38,30.59 185.97,30.01 187.76,28.21 192.41,28.46 193.53,26.23 193.72,25.84 193.72,22.83 193.53,22.45 193.11,21.61 192.93,20.59 192.27,19.93 190.33,17.99 189.63,22.33 188.49,21.19 188.36,21.06 188.36,17.53 188.49,17.41 189.12,16.78 190.38,16.78 191.01,16.15 191.28,15.87 190.79,11.11 191.01,11.11 191.43,11.11 191.43,12.37 191.01,12.37 190.91,12.37 187.49,11.11 185.97,11.11 182.54,11.11 175.78,9.96 173.37,12.37 173.07,12.66 173.66,13.33 173.37,13.63 172.74,14.26 170.22,13.00 169.59,13.63 169.29,13.92 169.88,14.59 169.59,14.89 168.51,15.96 161.06,13.63 159.51,13.63 156.15,13.63 159.93,13.21 158.25,14.89 157.06,16.07 134.01,11.89 128.01,14.89 126.96,15.41 123.77,14.09 122.97,14.89 119.31,18.54 120.32,18.93 119.19,21.19 118.81,21.94 117.51,21.19 116.67,21.19 113.71,21.19 117.26,20.89 114.15,22.45 110.12,24.46 103.06,20.43 99.03,22.45 96.44,23.74 97.48,23.71 93.99,23.71 92.36,23.71 87.76,22.38 87.69,22.45 86.02,24.11 85.17,25.28 85.17,28.75 85.17,28.75 85.17,30.01 85.17,30.01 85.17,24.38 83.42,31.76 82.65,32.53 81.60,33.58 78.66,32.74 77.61,33.79 76.35,35.05 77.61,38.83 76.35,40.09 75.27,41.16 68.79,41.40 68.79,41.35 68.79,40.93 70.05,40.93 70.05,41.35 70.05,42.53 68.06,42.80 67.53,43.87 67.34,44.24 67.83,44.83 67.53,45.13 67.10,45.55 65.44,44.70 65.01,45.13 63.24,46.89 66.55,47.09 65.01,50.17 62.12,55.94 65.01,45.86 65.01,48.91 65.01,50.78 62.49,52.07 62.49,53.95 62.49,54.37 63.45,53.65 63.75,53.95 64.73,54.93 62.65,56.14 62.49,56.47 61.82,57.81 63.16,60.16 62.49,61.51 62.19,62.11 60.27,63.42 59.97,64.03 58.06,67.85 62.06,63.63 59.97,67.81 59.78,68.18 59.01,67.51 58.71,67.81 56.40,70.11 54.72,73.05 52.41,75.36 50.31,77.46 45.69,74.52 43.59,76.62 42.75,77.46 44.43,80.82 43.59,81.66 42.67,82.58 39.79,82.94 38.55,84.18 38.13,84.60 38.97,86.28 38.55,86.70 37.96,87.30 36.62,86.11 36.03,86.70 34.66,88.08 35.82,92.48 32.25,94.26 31.57,94.61 30.41,93.92 29.73,94.26 24.49,96.89 31.08,94.18 28.47,96.78 27.74,97.51 24.16,98.57 23.43,99.30 23.01,99.72 23.85,101.41 23.43,101.82 23.13,102.12 22.47,101.53 22.17,101.82 19.95,104.05 23.63,112.76 22.17,115.68 20.69,118.65 21.78,127.41 20.91,128.28 20.61,128.58 19.95,127.99 19.65,128.28 19.23,128.70 20.07,130.38 19.65,130.80 19.35,131.10 18.69,130.51 18.39,130.80 16.16,133.04 17.13,150.81 17.13,157.26 17.13,158.98 17.32,174.72 17.13,174.90 13.58,178.46 10.83,178.23 10.83,183.72 10.83,191.51 15.68,192.16 18.39,197.58 18.77,198.35 19.12,200.83 19.65,201.36 20.20,201.91 21.65,199.58 23.43,201.36 23.97,201.90 24.39,204.55 24.69,205.14 25.58,206.91 30.56,209.31 30.99,210.18 31.37,210.94 30.41,213.38 30.99,213.96 31.29,214.26 31.95,213.66 32.25,213.96 32.78,214.49 33.13,216.98 33.51,217.74 33.93,218.58 35.71,220.26 34.77,220.26 34.35,220.26 34.35,219.00 34.77,219.00 35.36,219.00 35.77,219.73 36.03,220.26 36.41,221.01 35.44,222.19 36.03,222.78 36.33,223.08 36.99,222.48 37.29,222.78 38.55,224.04 36.03,229.08 37.29,230.34 37.59,230.64 38.25,230.04 38.55,230.34 39.39,231.18 38.97,233.28 39.81,234.12 40.40,234.71 41.74,233.53 42.33,234.12 44.94,236.73 38.35,234.02 43.59,236.64 45.16,237.42 56.61,239.58 57.45,240.42 57.75,240.72 57.15,241.38 57.45,241.68 58.04,242.27 59.38,241.09 59.97,241.68 60.81,242.52 60.39,244.62 61.23,245.46 63.51,247.74 67.53,248.34 67.53,253.02 67.53,253.44 67.95,254.28 67.53,254.28 67.11,254.28 67.11,253.02 67.53,253.02 68.12,253.02 68.26,254.01 68.79,254.28 70.69,255.23 76.38,255.54 78.87,255.54 79.71,255.54 80.64,255.92 81.39,255.54 82.45,255.01 83.07,252.18 83.91,253.02 84.33,253.44 82.06,254.28 82.65,254.28 83.98,254.28 85.49,253.96 86.43,253.02 86.73,252.72 86.13,252.06 86.43,251.76 87.48,250.71 91.68,252.81 92.73,251.76 93.03,251.46 92.43,250.80 92.73,250.50 93.32,249.91 94.50,250.88 95.25,250.50 96.44,249.91 98.09,250.18 99.03,249.24 99.33,248.94 98.73,248.28 99.03,247.98 99.66,247.35 102.18,248.61 102.81,247.98 103.11,247.68 102.51,247.02 102.81,246.72 103.15,246.38 131.23,246.72 134.31,246.72 139.57,246.72 126.36,247.11 133.05,240.42 134.65,238.82 137.13,242.50 139.35,242.94 140.17,243.10 140.17,240.58 139.35,240.42 137.29,240.01 133.05,242.52 133.05,240.42 133.05,238.32 137.25,240.42 138.09,240.42 138.09,240.42 138.09,240.42 138.09,240.42 Z";

	ukMainPathString1 = "M 0.00,126.81 C 0.00,126.81 10.51,140.19 10.51,140.19 10.51,140.19 16.39,140.07 16.39,140.07 16.39,140.07 17.51,133.94 17.51,133.94 17.51,133.94 22.89,132.81 22.89,132.81 22.89,132.81 23.64,139.44 23.64,139.44 23.64,139.44 27.77,142.57 27.77,142.57 27.77,142.57 26.02,146.07 26.02,146.07 26.02,146.07 30.77,147.44 30.77,147.44 30.77,147.44 32.15,145.07 32.15,145.07 32.15,145.07 36.65,148.32 36.65,148.32 36.65,148.32 39.65,147.94 39.65,147.94 39.65,147.94 42.41,142.82 42.41,142.82 42.41,142.82 50.41,142.19 50.41,142.19 50.41,142.19 51.16,131.06 51.16,131.06 51.16,131.06 45.78,131.94 45.78,131.94 45.78,131.94 43.16,130.94 43.16,130.94 43.16,130.94 49.04,125.78 49.04,125.78 49.04,125.78 48.66,123.02 48.66,123.02 48.66,123.02 45.28,121.40 45.28,121.40 45.28,121.40 44.53,117.40 44.53,117.40 44.53,117.40 45.28,112.27 45.28,112.27 45.28,112.27 38.90,108.39 38.90,108.39 38.90,108.39 34.65,108.39 34.65,108.39 34.65,108.39 32.90,110.02 32.90,110.02 32.90,110.02 28.40,108.52 28.40,108.52 28.40,108.52 26.02,113.02 26.02,113.02 26.02,113.02 22.64,112.40 22.64,112.40 22.64,112.40 20.52,111.02 20.14,111.02 19.76,111.02 15.14,119.77 15.14,119.77 15.14,119.77 8.88,119.27 8.88,119.27 8.88,119.27 11.01,123.52 11.01,123.52 11.01,123.52 0.00,126.79 0.00,126.79 0.00,126.79 0.00,126.81 0.00,126.81 Z M 14.51,282.24 C 14.51,282.24 24.27,282.99 23.77,289.00 23.27,295.00 28.02,286.24 29.02,282.49 30.02,278.74 35.03,282.49 35.03,282.49 35.03,282.49 37.03,278.74 37.28,277.99 37.53,277.24 57.79,287.75 58.79,288.00 59.80,288.25 67.05,272.99 67.05,272.99 67.05,272.99 95.32,281.49 96.57,281.24 97.82,280.99 97.32,276.74 97.32,276.74 97.32,276.74 111.58,277.49 111.58,277.49 111.58,277.49 110.08,271.49 110.08,271.49 110.08,271.49 122.59,280.49 122.59,280.49 122.59,280.49 137.10,279.49 137.10,279.49 137.10,279.49 144.36,284.24 144.36,284.24 144.36,284.24 158.37,278.24 158.37,278.24 158.37,278.24 159.87,280.24 159.87,280.24 159.87,280.24 163.87,275.74 163.87,275.74 163.87,275.74 170.88,274.99 170.88,274.99 170.88,274.99 172.88,264.49 172.88,264.49 172.88,264.49 161.37,266.24 161.37,266.24 161.37,266.24 159.87,260.23 159.87,260.23 159.87,260.23 151.86,259.98 152.36,259.23 152.87,258.48 162.87,258.48 162.87,258.48 162.87,258.48 165.87,252.73 165.87,252.73 165.87,252.73 161.62,251.48 161.37,251.23 161.12,250.98 168.63,251.23 168.63,251.23 168.63,251.23 172.13,248.98 172.13,248.98 172.13,248.98 169.38,245.23 169.38,245.23 169.38,245.23 174.38,246.48 174.38,246.48 174.38,246.48 189.14,232.47 185.39,222.97 181.64,213.47 167.88,208.46 161.62,208.96 155.37,209.46 156.53,214.72 156.53,214.72 156.53,214.72 152.36,214.22 151.03,210.72 149.70,207.21 152.03,207.55 156.53,205.88 161.04,204.21 156.03,193.71 153.87,189.71 151.70,185.71 154.03,187.04 156.20,186.04 158.37,185.04 153.70,178.20 151.36,174.03 149.03,169.87 152.49,169.45 154.37,167.70 156.24,165.95 150.86,162.45 148.24,160.32 145.61,158.19 144.61,148.69 135.73,148.31 126.85,147.94 130.72,119.55 131.97,115.18 133.23,110.80 127.35,114.68 124.34,102.84 121.34,91.00 116.00,95.34 113.17,95.00 110.33,94.67 102.16,98.17 100.83,94.84 99.49,91.50 105.83,92.17 108.16,92.50 110.50,92.84 109.67,91.50 110.83,89.67 112.00,87.83 119.17,95.67 118.84,89.33 118.51,83.00 114.67,83.33 114.67,83.33 114.67,83.33 116.50,81.16 116.50,81.16 116.50,81.16 135.35,64.16 135.52,56.99 135.69,49.82 141.36,52.82 141.36,47.82 141.36,42.81 122.67,39.65 119.67,40.15 116.67,40.65 112.83,35.98 110.67,37.48 108.50,38.98 104.66,41.48 103.33,40.65 101.99,39.81 94.99,41.98 95.15,39.65 95.32,37.31 98.49,34.48 99.99,35.81 101.49,37.14 103.16,36.31 103.16,36.31 103.16,36.31 106.16,33.64 106.50,32.81 106.83,31.98 104.16,31.81 102.83,31.81 101.49,31.81 101.16,30.98 101.66,30.48 102.16,29.98 121.17,17.14 121.67,16.30 122.17,15.47 125.34,11.30 125.51,8.80 125.68,6.30 101.99,5.30 101.66,6.63 101.32,7.97 99.16,10.13 99.16,10.13 99.16,10.13 98.82,7.30 98.15,5.47 97.49,3.63 91.65,-2.71 90.65,1.30 89.65,5.30 88.98,7.80 87.98,7.80 86.98,7.80 80.97,10.13 89.65,13.80 98.32,17.47 88.48,17.47 85.31,14.80 82.14,12.13 81.64,11.47 82.31,15.14 82.31,15.14 82.48,18.97 82.48,18.97 82.48,18.97 78.81,16.47 78.81,16.47 78.81,16.47 76.43,18.89 79.18,21.14 81.93,23.39 82.18,23.01 80.56,24.14 78.93,25.26 78.31,24.39 76.31,22.26 74.30,20.14 73.68,24.14 74.80,26.51 75.93,28.89 73.68,27.89 72.80,26.51 71.93,25.14 70.55,22.26 69.55,24.14 68.55,26.01 70.80,32.39 72.80,34.89 74.80,37.39 73.68,45.40 73.43,45.77 73.18,46.15 67.17,44.65 67.80,46.65 68.42,48.65 74.43,50.02 72.43,51.77 70.43,53.53 67.92,53.90 66.05,51.90 64.17,49.90 58.92,53.40 62.04,57.03 65.17,60.65 63.17,60.78 60.67,59.65 58.17,58.53 54.54,57.40 54.79,59.90 55.04,62.40 55.16,62.78 55.16,62.78 55.16,62.78 50.91,62.28 51.79,64.28 52.66,66.28 56.29,65.03 57.04,66.66 57.79,68.28 55.66,71.53 53.41,71.66 51.16,71.78 46.53,71.03 49.16,73.91 51.79,76.78 60.54,75.03 62.67,71.91 64.80,68.78 65.55,67.78 66.17,67.28 66.80,66.78 69.30,64.91 69.30,64.91 69.30,64.91 73.09,62.77 73.09,62.77 73.09,62.77 73.59,64.77 73.59,64.77 73.59,64.77 68.08,68.52 68.08,68.52 68.08,68.52 66.33,72.28 66.33,72.28 66.33,72.28 62.70,75.78 62.70,75.78 62.95,78.28 62.20,83.78 62.20,83.78 62.20,83.78 56.82,87.03 56.82,87.03 56.82,87.03 60.20,87.41 61.33,86.66 62.45,85.91 57.70,90.66 57.70,90.66 57.70,90.66 59.95,92.91 59.95,92.91 59.95,92.91 55.70,95.16 55.20,99.16 54.70,103.16 51.69,106.41 50.94,106.91 50.19,107.41 49.69,109.92 51.95,110.04 54.20,110.17 56.95,108.54 56.95,108.54 56.95,108.54 58.45,104.16 58.45,104.16 58.45,104.16 59.33,101.54 59.33,101.54 59.33,101.54 60.70,96.91 60.70,96.91 60.70,96.91 63.95,94.78 63.95,94.78 63.95,94.78 64.33,90.78 64.33,90.78 64.33,90.78 63.33,87.53 63.33,87.53 63.33,87.53 74.21,81.03 74.21,81.03 74.21,81.03 73.84,86.78 74.96,89.41 76.09,92.03 80.47,92.78 80.47,92.78 80.47,92.78 73.71,91.91 73.71,91.91 73.71,91.91 71.33,98.79 71.33,99.41 71.33,100.04 74.84,106.66 74.84,106.66 74.84,106.66 69.33,112.29 69.33,112.29 69.33,112.29 64.08,119.79 64.08,119.79 64.08,119.79 63.58,124.17 63.58,124.17 63.58,124.17 60.45,124.67 60.08,124.80 59.70,124.92 65.83,129.67 65.83,129.67 65.83,129.67 67.46,127.55 67.46,127.55 67.46,127.55 73.09,135.80 73.09,135.80 73.09,135.80 75.09,133.17 75.09,133.17 75.09,133.17 74.71,127.92 74.71,127.67 74.71,127.42 80.22,134.55 80.22,134.55 80.22,134.55 83.97,133.80 83.97,133.80 83.97,133.80 88.47,129.55 90.22,131.55 91.98,133.55 94.10,129.43 94.10,129.43 94.10,129.43 97.35,130.55 97.35,130.55 97.35,130.55 100.98,130.68 100.98,130.68 100.98,130.68 100.23,132.43 100.23,132.43 100.23,132.43 94.23,131.43 93.60,133.68 92.98,135.93 86.97,143.18 86.97,143.18 86.97,143.18 88.85,145.43 89.97,148.94 91.10,152.44 89.35,154.81 89.35,154.81 89.35,154.81 90.72,156.06 90.72,156.06 90.72,156.06 93.23,154.81 93.23,154.81 93.23,154.81 92.98,159.44 92.98,159.44 92.98,159.44 92.98,160.07 92.98,160.07 92.98,160.07 95.85,160.94 95.85,160.94 95.85,160.94 99.73,156.44 99.73,156.44 99.73,156.44 100.61,158.94 100.61,158.94 100.61,158.94 97.73,162.69 97.73,162.69 97.73,162.69 98.86,164.44 98.86,164.44 98.86,164.44 98.23,166.19 98.23,166.19 98.23,166.19 93.35,165.44 93.35,165.44 93.35,165.44 92.35,169.07 92.35,169.07 92.35,169.07 95.85,171.69 95.85,171.69 95.85,171.69 95.73,173.45 95.73,173.45 95.73,173.45 90.72,177.07 90.72,177.07 90.72,177.07 91.47,181.32 91.47,181.32 91.47,181.32 97.98,185.95 97.98,185.95 97.98,185.95 95.73,188.45 95.73,188.45 95.73,188.45 91.10,182.35 91.10,182.35 91.10,182.35 89.10,184.22 89.10,184.22 89.10,184.22 90.97,187.10 90.97,187.10 90.97,187.10 88.85,189.48 88.85,189.48 88.85,189.48 87.22,184.98 87.22,184.98 87.22,184.98 83.34,183.10 82.22,184.73 81.09,186.35 79.09,186.85 77.96,185.48 76.84,184.10 75.46,182.22 75.46,182.22 75.46,182.22 73.34,184.35 73.21,184.73 73.09,185.10 68.83,184.98 68.83,184.98 68.83,184.98 70.33,181.72 70.33,181.72 70.33,181.72 64.33,175.35 64.33,175.35 64.33,175.35 60.58,178.85 60.58,178.85 60.58,178.85 64.20,186.10 64.20,186.10 64.20,186.10 59.45,191.85 59.45,191.85 59.45,191.85 54.57,194.98 54.57,194.48 54.57,193.98 56.57,199.11 56.57,199.11 56.57,199.11 63.45,194.10 63.45,194.10 63.45,194.10 67.46,199.23 67.46,199.23 67.46,199.23 67.58,208.73 67.58,208.73 67.58,208.73 56.07,218.74 56.07,218.74 56.07,218.74 50.57,218.11 50.57,218.11 50.57,218.11 46.82,222.74 46.82,222.74 46.82,222.74 36.68,221.11 36.68,221.11 36.68,221.11 35.81,230.24 35.81,230.24 35.81,230.24 38.31,231.62 38.31,231.62 38.31,231.62 40.69,235.75 40.69,235.75 40.69,235.75 46.19,236.12 46.19,236.12 46.19,236.12 49.19,232.74 49.19,232.74 49.19,232.74 54.82,232.87 54.82,232.87 54.82,232.87 55.70,241.25 55.70,241.25 55.70,241.25 59.83,240.87 59.83,240.87 59.83,240.87 61.95,238.87 61.95,238.87 61.95,238.87 64.83,239.75 64.83,239.75 64.83,239.75 66.96,246.50 66.96,246.50 66.96,246.50 71.96,250.75 71.96,250.75 71.96,250.75 76.09,250.12 76.09,250.12 76.09,250.12 80.72,245.24 80.72,245.24 80.72,245.24 83.97,245.99 83.97,245.99 83.97,245.99 86.35,247.25 86.35,247.25 86.35,247.25 81.09,251.50 81.09,251.50 81.09,251.50 79.22,255.75 79.22,255.75 79.22,255.75 79.47,256.37 79.09,256.37 78.72,256.37 72.59,257.75 72.59,257.75 72.59,257.75 64.08,252.37 64.08,252.37 64.08,252.37 55.57,252.87 55.32,252.50 55.07,252.12 51.44,258.87 51.44,258.87 51.44,258.87 48.44,258.87 48.44,258.87 48.44,258.87 46.69,255.62 46.69,255.62 46.69,255.62 43.44,258.75 43.44,258.75 43.44,258.75 44.94,263.75 44.94,263.75 44.94,263.75 37.18,269.50 37.18,269.50 37.18,269.50 35.31,268.75 34.81,268.75 34.31,268.75 32.56,272.63 32.56,272.63 32.56,272.63 28.43,274.76 28.55,274.51 28.68,274.26 27.18,278.13 27.18,278.13 27.18,278.13 18.04,278.24 18.04,278.24 18.04,278.24 14.29,278.74 14.29,278.74 14.29,278.74 14.54,282.24 14.54,282.24 14.54,282.24 14.51,282.24 14.51,282.24 Z";

	australiaMainPathString1 = "M 561.30,589.70 C 561.30,600.04 554.93,606.67 549.65,613.67 545.06,619.76 542.23,626.92 533.37,626.92 526.89,626.92 527.18,621.53 524.59,618.72 519.55,613.25 515.84,606.85 515.84,594.08 515.84,582.16 500.32,565.23 511.38,564.49 518.24,564.02 533.19,576.02 540.49,576.02 547.92,576.02 556.02,570.78 559.11,570.88 563.93,571.04 561.30,577.92 561.30,589.70 561.30,589.70 561.30,589.70 561.30,589.70 Z M 672.25,331.90 C 672.25,369.04 660.32,396.89 645.06,422.65 641.49,428.68 637.01,430.06 632.72,435.53 622.78,448.23 626.85,461.86 613.20,472.04 601.29,480.94 598.71,496.43 598.23,512.53 598.00,520.01 581.72,511.16 577.17,515.80 574.57,518.44 565.40,514.75 561.78,516.78 553.85,521.21 547.14,531.59 537.88,536.13 530.47,539.77 525.27,519.62 516.00,520.90 500.23,523.08 482.39,516.17 463.22,517.65 454.25,518.33 451.12,499.20 441.96,500.49 429.12,502.29 442.36,453.94 430.60,463.14 417.61,473.30 423.38,441.07 410.67,441.07 405.20,441.07 418.34,410.95 412.84,410.90 410.48,410.88 380.24,444.53 378.90,442.58 374.69,436.47 371.03,422.07 363.55,415.79 358.30,411.36 355.65,404.51 350.15,400.70 341.15,394.48 334.03,398.35 324.48,393.59 318.70,390.72 312.93,386.49 307.10,386.77 298.26,387.19 292.56,389.15 280.00,390.16 259.49,391.82 245.32,404.59 224.92,404.26 207.90,403.98 193.70,439.34 177.21,437.01 159.18,434.46 144.86,441.30 132.06,441.13 121.05,440.99 111.60,470.67 101.63,466.14 87.38,459.65 65.49,468.54 53.79,452.71 48.30,445.28 66.36,446.43 61.90,436.88 59.21,431.14 62.42,424.72 62.16,417.32 61.97,411.65 58.51,405.06 56.30,399.78 54.03,394.37 48.75,389.87 46.29,383.41 44.31,378.24 45.32,371.22 42.35,365.85 38.04,358.06 30.52,350.44 26.26,342.95 24.07,339.09 24.83,334.81 22.54,331.28 15.87,321.03 4.84,316.44 1.34,307.78 -1.59,300.51 21.60,313.32 22.61,307.95 23.33,304.11 16.43,299.36 12.51,291.94 7.62,282.69 5.39,270.67 5.39,266.90 5.39,257.37 3.06,239.86 6.27,232.67 9.47,225.53 14.53,229.88 20.51,225.04 29.54,217.71 38.24,208.38 51.30,201.98 55.81,199.77 62.53,200.17 67.52,198.17 86.85,190.41 107.00,181.27 125.51,171.72 134.24,167.20 136.72,151.63 145.05,146.50 148.70,144.26 138.39,133.44 142.00,131.08 147.29,127.63 143.29,120.22 148.56,116.53 152.72,113.62 163.82,131.49 167.91,128.37 170.55,126.36 163.87,108.78 166.46,106.62 169.81,103.82 181.68,114.12 185.03,111.23 187.64,108.98 177.06,92.74 179.64,90.39 193.26,77.94 211.49,67.70 226.75,56.13 231.22,52.74 246.55,78.04 251.08,74.81 258.37,69.59 269.89,84.92 276.67,78.18 282.27,72.61 265.08,70.27 270.32,62.80 277.29,52.92 283.07,39.15 294.81,28.93 302.74,22.04 315.27,30.87 324.76,26.46 327.78,25.07 328.91,20.32 324.65,16.83 320.59,13.52 311.14,11.49 313.49,8.99 316.78,5.49 335.82,15.60 346.96,14.99 352.54,14.68 358.66,19.25 360.21,19.25 365.41,19.25 372.14,24.74 377.28,24.89 380.91,24.99 382.39,19.71 385.98,19.88 393.94,20.26 397.25,22.85 405.03,23.59 412.43,24.28 409.05,33.86 404.15,39.28 401.63,42.07 387.23,46.95 391.47,52.41 395.78,57.96 376.65,71.69 383.29,75.80 409.29,91.87 432.39,121.72 463.24,129.71 488.24,136.20 490.21,81.17 492.92,56.30 494.63,40.59 510.71,-7.79 514.39,2.51 518.23,13.26 522.29,28.99 532.27,49.99 533.99,53.62 532.17,66.97 534.51,70.88 536.90,74.88 541.70,71.27 546.26,72.96 550.52,74.55 554.51,81.40 557.78,85.47 562.98,91.93 556.24,114.12 562.20,121.03 570.36,130.49 566.25,160.02 575.69,169.28 579.46,172.97 584.13,166.45 588.13,169.88 593.85,174.78 605.70,182.65 609.49,189.29 612.25,194.14 606.75,197.95 611.13,201.25 618.45,206.75 620.55,228.88 627.98,233.67 631.02,235.63 628.67,227.35 636.39,232.83 642.07,236.87 639.82,248.71 643.69,253.88 649.55,261.68 662.86,277.23 667.59,284.26 678.21,300.05 672.25,323.64 672.25,331.90 672.25,331.90 672.25,331.90 672.25,331.90 Z";

	koreaMainPathString1 = "M 236.37,309.03 C 236.37,309.03 233.36,310.67 233.36,310.67 233.36,310.67 232.83,318.74 232.83,318.74 232.83,318.74 223.02,329.39 223.02,329.39 223.02,329.39 218.38,330.88 218.38,330.88 218.38,330.88 209.14,329.46 209.14,329.46 209.14,329.46 205.77,331.32 205.77,331.32 205.77,331.32 202.38,328.95 202.38,328.95 202.38,328.95 189.49,329.67 189.49,329.67 189.49,329.67 185.94,331.70 185.94,331.70 185.94,331.70 179.35,328.76 179.35,328.76 179.35,328.76 164.55,330.93 164.55,330.93 164.55,330.93 153.00,339.55 153.00,339.55 153.00,339.55 153.53,342.88 153.53,342.88 153.53,342.88 147.99,346.87 147.99,346.87 147.99,346.87 147.27,350.82 147.27,350.82 147.27,350.82 142.81,355.62 142.81,355.62 142.81,355.62 137.11,356.00 137.11,356.00 137.11,356.00 137.86,362.79 137.86,362.79 137.86,362.79 134.93,367.52 134.93,367.52 134.93,367.52 131.00,368.65 131.00,368.65 131.00,368.65 132.33,369.57 132.33,369.57 132.33,369.57 135.74,368.58 135.74,368.58 135.74,368.58 139.15,363.08 139.15,363.08 139.15,363.08 138.50,357.15 138.50,357.15 138.50,357.15 143.39,356.83 143.39,356.83 143.39,356.83 148.43,351.40 148.43,351.40 148.43,351.40 149.13,347.59 149.13,347.59 149.13,347.59 154.89,343.45 154.89,343.45 154.89,343.45 154.36,340.09 154.36,340.09 154.36,340.09 165.05,332.12 165.05,332.12 165.05,332.12 179.17,330.05 179.17,330.05 179.17,330.05 186.00,333.11 186.00,333.11 186.00,333.11 189.85,330.91 189.85,330.91 189.85,330.91 202.03,330.22 202.03,330.22 202.03,330.22 205.69,332.79 205.69,332.79 205.69,332.79 209.38,330.76 209.38,330.76 209.38,330.76 218.49,332.16 218.49,332.16 218.49,332.16 223.73,330.48 223.73,330.48 223.73,330.48 234.04,319.26 234.04,319.26 234.04,319.26 234.57,311.44 234.57,311.44 234.57,311.44 236.98,310.12 236.98,310.12 236.98,310.12 236.37,309.03 236.37,309.03 236.37,309.03 236.37,309.03 236.37,309.03 Z M 325.36,-0.00 C 325.36,-0.00 317.25,38.82 317.25,38.82 317.25,38.82 307.37,44.82 307.37,44.82 307.37,44.82 297.84,39.53 297.84,39.53 297.84,39.53 286.19,51.17 286.19,51.17 286.19,51.17 280.90,60.34 280.90,60.34 280.90,60.34 268.90,70.57 268.90,70.57 268.90,70.57 232.90,68.46 232.90,68.46 232.90,68.46 219.14,73.40 219.14,73.40 219.14,73.40 223.73,91.39 223.73,91.39 223.73,91.39 233.61,99.16 233.61,99.16 233.61,99.16 221.25,115.74 221.25,115.74 221.25,115.74 164.09,104.45 164.09,104.45 164.09,104.45 153.15,85.40 153.15,85.40 153.15,85.40 131.28,97.75 131.28,97.75 131.28,97.75 125.27,118.92 125.27,118.92 125.27,118.92 104.80,136.56 104.80,136.56 104.80,136.56 98.46,149.27 98.46,149.27 98.46,149.27 80.81,151.74 80.81,151.74 80.81,151.74 75.16,159.15 75.16,159.15 75.16,159.15 39.87,175.03 39.87,175.03 39.87,175.03 0.00,205.37 0.00,205.37 0.00,205.37 1.41,221.60 1.41,221.60 1.41,221.60 13.05,224.78 13.05,224.78 13.05,224.78 16.23,238.54 16.23,238.54 16.23,238.54 22.23,236.43 22.23,236.43 22.23,236.43 23.29,227.96 23.29,227.96 23.29,227.96 56.11,245.95 56.11,245.95 56.11,245.95 64.93,242.77 64.93,242.77 64.93,242.77 57.87,251.60 57.87,251.60 57.87,251.60 64.57,257.24 64.57,257.24 64.57,257.24 46.93,296.76 46.93,296.76 46.93,296.76 77.99,307.70 77.99,307.70 77.99,307.70 76.22,311.23 76.22,311.23 76.22,311.23 46.58,309.11 46.58,309.11 46.58,309.11 20.46,344.05 20.46,344.05 20.46,344.05 54.69,347.23 54.69,347.23 54.69,347.23 40.23,359.58 40.23,359.58 40.23,359.58 49.76,362.75 49.76,362.75 49.76,362.75 53.99,358.87 53.99,358.87 53.99,358.87 55.40,365.22 55.40,365.22 55.40,365.22 65.28,359.23 65.28,359.23 65.28,359.23 69.52,363.10 69.52,363.10 69.52,363.10 58.93,371.93 58.93,371.93 58.93,371.93 59.29,375.45 59.29,375.45 59.29,375.45 80.46,362.75 80.46,362.75 80.46,362.75 69.87,350.40 69.87,350.40 69.87,350.40 84.34,350.75 84.34,350.75 84.34,350.75 92.45,364.51 92.45,364.51 92.45,364.51 99.87,365.57 99.87,365.57 99.87,365.57 104.45,371.93 104.45,371.93 104.45,371.93 106.21,365.22 106.21,365.22 106.21,365.22 120.34,361.34 120.34,361.34 120.34,361.34 131.67,369.11 131.67,369.11 131.67,369.11 135.33,368.05 135.33,368.05 135.33,368.05 138.50,362.93 138.50,362.93 138.50,362.93 137.80,356.58 137.80,356.58 137.80,356.58 143.10,356.23 143.10,356.23 143.10,356.23 147.85,351.11 147.85,351.11 147.85,351.11 148.56,347.23 148.56,347.23 148.56,347.23 154.21,343.16 154.21,343.16 154.21,343.16 153.68,339.82 153.68,339.82 153.68,339.82 164.80,331.52 164.80,331.52 164.80,331.52 179.26,329.41 179.26,329.41 179.26,329.41 185.97,332.40 185.97,332.40 185.97,332.40 189.67,330.29 189.67,330.29 189.67,330.29 202.20,329.58 202.20,329.58 202.20,329.58 205.73,332.05 205.73,332.05 205.73,332.05 209.26,330.11 209.26,330.11 209.26,330.11 218.43,331.52 218.43,331.52 218.43,331.52 223.38,329.93 223.38,329.93 223.38,329.93 233.43,319.00 233.43,319.00 233.43,319.00 233.97,311.05 233.97,311.05 233.97,311.05 236.68,309.57 236.68,309.57 236.68,309.57 231.49,300.29 231.49,300.29 231.49,300.29 199.73,273.83 199.73,273.83 199.73,273.83 177.85,268.89 177.85,268.89 177.85,268.89 179.26,254.42 179.26,254.42 179.26,254.42 185.97,251.25 185.97,251.25 185.97,251.25 188.79,238.54 188.79,238.54 188.79,238.54 183.50,231.84 183.50,231.84 183.50,231.84 206.09,218.43 206.09,218.43 206.09,218.43 215.97,207.14 215.97,207.14 215.97,207.14 227.26,209.96 227.26,209.96 227.26,209.96 254.43,198.31 254.43,198.31 254.43,198.31 250.90,192.32 250.90,192.32 250.90,192.32 280.90,177.49 280.90,177.49 280.90,177.49 286.90,163.38 286.90,163.38 286.90,163.38 316.54,149.97 316.54,149.97 316.54,149.97 320.42,115.04 320.42,115.04 320.42,115.04 311.60,102.68 311.60,102.68 311.60,102.68 344.77,58.57 344.77,58.57 344.77,58.57 360.30,48.34 360.30,48.34 360.30,48.34 371.24,51.88 371.24,51.88 371.24,51.88 373.00,48.34 373.00,48.34 373.00,48.34 362.41,26.11 362.41,26.11 362.41,26.11 355.35,26.82 355.35,26.82 355.35,26.82 346.53,15.52 346.53,15.52 346.53,15.52 349.36,6.71 349.36,6.71 349.36,6.71 325.36,-0.00 325.36,-0.00 325.36,-0.00 325.36,-0.00 325.36,-0.00 Z M 256.02,564.07 C 256.02,564.07 243.84,575.71 243.84,575.71 243.84,575.71 249.49,577.65 249.49,577.65 249.49,577.65 249.67,585.24 249.67,585.24 249.67,585.24 253.90,584.53 253.90,584.53 253.90,584.53 255.31,578.89 255.31,578.89 255.31,578.89 257.78,579.24 257.78,579.24 257.78,579.24 259.19,573.06 259.19,573.06 259.19,573.06 256.72,573.42 256.72,573.42 256.72,573.42 257.61,564.42 257.61,564.42 257.61,564.42 256.02,564.07 256.02,564.07 Z M 236.68,309.57 C 236.68,309.57 233.97,311.05 233.97,311.05 233.97,311.05 233.43,319.00 233.43,319.00 233.43,319.00 223.38,329.93 223.38,329.93 223.38,329.93 218.43,331.52 218.43,331.52 218.43,331.52 209.26,330.11 209.26,330.11 209.26,330.11 205.73,332.05 205.73,332.05 205.73,332.05 202.20,329.58 202.20,329.58 202.20,329.58 189.67,330.29 189.67,330.29 189.67,330.29 185.97,332.40 185.97,332.40 185.97,332.40 179.26,329.41 179.26,329.41 179.26,329.41 164.80,331.52 164.80,331.52 164.80,331.52 153.68,339.82 153.68,339.82 153.68,339.82 154.21,343.16 154.21,343.16 154.21,343.16 148.56,347.23 148.56,347.23 148.56,347.23 147.85,351.11 147.85,351.11 147.85,351.11 143.10,356.23 143.10,356.23 143.10,356.23 137.80,356.58 137.80,356.58 137.80,356.58 138.50,362.93 138.50,362.93 138.50,362.93 135.33,368.05 135.33,368.05 135.33,368.05 131.67,369.11 131.67,369.11 131.67,369.11 132.69,369.81 132.69,369.81 132.69,369.81 130.22,379.69 130.22,379.69 130.22,379.69 137.97,384.98 137.97,384.98 137.97,384.98 135.51,390.98 135.51,390.98 135.51,390.98 145.39,401.57 145.39,401.57 145.39,401.57 146.80,406.51 146.80,406.51 146.80,406.51 142.57,419.21 142.57,419.21 142.57,419.21 150.68,429.09 150.68,429.09 150.68,429.09 147.15,442.50 147.15,442.50 147.15,442.50 141.51,427.33 141.51,427.33 141.51,427.33 128.09,425.21 128.09,425.21 128.09,425.21 118.92,423.80 118.92,423.80 118.92,423.80 118.21,436.50 118.21,436.50 118.21,436.50 109.40,431.56 109.40,431.56 109.40,431.56 104.45,441.79 104.45,441.79 104.45,441.79 115.04,452.73 115.04,452.73 115.04,452.73 126.68,443.91 126.68,443.91 126.68,443.91 130.92,484.49 130.92,484.49 130.92,484.49 136.21,492.61 136.21,492.61 136.21,492.61 148.56,490.14 148.56,490.14 148.56,490.14 147.85,495.08 147.85,495.08 147.85,495.08 136.92,502.14 136.92,502.14 136.92,502.14 137.27,510.96 137.27,510.96 137.27,510.96 126.33,520.49 126.33,520.49 126.33,520.49 127.39,523.66 127.39,523.66 127.39,523.66 138.68,522.61 138.68,522.61 138.68,522.61 137.97,530.36 137.97,530.36 137.97,530.36 126.68,530.72 126.68,530.72 126.68,530.72 117.86,549.07 117.86,549.07 117.86,549.07 125.27,559.65 125.27,559.65 125.27,559.65 119.63,578.01 119.63,578.01 119.63,578.01 132.69,576.60 132.69,576.60 132.69,576.60 133.04,581.53 133.04,581.53 133.04,581.53 114.33,584.71 114.33,584.71 114.33,584.71 116.80,595.29 116.80,595.29 116.80,595.29 130.57,598.12 130.57,598.12 130.57,598.12 126.33,610.47 126.33,610.47 126.33,610.47 130.92,614.00 130.92,614.00 130.92,614.00 144.68,597.77 144.68,597.77 144.68,597.77 149.27,604.82 149.27,604.82 149.27,604.82 171.86,582.59 171.86,582.59 171.86,582.59 176.44,589.65 176.44,589.65 176.44,589.65 166.21,597.06 166.21,597.06 166.21,597.06 176.44,604.47 176.44,604.47 176.44,604.47 186.68,592.47 186.68,592.47 186.68,592.47 178.20,578.01 178.20,578.01 178.20,578.01 186.32,575.18 186.32,575.18 186.32,575.18 191.97,582.94 191.97,582.94 191.97,582.94 191.26,590.35 191.26,590.35 191.26,590.35 194.79,592.12 194.79,592.12 194.79,592.12 202.20,576.60 202.20,576.60 202.20,576.60 193.38,579.06 193.38,579.06 193.38,579.06 190.55,571.30 190.55,571.30 190.55,571.30 217.38,563.54 217.38,563.54 217.38,563.54 218.08,569.89 218.08,569.89 218.08,569.89 239.95,574.81 239.95,574.81 239.95,574.81 243.69,557.84 243.69,557.84 243.69,557.84 251.92,560.84 251.92,560.84 251.92,560.84 249.68,550.61 249.68,550.61 249.68,550.61 257.91,558.09 257.91,558.09 257.91,558.09 270.89,558.09 270.89,558.09 270.89,558.09 272.14,562.33 272.14,562.33 272.14,562.33 277.72,557.89 277.72,557.89 277.72,557.89 299.60,530.72 299.60,530.72 299.60,530.72 308.42,489.44 308.42,489.44 308.42,489.44 296.78,495.08 296.78,495.08 296.78,495.08 298.19,419.56 298.19,419.56 298.19,419.56 236.68,309.57 236.68,309.57 Z";

	usMainPathString1 = "M 400.00,571.63 C 397.96,571.34 392.58,567.71 387.93,563.50 379.78,556.08 379.35,555.36 370.76,532.68 365.82,519.89 361.45,508.85 360.73,508.26 360.15,507.54 355.78,506.52 351.13,505.94 343.13,504.78 341.82,505.07 332.80,509.57 327.42,512.19 320.58,514.81 317.53,515.39 317.53,515.39 311.85,516.26 311.85,516.26 311.85,516.26 298.76,500.42 298.76,500.42 291.49,491.84 282.76,481.09 279.27,476.58 279.27,476.58 273.02,468.30 273.02,468.30 273.02,468.30 248.87,467.42 248.87,467.42 220.80,466.26 198.55,462.34 165.82,452.74 154.04,449.26 137.60,445.33 129.31,444.02 121.02,442.72 113.75,441.26 113.31,440.68 112.73,440.10 107.64,432.54 101.82,423.68 86.55,400.71 80.00,392.86 68.22,382.98 58.33,374.69 57.31,373.39 48.58,354.93 41.31,339.67 38.84,332.84 37.09,322.23 34.04,304.35 31.85,297.66 25.45,284.87 20.22,274.41 20.07,273.97 21.67,266.56 22.84,261.47 23.13,252.32 22.55,239.53 22.55,239.53 21.53,220.19 21.53,220.19 21.53,220.19 30.25,196.07 30.25,196.07 40.58,167.29 45.96,143.31 48.00,115.55 49.02,103.34 50.33,94.62 51.35,93.60 52.36,92.73 58.18,90.11 64.29,87.93 64.29,87.93 75.35,84.01 75.35,84.01 75.35,84.01 107.93,87.06 107.93,87.06 125.82,88.80 174.11,92.73 215.27,95.93 215.27,95.93 290.18,101.89 290.18,101.89 290.18,101.89 373.96,100.29 373.96,100.29 447.56,98.83 458.76,98.83 466.18,100.87 470.84,102.03 475.20,103.63 476.07,104.50 477.09,105.52 476.22,109.15 473.16,115.98 470.11,122.81 469.09,126.74 469.96,128.92 472.00,134.30 477.53,131.54 485.09,121.22 488.73,116.13 492.51,111.91 493.24,111.91 493.96,111.91 498.62,113.95 503.42,116.42 512.15,120.78 512.58,120.78 526.55,119.91 536.15,119.18 540.95,119.33 541.67,120.34 542.25,121.22 539.64,127.90 536.00,135.02 532.51,142.15 527.27,153.92 524.51,161.19 524.51,161.19 519.71,174.27 519.71,174.27 519.71,174.27 523.64,195.92 523.64,195.92 525.67,207.84 528.00,218.16 528.44,219.03 529.02,219.90 531.05,220.19 533.09,219.76 537.45,219.03 537.60,217.72 534.40,199.85 531.49,182.99 532.65,166.13 537.75,153.63 542.69,141.42 543.13,140.98 551.85,140.98 561.75,141.13 564.51,142.87 571.49,153.77 576.87,161.91 577.89,162.78 582.40,162.78 588.22,162.78 589.53,164.24 591.85,173.25 593.45,178.92 593.31,182.26 591.27,194.61 589.96,202.61 589.24,209.88 589.82,210.60 590.25,211.47 597.67,206.53 606.55,199.41 606.55,199.41 622.55,186.77 622.55,186.77 622.55,186.77 624.73,176.59 624.73,176.59 626.04,171.07 628.80,163.22 630.98,159.15 634.18,153.19 635.78,151.74 639.71,151.16 642.18,150.72 648.00,147.52 652.36,144.04 660.22,137.79 660.51,137.20 665.45,121.51 670.40,105.52 670.55,105.37 681.60,94.47 690.62,85.46 693.96,80.81 700.36,68.17 706.76,55.67 708.51,50.43 709.82,40.70 711.85,26.31 715.93,18.17 724.51,12.21 724.51,12.21 730.47,8.14 730.47,8.14 730.47,8.14 735.85,11.19 735.85,11.19 740.65,13.95 741.67,15.70 747.49,32.12 747.49,32.12 753.75,50.14 753.75,50.14 753.75,50.14 749.82,69.04 749.82,69.04 747.64,79.50 743.42,96.36 740.36,106.54 740.36,106.54 734.84,125.14 734.84,125.14 734.84,125.14 737.75,143.89 737.75,143.89 737.75,143.89 740.65,162.49 740.65,162.49 740.65,162.49 725.96,209.44 725.96,209.44 725.96,209.44 711.42,256.53 711.42,256.53 711.42,256.53 713.60,282.69 713.60,282.69 713.60,282.69 715.78,308.85 715.78,308.85 715.78,308.85 702.69,344.17 702.69,344.17 689.89,378.91 689.31,379.93 677.82,395.19 677.82,395.19 666.18,410.89 666.18,410.89 666.18,410.89 666.18,420.19 666.18,420.19 666.18,429.05 667.20,431.96 685.82,473.82 696.58,498.24 706.47,521.93 707.78,526.43 710.11,534.72 710.11,534.72 706.47,541.11 703.56,545.91 701.53,547.80 698.04,548.53 689.89,550.12 687.85,549.54 678.55,542.71 669.53,536.03 669.24,535.73 658.91,513.21 653.24,500.71 644.80,485.01 640.29,478.18 640.29,478.18 632.00,465.82 632.00,465.82 632.00,465.82 621.82,466.26 621.82,466.26 616.29,466.55 600.15,465.97 586.18,465.10 586.18,465.10 560.73,463.64 560.73,463.64 560.73,463.64 552.00,469.60 552.00,469.60 547.20,472.95 536.29,480.94 527.71,487.19 527.71,487.19 512.00,498.82 512.00,498.82 512.00,498.82 495.85,497.36 495.85,497.36 495.85,497.36 479.56,495.77 479.56,495.77 479.56,495.77 466.33,502.31 466.33,502.31 459.05,505.94 446.40,512.92 438.25,517.86 438.25,517.86 423.42,526.72 423.42,526.72 423.42,526.72 419.64,543.58 419.64,543.58 413.38,571.05 413.09,571.93 408.00,572.07 405.67,572.22 402.04,572.07 400.00,571.63 Z";

	chinaMainPathString1 = "";
	japanMainPathString1 = "";

	worldMainPathString1 = "";

	bwKings1 = "";

	startGame03();

	timer03 = setInterval(startGame03, 200);

};

//functions for 2D maps to appear
let createAfricaMain = function(){
	var africaMain1 = paper.path(africaMainPathString1);
	africaMain1.attr({
		//"fill": "black",
		"stroke-width": 5,
		"stroke": "white",
		"opacity": 0,
	});
	africaMain1.animate({opacity: 1}, 1000);
	var africaTransformedPath1 = Raphael.transformPath(africaMainPathString1, `T0,50`);
	africaMain1.animate({path: africaTransformedPath1}, 1000);
	
	africaMain1.node.addEventListener("click", function myFunction(ev){
		africaMain1.node.removeEventListener("click", myFunction);
		africaMain1.animate({"opacity": 0}, 1500, function(ev){this.remove()});
		africaMain1.node.style.cursor="pointer";
		commentary.innerHTML = `[${new Date().toLocaleTimeString()}] <b>The Talking Lemon</b>: The United Kingdom! Computer programs are also helpful in prior art searches. There are various search engines and databases out there that are powered by artificial intelligence (AI)! Oh, me? Nah, I'm not an AI - do I sound artificial to you?
			    		<hr>This webpage is powered by HTML5, CSS, and purely by the Javascript library, Raphaël.<br><br>All audio and SVG line paths are extracted from works that are in the public domain (sources: freesound.org and freesvg.org). The image files used are created by yours truly.<br><br> © 2021, <a href='https://www.linkedin.com/in/lenon-ong/' target= '_blank'><span class='underline'>Lenon Ong</span></a><br><a href='https://creativecommons.org/licenses/by/3.0/' target= '_blank'><span class='underline'>Available under the Creative Commons Attribution 3.0 Unported License.</span></a><hr>`;
		hitAudio[3].pause();
        hitAudio[3].currentTime = 0;
        hitAudio[3].play();
		createUkMain();
    });

	africaMain1.node.addEventListener("mousemove", function(ev){
		africaMain1.node.style.cursor="pointer";
    });    
};

let createUkMain = function(){
  var ukMain1 = paper.path(ukMainPathString1);
  ukMain1.attr({
    //"fill": "black",
    "stroke-width": 5,
    "stroke": "white",
    "opacity": 0,
  });
  ukMain1.transform('S1,1', 1000);
  ukMain1.animate({opacity: 1}, 1000);
  var ukTransformedPath1 = Raphael.transformPath(ukMainPathString1, `T400,30`);
  ukMain1.animate({path: ukTransformedPath1}, 1000);
  
  ukMain1.node.addEventListener("click", function myFunction(ev){
  	ukMain1.node.removeEventListener("click", myFunction);
  	var ukTransformedPath1 = Raphael.transformPath(ukMainPathString1, `T100,30`);
    ukMain1.animate({"opacity": 0, "path": ukTransformedPath1}, 1500, function(ev){this.remove()});
    ukMain1.node.style.cursor="pointer";
    commentary.innerHTML = `[${new Date().toLocaleTimeString()}] <b>The Talking Lemon</b>: We are now at the land of <i>swagging</i> Kangaroo pouches! Impressive if your browser is not <i>lagging</i> from all the animated lines of binary code; my bad if your browser is <i>hanging</i>... I can hear your CPU <i>nagging</i> from here, hahaha!
    	    		<hr>This webpage is powered by HTML5, CSS, and purely by the Javascript library, Raphaël.<br><br>All audio and SVG line paths are extracted from works that are in the public domain (sources: freesound.org and freesvg.org). The image files used are created by yours truly.<br><br> © 2021, <a href='https://www.linkedin.com/in/lenon-ong/' target= '_blank'><span class='underline'>Lenon Ong</span></a><br><a href='https://creativecommons.org/licenses/by/3.0/' target= '_blank'><span class='underline'>Available under the Creative Commons Attribution 3.0 Unported License.</span></a><hr>`;
    hitAudio[3].pause();
    hitAudio[3].currentTime = 0;
    hitAudio[3].play();
    createAustraliaMain();
    });

  ukMain1.node.addEventListener("mousemove", function(ev){
    ukMain1.node.style.cursor="pointer";
    });      
};

let createAustraliaMain = function(){
  var australiaMain1 = paper.path(australiaMainPathString1);
  australiaMain1.attr({
    //"fill": "black",
    "stroke-width": 5,
    "stroke": "white",
    "opacity": 0,
  });
  australiaMain1.transform('S0.5,0.5', 1000);
  australiaMain1.animate({opacity: 1}, 1000);
  var australiaTransformedPath1 = Raphael.transformPath(australiaMainPathString1, `T100,-50`);
  australiaMain1.animate({path: australiaTransformedPath1}, 1000);
  
  australiaMain1.node.addEventListener("click", function myFunction(ev){
  	australiaMain1.node.removeEventListener("click", myFunction);
  	var australiaTransformedPath1 = Raphael.transformPath(australiaMainPathString1, `T${pWidth},0`);
    australiaMain1.animate({"opacity": 0, "path": australiaTransformedPath1}, 1500, function(ev){this.remove()});
    australiaMain1.node.style.cursor="pointer";
   	commentary.innerHTML = `[${new Date().toLocaleTimeString()}] <b>The Talking Lemon</b>: I don't blame you if you don't recognise that. Those are North Korea and South Korea! They are both World Intellectual Property Organization (WIPO) member states. I like ${sentences[Math.floor(Math.random()*4)]}, what about you? If you come back here again, I might tell you what else I like about Korea!
   		    		<hr>This webpage is powered by HTML5, CSS, and purely by the Javascript library, Raphaël.<br><br>All audio and SVG line paths are extracted from works that are in the public domain (sources: freesound.org and freesvg.org). The image files used are created by yours truly.<br><br> © 2021, <a href='https://www.linkedin.com/in/lenon-ong/' target= '_blank'><span class='underline'>Lenon Ong</span></a><br><a href='https://creativecommons.org/licenses/by/3.0/' target= '_blank'><span class='underline'>Available under the Creative Commons Attribution 3.0 Unported License.</span></a><hr>`;
   	hitAudio[3].pause();
    hitAudio[3].currentTime = 0;
    hitAudio[3].play();
    createKoreaMain(); 
    });

  australiaMain1.node.addEventListener("mousemove", function(ev){
    australiaMain1.node.style.cursor="pointer";
    });    
};

let createKoreaMain = function(){
  var koreaMain1 = paper.path(koreaMainPathString1);
  koreaMain1.attr({
    //"fill": "black",
    "stroke-width": 5,
    "stroke": "white",
    "opacity": 0,
  });
  koreaMain1.transform('S0.5,0.5', 1000);
  koreaMain1.animate({opacity: 1}, 1000);
  var koreaTransformedPath1 = Raphael.transformPath(koreaMainPathString1, `T350,-50`);
  koreaMain1.animate({path: koreaTransformedPath1}, 1000);

  koreaMain1.node.addEventListener("click", function myFunction(ev){
  	koreaMain1.node.removeEventListener("click", myFunction);
    var koreaTransformedPath1 = Raphael.transformPath(koreaMainPathString1, `T850,-100`);
    koreaMain1.animate({"opacity": 0, "path": koreaTransformedPath1}, 1500, function(ev){this.remove()}); 
    koreaMain1.node.style.cursor="pointer";
    commentary.innerHTML = `<span>[${new Date().toLocaleTimeString()}] <b>The Talking Lemon</b>: Murica!!! Did you know? The United States of America was consistently the top filer of international patents until in 2019, when China became the top filer! <br>Source:<a href='https://www.wipo.int/pressroom/en/articles/2020/article_0005.html 'target= '_blank'><span class='underline'>World Intellectual Property Organization website</span></a></span>
    	    		<hr>This webpage is powered by HTML5, CSS, and purely by the Javascript library, Raphaël.<br><br>All audio and SVG line paths are extracted from works that are in the public domain (sources: freesound.org and freesvg.org). The image files used are created by yours truly.<br><br> © 2021, <a href='https://www.linkedin.com/in/lenon-ong/' target= '_blank'><span class='underline'>Lenon Ong</span></a><br><a href='https://creativecommons.org/licenses/by/3.0/' target= '_blank'><span class='underline'>Available under the Creative Commons Attribution 3.0 Unported License.</span></a><hr>`;
    hitAudio[3].pause();
    hitAudio[3].currentTime = 0;
    hitAudio[3].play();
    createUsMain();
    });

  koreaMain1.node.addEventListener("mousemove", function(ev){
    koreaMain1.node.style.cursor="pointer";
    });    
};

let createUsMain = function(){
  var usMain1 = paper.path(usMainPathString1);
  usMain1.attr({
    //"fill": "black",
    "stroke-width": 5,
    "stroke": "white",
    "opacity": 0,
  });
  usMain1.transform('S0.5,0.5', 1000);
  usMain1.animate({opacity: 1}, 1000);
  var usTransformedPath1 = Raphael.transformPath(usMainPathString1, `T0,-150`);
  usMain1.animate({path: usTransformedPath1}, 1000);

  usMain1.node.addEventListener("click", function myFunction(ev){
    usMain1.node.removeEventListener("click", myFunction);
    var usTransformedPath1 = Raphael.transformPath(usMainPathString1, `T-200,-100`);
    usMain1.animate({"opacity": 0, "path": usTransformedPath1}, 1500, function(ev){this.remove()}); 
    usMain1.node.style.cursor="pointer";
    //game03State = "false";
    //game04State = "true";
  	commentary.innerHTML = `[${new Date().toLocaleTimeString()}] <b>The Talking Lemon</b>: An "international patent protection" does not actually exist. Multiple national patent applications are made (via your local IP office or WIPO)! Psst... Try holding the left mouse button and dragging the mouse on the continents! <br> Also, for this stage, there's something to do with the number 12...
  		    		<hr>This webpage is powered by HTML5, CSS, and purely by the Javascript library, Raphaël.<br><br>All audio and SVG line paths are extracted from works that are in the public domain (sources: freesound.org and freesvg.org). The image files used are created by yours truly.<br><br> © 2021, <a href='https://www.linkedin.com/in/lenon-ong/' target= '_blank'><span class='underline'>Lenon Ong</span></a><br><a href='https://creativecommons.org/licenses/by/3.0/' target= '_blank'><span class='underline'>Available under the Creative Commons Attribution 3.0 Unported License.</span></a><hr>`;
  	hitAudio[3].pause();
    hitAudio[3].currentTime = 0;
    hitAudio[3].play();
    create3DMain();
    });

  usMain1.node.addEventListener("mousemove", function(ev){
    usMain1.node.style.cursor="pointer";
    });    
};

//function for 2.5D globe to appear (need to pause the CPUText function)
counterColor = 0;
var globeColourArray = [];
var numGlobeColourArray = 100;
while (counterColor < numGlobeColourArray) {
    var globecolourHolder = Math.floor(map(Math.random(),0,1,100001,999999))
    if (globecolourHolder>100000){
        globeColourArray[counterColor] = "#" + globecolourHolder; //for natural-looking colours
    };
    counterColor++;
};
var globeNumClicks = 0;
var globeGlow = "false";
var maxGlobeClicks = 12;


let create3DMain = function(){
  	console.log("Game03 state is: " + game03State);

  	globeString = "M 721.48,131.37 719.97,131.87 722.85,132.36 721.48,131.37 M 723.59,110.45 C 727.90,113.03 731.44,112.43 731.13,110.01 730.82,107.59 726.66,103.34 724.83,102.56M 720.27,130.77 719.87,129.84 719.98,131.40 720.27,130.77 M 717.09,131.59 718.38,138.85 723.93,127.84 717.09,131.59 M 713.83,128.93 C 720.52,129.15 722.34,135.29 729.01,134.02 734.07,133.06 728.83,124.16 729.34,120.22 728.04,116.12 723.68,113.27 726.31,119.18 726.68,124.22 722.24,131.40 715.83,126.18 714.33,126.48 714.10,127.99 713.83,128.93M 711.89,129.59 C 712.34,133.24 716.57,139.44 715.88,132.08 715.56,130.74 714.23,128.14 711.89,129.59M 123.21,27.30 C 125.23,25.27 130.63,20.54 132.66,21.89 134.68,23.24 137.72,20.88 140.09,22.91 142.45,24.93 145.15,27.30 147.17,27.97 149.20,28.65 151.56,26.28 153.59,27.30 155.61,28.31 162.70,22.23 161.35,26.96 160.00,31.69 163.04,33.04 159.33,33.38 155.61,33.72 151.56,36.42 149.87,35.41 148.19,34.40 146.84,33.38 144.14,34.73 141.43,36.09 142.79,36.09 139.75,35.41 136.71,34.73 136.03,36.09 135.36,35.07 134.68,34.06 132.66,34.40 133.00,31.35 133.33,28.31 134.35,28.65 132.32,28.65 130.29,28.65 128.61,28.99 127.26,27.98 125.92,26.96 123.22,27.30 123.22,27.30 123.22,27.30 123.21,27.30 123.21,27.30 Z M 198.49,23.24 C 196.80,24.93 192.75,27.30 193.76,28.31 194.78,29.33 195.45,33.04 197.48,32.03 199.50,31.02 197.14,27.64 204.90,30.34 212.67,33.04 211.99,30.00 213.68,34.06 215.37,38.11 216.72,41.15 215.70,42.17 214.69,43.18 214.35,44.20 210.98,45.21 207.60,46.22 206.25,47.58 208.62,49.26 210.98,50.95 215.37,52.64 217.39,53.66 219.42,54.67 225.49,55.01 222.46,51.63 219.42,48.25 223.13,47.24 223.13,47.24 223.13,47.24 228.87,51.63 226.85,46.56 224.82,41.49 223.47,41.49 224.82,41.49 226.17,41.49 228.87,43.18 228.87,43.18 228.87,43.18 230.22,40.48 230.22,40.48 230.22,40.48 228.87,36.09 228.87,36.09 228.87,36.09 224.48,31.69 224.48,31.69 224.48,31.69 228.19,28.31 223.13,27.64 218.07,26.96 218.40,26.96 215.70,25.27 213.00,23.58 212.67,22.91 207.60,23.92 202.54,24.94 200.85,25.61 200.85,25.61 200.85,25.61 198.50,23.24 198.50,23.24 198.50,23.24 198.49,23.24 198.49,23.24 Z M 205.92,8.04 C 205.92,8.04 219.42,6.35 219.42,6.35 219.42,6.35 224.15,6.35 226.51,4.66 228.87,2.97 226.51,2.97 233.60,1.62 240.69,0.27 238.66,-0.41 242.38,0.27 246.09,0.94 247.10,0.94 251.15,1.62 255.20,2.29 256.22,1.28 259.93,2.29 263.64,3.31 265.33,2.97 268.37,2.97 268.37,2.97 277.82,2.97 277.82,2.97 282.55,2.97 286.94,0.27 288.63,1.95 290.31,3.64 291.33,2.97 297.07,3.64 302.80,4.32 305.17,2.97 307.53,3.64 309.89,4.32 313.95,3.31 318.67,3.64 323.40,3.98 325.76,3.31 327.45,3.31 329.14,3.31 330.82,0.94 333.19,2.97 335.55,5.00 338.59,2.29 338.92,5.00 339.26,7.70 343.65,5.67 339.26,7.70 334.87,9.73 335.55,9.39 332.51,12.09 329.47,14.80 334.54,17.16 328.12,19.53 321.71,21.89 320.69,18.17 319.01,22.23 317.32,26.28 319.01,27.30 318.67,29.33 318.33,31.35 317.66,31.69 315.63,33.38 313.61,35.07 313.61,33.38 308.88,34.40 304.15,35.41 300.78,36.42 298.75,36.42 296.73,36.42 292.34,38.11 290.99,38.79 289.64,39.46 293.35,40.48 286.26,42.51 279.17,44.53 277.48,44.20 275.46,46.90 273.43,49.60 274.11,49.94 272.76,51.63 271.41,53.32 267.36,60.08 265.33,58.39 263.31,56.70 262.29,57.04 260.60,55.35 258.92,53.66 257.90,51.29 256.89,49.94 255.88,48.59 255.54,45.21 255.20,43.18 254.87,41.15 251.83,36.42 255.20,37.10 258.58,37.78 260.60,37.44 261.62,36.76 262.63,36.09 263.64,33.72 263.64,33.72 263.64,33.72 263.31,30.00 262.29,27.98 261.28,25.95 261.96,24.26 260.27,22.23 258.58,20.20 258.58,20.54 256.22,18.51 253.85,16.49 254.53,15.47 250.81,15.14 247.10,14.80 246.09,13.78 244.74,14.12 243.39,14.46 239.00,11.76 243.72,11.42 248.45,11.08 252.84,11.76 252.84,11.76 252.84,11.76 258.92,9.05 256.89,8.71 254.87,8.38 259.93,5.33 255.20,6.35 250.48,7.36 245.08,8.71 243.73,9.05 242.38,9.39 239.00,9.73 235.62,10.74 232.25,11.76 228.20,11.42 226.17,13.78 224.15,16.15 226.17,16.49 224.15,16.15 222.12,15.81 225.83,13.78 221.11,16.15 216.38,18.51 217.73,18.18 215.37,17.50 213.01,16.82 211.32,15.81 211.32,15.81 211.32,15.81 214.36,15.47 209.97,15.14 205.58,14.80 205.58,14.80 203.89,12.77 202.20,10.74 203.22,10.74 204.23,10.07 205.23,9.39 205.91,8.04 205.91,8.04 205.91,8.04 205.92,8.04 205.92,8.04 Z M 133.79,217.32 C 133.79,217.32 132.21,215.07 132.21,215.07 132.21,215.07 131.54,213.72 130.41,213.49 129.28,213.27 126.81,210.34 126.81,210.34 126.81,210.34 125.68,209.44 125.68,207.86 125.68,206.28 124.78,203.81 125.46,201.10 126.13,198.40 126.36,195.02 126.13,194.12 125.91,193.22 127.26,192.99 125.68,192.09 124.11,191.19 120.96,190.96 118.93,190.96 116.91,190.96 114.43,191.64 113.98,191.86 113.53,192.09 116.46,185.11 116.91,183.98 117.36,182.86 119.38,177.90 119.38,177.22 119.38,176.55 120.06,176.32 118.71,175.42 117.36,174.52 115.11,174.07 113.75,174.74 112.40,175.42 112.63,173.84 111.50,176.55 110.38,179.25 109.25,182.18 107.90,182.63 106.55,183.08 103.85,184.43 103.85,184.43 103.85,184.43 100.48,184.21 99.35,183.98 98.23,183.76 93.50,181.28 92.60,179.70 91.70,178.12 91.25,174.74 91.25,173.17 91.25,171.59 93.72,166.86 93.50,165.74 93.27,164.61 95.98,160.10 95.75,159.43 95.52,158.75 96.20,156.50 96.88,155.60 97.55,154.70 100.93,153.57 101.83,152.67 102.73,151.77 104.30,150.64 105.88,150.19 107.45,149.74 108.80,149.29 109.93,149.29 111.05,149.29 113.98,146.81 114.43,149.29 114.88,151.77 116.91,150.87 118.03,151.09 119.16,151.32 119.38,152.44 121.18,149.51 122.98,146.59 124.78,145.68 124.78,146.36 124.78,147.04 127.71,146.14 128.16,146.81 128.61,147.49 129.51,146.36 131.08,147.71 132.66,149.06 134.91,149.29 134.68,149.96 134.46,150.64 135.58,150.64 135.58,151.32 135.58,151.99 136.49,149.74 136.49,153.79 136.49,157.85 137.61,160.33 137.61,160.33 137.61,160.33 139.18,163.71 139.86,163.03 140.53,162.36 141.88,160.55 141.88,160.55 141.88,160.55 144.14,159.20 142.56,154.47 140.98,149.74 142.11,148.39 141.66,146.81 141.21,145.23 141.21,144.33 143.91,142.30 146.61,140.28 153.14,135.77 154.71,134.87 156.29,133.97 159.89,131.49 159.89,131.49 159.89,131.49 161.24,130.82 161.46,129.01 161.69,127.21 165.96,124.06 166.19,123.16 166.42,122.26 169.34,120.00 169.34,120.00 169.34,120.00 172.49,118.20 172.27,117.08 172.04,115.95 176.32,113.92 176.99,113.92 177.67,113.92 181.27,115.05 181.27,113.02 181.27,110.99 181.27,110.54 183.52,108.74 185.77,106.94 188.70,104.23 189.82,104.23 190.95,104.23 194.77,102.21 196.35,101.76 197.92,101.31 202.88,99.05 198.37,101.76 193.87,104.46 196.80,102.88 195.90,105.14 195.00,107.39 194.32,110.32 198.60,106.94 202.88,103.56 202.65,102.88 204.23,102.66 205.80,102.43 204.68,103.33 208.05,102.21 211.43,101.08 211.65,100.63 211.65,100.63 211.65,100.63 213.23,99.28 212.33,98.60 211.43,97.93 213.23,97.03 209.85,98.38 206.48,99.73 206.70,99.95 204.45,99.28 202.20,98.60 198.82,98.83 201.30,96.57 203.78,94.32 206.93,93.64 204.90,92.74 202.88,91.84 197.70,92.97 197.02,93.19 196.35,93.42 194.77,92.97 193.42,93.19 192.07,93.42 192.52,91.39 193.42,90.94 194.32,90.49 197.25,89.14 200.85,88.24 204.45,87.34 213.23,87.11 215.25,87.11 217.28,87.11 219.98,87.56 221.55,86.44 223.13,85.31 226.28,83.51 226.73,82.61 227.18,81.71 228.98,80.35 228.98,80.35 228.98,80.35 231.01,78.33 229.88,77.43 228.76,76.52 227.63,74.50 226.73,74.95 225.83,75.40 226.51,78.10 224.71,75.17 222.91,72.25 223.13,71.79 222.23,71.12 221.33,70.44 220.43,70.89 221.11,67.74 221.78,64.59 221.56,63.23 221.56,63.23 221.56,63.23 222.23,60.53 221.56,60.31 220.88,60.08 220.43,59.40 219.31,60.08 218.18,60.76 211.88,63.91 210.53,64.59 209.18,65.26 207.38,61.88 208.05,60.31 208.73,58.73 208.28,59.63 207.38,57.38 206.48,55.12 202.88,54.67 201.53,54.67 200.18,54.67 197.03,52.65 196.12,54.00 195.22,55.35 190.50,59.63 189.60,60.08 188.70,60.53 187.35,56.25 186.67,63.23 186.00,70.22 189.15,72.25 185.55,72.70 181.95,73.15 178.80,75.17 178.80,75.17 178.80,75.17 175.87,75.40 175.87,77.20 175.87,79.00 174.75,83.28 173.39,83.73 172.04,84.18 168.67,83.51 167.54,82.16 166.42,80.80 167.77,75.85 167.77,75.85 167.77,75.85 169.79,73.82 169.79,73.82 169.79,73.82 155.39,71.57 155.61,70.67 155.84,69.77 151.34,68.19 150.89,66.84 150.44,65.49 150.21,62.56 150.66,61.43 151.11,60.31 157.19,54.90 160.34,53.77 163.49,52.65 168.89,50.17 170.47,49.72 172.04,49.27 174.74,49.49 175.64,48.37 176.54,47.24 176.77,45.21 176.77,45.21 176.77,45.21 176.32,42.06 177.22,42.51 178.12,42.96 179.70,43.64 179.92,44.31 180.15,44.99 180.15,46.56 181.72,44.76 183.30,42.96 185.32,42.28 187.12,41.38 188.92,40.48 191.62,40.71 193.20,39.81 194.77,38.91 197.48,38.00 197.70,35.75 197.93,33.50 197.03,34.17 195.90,33.95 194.77,33.72 196.35,34.17 192.52,35.98 188.70,37.78 189.82,36.43 187.12,37.78 184.42,39.13 184.20,39.35 183.97,38.23 183.75,37.10 184.42,35.30 184.42,35.30 184.42,35.30 184.65,35.07 183.07,34.62 181.50,34.17 181.50,34.85 181.27,32.82 181.05,30.79 182.40,27.87 180.15,28.77 177.90,29.67 175.87,28.09 174.29,32.60 172.72,37.10 167.32,41.83 165.97,40.71 164.62,39.58 164.39,39.35 163.27,39.35 162.14,39.35 160.57,38.00 158.54,37.78 156.51,37.55 150.44,37.55 148.86,37.78 147.29,38.00 145.49,36.88 144.14,38.23 142.79,39.58 140.76,41.38 140.76,42.06 140.76,42.74 138.73,39.58 138.06,39.81 137.38,40.03 135.58,38.91 133.56,38.91 131.53,38.91 130.18,37.78 129.51,37.78 128.83,37.78 130.18,35.98 129.51,35.75 128.83,35.53 114.20,35.08 114.20,35.08 114.20,35.08 109.48,33.27 107.68,33.50 105.88,33.72 100.93,33.95 97.10,34.63 93.27,35.30 87.65,37.55 85.85,37.78 84.05,38.01 80.00,38.01 79.32,36.88 78.64,35.75 79.55,35.98 78.64,35.75 77.74,35.53 78.42,35.08 76.39,33.50 74.37,31.92 77.30,30.57 73.24,30.57 69.19,30.57 66.72,30.35 63.12,30.57 59.52,30.80 52.09,32.60 51.19,32.37 50.29,32.15 43.09,33.50 41.96,32.82 40.84,32.15 35.21,35.30 34.09,35.08 32.96,34.85 28.68,35.30 27.56,35.98 26.43,36.66 21.03,38.01 22.83,39.13 24.63,40.26 24.41,41.38 24.63,42.06 24.86,42.74 22.83,44.31 22.83,44.31 22.83,44.31 22.38,44.31 19.91,43.41 17.43,42.51 14.73,42.06 13.60,42.74 12.48,43.41 10.45,44.77 10.90,45.67 11.35,46.57 14.50,48.59 14.96,47.92 15.41,47.24 16.53,45.89 17.88,46.12 19.23,46.34 21.26,45.22 19.46,47.47 17.66,49.72 16.08,50.85 14.96,51.07 13.83,51.30 11.13,51.52 8.65,51.75 6.18,51.98 6.40,50.85 4.15,53.10 1.90,55.35 1.00,54.00 0.55,56.48 0.10,58.96 -0.35,58.96 0.55,59.63 1.45,60.31 -1.25,60.53 0.78,61.21 2.80,61.89 5.28,62.56 5.05,63.24 4.83,63.91 7.30,62.34 5.95,64.14 4.60,65.94 3.70,67.52 6.40,65.72 9.10,63.91 10.68,65.26 12.93,64.14 15.18,63.01 17.43,62.79 18.78,61.89 20.13,60.98 20.81,59.63 22.83,58.96 24.86,58.28 23.51,59.18 23.73,60.31 23.96,61.43 23.73,61.66 25.08,60.76 26.43,59.86 26.43,60.53 28.23,59.41 30.03,58.28 32.06,57.15 33.41,57.83 34.76,58.51 35.21,58.51 36.11,58.51 37.01,58.51 34.99,58.28 37.01,58.51 39.04,58.73 36.11,57.83 42.86,59.41 49.61,60.98 51.41,59.86 51.86,62.34 52.31,64.81 53.21,62.11 54.34,63.69 55.46,65.26 56.14,63.91 56.81,66.62 57.49,69.32 56.81,76.75 56.36,77.65 55.91,78.55 55.69,78.55 55.91,80.58 56.14,82.61 58.84,92.30 57.94,92.97 57.04,93.65 55.01,93.87 55.01,93.87 55.01,93.87 53.89,97.93 53.89,97.93 53.89,97.93 52.09,101.31 50.51,103.11 48.94,104.91 46.91,107.16 45.79,108.74 44.66,110.32 43.76,113.02 42.19,114.60 40.61,116.17 39.26,115.50 39.71,118.88 40.16,122.26 39.71,125.86 40.16,128.34 40.61,130.82 41.74,134.20 42.64,135.55 43.54,136.90 44.21,136.90 45.79,138.03 47.36,139.15 49.39,140.51 49.16,141.63 48.94,142.76 49.39,149.74 49.39,149.74 49.39,149.74 50.74,152.00 50.96,154.47 51.19,156.95 52.76,159.43 52.76,159.43 52.76,159.43 54.12,162.36 54.12,162.36 54.12,162.36 54.79,162.59 55.69,164.39 56.59,166.19 56.59,166.19 56.82,167.09 57.04,167.99 57.04,167.76 57.04,167.99 57.04,168.22 56.82,164.16 56.37,163.03 55.92,161.91 55.92,160.56 55.47,159.20 55.02,157.85 55.69,156.27 54.34,154.25 52.99,152.22 52.99,152.00 52.32,149.97 51.64,147.94 50.74,145.69 51.64,145.24 52.54,144.79 53.22,141.86 55.02,145.24 56.82,148.62 57.04,147.72 57.27,150.42 57.49,153.12 58.17,154.02 58.84,155.15 59.52,156.27 61.09,160.11 61.99,161.68 62.89,163.26 61.99,160.78 64.02,163.93 66.04,167.09 66.27,167.76 67.39,170.24 68.52,172.72 69.20,172.72 69.87,174.52 70.55,176.33 70.10,175.87 69.64,177.90 69.19,179.93 70.09,182.18 70.09,182.18 70.09,182.18 73.24,183.31 73.47,183.98 73.69,184.66 76.85,185.78 77.30,186.69 77.75,187.59 80.67,188.71 80.67,188.71 80.67,188.71 83.15,190.29 84.05,190.74 84.95,191.19 87.65,191.64 87.65,191.64 87.65,191.64 89.45,192.09 90.12,192.32 90.80,192.54 92.82,192.54 92.82,192.54 92.82,192.54 94.63,191.19 95.30,191.64 95.98,192.09 97.55,190.74 98.23,191.87 98.90,192.99 100.25,192.99 100.93,193.90 101.60,194.80 102.28,194.80 103.40,195.92 104.53,197.05 105.65,196.82 106.78,197.72 107.90,198.62 108.80,198.62 110.15,198.62 111.50,198.62 111.50,198.62 112.40,198.85 113.30,199.08 113.75,198.17 114.65,199.30 115.55,200.43 116.23,201.10 116.90,202.23 117.58,203.36 119.15,203.36 119.38,205.16 119.60,206.96 120.05,206.74 120.05,208.31 120.05,209.89 120.95,210.57 121.63,211.02 122.30,211.47 124.78,213.72 124.78,213.72 124.78,213.72 128.16,214.39 128.16,214.39 128.16,214.39 130.86,216.42 130.86,216.42 130.86,216.42 133.71,217.32 133.71,217.32 133.71,217.32 133.79,217.32 133.79,217.32 Z M 191.85,400.70 C 190.27,399.80 186.90,398.22 185.77,397.32 184.65,396.42 181.27,391.46 181.27,391.46 181.27,391.46 178.80,386.73 178.80,386.73 178.80,386.73 175.87,383.13 176.55,381.78 177.22,380.42 178.57,379.52 178.57,378.85 178.57,378.17 179.92,376.37 178.80,375.69 177.67,375.02 177.67,374.79 176.99,372.77 176.32,370.74 176.32,368.93 175.42,368.48 174.52,368.04 173.84,365.11 172.94,364.88 172.04,364.65 171.14,363.08 171.14,363.08 171.14,363.08 169.79,344.83 169.79,344.83 169.79,344.83 169.34,336.50 168.89,334.69 168.44,332.89 169.57,329.06 168.44,325.68 167.32,322.30 168.67,318.25 167.99,316.90 167.32,315.54 168.44,311.71 167.77,308.11 167.09,304.51 170.47,300.00 167.77,298.65 165.07,297.30 167.09,295.27 164.84,295.27 162.59,295.27 161.02,294.14 158.99,292.57 156.96,290.99 153.14,288.06 152.01,286.93 150.89,285.81 147.29,282.88 146.16,281.98 145.04,281.08 143.91,277.25 143.01,276.12 142.11,274.99 141.66,271.62 140.31,269.59 138.96,267.56 137.16,264.18 136.71,263.51 136.26,262.83 131.31,256.97 131.31,256.97 131.31,256.97 131.76,253.37 131.76,253.37 131.76,253.37 135.13,251.34 134.68,250.67 134.23,249.99 134.91,249.31 133.33,247.96 131.76,246.61 131.98,244.13 133.33,243.01 134.68,241.88 136.71,238.27 136.71,238.27 136.71,238.27 140.08,232.64 140.08,232.64 140.08,232.64 142.78,229.71 142.78,227.69 142.78,225.66 146.61,224.31 144.36,222.50 142.11,220.70 143.23,219.12 142.56,217.77 141.88,216.42 142.33,215.52 144.36,214.17 146.38,212.82 149.99,207.86 149.99,207.86 149.99,207.86 152.69,207.18 153.36,207.18 154.04,207.18 155.16,199.97 157.19,204.71 159.21,209.44 159.89,206.96 159.21,210.34 158.54,213.72 160.11,213.04 161.01,212.14 161.91,211.24 160.56,212.82 162.36,208.76 164.16,204.71 163.49,203.35 164.61,204.48 165.74,205.61 166.19,205.83 168.21,206.51 170.24,207.18 170.92,206.96 171.59,208.31 172.26,209.66 172.04,207.86 175.87,208.54 179.69,209.21 185.09,207.18 184.42,209.44 183.74,211.69 182.39,209.21 185.54,211.69 188.69,214.17 189.14,214.62 190.94,215.07 192.74,215.52 194.32,215.29 197.02,218.00 199.72,220.70 200.40,220.93 201.07,222.28 201.75,223.63 202.87,222.73 204.00,224.08 205.12,225.43 206.70,225.43 208.27,225.43 209.85,225.43 208.27,224.08 210.75,225.88 213.23,227.68 215.03,227.91 216.15,231.51 217.28,235.12 219.53,234.89 217.73,238.50 215.93,242.10 212.32,243.68 213.90,243.46 215.47,243.23 218.40,241.88 219.30,242.10 220.20,242.33 220.65,241.43 222.00,242.10 223.35,242.78 223.58,241.20 223.35,242.78 223.13,244.36 223.13,242.78 223.13,244.36 223.13,245.93 222.68,242.78 225.38,243.46 228.08,244.13 226.50,242.10 229.65,245.03 232.80,247.96 232.80,247.06 233.93,248.64 235.05,250.21 236.18,247.74 236.85,248.41 237.53,249.09 239.56,248.64 241.58,249.09 243.61,249.54 242.26,247.74 245.41,249.76 248.56,251.79 251.71,251.11 252.38,252.92 253.06,254.72 254.86,254.04 255.76,255.17 256.66,256.30 257.11,254.72 258.01,256.30 258.91,257.87 261.61,257.42 261.16,259.00 260.71,260.58 261.84,259.67 261.39,261.93 260.94,264.18 259.36,267.79 258.01,268.69 256.66,269.59 256.66,270.71 255.76,271.84 254.86,272.97 255.08,270.71 253.96,273.87 252.83,277.02 253.06,277.47 252.16,280.40 251.26,283.33 251.93,280.40 251.26,283.33 250.58,286.26 251.03,288.06 250.36,291.44 249.68,294.82 249.91,294.82 249.46,297.30 249.01,299.77 250.58,296.17 248.56,301.35 246.53,306.53 246.31,306.31 245.63,308.56 244.96,310.81 245.86,309.01 243.38,310.36 240.91,311.72 242.26,311.26 239.33,312.17 236.41,313.07 232.81,313.97 231.68,314.19 230.56,314.42 226.05,315.77 227.41,318.47 228.76,321.18 228.76,321.63 227.41,325.01 226.05,328.38 224.03,329.51 224.03,331.09 224.03,332.66 223.13,334.24 222.90,335.37 222.68,336.49 224.93,334.24 222.23,337.62 219.53,341.00 219.30,340.10 218.40,342.13 217.50,344.15 218.40,342.58 217.50,344.15 216.60,345.73 214.35,346.41 214.35,346.41 214.35,346.41 214.58,347.53 213.68,347.08 212.78,346.63 213.00,347.31 209.62,346.41 206.25,345.50 205.80,343.25 205.35,344.83 204.90,346.41 205.57,347.31 207.60,348.88 209.62,350.46 213.00,350.91 212.10,352.49 211.20,354.07 211.20,354.07 210.53,354.97 209.85,355.87 211.43,355.19 209.85,355.87 208.28,356.55 207.37,359.47 206.70,359.47 206.02,359.47 205.57,360.60 204.67,360.15 203.77,359.70 201.52,358.12 201.07,359.02 200.62,359.92 199.72,357.90 199.95,361.05 200.17,364.20 200.62,366.01 199.50,366.68 198.37,367.36 195.67,366.68 195.67,366.68 195.67,366.68 195.22,365.56 195.22,365.56 195.22,365.56 193.65,366.01 193.65,366.01 193.65,366.01 192.97,368.71 194.10,369.16 195.22,369.61 195.00,370.06 196.12,371.41 197.25,372.76 196.57,375.24 196.57,375.24 196.57,375.24 196.57,375.92 195.45,377.05 194.32,378.17 193.87,379.07 193.65,379.75 193.42,380.42 192.07,383.35 194.10,383.13 196.12,382.90 197.70,381.78 197.70,385.38 197.70,388.98 198.60,388.08 197.47,390.56 196.35,393.04 195.45,393.27 195.22,395.52 195.00,397.77 195.45,398.00 195.90,399.35 196.35,400.70 197.47,400.02 196.35,400.70 195.23,401.34 191.86,400.67 191.86,400.67 191.86,400.67 191.85,400.70 191.85,400.70 Z M 629.58,224.98 C 629.58,224.98 630.71,226.10 632.51,225.88 634.31,225.65 635.66,229.48 636.78,230.83 637.91,232.19 638.58,232.86 641.06,234.44 643.53,236.02 643.31,233.09 646.68,237.82 650.06,242.55 648.48,239.62 650.06,242.55 651.64,245.48 652.54,247.06 653.44,247.73 654.34,248.41 655.01,250.21 655.24,250.89 655.46,251.56 657.04,253.59 657.04,254.26 657.04,254.94 657.49,256.74 656.14,258.32 654.79,259.90 653.66,260.12 653.66,260.12 653.66,260.12 650.96,258.77 650.06,257.42 649.16,256.07 648.04,254.94 646.46,252.24 644.88,249.53 643.08,246.60 642.18,245.25 641.28,243.90 639.93,242.55 639.26,241.20 638.58,239.84 636.78,235.79 635.88,235.34 634.98,234.89 634.76,233.54 633.18,231.96 631.61,230.38 631.83,229.03 631.16,228.13 630.48,227.23 628.91,225.20 628.91,225.20 628.91,225.20 629.57,224.98 629.57,224.98 629.57,224.98 629.58,224.98 629.58,224.98 Z M 730.86,243.68 C 731.76,243.46 734.91,241.21 735.14,245.26 735.36,249.32 735.59,248.19 736.94,250.44 738.29,252.69 739.19,253.37 740.76,252.24 742.34,251.12 744.14,251.12 744.59,249.09 745.04,247.06 745.04,247.06 746.39,247.06 747.74,247.06 748.19,246.84 748.87,247.74 749.54,248.64 749.99,247.74 752.92,249.32 755.84,250.89 758.32,250.44 760.12,252.02 761.92,253.60 762.82,253.37 765.29,254.27 767.77,255.17 766.64,253.82 768.90,256.30 771.15,258.78 770.25,259.45 771.37,260.58 772.50,261.71 773.40,259.68 772.95,262.38 772.50,265.09 769.35,262.38 774.07,266.21 778.80,270.04 779.47,270.72 781.05,271.84 782.63,272.97 783.75,274.32 782.40,274.32 781.05,274.32 776.77,274.32 776.32,273.65 775.87,272.97 773.85,272.52 772.50,270.94 771.15,269.37 768.22,268.24 767.55,266.89 766.87,265.53 765.97,265.09 764.85,265.09 763.72,265.09 762.60,266.44 761.02,268.01 759.44,269.59 760.12,267.11 758.09,267.79 756.07,268.46 753.82,267.56 752.69,266.66 751.57,265.76 751.79,264.41 749.99,265.09 748.19,265.76 747.07,265.31 747.74,263.96 748.42,262.61 747.97,260.80 747.97,260.80 747.97,260.80 748.64,258.55 747.07,258.10 745.49,257.65 745.49,256.08 743.92,255.62 742.34,255.17 739.87,254.05 739.87,254.05 739.87,254.05 739.64,254.05 738.97,253.82 738.29,253.59 738.29,253.59 736.49,253.15 734.69,252.69 733.34,253.14 732.44,252.02 731.54,250.89 731.99,249.32 731.99,249.32 731.99,249.32 735.59,249.77 731.99,247.06 731.99,247.06 728.39,244.36 728.39,244.36 728.39,244.36 728.84,244.13 728.61,243.68 728.38,243.22 730.86,243.67 730.86,243.67 730.86,243.67 730.86,243.68 730.86,243.68 Z M 686.74,221.15 C 685.85,222.51 682.92,226.56 681.80,226.79 680.67,227.01 679.54,228.14 678.64,227.91 677.74,227.69 675.72,227.91 675.04,230.84 674.37,233.77 673.24,235.35 672.57,235.12 671.89,234.90 673.69,239.40 669.87,237.60 666.04,235.80 667.39,239.18 666.94,240.08 666.49,240.98 667.61,243.46 667.84,244.36 668.07,245.26 668.74,246.84 669.64,248.19 670.54,249.54 671.22,251.12 672.79,250.67 674.37,250.22 679.32,250.67 679.32,250.67 679.32,250.67 681.12,251.34 682.24,251.34 683.37,251.34 683.59,250.89 684.27,250.89 684.94,250.89 686.29,248.64 686.07,248.41 685.84,248.19 685.17,247.51 686.52,246.16 687.87,244.81 689.44,244.36 689.67,242.78 689.90,241.21 689.22,241.21 689.90,240.30 690.57,239.40 692.14,239.63 691.70,238.73 691.25,237.83 692.14,238.05 691.25,236.25 690.35,234.45 689.22,233.77 690.12,231.52 691.02,229.26 691.92,228.81 691.70,227.46 691.47,226.11 692.82,225.66 691.25,224.08 689.67,222.51 689.00,222.05 687.87,221.60 687.87,221.60 686.76,221.14 686.76,221.14 686.76,221.14 686.74,221.15 686.74,221.15 Z M 673.47,310.14 C 672.79,311.04 672.34,320.73 671.89,321.86 671.44,322.98 670.54,328.84 670.99,330.19 671.44,331.54 672.12,336.50 671.67,338.08 671.22,339.65 671.89,344.61 670.77,344.38 669.64,344.16 669.19,344.61 669.19,345.28 669.19,345.96 670.77,347.31 670.77,347.31 670.77,347.31 673.47,347.31 674.59,347.09 675.72,346.86 677.97,345.73 679.77,345.73 681.57,345.73 682.70,344.38 684.27,344.38 685.85,344.38 689.22,343.26 690.12,343.71 691.02,344.16 692.37,341.00 693.95,341.68 695.52,342.35 698.90,340.10 700.48,340.10 702.05,340.10 702.73,337.62 704.53,338.07 706.33,338.53 709.70,337.17 711.28,337.85 712.85,338.53 715.33,335.60 716.45,337.85 717.58,340.10 720.96,341.00 720.96,342.13 720.96,343.25 720.73,345.73 720.73,345.73 720.73,345.73 723.43,345.51 723.43,345.51 723.43,345.51 727.71,342.80 728.38,342.80 729.06,342.80 730.63,340.55 730.63,341.68 730.63,342.80 729.28,345.28 728.83,346.41 728.38,347.54 729.28,348.89 729.28,348.89 729.28,348.89 731.53,350.01 730.63,352.04 729.73,354.07 730.86,353.62 730.63,355.19 730.41,356.77 730.63,356.10 731.53,357.00 732.43,357.90 734.01,359.48 735.36,359.25 736.71,359.02 737.16,357.67 738.28,358.35 739.41,359.03 741.66,358.57 742.33,359.48 743.01,360.38 738.06,362.63 746.61,358.80 755.16,354.97 756.06,354.07 757.19,352.72 758.32,351.37 759.67,350.01 760.56,349.11 761.46,348.21 760.79,348.44 763.49,346.41 766.19,344.38 766.19,345.28 768.67,341.45 771.14,337.62 772.94,336.27 773.39,335.60 773.84,334.92 774.74,334.69 774.97,331.99 775.19,329.29 776.99,326.81 776.99,325.91 776.99,325.01 777.67,323.66 777.44,322.08 777.22,320.50 778.34,318.25 776.99,316.00 775.64,313.74 777.67,312.84 775.64,311.94 773.62,311.04 772.27,311.49 771.82,309.91 771.37,308.34 769.57,308.56 768.89,304.28 768.22,300.00 765.51,299.55 765.51,299.55 765.51,299.55 762.81,298.42 763.49,297.97 764.17,297.52 764.39,294.37 764.17,293.47 763.94,292.57 763.94,290.54 763.27,289.19 762.59,287.84 762.14,286.04 761.47,284.46 760.79,282.88 759.67,282.43 759.21,280.63 758.76,278.83 758.09,278.15 757.86,277.70 757.64,277.25 757.19,275.00 756.74,277.47 756.29,279.95 755.39,284.68 755.39,284.68 755.39,284.68 753.59,288.51 752.91,289.64 752.24,290.76 751.56,293.69 750.44,293.47 749.31,293.24 748.63,294.59 747.74,294.37 746.83,294.14 745.49,294.59 744.81,293.92 744.14,293.24 742.33,291.44 741.43,291.21 740.53,290.99 739.86,289.19 739.18,289.19 738.51,289.19 737.38,287.61 737.61,286.71 737.83,285.81 738.06,283.78 738.28,282.88 738.51,281.98 739.86,279.95 739.86,279.95 739.86,279.95 739.86,278.60 738.73,278.60 737.61,278.60 737.38,278.60 734.91,278.37 732.43,278.15 731.76,277.92 730.85,277.92 729.96,277.92 731.76,277.47 729.28,278.15 726.81,278.83 725.68,280.63 724.10,282.20 722.53,283.78 723.88,283.33 722.53,283.78 721.18,284.23 721.40,282.65 720.50,285.13 719.60,287.61 720.95,288.29 720.28,288.74 719.60,289.19 714.88,287.16 714.88,287.16 714.88,287.16 716.00,286.93 715.10,285.81 714.20,284.68 713.30,283.11 711.95,283.78 710.60,284.46 709.47,284.91 708.58,286.03 707.68,287.16 707.68,288.06 707.00,288.96 706.33,289.86 704.53,289.86 704.30,290.76 704.07,291.67 704.07,293.92 703.40,294.14 702.73,294.37 702.50,293.24 701.83,293.02 701.15,292.79 701.37,290.99 700.93,292.12 700.48,293.24 700.03,293.02 699.35,294.82 698.67,296.62 698.45,298.20 697.78,298.43 697.10,298.65 697.78,298.88 695.75,300.00 693.72,301.13 693.27,301.13 690.35,302.48 687.42,303.83 688.10,303.83 686.07,304.06 684.05,304.28 683.60,304.96 682.25,305.18 680.90,305.41 680.00,305.63 678.65,306.99 677.30,308.34 676.17,308.79 675.27,309.01 674.37,309.24 673.51,310.12 673.51,310.12 673.51,310.12 673.47,310.14 673.47,310.14 Z M 497.25,279.72 C 496.57,282.20 494.09,285.81 494.09,285.81 494.09,285.81 489.59,288.06 489.59,288.06 489.59,288.06 488.02,289.41 487.12,289.64 486.22,289.86 483.97,290.99 483.97,290.99 483.97,290.99 481.94,290.54 482.62,292.57 483.29,294.59 483.52,297.07 483.29,297.75 483.07,298.42 483.07,299.78 483.07,301.58 483.07,303.38 482.39,305.63 481.27,306.08 480.14,306.53 479.02,306.98 479.24,308.56 479.47,310.14 479.47,314.87 479.47,314.87 479.47,314.87 482.39,319.37 482.39,319.37 482.39,319.37 483.29,318.70 485.09,318.70 486.89,318.70 488.69,317.12 488.69,317.12 488.69,317.12 490.72,317.57 490.49,315.10 490.27,312.62 491.40,309.69 491.17,309.01 490.95,308.34 493.20,305.41 493.20,304.73 493.20,304.06 495.45,300.90 495.45,299.78 495.45,298.65 497.02,296.85 497.25,295.50 497.47,294.14 497.70,290.99 498.15,290.09 498.60,289.19 498.82,288.29 498.82,287.39 498.82,286.49 498.82,284.68 498.82,284.68 498.82,284.68 497.22,279.72 497.22,279.72 497.22,279.72 497.25,279.72 497.25,279.72 Z M 346.68,131.50 C 346.68,131.50 343.31,136.00 343.31,136.00 343.31,136.00 341.06,138.25 341.06,138.25 341.06,138.25 336.56,140.73 336.56,140.73 336.56,140.73 335.88,142.76 335.88,142.76 335.88,142.76 334.08,144.56 334.30,145.69 334.53,146.81 334.53,148.84 334.53,148.84 334.53,148.84 331.38,151.77 330.03,152.67 328.68,153.57 326.88,155.60 326.88,155.60 326.88,155.60 325.75,156.95 325.08,157.40 324.40,157.85 323.28,159.20 322.38,160.56 321.48,161.91 320.58,162.81 320.13,163.48 319.68,164.16 318.33,165.74 317.65,168.21 316.98,170.69 315.17,173.62 315.17,173.62 315.17,173.62 314.72,174.75 314.72,174.75 314.95,178.58 314.95,179.25 315.40,180.61 315.85,181.96 316.30,181.50 315.85,184.43 315.40,187.36 315.40,188.49 314.95,189.84 314.50,191.19 313.15,193.67 312.70,194.80 312.25,195.92 313.60,197.95 313.60,197.95 313.60,197.95 314.28,200.88 313.82,201.56 313.37,202.23 314.05,203.58 314.05,203.58 314.05,203.58 316.75,205.16 317.65,206.06 318.55,206.96 320.13,208.31 320.35,208.99 320.58,209.67 322.38,212.82 322.60,213.50 322.83,214.17 324.63,216.65 325.08,217.33 325.53,218.00 327.78,220.48 327.78,220.48 327.78,220.48 330.70,222.73 331.38,223.63 332.06,224.53 334.08,224.98 334.76,225.66 335.43,226.34 337.01,226.11 337.91,226.79 338.81,227.46 340.61,226.34 341.51,226.79 342.41,227.24 344.88,226.34 345.56,225.89 346.23,225.44 347.81,223.86 348.93,224.53 350.06,225.21 350.73,224.53 351.64,224.76 352.53,224.98 353.89,223.86 354.79,223.86 355.69,223.86 357.94,222.96 358.61,222.96 359.29,222.96 361.54,221.60 362.44,221.60 363.34,221.60 364.46,220.71 365.59,221.15 366.71,221.60 366.26,220.25 368.29,220.93 370.31,221.60 370.99,220.93 371.66,221.60 372.34,222.28 373.24,221.61 373.92,222.51 374.59,223.41 375.72,224.08 375.94,224.98 376.16,225.89 377.52,226.79 377.52,226.79 377.52,226.79 378.87,227.01 378.87,227.01 378.87,227.01 380.67,225.66 381.12,226.56 381.57,227.46 383.59,227.24 383.59,227.24 383.59,227.24 385.62,229.49 385.62,229.49 385.62,229.49 386.29,230.39 386.29,230.39 386.29,230.39 387.64,234.00 387.42,235.35 387.19,236.70 387.19,239.63 386.52,240.30 385.84,240.98 385.39,243.91 385.39,243.91 385.39,243.91 384.49,244.81 386.52,246.61 388.54,248.42 389.90,249.99 390.57,250.89 391.25,251.79 393.05,254.27 393.27,255.85 393.50,257.42 393.95,258.33 394.85,260.35 395.75,262.38 396.87,262.61 397.10,264.86 397.32,267.11 397.77,267.11 397.55,268.69 397.32,270.27 396.65,270.49 397.32,271.62 398.00,272.74 398.90,274.77 398.67,275.45 398.45,276.12 398.00,279.05 398.00,279.05 398.00,279.05 397.55,280.40 397.55,280.40 397.55,280.40 395.52,284.23 395.52,284.23 395.52,284.23 394.17,286.26 394.17,286.26 393.72,287.84 392.82,289.41 393.05,291.67 393.27,293.92 391.92,293.92 393.72,296.17 395.52,298.43 396.42,300.90 397.55,302.93 398.67,304.96 399.35,306.99 399.57,308.34 399.80,309.69 400.70,310.14 401.15,311.94 401.60,313.74 401.82,314.64 401.82,315.77 401.82,316.90 401.60,319.83 402.05,320.50 402.50,321.18 402.72,323.21 402.95,324.11 403.17,325.01 402.27,325.23 403.62,326.81 404.97,328.39 405.87,329.29 406.77,330.42 407.67,331.54 407.45,331.09 408.12,332.67 408.80,334.25 409.70,335.15 409.92,336.50 410.15,337.85 410.37,341.23 411.05,342.81 411.72,344.38 412.62,345.96 412.62,345.96 412.62,345.96 415.10,347.54 416.00,347.31 416.90,347.09 418.70,345.06 420.05,345.74 421.40,346.41 422.53,345.74 423.65,345.74 424.78,345.74 425.90,344.38 427.03,344.38 428.15,344.38 429.73,342.58 430.63,343.03 431.53,343.48 432.66,342.58 433.78,341.45 434.91,340.33 435.58,339.43 437.61,337.63 439.63,335.82 439.41,335.82 440.76,334.70 442.11,333.57 443.46,331.09 445.03,330.64 446.61,330.19 447.06,328.61 447.51,327.49 447.96,326.36 448.18,325.69 448.86,324.78 449.54,323.88 449.08,325.01 450.21,322.08 451.34,319.15 452.69,318.03 453.81,317.35 454.94,316.67 455.61,315.32 456.29,315.10 456.96,314.87 458.09,315.77 457.64,313.74 457.19,311.72 457.64,308.79 457.19,308.11 456.74,307.44 456.06,309.69 456.29,306.31 456.52,302.93 458.99,299.55 458.99,299.55 458.99,299.55 462.37,295.27 463.49,294.60 464.62,293.92 464.84,293.24 466.42,292.34 467.99,291.44 471.37,289.19 471.37,288.06 471.37,286.94 472.72,284.01 472.72,283.33 472.72,282.66 472.72,281.98 472.27,278.15 471.82,274.32 472.72,275.22 471.37,271.62 470.02,268.01 469.79,263.51 468.89,262.38 467.99,261.25 468.44,258.32 468.44,257.42 468.44,256.52 470.02,254.27 470.69,253.37 471.37,252.47 474.29,248.86 474.29,248.86 474.29,248.86 478.80,243.68 480.37,241.21 481.95,238.73 483.52,236.47 484.65,235.57 485.77,234.67 488.47,232.64 490.05,230.39 491.62,228.14 494.77,223.86 495.00,223.18 495.22,222.51 497.02,220.25 497.02,220.25 497.02,220.25 499.50,217.32 499.95,215.75 500.40,214.17 502.65,205.38 502.20,205.84 501.75,206.29 499.05,206.74 498.15,206.96 497.25,207.19 499.50,208.09 492.97,207.64 486.45,207.19 483.07,208.31 483.07,208.31 481.05,207.86 479.47,210.11 478.79,206.96 478.12,203.81 477.67,202.01 476.32,199.75 474.97,197.50 474.07,196.60 472.04,193.67 470.02,190.74 470.24,192.09 468.44,189.84 466.64,187.59 466.19,188.26 465.07,185.34 463.94,182.41 463.04,183.53 461.69,179.48 460.34,175.42 459.44,174.97 458.76,172.72 458.09,170.47 457.19,169.79 456.74,167.76 456.29,165.74 451.11,155.37 450.44,154.70 449.76,154.02 448.64,150.42 448.86,151.09 449.09,151.77 452.24,154.02 452.24,154.02 452.24,154.02 454.04,153.34 454.71,153.34 455.39,153.34 458.09,155.82 458.09,156.72 458.09,157.62 462.82,161.91 463.94,165.06 465.07,168.21 466.42,170.47 466.64,171.37 466.87,172.27 469.12,175.87 470.02,177.23 470.92,178.58 473.84,181.28 474.29,182.63 474.74,183.98 479.02,188.49 479.02,191.42 479.02,194.35 481.05,198.18 481.27,199.08 481.50,199.98 485.55,201.11 485.55,201.11 485.55,201.11 490.95,199.75 490.95,199.75 490.95,199.75 499.05,194.57 499.95,194.57 500.85,194.57 508.05,191.19 508.05,191.19 508.05,191.19 510.98,188.49 513.00,186.91 515.03,185.34 517.28,182.41 517.73,181.05 518.18,179.70 519.08,179.48 520.88,177.45 522.68,175.42 525.16,173.39 523.58,172.04 522.01,170.69 521.11,171.14 518.86,168.89 516.61,166.64 516.83,167.09 515.25,164.16 513.68,161.23 515.48,157.85 512.10,161.23 508.73,164.61 510.08,165.51 506.70,166.19 503.33,166.86 501.97,169.12 500.40,166.86 498.83,164.61 497.25,165.96 496.35,162.58 495.45,159.20 494.77,158.98 494.55,157.63 494.32,156.27 494.55,156.27 492.75,152.89 490.95,149.51 492.30,144.33 493.42,147.26 494.55,150.19 496.35,150.64 499.28,152.67 502.20,154.70 503.55,156.27 506.25,156.50 508.95,156.72 511.20,156.50 511.65,156.95 512.10,157.40 512.55,156.72 513.68,157.17 514.80,157.62 515.25,156.50 515.70,158.30 516.15,160.10 518.63,160.33 519.75,161.45 520.88,162.58 520.88,162.13 523.81,162.58 526.73,163.03 530.78,163.03 530.78,163.03 530.78,163.03 535.06,162.80 535.06,162.80 535.06,162.80 540.01,163.25 540.01,163.25 540.01,163.25 543.61,165.28 544.51,165.28 545.41,165.28 545.64,167.76 547.89,169.11 550.14,170.46 550.59,170.69 551.94,172.27 553.29,173.84 553.06,174.52 554.86,176.10 556.67,177.67 559.59,175.87 560.04,175.20 560.49,174.52 562.74,173.39 562.29,175.20 561.84,177.00 564.54,176.32 563.87,180.60 563.19,184.88 562.74,183.76 563.87,186.69 564.99,189.61 569.94,198.62 570.17,201.33 570.40,204.03 571.74,203.13 571.97,205.61 572.20,208.09 573.54,208.99 573.54,210.79 573.54,212.59 575.12,213.04 575.34,214.40 575.57,215.75 578.05,214.62 578.72,214.40 579.40,214.17 582.55,211.24 582.55,211.24 582.55,211.24 583.90,210.79 583.67,208.54 583.45,206.29 583.67,206.74 583.67,203.36 583.67,199.98 582.32,199.98 583.00,196.60 583.67,193.22 585.47,191.19 585.92,189.62 586.37,188.04 588.17,185.34 589.07,185.11 589.97,184.88 594.93,182.41 596.05,180.83 597.18,179.25 598.98,177.45 600.78,175.65 602.58,173.85 605.73,171.59 606.40,172.27 607.08,172.95 606.85,172.72 607.98,172.72 609.11,172.72 611.13,173.62 612.71,173.85 614.28,174.07 617.43,177.90 618.11,179.93 618.78,181.96 618.33,181.51 620.81,184.44 623.28,187.36 625.54,185.56 625.54,189.17 625.54,192.77 625.54,192.54 626.66,193.90 627.79,195.25 629.14,191.42 630.49,191.87 631.84,192.32 632.06,191.42 633.19,195.02 634.31,198.63 634.99,198.63 635.21,202.23 635.44,205.84 634.99,202.46 634.99,205.39 634.99,208.32 634.76,208.54 635.21,211.24 635.66,213.95 637.24,214.85 637.01,215.30 637.01,215.30 638.36,211.47 637.91,208.77 637.46,206.06 637.91,202.23 639.04,201.11 640.16,199.98 641.29,198.86 642.19,201.78 643.09,204.71 643.54,202.46 645.56,205.84 647.59,209.22 649.39,208.54 649.61,210.12 649.84,211.70 650.97,211.92 652.54,213.27 654.12,214.62 655.47,213.05 657.27,211.70 659.07,210.34 664.02,205.39 664.25,203.36 664.47,201.33 666.49,201.78 662.89,196.60 659.29,191.42 659.29,189.62 655.47,186.46 651.64,183.31 649.39,183.09 652.32,179.03 655.24,174.97 656.59,172.27 658.39,173.40 660.19,174.52 663.34,174.30 663.34,178.81 663.34,183.31 662.44,188.27 665.59,182.86 668.74,177.45 670.32,174.30 669.42,175.20 668.52,176.10 671.45,173.40 671.45,173.40 671.45,173.40 671.67,171.37 675.50,170.47 679.32,169.57 680.45,169.12 681.80,168.44 683.15,167.77 686.98,163.26 687.65,161.23 688.33,159.21 690.13,155.60 689.68,154.03 689.23,152.45 686.97,144.79 686.52,145.01 686.08,145.24 686.30,145.24 683.38,142.09 680.45,138.93 678.42,136.68 677.97,135.33 677.52,133.98 676.40,133.75 677.75,131.95 679.10,130.15 679.77,130.37 680.00,128.79 680.22,127.22 682.02,125.87 678.65,126.99 675.27,128.12 677.75,127.44 674.82,127.22 671.90,126.99 664.25,128.80 668.07,124.07 671.90,119.33 673.02,116.41 673.70,116.41 674.37,116.41 677.75,112.58 677.97,116.18 678.20,119.78 679.55,118.88 679.77,121.14 680.00,123.39 684.50,118.66 684.50,118.66 684.50,118.66 686.07,119.11 687.20,120.24 688.33,121.36 688.33,124.97 688.33,124.97 688.33,124.97 687.43,123.84 689.90,125.64 692.38,127.45 695.08,126.54 695.08,130.37 695.08,134.20 695.08,134.43 696.65,135.33 698.23,136.23 699.80,135.78 701.16,134.65 702.50,133.53 704.75,129.47 704.75,129.47 704.75,129.47 704.98,127.89 701.38,125.64 697.78,123.39 695.53,121.81 694.18,120.69 692.83,119.56 693.28,116.18 694.63,114.83 695.98,113.48 696.65,112.80 696.20,111.00 695.75,109.20 696.88,107.84 700.25,108.07 703.63,108.30 704.30,107.85 704.30,107.85 704.30,107.85 704.98,108.29 704.98,106.94 704.98,105.59 709.26,99.28 708.13,99.28 707.01,99.28 708.36,97.71 707.68,95.23 707.01,92.75 709.93,88.92 707.46,87.12 704.98,85.32 704.30,84.41 702.73,81.71 701.16,79.01 701.38,78.56 695.53,77.88 689.68,77.21 686.98,79.23 685.62,77.43 684.27,75.63 683.60,80.14 682.70,74.73 681.80,69.32 684.05,65.72 684.05,65.72 684.05,65.72 687.65,63.46 688.55,61.89 689.45,60.31 693.05,59.63 695.98,60.76 698.91,61.89 703.18,61.66 706.78,62.34 710.38,63.01 710.16,65.27 711.96,62.34 713.76,59.41 711.96,58.06 713.31,56.48 714.66,54.90 716.23,52.43 717.36,54.00 718.48,55.58 720.74,57.16 722.54,55.13 724.34,53.10 725.01,52.88 725.01,52.88 725.01,52.88 725.91,53.78 725.91,53.78 725.91,53.78 727.94,52.65 727.94,54.68 727.94,56.71 729.96,58.96 728.84,60.53 727.71,62.11 726.14,61.89 726.14,65.72 726.14,69.55 726.14,68.87 728.61,72.03 731.09,75.18 732.66,72.48 733.11,75.86 733.56,79.23 734.01,78.56 736.49,80.81 738.97,83.06 738.51,83.06 740.32,84.42 742.12,85.77 743.02,87.12 743.02,84.87 743.02,82.61 743.24,81.49 743.02,79.46 742.79,77.43 744.82,75.86 743.47,72.48 742.12,69.10 743.24,69.32 740.54,66.84 737.84,64.37 736.04,67.30 735.14,63.69 734.24,60.09 739.41,58.51 740.77,58.06 742.12,57.61 744.14,54.91 744.59,56.71 745.04,58.51 741.22,65.04 747.74,58.06 754.27,51.08 751.34,54.00 751.34,54.00 751.34,54.00 754.72,53.55 755.39,54.00 756.07,54.46 757.87,51.98 757.19,52.20 756.52,52.43 749.99,48.60 749.99,48.60 749.99,48.60 745.27,45.90 745.27,45.90 745.27,45.90 746.84,44.77 747.97,44.99 749.09,45.22 749.32,42.74 750.45,42.52 751.57,42.29 759.22,44.09 760.80,44.99 762.37,45.90 768.00,46.12 767.32,45.67 766.65,45.22 763.05,42.52 762.82,41.61 762.60,40.71 754.72,38.91 752.25,39.14 749.77,39.36 747.52,40.04 745.49,39.36 743.47,38.68 740.54,36.88 738.97,36.88 737.39,36.88 717.59,33.05 716.69,33.28 715.79,33.50 714.44,37.78 713.76,37.11 713.09,36.43 711.96,36.43 708.81,35.53 705.66,34.63 701.38,33.95 695.75,33.50 690.13,33.05 686.30,33.95 684.73,32.15 683.15,30.35 679.78,31.03 675.95,30.80 672.13,30.57 667.62,30.80 665.60,30.80 663.57,30.80 658.85,30.57 657.72,30.35 656.60,30.12 655.25,28.55 653.90,28.32 652.55,28.10 652.77,27.65 650.07,27.20 647.37,26.74 647.59,23.82 646.69,26.29 645.80,28.77 646.24,28.10 644.89,29.00 643.54,29.90 642.19,31.70 641.29,31.70 640.39,31.70 636.79,31.93 636.12,31.48 635.44,31.03 634.32,30.57 632.06,30.57 629.81,30.57 629.81,30.80 626.89,30.35 623.96,29.90 621.71,30.12 619.01,28.77 616.31,27.42 616.31,26.52 614.06,26.74 611.81,26.97 611.81,26.29 608.66,26.29 605.51,26.29 601.68,28.10 599.66,28.32 597.63,28.55 593.13,28.10 591.56,27.42 589.98,26.74 589.53,25.17 583.68,25.84 577.83,26.52 574.45,26.52 575.57,24.72 576.70,22.92 578.05,21.11 578.73,20.89 579.40,20.66 580.98,19.54 579.85,19.09 578.73,18.63 577.60,17.96 574.90,17.73 572.20,17.51 572.42,18.63 568.37,18.18 564.32,17.73 570.62,16.61 562.30,16.83 553.97,17.06 551.94,17.73 551.04,17.73 550.14,17.73 549.02,15.93 546.77,18.63 544.52,21.34 541.36,22.91 536.87,23.14 532.36,23.37 532.14,22.69 527.86,24.27 523.59,25.84 520.89,23.81 521.79,27.42 522.69,31.02 523.81,32.38 523.81,33.05 523.81,33.73 521.79,38.23 519.31,35.53 516.83,32.83 512.33,22.24 514.36,29.45 516.38,36.66 520.88,39.13 516.61,40.26 512.33,41.39 512.78,39.81 512.11,39.36 511.43,38.91 512.11,35.75 511.88,33.95 511.66,32.15 511.21,31.02 510.31,30.12 509.41,29.22 509.63,27.87 507.83,27.42 506.03,26.97 507.61,26.07 504.68,26.07 501.76,26.07 499.28,24.26 499.96,28.32 500.63,32.37 501.30,29.67 503.10,33.50 504.90,37.33 508.28,34.63 505.81,37.33 503.33,40.03 496.80,39.13 495.23,38.01 493.65,36.88 494.10,38.46 491.18,36.43 488.25,34.40 489.15,32.82 485.78,34.40 482.40,35.98 481.28,38.91 479.92,37.78 478.57,36.65 475.42,39.36 474.30,38.01 473.17,36.66 468.67,36.66 467.77,38.01 466.87,39.36 464.17,39.13 460.34,40.94 456.52,42.74 457.64,41.16 452.92,44.99 448.19,48.82 445.49,51.97 443.92,49.50 442.34,47.02 433.79,42.74 437.16,42.06 440.54,41.39 442.11,40.03 443.92,41.61 445.72,43.19 448.64,42.74 449.09,41.61 449.54,40.48 451.57,39.36 448.87,38.01 446.17,36.65 445.94,37.55 441.66,35.98 437.39,34.40 441.66,34.85 435.81,33.95 429.96,33.05 427.48,32.60 425.91,32.15 424.34,31.70 422.08,32.15 419.83,31.92 417.58,31.70 416.01,31.25 413.98,31.47 411.96,31.70 410.83,31.25 408.13,33.28 405.43,35.30 403.40,36.20 401.60,37.78 399.80,39.36 395.08,42.51 393.73,43.64 392.38,44.77 387.65,48.37 387.20,49.72 386.75,51.07 387.65,52.20 385.85,53.10 384.05,54.00 382.25,54.00 380.90,54.23 379.55,54.45 380.90,52.20 379.55,54.45 378.20,56.70 378.65,64.81 379.77,63.69 380.90,62.56 380.22,58.96 385.17,62.34 390.12,65.72 393.28,65.27 393.05,68.42 392.82,71.57 396.43,71.35 396.88,72.02 397.33,72.70 399.58,71.12 399.58,71.12 399.58,71.12 404.53,67.97 404.53,66.39 404.53,64.81 407.68,61.21 407.68,61.21 407.68,61.21 405.43,60.08 405.43,57.83 405.43,55.58 406.10,54.90 406.55,52.65 407.00,50.40 404.08,52.65 410.83,48.37 417.58,44.09 418.03,47.02 418.03,47.02 418.03,47.02 418.93,47.92 417.80,49.27 416.68,50.62 414.65,54.23 414.20,54.68 413.75,55.13 416.23,58.73 417.35,58.73 418.48,58.73 420.73,57.83 422.08,58.06 423.43,58.28 425.68,57.38 426.36,57.83 427.03,58.28 428.61,59.63 427.48,60.76 426.36,61.89 423.88,63.24 422.08,62.79 420.28,62.34 417.58,59.18 419.15,63.69 420.73,68.19 418.93,69.32 417.58,69.10 416.23,68.87 413.30,66.62 413.75,70.00 414.20,73.38 410.83,75.63 410.15,75.63 409.48,75.63 408.13,75.40 408.13,75.40 408.13,75.40 406.10,75.18 404.98,75.18 403.85,75.18 401.60,76.30 400.92,77.20 400.25,78.11 399.35,77.43 398.22,77.43 397.10,77.43 398.22,76.08 395.97,75.63 393.72,75.18 392.37,74.73 391.02,75.63 389.67,76.53 387.65,76.98 386.75,76.30 385.85,75.63 387.20,74.05 385.40,74.95 383.60,75.85 382.25,78.33 381.57,78.56 380.90,78.78 383.60,78.56 380.90,78.78 378.19,79.01 377.07,79.68 375.72,80.13 374.37,80.59 376.17,83.29 373.69,84.19 371.22,85.09 373.02,83.06 370.54,85.09 368.07,87.12 367.62,88.92 366.72,89.15 365.82,89.37 366.04,89.82 364.02,90.05 361.99,90.27 362.22,90.50 361.09,90.72 359.96,90.95 361.32,91.40 358.84,90.95 356.36,90.50 354.56,91.40 355.01,92.30 355.46,93.20 363.79,95.68 357.49,95.45 351.19,95.23 353.21,96.35 354.56,97.25 355.91,98.15 356.59,99.06 357.26,99.28 357.94,99.51 359.06,102.21 359.06,102.21 359.06,102.21 360.86,101.99 359.74,103.56 358.61,105.14 360.19,105.59 359.06,107.62 357.94,109.65 357.94,108.29 357.04,108.74 356.14,109.19 354.79,110.77 352.31,109.42 349.84,108.07 348.04,107.39 345.11,107.17 342.18,106.94 344.21,106.49 342.18,108.07 340.16,109.65 339.71,111.45 339.93,113.47 340.16,115.50 340.38,118.21 339.71,119.56 339.03,120.91 339.03,122.26 339.48,124.29 339.93,126.32 341.28,127.22 341.28,127.22 341.28,127.22 344.44,127.67 345.11,127.89 345.79,128.12 347.14,127.44 348.94,128.57 350.74,129.70 352.54,130.15 353.66,128.79 354.79,127.44 359.29,125.87 360.64,124.51 361.99,123.16 362.89,122.71 362.22,121.36 361.54,120.01 363.57,116.63 364.69,115.95 365.82,115.28 368.29,114.60 368.29,114.60 368.29,114.60 370.99,110.55 370.99,110.55 370.99,110.55 373.24,108.07 374.37,108.29 375.49,108.52 381.79,110.77 381.35,107.85 380.90,104.92 381.80,104.02 382.47,105.14 383.14,106.27 384.95,105.82 384.95,105.82 384.95,105.82 385.85,105.37 386.52,106.04 387.20,106.72 388.10,109.65 389.45,110.32 390.80,111.00 391.92,111.67 392.82,112.12 393.72,112.58 394.62,112.12 396.42,113.70 398.22,115.28 400.03,116.18 400.25,116.86 400.48,117.53 402.05,119.11 402.05,119.11 402.05,119.11 403.63,119.56 403.18,120.46 402.73,121.36 400.48,124.07 399.35,124.51 398.22,124.97 395.30,124.06 396.42,124.97 397.55,125.87 399.13,126.99 399.80,126.32 400.48,125.64 404.75,121.14 404.75,121.14 404.75,121.14 404.53,121.36 404.75,120.01 404.98,118.66 404.75,117.08 405.88,117.76 407.00,118.43 407.68,119.33 408.13,118.43 408.58,117.53 409.03,117.98 407.90,117.31 406.78,116.63 404.08,112.80 402.72,112.58 401.37,112.35 398.00,110.10 398.00,110.10 398.00,110.10 397.32,109.42 395.75,107.62 394.17,105.82 393.72,106.27 393.27,104.69 392.82,103.11 391.47,101.09 393.95,101.54 396.42,101.99 398.00,103.56 400.25,104.91 402.50,106.27 402.05,106.72 404.07,108.07 406.10,109.42 406.33,110.77 407.90,110.55 409.48,110.32 411.28,111.45 411.28,113.48 411.28,115.50 411.73,117.76 412.18,118.21 412.63,118.66 413.98,119.56 414.43,120.46 414.88,121.36 415.78,123.61 416.45,124.51 417.13,125.42 417.80,126.09 418.48,127.22 419.15,128.35 419.38,126.99 420.05,127.44 420.73,127.89 421.63,127.67 421.63,126.77 421.63,125.87 421.85,124.29 421.85,124.29 421.85,124.29 425.00,123.39 424.10,122.94 423.20,122.49 420.50,119.78 420.73,118.88 420.95,117.98 420.73,116.18 421.85,116.41 422.98,116.63 424.10,118.66 426.58,116.86 429.05,115.05 431.98,114.15 431.08,116.86 430.18,119.56 431.31,120.01 431.08,122.94 430.86,125.87 431.98,124.97 433.56,126.54 435.13,128.12 436.26,128.35 437.38,128.80 438.51,129.25 440.31,129.02 442.11,129.25 443.91,129.47 445.04,128.57 446.61,129.02 448.18,129.47 451.79,128.80 452.46,129.25 453.14,129.70 455.84,128.35 456.06,129.92 456.29,131.50 457.19,129.70 456.51,133.30 455.84,136.91 454.94,139.38 454.94,139.38 452.46,144.12 451.56,145.24 450.44,145.47 449.31,145.69 448.64,146.37 446.61,146.14 444.59,145.92 442.11,146.14 439.18,145.47 436.26,144.79 430.86,146.14 428.61,144.79 426.36,143.44 423.21,144.57 421.85,142.99 420.50,141.41 418.25,141.64 417.35,140.74 416.45,139.84 416.00,137.36 416.00,140.96 416.00,144.57 413.98,144.79 413.53,146.59 413.08,148.40 414.20,147.50 411.73,147.27 409.25,147.04 408.58,148.40 404.97,145.69 401.37,142.99 399.57,142.99 397.77,141.86 395.97,140.74 394.17,143.89 392.37,140.29 390.57,136.68 388.10,139.61 387.87,136.68 387.65,133.75 387.87,133.98 388.10,132.18 388.32,130.37 390.80,128.80 389.67,128.12 388.55,127.45 389.45,126.32 387.87,127.00 386.29,127.67 384.04,127.90 382.24,128.57 380.44,129.25 386.29,128.57 377.52,129.25 368.74,129.92 366.26,130.83 366.26,130.83 366.26,130.83 365.59,130.38 364.46,131.28 363.34,132.18 361.76,133.53 360.19,132.85 358.61,132.18 357.71,132.40 356.36,132.63 355.01,132.85 354.11,131.50 352.54,132.63 350.96,133.75 349.16,134.20 348.48,133.75 347.78,133.29 346.65,131.49 346.65,131.49 346.65,131.49 346.68,131.50 346.68,131.50 Z";

	globeMain = paper.path(globeString);

	globeMain.attr({
		"fill": "Grey",
		"stroke-width": 5,
		"stroke": "white",
		"opacity": 0,
	});

	var hitGlobeText = paper.text(pWidth/4*3.6, pHeight/10, `Globe clicked: ${globeNumClicks} / 12 times`).attr({
	"font-size": 15, 
	"fill": "#FFFFFF"
	});

	hitGlobeText.hide();

	globeMain.node.addEventListener("mousedown", function(ev){
	    globeMouseState = "down";
    });

    globeMain.node.addEventListener("mouseup", function(ev){
	    globeMouseState = "up";
    });

	globeMain.node.addEventListener("click", function myFunction(ev){
	    globeNumClicks++;
	    console.log(globeMain.color);
	   	globeMain.attr({"fill": globeColourArray[Math.floor(map(Math.random(),0,1,0,numGlobeColourArray))], "stroke": globeColourArray[Math.floor(map(Math.random(),0,1,0,numGlobeColourArray))]});
	    hitGlobeText.show();
	    hitAudio[1].pause();
    	hitAudio[1].currentTime = 0;
    	hitAudio[1].play();
	   	if (globeNumClicks < 11){
	   		hitGlobeText.attr({"text": `Globe clicked: ${globeNumClicks} / 12 times`});
	   		hitGlobeText.attr({"opacity":1});
			hitGlobeText.animate({opacity:0}, 3000);
	    };
	   	if (globeNumClicks === 11){
	   		hitGlobeText.attr({"text": `Globe clicked: ${globeNumClicks} / 12 times`});
	   		hitGlobeText.attr({"opacity":1});
			hitGlobeText.animate({opacity:0}, 3000);
	    };
	    if (globeNumClicks >= maxGlobeClicks){
	    	hitGlobeText.attr({"text": `We have talked about prior art, territoriality, the public domain, the typical duration of patent protection,\nand that computer programs are helpful in the international patent search process.\n \nComputer programs also impose challenges when determining the patentability of inventions, \nand particularly, the patentability of computer programs.\n \nHowever, we have only talked about "novelty", one of the three criteria for patentability.\n \nLet's go through the portal and check out what the other two are!`});
	    	hitGlobeText.attr({"opacity":0, "x": pWidth/2, "y": pHeight/2, "font-size": 20});
	    	hitGlobeText.animate({"opacity":1}, 3000);
	    	commentary.innerHTML = `[${new Date().toLocaleTimeString()}] <b>The Talking Lemon</b>: Patents are territorially limited. To protect your invention in multiple countries (after a local patent application), you <b>generally</b> have a window of 12 months before an invention is no longer available in multiple countries... sobs.<br>Source:<a href='https://www.wipo.int/export/sites/www/pct/en/basic_facts/faqs_about_the_pct.pdf' 'target= '_blank'><span class='underline'>Patent Coorperation Treaty</span></a></span>
	    		    		<hr>This webpage is powered by HTML5, CSS, and purely by the Javascript library, Raphaël.<br><br>All audio and SVG line paths are extracted from works that are in the public domain (sources: freesound.org and freesvg.org). The image files used are created by yours truly.<br><br> © 2021, <a href='https://www.linkedin.com/in/lenon-ong/' target= '_blank'><span class='underline'>Lenon Ong</span></a><br><a href='https://creativecommons.org/licenses/by/3.0/' target= '_blank'><span class='underline'>Available under the Creative Commons Attribution 3.0 Unported License.</span></a><hr>`;
        	hitAudio[6].pause();
        	hitAudio[6].currentTime = 0;
        	hitAudio[6].play();
        	startAudio.pause();
        	finalAudio.pause();
        	finalAudio.currentTime = 0;
        	finalAudio.play();
        	finalAudio.loop = true;
	    	globeMain.animate({"opacity": 0}, 1500, function(ev){this.remove()}); 
	    	globeMain.node.removeEventListener("click", myFunction);
		    globeMain.node.style.cursor="pointer";
		    game03State = "false";
		    
		    //creating the door

		    var theDoorWidth = pWidth/20;
		    var theDoorHeight = pHeight/5;
		    var theDoorCoordinateX = pWidth/2-theDoorWidth/2;
		    var theDoorCoordinateY = pHeight-theDoorHeight;
		    var theDoor = paper.rect(theDoorCoordinateX, theDoorCoordinateY, theDoorWidth, theDoorHeight, 5).attr({
		    	"fill": "#dcddd9",
		    	"stroke-width": 0
		    });

		    let theDoorBlueConvertor = function(loop){
				theDoor.animate({
					"fill" : "#15f4ee"
				}, 1500, theDoorWhiteConvertor);
			};

			let theDoorWhiteConvertor = function(loop){
				theDoor.animate({
					"fill" : "#dcddd9"
				}, 1500, theDoorBlueConvertor);
			};


			theDoor.node.addEventListener("click", function myFunction(ev){
				theDoor.node.removeEventListener("click", myFunction);
				theDoor.node.style.cursor="pointer";
				game03State = "false";
				game04State = "true";
				theDoorGlowFluorescentBlue.animate({
					"opacity": 0
				}, 3000, function(ev){this.remove()});
				theDoor.animate({
					"width": 20,
					"opacity": 0
				}, 3000, function(ev){this.remove()});
				bgRect.animate({
					"fill": "white"
				}, 3000);
				hitGlobeText.animate({"opacity":0}, 3000, function(ev){this.remove()});
				var chapterHeader = paper.text(pWidth/2, pHeight/2, "Act V: The Inventive Step.").attr({"font-size": 20, "fill": "#000000", "opacity": 0}).animate({"y": pHeight/10, "opacity": 1},7000, function(ev){this.animate({"opacity":0},2000, function(ev){this.remove()})});
				commentary.innerHTML = `[${new Date().toLocaleTimeString()}] <b>The Talking Lemon</b>: This is the endgame. We are now in the <i>internal dimension</i> of a patent, and this is the manifestation of the patent's core. <i>Fancy.</i> You can learn more about the principles of "inventive step" and "industrial application" here. <br><br><br> Y'know, this is inspired by the internal dimension where Naruto talks to the Nine Tailed Fox:<br>Source:<a href='https://www.youtube.com/watch?v=vWwVkkzruFM' target= '_blank'><span class='underline'>YouTube - "Naruto Meets Kyuubi First Time"</span></a>
					    		<hr>This webpage is powered by HTML5, CSS, and purely by the Javascript library, Raphaël.<br><br>All audio and SVG line paths are extracted from works that are in the public domain (sources: freesound.org and freesvg.org). The image files used are created by yours truly.<br><br> © 2021, <a href='https://www.linkedin.com/in/lenon-ong/' target= '_blank'><span class='underline'>Lenon Ong</span></a><br><a href='https://creativecommons.org/licenses/by/3.0/' target= '_blank'><span class='underline'>Available under the Creative Commons Attribution 3.0 Unported License.</span></a><hr>`;
				hitAudio[4].pause();
        		hitAudio[4].currentTime = 0;
        		hitAudio[4].play();
				startGame04();
			});

		    theDoor.node.addEventListener("mousemove", function(ev){
		    	theDoor.node.style.cursor="pointer";
		    });   
		    
			theDoorBlueConvertor(theDoorBlueConvertor);

		    //creating the door glow

		    var theDoorGlowFluorescentBlue = theDoor.glow({ 'width': 20, 'fill': true, 'opacity': 0.8, 'color': '#15f4ee'});
		    let theDoorGlowZoffanyGlacierGreyConvertor = function(loop){
				theDoorGlowFluorescentBlue.animate({
					"color" : "#dcddd9",
					"width": 300
				}, 1500, theDoorGlowFluorescentBlueConvertor);
			};

			let theDoorGlowFluorescentBlueConvertor = function(loop){
				theDoorGlowFluorescentBlue.animate({
					"color" : "#15f4ee",
					"width": 20
				}, 1500, theDoorGlowZoffanyGlacierGreyConvertor);
			};


			theDoorGlowZoffanyGlacierGreyConvertor(theDoorGlowZoffanyGlacierGreyConvertor);
	    };

    });

  	globeMain.node.addEventListener("mousemove", function(ev){
    	globeMain.node.style.cursor="pointer";
    	if (globeMouseState === "down"){
	    	globeMain.attr({"stroke": globeColourArray[Math.floor(map(Math.random(),0,1,0,9))]});
	    };
    });    

  	globeMain.animate({opacity: 1}, 2000);
    };

//GAME 03: animation on territoriality, patent search, and computer program.

////*******************

//set the new elements

//create the CPU texts
numCPUTextList = [];
var numCPUText = 10;
counter = 0;
let createCPUText = function(){
	counter = 0;
	while(counter<numCPUText){
		numCPUTextList[counter] = paper.text(map(Math.random(),0,1,0,pWidth), map(Math.random(),0,1,0,pHeight), `${Math.random().toString(2).substring(6)}`).attr({
			"font-size": 20, 
			"fill": '#008000',
			'opacity': 0,
			'text-anchor': 'start',
		});
		numCPUTextList[counter].hide();
		counter++;
	};
};

let deleteCPUText = function(){
	counter = 0;
	while(counter<numCPUText){
		numCPUTextList[counter].hide();
		counter++;
	};
};

createCPUText();

let startGame03 = function(){
	counter = 0;
	if(game03State==="true"){
		while(counter<numCPUText){
			numCPUTextList[counter].show();
			numCPUTextList[counter].animate({"opacity": 1}, 1500, function(ev){this.animate({"opacity": 0}, 1800, function(ev){this.remove()})});
			createCPUText();
			counter++;
		};
	};

	if(game03State==="false"){
		console.log("game04State = true");
		game04State="true";
		clearInterval(timer03);
	};
};




////*******************

//GAME 04: 

////*******************


let startGame04 = function(){
			
				//creating all the variables for Game 04    
	var orbsArray = [];
	var target1Y = [];
	var target2Y = [];
	var target3Y = [];
	let numOrbs = 18;
	var orbsCounter = 0;
	var newOrbsObj = {};
	var newOrbsArray = [];
	var orbsCleared = 0;
	let avatarClicked = 0;
	let numBubbles = 10;
	var newBubbles = [];
	let playerAvatarRadius = 15;
	var bubbleTimeLapsed = "";
	var finalStageCleared = 0;

				//prompt text

	var mouseText2 = paper.text(pWidth/2, pHeight/4*3, "Click on the floating core to begin.").attr({"font-size": 15, "fill": "#000000", "font-family": "Arial", "opacity": 0});
	mouseText2.animate({opacity: 1}, 5000);

			    //creating the "egg"
    var theEgg = paper.circle(bulletSpotX/3,bulletSpotY/3*2,20).attr({
    		"fill": "r(.3,.25) #ffe9e8-" + "pink",
		    "stroke-width":0,
		    "stroke": "#FFF",
		    "opacity": 0
		});
    theEgg.hide();
    theEgg.animate({"opacity": 1}, 3500, function(ev){this.show();});

    theEgg.node.addEventListener("click", function myFunction(ev){
		theEgg.node.removeEventListener("click", myFunction);
		theEgg.node.style.cursor="pointer";
		commentary.innerHTML = `[${new Date().toLocaleTimeString()}] <b>The Talking Lemon</b>: That flash of darkness... and we are now within a body of water. Are those impurities? Ahhh! Clear away the black orbs with the floating slice of lemon!<b> The slice of lemon can only be controlled vertically upwards</b>; after all, to stand head and shoulders above the rest, the invention has to be non-obvious (or, an inventive step "<i>upwards</i>"...). You might be able to move faster by rebounding from the bottom, or the top. <br><br>Try using the ↑ arrow button on your keyboard as an alternative to the mouse click.
			    		<hr>This webpage is powered by HTML5, CSS, and purely by the Javascript library, Raphaël.<br><br>All audio and SVG line paths are extracted from works that are in the public domain (sources: freesound.org and freesvg.org). The image files used are created by yours truly.<br><br> © 2021, <a href='https://www.linkedin.com/in/lenon-ong/' target= '_blank'><span class='underline'>Lenon Ong</span></a><br><a href='https://creativecommons.org/licenses/by/3.0/' target= '_blank'><span class='underline'>Available under the Creative Commons Attribution 3.0 Unported License.</span></a><hr>`;
		hitAudio[3].pause();
        hitAudio[3].currentTime = 0;
        hitAudio[3].play();
		console.log("egg clicked");
		cursorTarget2_2.attr({"opacity": 0});
		cursorTarget2_3.attr({"opacity": 0});
		overlay.node.addEventListener("click", function(ev){
			cursorInitialRipple.attr({
		        "cx": state.x,
		        "cy": state.y
		    });
		    console.log("overlay clicked");
		    playerAvatar.speedX *= 1.05;
			playerAvatar.speedY += -10;
			avatarClicked++;
    		hitAudio[5].pause();
        	hitAudio[5].currentTime = 0;
        	hitAudio[5].play();
		    cursorInitialRipple.show();
			cursorRippleAnimation();
		});
		var bubbleSpawnTime = Date.now();
		var bubbleTimeLapsed = paper.text(pWidth/10, pHeight/10, `${Date.now()-bubbleSpawnTime}`).attr({"font-size": 20, "fill": "#000000", "opacity": 0});
		
						//creating the orbs

		while (orbsCounter<numOrbs){
			//target1Y[orbsCounter] = map(Math.random(),0,1,0.2,1)*column1Coord.y/1.5;
			orbsArray[orbsCounter] = paper.circle(map(Math.random(),0,1,playerAvatarRadius,pWidth-playerAvatarRadius),map(Math.random(),0,1,pHeight/3,pHeight-playerAvatarRadius),map(Math.random(),0,1,20,25)).attr({
			    		"fill": "r(.3,.25) #ffe9e8-" + "black",
					    "stroke-width":0,
					    "opacity":0
					});
			orbsArray[orbsCounter].animate({"opacity": 1}, 5000);
			var orbsValuesArray = Object.values(orbsArray[orbsCounter]);
			newOrbsObj = {
				"x": orbsValuesArray[6].cx,
				"y": orbsValuesArray[6].cy,
				"r": orbsValuesArray[6].r
			};
			newOrbsArray.push(newOrbsObj);
			orbsCounter++;
		};

		var overlay2 = paper.rect(0,0,pWidth,pHeight).attr({
		    "fill":"#FFFFFF",
		    "stroke-width": 0, 
		    "fill-opacity": 1}
		    );
		overlay2.node.addEventListener("click", function(ev){
			/*cursorInitialRipple.attr({
		        "cx": state.x,
		        "cy": state.y
		    });*/
		    console.log("overlay clicked");
		    playerAvatar.speedX *= 1.05;
			playerAvatar.speedY += -5;
			avatarClicked++;
    		hitAudio[5].pause();
        	hitAudio[5].currentTime = 0;
        	hitAudio[5].play();
		    //cursorInitialRipple.show();
			//cursorRippleAnimation();
		});
		overlay2.animate({opacity: 0}, 3000, function(ev){this.remove();});
		mouseText2.remove();
		var mouseText3 = paper.text(pWidth/2, pHeight/4*3, `Click anywhere or use the "up" arrow key on a keyboard to give the slice of lemon a little vertical boost!\n \nClear away all the black orbs by touching them with the slice of lemon!`).attr({"font-size": 15, "fill": "#000000", "font-family": "Arial", "opacity": 1});
		mouseText3.animate({opacity: 0}, 7000, function(ev){this.remove();});
		var scoreTextStage4 = paper.text(pWidth/4*3.6, pHeight/10, `Black orbs cleared: ${orbsCleared} / 18`).attr({"font-size": 15, "fill": "#000000", "font-family": "Arial", "opacity": 0});
		scoreTextStage4.animate({opacity: 1}, 1000);
		eggSqueezed++;
		bgRect.animate({
			"fill": "90-#9cfbff:5-#FFFFFF:100"
		}, 1000);

		if (eggSqueezed===1){
		theEgg.animate({"cx": bulletSpotX/4, "cy": bulletSpotY/4*2, "fill": "white", "r":0.1, "opacity":0.1}, 2000, function(ev){this.remove();});
			};

		var playerAvatar = paper.circle(bulletSpotX/3,bulletSpotY/3*2,playerAvatarRadius).attr({
    		"fill": "url('resources/just_lemon5.png')",
		    "stroke-width":0,
		});





	//bubbles code
	let createBubbles = function(){			

		var bubblesInitialPosition = {
			"x": map(Math.random(),0,1,0,pWidth),
			"y": pHeight + 25
		};
		var bubblesCounter = 0;
		while (bubblesCounter < numBubbles) {
				newBubbles[bubblesCounter] = paper.circle(bubblesInitialPosition.x,bubblesInitialPosition.y,map(Math.random(),0,1,5,20)).attr({
		    		"fill": "r(.3,.25) #b5fcff-" + "#e8feff",
				    "stroke-width":0,
				});

				if (orbsCleared >= numOrbs){
					newBubbles[bubblesCounter].attr({"fill": "r(.3,.25) #bd3000-" + "#e8feff"});
				};
				

				newBubbles[bubblesCounter].animate({"cx": map(Math.random(),0,1,-20,pWidth), "cy": -25}, map(Math.random(),0,1,10000,20000));
				bubblesCounter++;
		};
	};

		//4. Map "Up" key to button

		// Execute a function when the user releases a key on the keyboard
		window.addEventListener("keyup", function(event) {
		  // Number 32 is the "Spacebar" key on the keyboard
		  if (event.keyCode === 38) {
		    // Cancel the default action, if needed
		    event.preventDefault();
			var playerAvatarObj = {
				"x": playerAvatar.attr("cx"),
				"y": playerAvatar.attr("cy")
			};
			playerAvatar.speedX *= 1.05;
			playerAvatar.speedY += -5;
			avatarClicked++;
			hitAudio[5].pause();
        	hitAudio[5].currentTime = 0;
        	hitAudio[5].play();
		  };
		});


		playerAvatar.speedX = 2;
		playerAvatar.speedY = 0;
		playerAvatar.gravity = 0.1;
		playerAvatar.drag = 0.95;
		playerAvatar.gravitySpeed = 0;
		playerAvatar.posx = bulletSpotX/3;
		playerAvatar.posy = bulletSpotY/3*2;

		let updateMap = function() {
			//bubbleTimeLapsed.attr({text: `${(Math.round((Date.now()-bubbleSpawnTime))/1000).toFixed(2)}`});
			scoreTextStage4.attr({text: `Black orbs cleared: ${orbsCleared} / 18`});
			playerAvatar.toFront();
			playerAvatar.gravitySpeed += playerAvatar.gravity;
			playerAvatar.posx += playerAvatar.speedX;
			playerAvatar.posy += playerAvatar.speedY + playerAvatar.gravitySpeed;
			playerAvatar.posy *= playerAvatar.drag;

			/*let clashInitialRipple = paper.circle(-100,-100,40).attr({
			    "stroke-width":2,
			    "stroke": "yellow"
			});
			let clashRippleAnimation = function(){
				clashInitialRipple.show();
				clashInitialRipple.animate({
					"r": 400,
					"opacity": 0
				}, 2000);
			};*/
			if(playerAvatar.posy >= pHeight-15){
				playerAvatar.posy = pHeight-15;
				playerAvatar.gravitySpeed = 0;
				playerAvatar.speedY = -3;
				/*clashInitialRipple.attr({
	            	"cx": playerAvatar.posx,
	            	"cy": playerAvatar.posy
	            });*/
	            //clashRippleAnimation();
    			hitAudio[5].pause();
        		hitAudio[5].currentTime = 0;
        		hitAudio[5].play();
			};
			if(playerAvatar.posx >= pWidth-15){
				playerAvatar.posx = pWidth-15;
				playerAvatar.speedX = -2;
				/*clashInitialRipple.attr({
	            	"cx": playerAvatar.posx,
	            	"cy": playerAvatar.posy
	            });*/
	            //clashRippleAnimation();	
    			hitAudio[5].pause();
        		hitAudio[5].currentTime = 0;
        		hitAudio[5].play();
			};
			if(playerAvatar.posx <= 15){
				playerAvatar.posx = 15;
				playerAvatar.speedX = 2;
				/*clashInitialRipple.attr({
	            	"cx": playerAvatar.posx,
	            	"cy": playerAvatar.posy
	            });*/
	            //clashRippleAnimation();	
    			hitAudio[5].pause();
        		hitAudio[5].currentTime = 0;
        		hitAudio[5].play();
			};

			if(playerAvatar.posy <= 15){
				playerAvatar.posy = 15;
				playerAvatar.speedY += 10;
				/*clashInitialRipple.attr({
	            	"cx": playerAvatar.posx,
	            	"cy": playerAvatar.posy
	            });*/
	            //clashRippleAnimation();	
    			hitAudio[5].pause();
        		hitAudio[5].currentTime = 0;
        		hitAudio[5].play();
			};
			playerAvatar.attr({
				"cx": playerAvatar.posx,
				"cy": playerAvatar.posy
			});
			//console.log(orbsCleared);
        	if (orbsCleared === numOrbs){
        		clearInterval(game04Inverval);
        		bubbleTotalTime = Math.round((Date.now()-bubbleSpawnTime)).toFixed(2)/1000;
        		bubbleTimeLapsed.attr({"opacity": 1});
        		bubbleTimeLapsed.attr({"text": `You took ${Math.round((Date.now()-bubbleSpawnTime)).toFixed(2)/1000} seconds.`});
        		bubbleTimeLapsed.animate({"x": pWidth/5, "opacity": 0}, 5000, function(ev){this.remove()});
        		scoreTextStage4.animate({"opacity": 0}, 5000, function(ev){this.remove()});
	        	var playerAvatarObj = {
					"stroke": "red",
					"stroke-width": 5,
					"fill": "r(.3,.25) red-" + "black"
				};
				gamesEndTime = Date.now(); // (in miliseconds since 1970)
				let theAvatarEnlarger = function(loop){
					playerAvatar.animate({
						"r" : 500
					}, 5000, theAvatarSqueezer);
				};

				let theAvatarSqueezer = function(loop){
					playerAvatar.animate({
						"r" : 1
					}, 5000, theAvatarEnlarger);
				};
			    theAvatarEnlarger(theAvatarEnlarger);
			    bgRect.attr({
					"fill": "90-#bd3000:5-#FFFFFF:100"
				});
        		oneLastThing();
        	};

			let bubblePop = function(b1, b2){
				bz = {
			        "x" : b1.posx,
			        "y" : b1.posy,
			    };

			    var d = [];
    			var orbsCounter = 0;

				while (orbsCounter<numOrbs){
					b2[orbsCounter] = {
				        "x" : b2[orbsCounter].x,
				        "y" : b2[orbsCounter].y,
				       	"r" : b2[orbsCounter].r,
				    };
				    d[orbsCounter] = distance(bz,b2[orbsCounter]);
					if (d[orbsCounter] < playerAvatarRadius + b2[orbsCounter].r){
				        orbsArray[orbsCounter].animate({"r":0, "opacity": 0.5}, 0.000001, function(){
				        	this.remove(); 
				        	orbsCleared++;
							hitAudio[0].pause();
			        		hitAudio[0].currentTime = 0;
			        		hitAudio[0].play();
							let clashInitialRipple = paper.circle(-100,-100,40).attr({
							    "stroke-width":2,
							    "stroke": "yellow"
							});
							let clashRippleAnimation = function(){
								clashInitialRipple.show();
								clashInitialRipple.animate({
									"r": 400,
									"opacity": 0
								}, 2000);
							};
				            clashInitialRipple.attr({
				            	"cx": b1.posx,
				            	"cy": b1.posy
				            });
				            clashRippleAnimation();
				        });
				    };

					orbsCounter++;
				};

			};

			bubblePop(playerAvatar, newOrbsArray);
 			
		};

		// animate
		let game04Inverval = setInterval(updateMap, 30);
		let createBubblesInverval = setInterval(createBubbles, 15000);

	});

    theEgg.node.addEventListener("mousemove", function(ev){
    	theEgg.node.style.cursor="pointer";
    });   

    let theEggEnlarger = function(loop){
		theEgg.animate({
			"r" : 30
		}, 1500, theEggSqueezer);
	};

	let theEggSqueezer = function(loop){
		theEgg.animate({
			"r" : 20
		}, 1500, theEggEnlarger);
	};

	var eggSqueezed = 0;
	if (eggSqueezed	=== 0){
    		theEggEnlarger(theEggEnlarger);
		};
};


//gravity function. source: https://www.w3schools.com/graphics/game_gravity.asp
//because I want to stimulate a floating environment, gravity will be weak while acceleration will be high (for later on)

			////*******************

			//Ending website formation / information / replay / options for hard mode.

			////*******************

let oneLastThing = function(){
    commentary.innerHTML = `[${new Date().toLocaleTimeString()}] <b>The Talking Lemon</b>: The patent example here is [CN101796992A] Manufacturing Process of Lemon Tea: <a href='https://patents.google.com/patent/CN101796992A/en' target= '_blank'><span class='underline'>Google Patents</span></a>
    <br><br>You might have realised that you were unable to interact with any of the rising, floating bubbles in the background: it is an easy way to remember that natural phenomena, products of nature, laws of nature, and mathematical formulas, are not patentable. (Well, I attribute bubbles to mathematical formulas as well since they defy gravity: there're various mathematical models behind this phenomenon!)<br><br>If there are useful applications of such findings to a product or process, that application might just be patentable! <br><br>For example, you cannot apply for a patent protection for water itself (even as we assume that you travelled back in time and discovered the fact that a water molecule has two hydrogen atoms covalently bonded to a single oxygen atom). However, if you invented an an efficient process to turn rainwater into drinkable water <i>which tastes like iced lemon tea</i>, that would be another story altogether (and an AWESOME one!!)<br><br>
    If you were wondering what the number 18 represents this time: patent documents are published by national and regional patent offices, usually 18 months after the date on which a patent application was first filed or once a patent has been granted for the invention claimed by the patent application. Once published, the patent document will form part of the "prior art" and lose its "novelty" status (remember the bouncing discs you had to clear through?). The rationale is to allow the public benefit from your patented invention, while the patent owner enjoys a time-limited monopoly with the patented invention.<br><br>Well, it was fun having you here with me today. You have spent your ${Math.floor((gamesEndTime-pageLoadTime)/1000/60)+1} precious minutes with me. <br><br>Thank you, and have a nice day! Ciao! 
    <br><br><br> The physics of Act V is inspired by the gravity and drag logic of MapleStory's Aqua Road:<br>Source:<a href='https://youtu.be/SxFGmwu3YOw' target= '_blank'><span class='underline'>YouTube - "Maplestory Exploring Aqua Road Aquarium Pt 1 | Maplestory Nostalgia"</span></a>
	<hr>      <input class="styled"
       type="button" onClick="window.location.href=window.location.href"
       value="Play Again">
              		<br><br>If you enjoyed Act V and want to experience it again:<br><br><input class="styled"
       type="button" onClick=window.open("https://lenon-ong.github.io/The-Floating-Lemon-Slice-Game/")
       value="Enter Act 0">  

<hr>This webpage is powered by HTML5, CSS, and purely by the Javascript library, Raphaël.<br><br>All audio and SVG line paths are extracted from works that are in the public domain (sources: freesound.org and freesvg.org). 
The image files used are created by yours truly.
<br><br> © 2021, <a href='https://www.linkedin.com/in/lenon-ong/' target= '_blank'><span class='underline'>Lenon Ong</span></a><br><a href='https://creativecommons.org/licenses/by/3.0/' target= '_blank'><span class='underline'>Available under the Creative Commons Attribution 3.0 Unported License.</span></a><hr>`;
    hitAudio[3].pause();
    hitAudio[3].currentTime = 0;
    hitAudio[3].play();
	var overlay3 = paper.rect(0,0,pWidth,pHeight).attr({
    "fill":"#FFFFFF", 
    "fill-opacity": 0.5}
    );
	var finalText = paper.text(pWidth/2, pHeight/2, "x").attr({
	"font-size": 20, 
	"fill": "#000000",
	"opacity": 0
	});
	var chapterHeader = paper.text(pWidth/2, pHeight/2, "Epilogue: Lemons, Water, Iced Lemon Tea, and Industrial Application.").attr({"font-size": 25, "fill": "#000000", "opacity": 0}).animate({"y": pHeight/10, "opacity": 1},7000);
	var evaluateTime = Math.floor((snekTotalTime+bubbleTotalTime+scopeTotalTime));
	if ((snekTotalTime+bubbleTotalTime) < 100){
		    finalText.attr({"text": `You have witnessed the birth of a patent's core.\n \nThe one thing to take away today would be the set of 3 requirements for patentability: \n(1) Novelty, \n(2) inventive step, and \n(3) industrial application.\n \n
		    	You took a total of ${scopeTotalTime} + ${snekTotalTime} + ${bubbleTotalTime} seconds \nto clear the timed Act I, Act III, and Act V respectively.\n That is a total of about ${evaluateTime} seconds! I give that an "A+"!\n \nScroll down for the final commentary!`});
		    finalText.animate({"opacity":1}, 3000);
	}else{
		    finalText.attr({"text": `You have witnessed the birth of a patent's core.\n \nThe one thing to take away today would be the set of 3 requirements for patentability: \n(1) Novelty, \n(2) inventive step, and \n(3) industrial application.\n \n
		    	You took a total of ${scopeTotalTime} + ${snekTotalTime} + ${bubbleTotalTime} seconds \nto clear the timed Act I, Act III, and Act V respectively.\n That is a total of about ${evaluateTime} seconds! I give that an "A"!\n \nScroll down for the final commentary!`});
			finalText.animate({"opacity":1}, 3000);
	};
};			
