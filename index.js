document.addEventListener("readystatechange", function() {    
    if (document.readyState == "complete") {

        const fileSelector1 = document.getElementById("fileSelector1")
        fileSelector1.addEventListener("change", main1)

        const fileSelector2 = document.getElementById("fileSelector2")
        fileSelector2.addEventListener("change", main2)

    }
})


async function main1() {

    const fileSelector1 = document.getElementById("fileSelector1")
    let fileContentsList = await getFromFiles(fileSelector1)
    console.log("fileContentsList")
    console.log(fileContentsList)

    let smsVar0 = concatFiles(fileContentsList)
    console.log("smsVar0")
    console.log(smsVar0)

    let smsVar1 = RemoveInboxSMS(smsVar0)
    console.log("smsVar1")
    console.log(smsVar1)
    document.getElementById("output1").value = smsVar1

    let issuesArray = checkAbnormalLineCount(smsVar1)
    console.log("issuesArray")
    console.log(issuesArray.join("\r\n"))
    document.getElementById("output1b").value = issuesArray.join("\r\n")

}

async function main2() {

    const fileSelector2 = document.getElementById("fileSelector2")
    let smsVar2 = await readFileReaderAsync(fileSelector2.files[0])
    let smsVar3 = tabulateList(smsVar2)
    console.log("smsVar3")
    console.log(smsVar3)
    document.getElementById("output2").value = smsVar3

}

// Returns array
async function getFromFiles(inputfileSelector) {

    const fileSelectFileList = inputfileSelector.files
    const fileContentsList = []

    for (let i = 0; i <= fileSelectFileList.length - 1; i++) {
        const file = fileSelectFileList[i]
        fileContentsList.push({id: file.name, content: await readFileReaderAsync(file)})
    }

    return fileContentsList

}

// Takes array, returns string
function concatFiles(fileContentsList) {

    fileContentsList.sort((a, b) => {
        if (a.id > b.id) {
          return -1
        }
        if (a.id < b.id) {
          return 1
        }
      
        // ids must be equal
        return 0
    })
    
    const forConcat = []
 
    for (let i = 0; i <= fileContentsList.length - 1; i++) {
        forConcat.push(fileContentsList[i].content)
    }

    const output = forConcat.join("")

    return output

}

// Takes string, returns string
function RemoveInboxSMS(inputString) {
    return inputString.replaceAll("Inbox SMS\r\n\r\n","")
}

// Takes string, returns array
function checkAbnormalLineCount(inputString) {
    let inputStringArray = inputString.split("\r\n")
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
    inputString = inputString.replaceAll("\r\n\r\n","$")
    inputString = inputString.replaceAll("\r\n","\t")
    inputString = inputString.replaceAll("$","\r\n")
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
