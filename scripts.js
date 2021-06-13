const $canvas = $('.canvas');
const $scoreBoard = $('.scoreBoard');
const $hourGlass = $('.hourGlass');
const $progressTitleText = $('.progressTitleText');
const $timeBar = $('.timeBar');
const $startBtn = $('.startBtn');
const banjo = new Audio('./audio/banjo.mp3');
const victory = new Audio('./audio/victory.mp3');
const losing = new Audio('./audio/losing.mp3');


let global = {
    stage: 1,
    lost: false,
    score: 0,
    isPlaying: false
};

$( document ).ready(function() {
    $progressTitleText.toggle();

$startBtn.click(()=>{;
        banjo.play();
        losing.pause();
        losing.currentTime = 0;
        victory.pause();
        victory.currentTime = 0;
        $('.startBtn'). attr('disabled','disabled');
        $('.gameWonTitle').hide()
        $('.gameOverTitle').hide()
            introTitle();
            setTimeout(()=>{
                decrementTime(300);
                var pig = new MakeCreature(60,95,1000, 'url(./images/pig.svg)');
                global.isPlaying = true;
            },2000);     
});



class MakeCreature {
    constructor (height,width,pulseRate,bgImg) {
        this.height = height;
        this.width = width;
        this.creature = $('<div></div>', 
        {class:'creature', width:width, height:height});
        this.creature.css('backgroundImage', bgImg)

        this.bloodSplatter = $('<div></div>', 
        {class:'bloodSplatter', width:width, height:height});

        this.styleSettings = {
            top:0,
            left:0
        }

        
        this.pulseRate = pulseRate;
        this.bgImg = bgImg;
        this.isAlive = true;

        this.creature.click(()=>{
            

            $progressTitleText.fadeIn();
            this.creature.css('opacity', '0');// hide creature when clicked
            global.score++;
            let placeholderScore = global.score.toString();
            $('.scoreBoard').attr('placeholder',placeholderScore);

            this.bloodEffect();
            this.squishSounds();

            
            

        });
        $canvas.append(this.creature);
        

        this.setPosition(this.creature);
        this.pulse();
    }

    setPosition (obj) {
        this.styleSettings.top = (Math.random() * (400-20) + 20);
        this.styleSettings.left = (Math.random() * (530-20) + 20);
        obj.css(this.styleSettings);
    };

    pulse () {
        if(global.score === 10) {
            if(global.stage !== 3) {
                const success = new Audio('./audio/success.mp3');
                success.play();
            }
            
            global.stage++;
            nextStage(global.stage);
            return;
        } else if (global.lost === true) {
            global.stage = 1;
            global.score = 0;
            global.lost = false;
            
            losing.play();
            return;
        }
        this.creature.css('opacity', '100');

        setTimeout(()=>{
            this.creature.toggle();
            this.setPosition(this.creature);
            this.pulse(); 
        },this.pulseRate)
    }

    bloodEffect () {
        let randomNumber = Math.floor(Math.random()*5);

        switch(randomNumber) {
            case 0:
                this.bloodSplatter.css('backgroundImage', 'url(./images/blood0.svg)');
                break;
            case 1:
                this.bloodSplatter.css('backgroundImage', 'url(./images/blood1.png)');
                break;
            case 2:
                this.bloodSplatter.css('backgroundImage', 'url(./images/blood2.png)');
                break;
            case 3:
                this.bloodSplatter.css('backgroundImage', 'url(./images/blood3.png)');
                break;
            case 4:
                this.bloodSplatter.css('backgroundImage', 'url(./images/blood4.png)');
                break;
        }

        this.bloodSplatter.css('top', this.styleSettings.top);
        this.bloodSplatter.css('left', this.styleSettings.left);
        $canvas.append(this.bloodSplatter);
        this.bloodSplatter.hide();
        this.bloodSplatter.fadeIn(200);

        setTimeout(()=>{
            this.bloodSplatter.fadeOut();
        },500)
    }

    squishSounds () {
        
        let randomNumber = Math.floor(Math.random()*6);

        const squish0 = new Audio('./audio/squish0.wav');
        const squish1 = new Audio('./audio/squish1.mp3');
        const squish2 = new Audio('./audio/squish2.mp3');
        const squish3 = new Audio('./audio/squish3.mp3');
        const squish4 = new Audio('./audio/squish4.mp3');
        const squish5 = new Audio('./audio/squish5.mp3');

        console.log(randomNumber)

        switch(randomNumber) {
            case 0:
                squish0.play();
                break;
            case 1:
                squish1.play();
                break;
            case 2:
                squish2.play();
                break;
            case 3:
                squish3.play();
                break;
            case 4:
                squish4.play();
                break;
            case 5:
                squish5.play();
                break;
        }
    }

     
}

function introTitle () {
    const $introTitle = $('<h1></h1>,',
    {class:'introTitle', text:'Smash 10 critters to advance'});

    $introTitle.appendTo($canvas);
    $introTitle.hide();
    $introTitle.fadeIn();

    setTimeout(()=>{
        $introTitle.fadeOut();
    },1000);
}

const decrementTime = function (time) {
    let i = 0;
    while(i === 0) {
        i = 1;
        var width = 80;
        var id = setInterval(frame, time);
        function frame () {
            if (width === -1) {
                clearInterval(id);
                i = 0;
            } else {
                width--;    
                $hourGlass.css('width', `${width}%`);
                showClock();    

                if(global.score === 10  ) {
                    clearInterval(id);
                } else if(width === -1) {
                    clearInterval(id);
                    gameOver();
                }
            }
        }  
    }
}

const nextStage = function (stage) {

    if(global.stage === 4) {
        banjo.pause();
        banjo.currentTime = 0;
        victory.play();
        gameWon();
        hideClock();
        global.stage = 1;
        global.score = 0;
        global.isPlaying = false;
        $('.startBtn').removeAttr('disabled');

        return;
    }

    hideClock();
    global.score = 0;

    setTimeout(()=>{
        const $nextStage = $('<h1></h1>,',
        {class:'stageIntro', text:`Congrats! Get Ready for stage ${global.stage}`});
        $('.scoreBoard').attr('placeholder','0');
        $nextStage.appendTo($canvas);
        $nextStage.hide();
        $nextStage.fadeIn();

        setTimeout(()=>{
            $nextStage.fadeOut();

            setTimeout(()=>{
                $hourGlass.css('width', `80%`);
                showClock();
                
                switch (global.stage) {
                    case 2: 
                    decrementTime(300);
                    var bat = new MakeCreature(50, 60, 900, 'url(./images/bat.svg)');
                    break;

                    case 3:
                    decrementTime(300);
                    var fly = new MakeCreature(30, 30, 900, 'url(./images/fly.png)'); 
                }
                
            },1000)
        },3000);
    },1000);
}

const hideClock = function () {
    $progressTitleText.hide();
    $hourGlass.hide();
    $('.scoreBoard').attr('placeholder','0');
}

const showClock = function () {
    $progressTitleText.show();
    $hourGlass.show();
}

const gameOver = function () {
    const $gameOverTitle = $('<h1></h1>,',
    {class:'gameOverTitle', text:'GAME OVER'});

    banjo.pause();
    banjo.currentTime = 0;
    global.lost = true;
    global.isPlaying = false;
    hideClock();
    
    $('.startBtn').removeAttr('disabled');

    setTimeout(()=>{
        $gameOverTitle.appendTo($canvas);
        $gameOverTitle.hide();
        $gameOverTitle.fadeIn();
    },1000)
    

    setTimeout(()=>{
        $gameOverTitle.fadeOut();
    },3000);
}

const gameWon = function () {
    const $gameWonTitle = $('<h1></h1>,',
    {class:'gameWonTitle', text:'Congrats you Win!'});

    banjo.pause();
    banjo.currentTime = 0;
    global.isPlaying = false;
    hideClock();
    
    $('.startBtn').removeAttr('disabled');

    setTimeout(()=>{
        $gameWonTitle.appendTo($canvas);
        $gameWonTitle.hide();
        $gameWonTitle.fadeIn();
    },500)
    

    setTimeout(()=>{
        $gameWonTitle.fadeOut();
    },3000);
}


});

