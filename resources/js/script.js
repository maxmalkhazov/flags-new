const cntDisplay = document.querySelector(".cntDisplay");
const squares = document.querySelectorAll(".square");
const img = document.querySelectorAll(".flagImg");
const h1 = document.querySelector("h1");
const backColor = document.querySelector(".backColor");
const messageDisplay = document.querySelector(".message");
const resetButton = document.querySelector(".reset");
const aboutButton = document.querySelector(".about");
const about = document.querySelector("#about");
const container = document.querySelector("#container");
const track = document.querySelector(".track");
let score = 0;
const scoreDisplay = document.querySelector(".score");


// REQUEST TO COUNTRIES API WHICH PUSHES ALL THE COUNTRIES INTO THE MAIN ARRAY
const getCountries = async () => {
    const mainArr = [];
    const response = await fetch('https://restcountries.eu/rest/v2/all');
    if (response.status === 200) {
        const data = await response.json();
        data.forEach((country) => {
            mainArr.push(`${country.name} - ${country.flag}`);
        });
    } else {
        throw new Error('cannot fetch data');
    }
    
    return mainArr;
}

// CHOOSING OF RANDOM COUNTRY OUT OF THE MAIN ARRAY
const randomCountry = async () => {
    const game = await getCountries();
    const random = Math.floor(Math.random() * game.length);
    const country = game[random];
    return country;
    
}

// NUMBER OF RANDOM COUNTRIES AS SPECIFIED BY THE USER
const random = async (num) => {
    let arr = [];
    let reachNum = false;
    let ctr = 0;
    while (!reachNum) {
        let country = await randomCountry();
        if (arr.indexOf(country) === -1) {
            arr.push(country);
            ctr++;
        }
        if (ctr === num) {
            reachNum = true;
        }
    }
    return arr;

}


// CHANGE ALL IMAGES TO THE CORRECT IMAGE WHEN THE ANSWER IS CORRECT
const changeSquares = (flag) => {
    for (var i = 0; i < img.length; i++) {
        img[i].style.visibility = "visible";
        img[i].style.opacity = "1";
        img[i].setAttribute("src", flag);
    }
}

// CHANGE H1 BACKGROUND TO THE CORRECT IMAGE WHEN THE ANSWER IS CORRECT
const backImage = (image) => {
    h1.style.backgroundImage = 'url("'+ image +'")';
    h1.style.backgroundPosition = "center";
    h1.style.backgroundSize = "cover";
    h1.style.backgroundRepeat = "no-repeat";
    h1.style.color = "black";
    h1.classList.add("special");
    backColor.classList.add("setBack");
}

const reset = () => {
    for (var i = 0; i < squares.length; i++) {
        squares[i].style.display = "block";
        about.style.display = "none";
    }
    
    for (var i = 0; i < img.length; i++) {
        img[i].style.visibility = "visible";
        img[i].style.opacity = "1";
        img[i].classList.remove("noClick");
    }
    
    messageDisplay.classList.add('message-special');
    resetButton.style.visibility = 'visible'
    scoreDisplay.textContent = '';
    resetButton.innerHTML = '<i class="fa fa-refresh" aria-hidden="true"></i>' + " " + "Shuffle";
    messageDisplay.textContent = "";
    h1.style.backgroundImage = "none";
    h1.style.color = "white";
    h1.classList.remove("special");
    backColor.classList.remove("setBack");
    container.classList.remove("setBack");
    about.classList.remove("setForward");
    resetButton.classList.remove("selected");
    aboutButton.classList.remove("selected");
}


const init = async () => {
    
    reset();
    
    scoreDisplay.textContent = score;
    
    scoreDisplay.classList.add('noClick');
    
    let mutualArr = [];
    const countries = await random(4);
    countries.forEach((country) => {
        mutualArr.push({
            name: country.slice(0, country.length -40),
            flag: country.slice(country.length -37)
        });
    });
    const randomN = Math.floor(Math.random() * mutualArr.length);
    const chosenCountry = mutualArr[randomN];
    cntDisplay.textContent = chosenCountry.name;
    for (var i = 0; i < img.length; i++) {
        img[i].setAttribute("src", mutualArr[i].flag);
        img[i].addEventListener('click', function(e) {
           let clickedFlag2 = this.getAttribute('src');
           if (clickedFlag2 === chosenCountry.flag) {
                messageDisplay.textContent = "Correct!";
                resetButton.textContent = "Play Again?"
                resetButton.classList.add("selected");
                backImage(chosenCountry.flag);
                changeSquares(chosenCountry.flag);
                score++;
                scoreDisplay.textContent = score;
                scoreDisplay.classList.add("selected");
                messageDisplay.classList.add('message-special');
                // scoreDisplay.style.background = "white";
                // prevent clicking on correct image more than once
                for (var i = 0; i < img.length; i++) {
                    img[i].classList.add("noClick");
                }
                setTimeout(() => {
                    init();
                }, 2000)
            } else {
                console.log(chosenCountry.flag);
                console.log(clickedFlag2);
                // if not correct hide the clicked flag
                this.style.visibility = "hidden";
                this.style.opacity = "0";
                messageDisplay.classList.remove('message-special');
                messageDisplay.textContent = `Your score is ${score}. Try Again!`
                scoreDisplay.textContent = 'New Game?';
                scoreDisplay.classList.remove('noClick');
                scoreDisplay.classList.remove("selected");
                scoreDisplay.style.color = "white";
                resetButton.style.visibility = 'hidden'
                scoreDisplay.style.background = "#3498db";
                for (var i = 0; i < img.length; i++) {
                    img[i].classList.add("noClick");
                }
            }
        });
    }
}

const aboutLink = () => {
    container.classList.toggle("setBack");
    about.classList.toggle("setForward");
    aboutButton.classList.toggle("selected");
}

// PLAY AGAIN
resetButton.addEventListener("click", function() {
    if (score > 0) {
        score--;
    }
    init();
});

// RESTART
scoreDisplay.addEventListener('click', function() {
    if (scoreDisplay.textContent = 'NEW GAME?') {
        score = 0;
        init();
    }
})

// ABOUT BUTTON
aboutButton.addEventListener("click", function() {
    aboutLink();
});

init();
