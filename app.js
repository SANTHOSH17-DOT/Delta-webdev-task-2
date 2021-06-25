var runner;
var lane1;
var lane2;
var obstacle1 = [];
var obstacle2 = [];
function startGame(){
    gameArea.start();
    runner = new component(40,40,'white',10,210);
    lane1 = new component(500,50,'red',0,250);
    lane2 = new component(500,50,'red',0,0);
}
var gameArea = {
    canvas: document.querySelector('canvas'),
    start: function(){
        this.canvas.width = 500;
        this.canvas.height = 300;
        this.context = this.canvas.getContext('2d');
        this.interval = setInterval(updateGameArea,20);
        this.frameNo = 0;
    },
    clear: function(){
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
    },
    stop: function(){
        clearInterval(this.interval);
    }
}
function component(width,height,color,x,y){
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function(){
        ctx = gameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
    this.hole = function(obs){
        
        var runL = this.x;
        var runR = this.x +(this.width);
        var runT = this.y;
        var runB = this.y + this.height;
        var obsL = obs.x;
        var obsR = obs.x + obs.width;
        var obsB = obs.y + obs.height;
        var obsT = obs.y;
        var crash = true;
        if(obsL>runR||obsR<runL||obsB<runT||obsT>runB){
            crash = false;
        }
        return crash;
    }
}
var score=()=>{
    score = 500-obstacle2.x;
    ctx = gameArea.context;
    ctx.font = '20px Georgia';
    ctx.fillText('Score '+score,450,0);
    ctx.fillStyle = 'white';
}


//runner motion
//click
document.querySelector('canvas').addEventListener('click',function(){
    console.log('s');
    if(runner.y==50){
        runner.y = 210;
    }
    else if(runner.y==210){
        runner.y = 50;
    }
});
//spacebar
window.addEventListener('keypress',(event)=>{
    if(event.keyCode == 32){
        if(runner.y==50){
            runner.y = 210;
        }
        else if(runner.y==210){
            runner.y = 50;
        }
    }
});
var count =1 ;
function updateGameArea(){
    
    yes1 = false;
    for(i = 0;i<obstacle1.length;i++){
        if(runner.hole(obstacle1[i])==true){
            yes1 = true;
            break;
        }
    }
    yes2 = false;
    for(i = 0;i<obstacle2.length;i++){
        if(runner.hole(obstacle2[i])==true){
            yes2 = true;
            break;
        }
    }
    if(yes1||yes2){
        runner.update();
        gameArea.stop();
        console.log('1');
    }
    else{
        
        gameArea.clear();
        
        runner.update();
        if(count>=2){
            
            document.querySelector('#points').innerHTML = 500-obstacle2[0].x;
        
        }
        count +=1;
    lane1.update();
    lane2.update();
    
    if(gameArea.frameNo%300 == 0){
        obstacle2.push(new component(Math.random()*(200)+100,50,'black',500,0));
    }
    else if(gameArea.frameNo%150 == 0){
        obstacle1.push(new component(Math.random()*(200)+100,50,'black',500,250));
    }
    
    for(i = 0;i<obstacle1.length;i++){
        obstacle1[i].x -=3;
        obstacle1[i].update();
    }
    for(i = 0;i<obstacle2.length;i++){
        obstacle2[i].x -=3;
        obstacle2[i].update();
    }
    gameArea.frameNo +=1;
    }
    
}
const playBtn = document.querySelector('#play');
playBtn.addEventListener('click',()=>{
    document.querySelector('canvas').pointerEvents = 'all';
    playBtn.style.display = 'none';
    startGame();
});
