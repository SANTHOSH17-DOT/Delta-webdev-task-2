//highscore localstorage
var highScore;
if (localStorage.getItem('highScore') == null) {
    highScore = 0;

} else {
    highScore = localStorage.getItem('highScore');
}

//powerups tab
const putab = document.querySelector('#powerups');
putab.width = 250;
putab.height = 300;
let ctx = putab.getContext('2d');
ctx.fillStyle = 'rgb(133, 127, 127)';
ctx.fillRect(0, 0, 225, 200);
ctx.fillStyle = 'gold';
ctx.fillRect(15, 25, 30, 30);
ctx.font = '20px Arial';
ctx.fillText('Invincibility', 50, 45);
ctx.font = '15px Arial';
ctx.fillText('Invincible-5sec', 50, 65);

ctx.fillStyle = 'blue';
ctx.fillRect(15, 90, 30, 30);
ctx.font = '20px Arial';
ctx.fillText('Score Booster', 50, 105);
ctx.font = '15px Arial';
ctx.fillText('Boosts score-5sec', 50, 120);

ctx.fillStyle = 'green';
ctx.fillRect(15, 150, 30, 30);
ctx.font = '20px Arial';
ctx.fillText('Speed Reduction', 50, 160);
ctx.font = '15px Arial';
ctx.fillText('Reduces game speed', 50, 175);

document.querySelector('#pDetails').innerHTML = highScore;
var runner;
var lane1;
var lane2;
var obstacle1 = [];
var obstacle2 = [];
var flyingSqd = [];
var spike = [];
var powerups = [];
var rem = 5;
// global powerup variables
var invincibility = 0;
var scorebooster = 0;
var speedReduction = 0;

function startGame() {
    gameArea.start();
    runner = new runComp(90, 320, 0);
    lane1 = new component(800, 50, 'rgba(73, 73, 80, 0.938) ', 0, 350);
    lane2 = new component(800, 50, 'rgba(73, 73, 80, 0.938)', 0, 0);
}
var gameArea = {
        canvas: document.querySelector('#game'),
        start: function() {
            this.canvas.width = 800;
            this.canvas.height = 400;
            this.context = this.canvas.getContext('2d');

            this.interval = setInterval(updateGameArea, 20);
            this.frameNo = -50;
        },
        clear: function() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
        stop: function() {
            clearInterval(this.interval);
        }
    }
    //runner design
