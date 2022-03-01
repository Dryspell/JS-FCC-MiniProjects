var cards = [];

function drawRandomCard(){
    choice = Math.floor(Math.random()*13) + 1
    return choice >= 10 ? 10 : 
    choice === 1 ? 11 : choice;
    //return (Math.floor(Math.random()*9) + 2);
}

// 🂠🃏
// // 🂡🂢🂣🂤🂥🂦🂧🂨🂩🂪🂫🂬🂭🂮 🂱🂲🂳🂴🂵🂶🂷🂸🂹🂺🂻🂼🂽🂾 🃁🃂🃃🃄🃅🃆🃇🃈🃉🃊🃋🃌🃍🃎 🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃜🃝🃞
// console.log("🂡".length)
// console.log("🂡");
// console.log("&#x1F0A1;")
// const CARDS = "🂡🂢🂣🂤🂥🂦🂧🂨🂩🂪🂫🂬🂭🂮🂱🂲🂳🂴🂵🂶🂷🂸🂹🂺🂻🂼🂽🂾🃁🃂🃃🃄🃅🃆🃇🃈🃉🃊🃋🃌🃍🃎🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃜🃝🃞";
// console.log(CARDS.length);
 // console.log("TEST" + Number("🂡".charCodeAt(0)).toString(10));

// const CardValueDict = {}
// for (let i = 0; i < CARDS.length; i++){
//     console.log(Number(CARDS[i].charCodeAt(0)).toString(16));
// }

//console.log(`FirstCard: ${firstCard}, SecondCard: ${secondCard}`)

const getSum = (arr) => arr.reduce((accumulator,current) => accumulator + current, 0);
const writeCardsText = (arr) => arr.reduce((accumulator,current) => accumulator === "" ? current : accumulator += ` ${current}`,"");
    // for (let i=0; i < cards.length; i++){
    //     if (i === 0){
    //         cardsText += cards[i]
    //     } else {cardsText += ` ${cards[i]}`}
    // }

let player = {
    name: "User:",
    chips: 200
}

function startGame(){
    cards = [];
    cards.push(drawRandomCard());
    cards.push(drawRandomCard());

    checkResults();
}

function checkResults(){
    let message = "";
    let hasBlackJack = false;
    let isAlive = true;
    let sum = getSum(cards);
    if (sum < 21) {
        message = "Do you want to draw a new card?";
    } else if (sum === 21) {
        hasBlackJack = true;
        message = "Wohooo! You've got Blackjack!";
        document.getElementById('startGameBtn-el').textContent = "Play again?"
    } else if (sum > 21){
        isAlive = false;
        message = "Bust!";
        document.getElementById('startGameBtn-el').textContent = "Play again?"
    }
    let cardsText = writeCardsText(cards)    

    document.getElementById('cards-el').textContent = `Cards: ${cardsText}`
    document.getElementById('sum-el').textContent = `Sum: ${sum}`
    document.getElementById('message-el').textContent = message
}

function newCard(){
    if (isAlive && !hasBlackJack){
        cards.push(drawRandomCard());
        checkResults();
    } else {
        return
    }
}