const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', {willReadFrequently: true});
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
const center = {x:canvas.width / 2, y: canvas.height / 2};

let spX, spY, cp1X, cp2X, cpY, epX, epY, r, dy, dx;
r = 20;
spX = center.x;
spY = 0;
epX = center.x + 2 * r
epY = 0;
cp1X = spX 
cp2X = epX; 
dy = 0;
dx = 0;
cpY = r
let req;
let isColliding = false;
let isDripping = false;


function drawWater(){
    console.log('draw');
    ctx.save()
    ctx.beginPath();
    ctx.fillStyle = 'rgba(116, 204, 244, 0.2)';
    ctx.moveTo(spX, spY);
    ctx.bezierCurveTo(cp1X, cpY, cp2X, cpY, epX, epY); // ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    ctx.fill();
    ctx.restore();
}
function updateWater(){
    if(dy <= 1.5){
        console.log(`cp1X: ${cp1X} cpY: ${cpY} cp2X: ${cp2X} cpY:${cpY} epX: ${epX} epY:${epY}`)
        console.log('1 update');
        dy += 0.1;
        cpY = r * dy;
    }else if(dy < 3){
        console.log('2 update');
        dx += 0.3;
        dy += 0.1;
        spX += dx; 
        epX -= dx; 
        cp1X -= dx * 3.5;
        cp2X += dx * 3.5; 
        cpY = r * dy;
    }
    else {
        console.log('3 update')
        spX = center.x;
        spY = 0;
        epX = center.x + 2 * r
        epY = 0;
        cp1X = spX 
        cp2X = epX; 
        dy = 0;
        dx = 0;
        cpY = r
        console.log(`cp1X: ${cp1X} cpY: ${cpY} cp2X: ${cp2X} cpY:${cpY} epX: ${epX} epY:${epY}`)
       isDripping = true;
       return;
    }
}


function drawColliding(){
    let pointX = center.x + r;
    let pointY = dy + cpY + r;
    ctx.save()
    ctx.beginPath();
    ctx.fillStyle = 'rgba(116, 204, 244, 0.2)';
    ctx.moveTo(pointX, pointY);
    ctx.bezierCurveTo(cp1X, cpY, cp2X, cpY, epX, epY); // ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    ctx.stroke();
    ctx.fill();
    ctx.restore()
}
let dh = cpY + r;
function drawDroplet(){
    console.log('droplet')
    ctx.beginPath();
    ctx.arc(center.x + r, dh, r, 0, 2 * Math.PI) //x,y,r,sA,eA
    ctx.fillStyle = 'rgba(116, 204, 244, 0.2)';
    ctx.fill();
}
function updateDroplet(){
    dh ++;
    
}

const img = new Image();
let  dr = 0;
let d = 0;
function drawRock(){
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(center.x-50, center.y);
    ctx.lineTo(center.x-100, center.y);
    ctx.lineTo(center.x-100, center.y + 100);
    ctx.lineTo(center.x+100, center.y + 100);
    ctx.lineTo(center.x+100, center.y);
    ctx.lineTo(center.x+50, center.y);
    ctx.bezierCurveTo(center.x-20,center.y-dr + d, center.x+20, center.y-dr + d,center.x-50, center.y);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img,center.x-100,center.y-500,500,1000)
    ctx.restore();
}
function updateRock(){
    if(isColliding && d < 2 * r){
        dr = 2 * r;
        d++
    }
}
const checkColliding = () => {
    return isColliding = center.y - dh < 0 ? true: false;  
}


const loopPage = () => {
    //update, detect, clear, draw
    updateWater();
    isDripping && updateDroplet();
   updateRock();
    //detect
    checkColliding();
    //clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //draw
    !isDripping && drawWater();
    isDripping && !isColliding && drawDroplet();
    drawRock();
    req = requestAnimationFrame(loopPage);
}
img.onload = function(){
    loopPage();
}
 img.src = 'https://cdn.pixabay.com/photo/2016/07/20/00/32/marble-1529415_960_720.jpg'; 

 window.addEventListener('click', () => {
    cancelAnimationFrame(req);
})