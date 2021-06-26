//highscore localstorage
var highScore;
if(localStorage.getItem('highScore')==null){
    highScore = 0;
    
}else{
    highScore = localStorage.getItem('highScore');
}

document.querySelector('#pDetails').innerHTML = highScore;
var runner;
var lane1;
var lane2;
var obstacle1 = [];
var obstacle2 = [];
function startGame(){
    gameArea.start();
    runner = new component(40,40,'white',70,210);
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



//runner motion
//click
console.log(document.querySelector('canvas'));
//use of canvas didn't work
//reason: the element isn't closed(maybe)
document.querySelector('body').addEventListener('click',function(){
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
    console.log(yes1);
    console.log(yes2);
    if(yes1||yes2){
        runner.update();
        gameArea.stop();
        if(count>highScore){
            localStorage.setItem('highScore',count-1);
            document.querySelector('#pDetails').innerHTML = count-1;
            
            //
        }
        document.querySelector('.fa-redo-alt').style.display = 'block';
        document.querySelector('#reset').style.display = 'block';
        gameArea.canvas.style.opacity = 0.4;
        
        
    }
    else{
        
        gameArea.clear();
        
        runner.update();
        
    lane1.update();
    lane2.update();
    
    //give random selection of lane aswell.
    if(gameArea.frameNo%100 == 0){
        decision = Math.floor(Math.random()*2 );
        if(decision==0){
            obstacle2.push(new component(Math.random()*(200)+100,50,'rgba(15, 15, 54, 0.938)',500,0));
        }
        else{
            obstacle1.push(new component(Math.random()*(200)+100,50,'rgba(15, 15, 54, 0.938)',500,250));
        }
    }
    
            
        document.querySelector('#points').innerHTML = count;
    
    
    count +=1;
    
    
    
    for(i = 0;i<obstacle1.length;i++){
        obstacle1[i].x -=10;
        obstacle1[i].update();
    }
    for(i = 0;i<obstacle2.length;i++){
        obstacle2[i].x -=10;
        obstacle2[i].update();
    }
    gameArea.frameNo +=1;
    }
    
}
const playBtn = document.querySelector('#play');
playBtn.addEventListener('click',()=>{
    document.querySelector('canvas').pointerEvents = 'all';
    
    document.querySelector('.intro').style.display = 'none'
    document.querySelector('.game').style.display = 'flex';
    count =1;
    obstacle1 = [];
    obstacle2= [];
    document.querySelector('body').style.cursor = 'pointer';
    startGame();
});
const resetBtn = document.querySelector('#reset');
resetBtn.addEventListener('click',()=>{
    
    document.querySelector('.fa-redo-alt').style.display = 'none';
    document.querySelector('#reset').style.display = 'none';
    
    document.querySelector('.intro').style.display = 'flex';
    document.querySelector('.game').style.display = 'none';
    gameArea.canvas.style.opacity = 1;
    document.querySelector('body').style.cursor = 'auto';
    
});
//work on the reset btn.