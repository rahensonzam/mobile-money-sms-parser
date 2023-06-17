//"import" smsData from smsDataFile.js

document.addEventListener("readystatechange", function() {    
    if (document.readyState == "complete") {
        main();
    }
});

function main() {
	let smsVar0 = smsData
    let smsVar1 = RemoveInboxSMS(smsVar0)
    // console.log("smsVar1")
    // console.log(smsVar1)

    let issuesArray = checkAbnormalLineCount(smsVar1)
    console.log("issuesArray")
    console.log(issuesArray.join("\n"))

    let smsVar2 = tabulateList(smsVar1)
    console.log("smsVar2")
    console.log(smsVar2)

}

// Takes string, returns string
function RemoveInboxSMS(inputString) {
    return inputString.replaceAll("Inbox SMS\n\n","")
}

// Takes string, returns array
function checkAbnormalLineCount(inputString) {
    let inputStringArray = inputString.split("\n")
    let lineNumbersArray = []
    let issuesArray = []
    for (let index = 0; index <= inputStringArray.length - 1; index++) {
        const element = inputStringArray[index];
        if (element === "") {
            lineNumbersArray.push(index + 1)
        }
    }

    for (let index = 0 + 1; index <= lineNumbersArray.length - 1; index++) {
        if (!(lineNumbersArray[index] === lineNumbersArray[index - 1] + 3 + 1)) {
            issuesArray.push(lineNumbersArray[index - 1])
        }
    }

    return issuesArray
}

// Takes string, returns string
function tabulateList(inputString) {
    if(inputString.indexOf("$") != -1){
        throw new Error(`"$" found in string`)
    }
    inputString = inputString.replaceAll("\n\n","$")
    inputString = inputString.replaceAll("\n","\t")
    inputString = inputString.replaceAll("$","\n")
    return inputString
}
