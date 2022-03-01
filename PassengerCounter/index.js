let counter = 0
// const increment = () => {
//     console.log("clicked");
//     counter++; 
//     console.log(counter);}

function increment() {
    console.log("clicked");
    counter++; 
    console.log(counter);
    let countEl = document.getElementById("count-el");
    countEl.textContent = counter;
}

function save(){
    let previousEntriesText = document.getElementById("previous-entries");
    Number.isInteger(parseInt(previousEntriesText.textContent[previousEntriesText.textContent.length-1])) ? 
    previousEntriesText.textContent += ` - ${counter}` : 
    previousEntriesText.textContent += ` ${counter}`;
    counter = 0
    let countEl = document.getElementById("count-el");
    countEl.textContent = counter;
}

function saveAndReset(){
    let countSaved = document.getElementById("count-saved");
    countSaved.textContent = counter;
    counter = 0;
    let countEl = document.getElementById("count-el");
    countEl.textContent = counter;
    console.log("saved and reset");
}

function loadSaved(buttonId){
    let countSaved = document.getElementById("count-saved");
    counter = countSaved.textContent;
    document.getElementById("count-el").textContent = counter;
    countSaved.textContent = 0;
}

// increment() 
let username = "PeterPan";
let message = `${username} wants all the children to fly`;
console.log(message)

//🔥 
const getTotalLaps = (...args) => args.reduce((accumulator,current) => accumulator + current,0);

console.log(getTotalLaps(1,2,3,4));