function runComp(x, y, ang) {
    this.x = x;
    this.y = y;
    //this.rad = rad;
    this.ang = ang;

    this.update = function() {
        ctx = gameArea.context;
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.ang * Math.PI / 180);
        if (invincibility == 1) {
            ctx.fillStyle = 'gold';
        } else if (scorebooster == 1) {
            ctx.fillStyle = 'blue';

        } else if (speedReduction == 1) {
            ctx.fillStyle = 'green';

        } else {
            ctx.fillStyle = 'white';
        }

        ctx.beginPath();
        ctx.moveTo(0, -30);
        ctx.lineTo(30, 30);
        ctx.lineTo(-30, 30);
        ctx.fill();
        ctx.rotate(this.ang * Math.PI / 180);
        ctx.translate(-this.x, -this.y);

    }

    this.hole = function(obs) {
        var runL = this.x - 30;
        var runR = this.x + 30;
        var runT = this.y - 30;
        var runB = this.y + 30;
        var obsL = obs.x;
        var obsR = obs.x + obs.width;
        var obsB = obs.y + obs.height;
        var obsT = obs.y;
        var crash = true;
        if (obsL > runR || obsR < runL || obsB < runT || obsT > runB) {
            crash = false;
        }
        return crash;
    }
    this.flyS = function(fs) {
        //var runL = this.x-40;
        var crash = false;
        var triPointx = this.x;
        var triPointy = this.y;
        var alpx = fs.x;
        var alpy = fs.y;
        var betax = fs.x + 30;
        var betay = fs.y;
        var gammax = fs.x + 30;
        var gammay = fs.y + 30;
        var deltax = fs.x;
        var deltay = fs.y + 30;

        function dis(x, y) {
            distance = Math.sqrt((triPointx - x) ** 2 + (triPointy - y) ** 2);
            if (distance < 25) {
                return true;
            } else {
                return false;
            }
        }
        //Straight line is not restricted to the runner.(problem)
        if (dis(alpx, alpy) || dis(betax, betay) || dis(gammax, gammay) || dis(deltax, deltay)) {
            crash = true;
        }

        return crash;
    }

    this.spike = function(s) {
        var crash = false;
        var triPointx = this.x;
        var triPointy = this.y;
        var alpx = s.x;
        var alpy = s.y;

        function dis(x, y) {
            distance = Math.sqrt((triPointx - x) ** 2 + (triPointy - y) ** 2);
            if (distance < 45) {
                return true;
            } else {
                return false;
            }
        }
        if (dis(alpx, alpy)) {
            crash = true;
        }
        return crash;
    }

}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.color = color;
    this.update = function() {
        ctx = gameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

function sphere(radius, color, x, y) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.color = color;
    this.update = function() {
        ctx = gameArea.context;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function spikeS(radius, color, x, y) {
    this.radius = radius;
    this.color = color;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = gameArea.context;
        ctx.beginPath();
        ctx.translate(this.x, this.y);
        ctx.strokeStyle = this.color;
        var ang = 0;
        while (ang < 360) {
            ctx.rotate(ang * Math.PI / 180);
            ctx.moveTo(0, 0);
            ctx.lineTo(this.radius, 0);
            ctx.rotate(-ang * Math.PI / 180);
            ang += 10;
        }
        ctx.translate(-this.x, -this.y);
        ctx.stroke();
    }
}



//runner motion
//click


document.querySelector('.game').addEventListener('click', function() {
    if (runner.y <= 80) {

        var intervala = setInterval(() => {

            console.log(runner.ang, runner.y);


            if (runner.y >= 320) {

                clearInterval(intervala);
            } else {
                runner.ang -= 180 / 8;
                runner.y += 30;
            }


        }, 40);


    }
    if (runner.y >= 320) {

        var intervalb = setInterval(() => {

            console.log(runner.ang, runner.y);
            if (runner.y <= 80) {
                clearInterval(intervalb);
            } else {
                runner.ang += 180 / 8;
                runner.y -= 30;
            }



        }, 40);

    }

});
//spacebar
window.addEventListener('keypress', (event) => {
    if (event.keyCode == 32) {
        if (runner.y <= 80) {

            var intervala = setInterval(() => {

                console.log(runner.ang, runner.y);


                if (runner.y >= 320) {

                    clearInterval(intervala);
                } else {
                    runner.ang -= 180 / 8;
                    runner.y += 30;
                }


            }, 40);


        }
        if (runner.y >= 320) {

            var intervalb = setInterval(() => {

                console.log(runner.ang, runner.y);
                if (runner.y <= 80) {
                    clearInterval(intervalb);
                } else {
                    runner.ang += 180 / 8;
                    runner.y -= 30;
                }



            }, 40);

        }
    }
});




var count = 1;
var y = 10;
var fs = 5;
var flyud = 0;
var flyuds = 0;
var obsEntry = 1;
var yes = false;
var s = 0

function updateGameArea() {

    for (i = 0; i < powerups.length; i++) {
        if (runner.hole(powerups[i]) == true) {
            if (powerups[i].color == 'gold') {
                invincibility = 1;
                scorebooster = 0;
                speedReduction = 0;
                powerups[i].color = 'transparent';
                yes = true;
                s = 1;

                interval = setInterval(() => {
                    rem -= 1;

                }, 1000);
                setTimeout(() => {
                    yes = false;
                    invincibility = 0;


                    clearInterval(interval);
                    rem = 5;
                    s = 0;

                }, 5000);
            } else if (powerups[i].color == 'blue') {
                invincibility = 0;
                scorebooster = 1;
                speedReduction = 0;
                document.querySelector('#points').style.color = 'blue';
                document.querySelector('#points').style.fontSize = '45px';
                interval = setInterval(() => {
                    count += 5;
                }, 50);
                setTimeout(() => {
                    clearInterval(interval);
                    scorebooster = 0;
                    document.querySelector('#points').style.color = 'red';
                    document.querySelector('#points').style.fontSize = '40px';
                }, 5000);
                powerups[i].color = 'transparent';
            } else if (powerups[i].color == 'green') {
                invincibility = 0;
                scorebooster = 0;
                speedReduction = 1;
                y -= 3;
                fs -= 1.5;
                obsEntry *= 2;
                setTimeout(() => {
                    speedReduction = 0;
                    fs = 5;
                    obsEntry = 1;
                }, 5000);
                powerups[i].color = 'transparent';
            }
        }
    }
    if (yes == true) {
        yes1 = false;
        yes2 = false;
        yes3 = false;
        yes4 = false;

    } else {
        yes1 = false;
        for (i = 0; i < obstacle1.length; i++) {
            if (runner.hole(obstacle1[i]) == true) {
                yes1 = true;
                break;
            }
        }
        yes2 = false;
        for (i = 0; i < obstacle2.length; i++) {
            if (runner.hole(obstacle2[i]) == true) {
                yes2 = true;
                break;
            }
        }
        yes3 = false;
        for (i = 0; i < flyingSqd.length; i++) {
            if (runner.flyS(flyingSqd[i]) == true) {
                yes3 = true;
                break;
            }
        }
        yes4 = false;
        for (i = 0; i < spike.length; i++) {
            if (runner.spike(spike[i]) == true) {
                yes4 = true;
                break;
            }
        }
    }



    if (yes1 || yes2 || yes3 || yes4) {
        runner.update();
        gameArea.stop();
        if (count > highScore) {
            localStorage.setItem('highScore', count - 1);
            document.querySelector('#pDetails').innerHTML = count - 1;
        }
        document.querySelector('.fa-redo-alt').style.display = 'block';
        document.querySelector('#reset').style.display = 'block';
        gameArea.canvas.style.opacity = 0.4;
    } else {
        gameArea.clear();

        runner.update();

        lane1.update();
        lane2.update();
        if (s == 1) {
            ctx = gameArea.context;
            ctx.fillStyle = 'gold';
            ctx.font = '50px Arial';
            ctx.fillText(rem, 750, 100);
        }

        //give random selection of lane aswell.

        if (gameArea.frameNo % (70 * obsEntry) == 0) {
            decision = Math.floor(Math.random() * 2);
            if (decision == 0) {
                obstacle2.push(new component(Math.random() * (200) + 100, 50, 'red', 800, 0));
            } else {
                obstacle1.push(new component(Math.random() * (200) + 100, 50, 'red', 800, 350));
            }
        }
        //Powerups
        if (gameArea.frameNo % (500 * obsEntry) == 0 && gameArea.frameNo != 0 || gameArea.frameNo == -50) {
            decision1 = Math.floor(Math.random() * 3);
            decision2 = Math.floor(Math.random() * 2);
            if (decision1 == 0) {
                if (decision2 == 0) {
                    powerups.push(new component(30, 30, 'gold', 800, 320));
                } else {
                    powerups.push(new component(30, 30, 'gold', 800, 50));
                }

            } else if (decision1 == 1) {
                if (decision2 == 0) {
                    powerups.push(new component(30, 30, 'blue', 800, 320));
                } else {
                    powerups.push(new component(30, 30, 'blue', 800, 50));
                }

            } else if (decision1 == 2) {
                if (decision2 == 0) {
                    powerups.push(new component(30, 30, 'green', 800, 320));
                } else {
                    powerups.push(new component(30, 30, 'green', 800, 50));
                }
            }
        }
        if (gameArea.frameNo % (175 * obsEntry) == 0 && gameArea.frameNo % (70 * obsEntry) != 0 && gameArea.frameNo != 0) {
            decision = Math.floor(Math.random() * 6);
            if (decision == 0) {
                flyingSqd.unshift(new component(30, 30, 'red', 800, 320));
            } else if (decision == 1) {
                flyingSqd.unshift(new component(30, 30, 'red', 800, 50));
            } else if (decision == 2) {
                spike.unshift(new spikeS(30, 'red', 800, 80));
            } else if (decision == 3) {
                spike.unshift(new spikeS(30, 'red', 800, 320));
            } else if (decision == 4) {
                spike.unshift(new sphere(20, 'red', 800, 320));
            } else if (decision == 5) {
                spike.unshift(new sphere(20, 'red', 800, 80));
            }
        }





        document.querySelector('#points').innerHTML = count;


        count += 1
        if (gameArea.frameNo % (500 * obsEntry) == 0) {
            y += 1;
        }
        //console.log(y);
        //for(i=0;i<flyingSqd.length;i++){
        try {
            for (i = 0; i < flyingSqd.length; i++) {
                flyingSqd[i].x -= y;
                if (flyingSqd[i].y == 320) {
                    flyud = 1;
                } else if (flyingSqd[i].y == 50) {
                    flyud = 0;
                }
                if (flyud == 0) {
                    flyingSqd[i].y += fs;
                } else {
                    flyingSqd[i].y -= fs;
                }

                flyingSqd[i].update();

            }




        } catch {

        }
        try {

            for (i = 0; i < spike.length; i++) {
                spike[i].x -= y;
                if (spike[i].y == 320) {
                    flyuds = 1;
                } else if (spike[i].y == 80) {
                    flyuds = 0;
                }
                if (flyuds == 0) {
                    spike[i].y += fs;
                } else {
                    spike[i].y -= fs;
                }

                spike[0].update();
            }



        } catch {

        }




        //}
        for (i = 0; i < obstacle1.length; i++) {

            obstacle1[i].x -= y;
            obstacle1[i].update();
        }
        for (i = 0; i < obstacle2.length; i++) {
            obstacle2[i].x -= y;
            obstacle2[i].update();
        }
        for (i = 0; i < powerups.length; i++) {
            powerups[i].x -= y;
            powerups[i].update();
        }
        gameArea.frameNo += 1;
    }

}
const playBtn = document.querySelector('#play');
playBtn.addEventListener('click', () => {
    document.querySelector('canvas').pointerEvents = 'all';

    document.querySelector('.intro').style.display = 'none'
    document.querySelector('.game').style.display = 'flex';
    count = 1;
    y = 10;
    obstacle1 = [];
    obstacle2 = [];
    flyingSqd = [];
    spike = [];
    powerups = [];
    invincibility = 0;
    scorebooster = 0;
    speedReduction = 0;
    document.querySelector('#points').style.color = 'red';
    document.querySelector('#points').style.fontSize = '40px';
    document.querySelector('body').style.cursor = 'pointer';
    startGame();
});
const resetBtn = document.querySelector('#reset');
resetBtn.addEventListener('click', () => {

    document.querySelector('.fa-redo-alt').style.display = 'none';
    document.querySelector('#reset').style.display = 'none';

    document.querySelector('.intro').style.display = 'flex';
    document.querySelector('.game').style.display = 'none';
    gameArea.canvas.style.opacity = 1;
    document.querySelector('body').style.cursor = 'auto';

});