let score
let timeUp
let timers = [];
const holes = document.querySelectorAll(".hole");
for (const hole of holes) {
    hole.addEventListener("click", mole_onClick);
}

function startGame() {
    if(timeUp === false) return;

    scoreBoard.textContent = 0;
    timeUp = false;
    score = 0;
    peep();
    setTimeout(() => {
        timeUp = true;
        alert("Game over");
        clearMole();
    }, 15000); 
//muestra topos aleatoriamente durante 15 segundos

}

const scoreBoard = document.querySelector(".score");

function launchMole( mole ) {
    let timer = getRandom( 1000, 5000 );
    
    timers.push(setTimeout(() => {
        mole.classList.toggle("hole-up");
        if(!timeUp) launchMole( mole );
    }, timer))
}

function getRandom(min, max) {
    return (min + Math.floor(Math.random() * (max - min)));
}

function peep() {
    for (const hole of holes) {
        launchMole( hole )
    }
}

function mole_onClick(e) {
    if(e.target.parentNode.className.includes("hole-up") ) {
        e.target.parentNode.classList.toggle("hole-up");
        refreshScore();
    }
}

function refreshScore() {
    score++;
    scoreBoard.textContent = score;
}

function clearMole() {
    for (const tim of timers) {
        clearTimeout( tim );
    }
    for (const hole of holes) {
        if(hole.className.includes("hole-up") ) {
            hole.classList.toggle("hole-up");
        }
    }
}