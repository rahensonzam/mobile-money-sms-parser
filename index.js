//"import" smsData from smsDataFile.js

document.addEventListener("readystatechange", function() {    
    if (document.readyState == "complete") {

        const fileSelector1 = document.getElementById("fileSelector")
        fileSelector1.addEventListener("change", getFromFiles)

        main();
    }
});


// Returns array
async function getFromFiles() {

    const fileSelector1 = document.getElementById("fileSelector")

    const fileSelectFileList = fileSelector1.files
    const fileContentsList = []

    for (let i = 0; i <= fileSelectFileList.length - 1; i++) {
        const file = fileSelectFileList[i]
        fileContentsList.push({id: file.name, content: await readFileReaderAsync(file)})
    }

    console.log("fileContentsList")
    console.log(fileContentsList)

    fileContentsList.sort((a, b) => b.id - a.id);

    const forConcat = []
 
    for (let i = 0; i <= fileContentsList.length - 1; i++) {
        forConcat.push(fileContentsList[i].content)
    }

    const output = forConcat.join("\n")
    console.log("output")
    console.log(output)

    // return fileContentsList

}

// // Takes array, returns string
// function concatFiles(fileContentsList) {

//     fileContentsList.sort((a, b) => b.id - a.id);

//     const forConcat = []
 
//     for (let i = 0; i <= fileContentsList.length - 1; i++) {
//         forConcat.push(fileContentsList[i].content)
//     }

//     const output = forConcat.join("\n")
//     console.log("output")
//     console.log(output)

//     return output

// }

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

// Takes file, returns promise
async function readFileReaderAsync(file) {
    return new Promise(function (resolve, reject) {
        let reader = new FileReader()
        reader.onload = function () {
            resolve(reader.result)
        }
        reader.onerror = reject
        reader.readAsText(file)
    })
}
