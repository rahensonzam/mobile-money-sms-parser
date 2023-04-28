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

    let smsVar2 = tabulateList(smsVar1)
    console.log("smsVar2")
    console.log(smsVar2)

}

// Takes string, returns string
function RemoveInboxSMS(inputString) {
    return inputString.replaceAll("Inbox SMS\n\n","")
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
