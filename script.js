const inputSlider = document.querySelector("[data-slider]");
const dataLength = document.querySelector("[data-length]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyButton = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copytext]");
const upperCase = document.querySelector("#uppercase");
const lowerCase = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbol");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector("[data-generate]");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~!@#$%^&*()_-+=:;<,>.?[]{}/'

let password = "";
let passwordLength = 10;
let checkCount = 0;
// strength circle color gray
setIndicator("#ccc");

handleSlider();

//! set password length
function handleSlider(){
    inputSlider.value = passwordLength;
    dataLength.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max - min)) +"% 100%";
}

//! set Indicator
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`
}

//! generate random integer
function getRandomInteger(min, max){
    return Math.floor(Math.random()*(max-min)) + min;   //todo get random num b/w min and max
}

//! generate random number
function generateRandomNumber(){
    return getRandomInteger(0, 9);
}

//! generate random Lowercase
function generateLowerCase(){
   return String.fromCharCode(getRandomInteger(97, 123));   //todo LowerCase-> 97(a), 123(z)
}

//! generate random Uppercase
function generateUpperCase(){
  return  String.fromCharCode(getRandomInteger(65, 91));   //todo UpperCase-> 65(A), 91(Z)
}

//! generate random symbol
function generateSymbol(){
    const rndnum = getRandomInteger(0, symbols.length);

    return symbols.charAt(rndnum);
}

//! calculate strength
function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if(upperCase.checked) hasUpper = true;
    if(lowerCase.checked) hasLower = true;
    if(numbersCheck.checked) hasNumber = true;
    if(symbolCheck.checked) hasSymbol = true;

        //* logic for password strength
    if(hasLower && hasUpper && (hasNumber || hasSymbol) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if( (hasLower || hasUpper) &&  (hasNumber || hasSymbol) && passwordLength >= 6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#ff0");
    }

}

//! copy password on clipboard
async function copyContent(){

    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";

    }catch(e){
        copyMsg.innerText = "failed"
    }

    // to make copy bala span visible
    copyMsg.classList.add("active");

    // remove copy text after 3sec.
    setTimeout(() => {
        copyMsg.classList.remove("active");

    }, 3000);

}


//! add eventlistener on slider
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})


//! add eventlistener on copybutton
copyButton.addEventListener('click', ()=>{

    if(passwordDisplay.value){
        copyContent();
    }
})


//! add eventlistener on checkboxes

function handleCheckBox(){
    checkCount = 0;

    allCheckBox.forEach( (checkbox) =>{

        if(checkbox.checked){
            checkCount++;
        }
    })


    // special condition -> agr checkbox ka count slider se jyada ho then update slider
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBox);
})


//! shuffle password function
function shufflePassword(shufflepass){
    //fisher yates Method
    for(let i=shufflepass.length-1; i>0; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = shufflepass[i];
        shufflepass[i] = shufflepass[j];
        shufflepass[j] = temp;
    }

    let passStr = '';
    shufflepass.forEach( (el) => (passStr += el));

    return passStr;
}


//! Generate password
generateBtn.addEventListener('click', ()=> {

    //if none of these checkbox is checked
    if(checkCount <= 0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    //* let's start finding new password

        //remove old password
        password = '';

        //todo lets put the values mentioned by checkboxes
        // if(upperCase.checked){
        //     password += generateUpperCase();
        // }
        // if(lowerCase.checked){
        //     password += generateLowerCase();
        // }
        // if(numbersCheck.checked){
        //     password += generateRandomNumber();
        // }
        // if(symbolCheck.checked){
        //     password += generateSymbol();
        // }


        let funcArray = [];

        if(upperCase.checked){
            funcArray.push(generateUpperCase);
        }
        if(lowerCase.checked){
            funcArray.push(generateLowerCase);
        }
        if(numbersCheck.checked){
            funcArray.push(generateRandomNumber);
        }
        if(symbolCheck.checked){
            funcArray.push(generateSymbol);
        }

        //* compulsary addition
        for(let i=0; i<funcArray.length; i++){
            password += funcArray[i]();
        }

        //* remaining addition
        for(let i=0; i<passwordLength-funcArray.length; i++){
            let randomIndex = getRandomInteger(0, funcArray.length);

            password += funcArray[randomIndex]();
        }

        //* shuffle password

        password = shufflePassword(Array.from(password));


    //todo display on UI
    passwordDisplay.value = password;

    //* calculate strength
    calcStrength();

})
