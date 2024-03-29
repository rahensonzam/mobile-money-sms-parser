document.addEventListener("readystatechange", function() {    
    if (document.readyState == "complete") {

        const fileSelector1 = document.getElementById("fileSelector1")
        fileSelector1.addEventListener("change", main1)
        const Go1 = document.getElementById("Go1")
        Go1.addEventListener("click", main1)

        const fileSelector2 = document.getElementById("fileSelector2")
        fileSelector2.addEventListener("change", main2)
        const Go2 = document.getElementById("Go2")
        Go2.addEventListener("click", main2)

        const fileSelector3 = document.getElementById("fileSelector3")
        fileSelector3.addEventListener("change", main3)
        const Go3 = document.getElementById("Go3")
        Go3.addEventListener("click", main3)

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

async function main3() {

    const fileSelector3 = document.getElementById("fileSelector3")
    let smsVar4 = await readFileReaderAsync(fileSelector3.files[0])
    let smsVar5 = `sender\tdateAndTime\tdescription\r\n${smsVar4}`    
    let smsVar6 = Papa.parse(smsVar5, {header: true})
    let smsVar7 = addRowType(smsVar6.data)
    let smsVar8 = Papa.unparse(smsVar7, {delimiter: "\t"})
    console.log("smsVar7")
    console.log(smsVar7)
    console.log("smsVar8")
    console.log(smsVar8)
    document.getElementById("output3").value = smsVar8}

// Takes file, returns array
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

    textSort(fileContentsList, "id")
    
    const forConcat = []

    for (let i = 0; i <= fileContentsList.length - 1; i++) {
        forConcat.push(fileContentsList[i].content)
    }

    const output = forConcat.join("")

    return output

}

// Takes array of objects, string, returns array of objects
function textSort(inputArray, prop) {

    function textCompare(a, b) {
        if (a[prop] > b[prop]) {
          return -1
        }
        if (a[prop] < b[prop]) {
          return 1
        }
    
        // props must be equal
        return 0
    }

	inputArray.sort(textCompare)
	return inputArray

}

// Takes string, returns string
function RemoveInboxSMS(inputString) {
    return inputString.replace(/^\r\n/,"").replaceAll("Inbox SMS\r\n\r\n","")
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

// Takes array of objects, returns array of objects
function addRowType(inputArray) {

    const outputArray = []

    for (let index = 0; index <= inputArray.length - 1; index++) {
        const element = inputArray[index]
        if (element.sender === "AirtelMoney") {
            if (element.description.includes("insufficient funds")) {
                element.type = "Other"
                outputArray.push(element)
                continue
            }

            if (element.description.includes("Commission disbursement")) {
                element.type = "Commission"
            }
            if (element.description.includes("Txn ID: PP") &&
                element.description.includes("Dear Customer, you have received")) {
                element.type = "Float"
            }
            if (element.description.includes("Txn. ID: PP") &&
                element.description.includes("Dear Customer, you have received")) {
                element.type = "Float"
            }
            if (element.description.includes("Txn. ID : PP") &&
                element.description.includes("You have sent")) {
                element.type = "Cash"
            }
            if (element.description.includes("Trans. ID :AO")) {
                element.type = "Float"
            }
            if (element.description.includes("Txn. ID: RB")) {
                element.type = "Float"
            }
            if (element.description.includes("Txn ID: RW")) {
                element.type = "Cash"
            }
            if (element.description.includes("Trans. ID: CI")) {
                element.type = "Deposit"
            }
            if (element.description.includes("Txn. ID: CO")) {
                element.type = "Withdrawal"
            }
            if (element.description.includes("Trans.ID: MB")) {
                element.type = "Airtime"
            }
            if (element.description.includes("Trans.ID: MO")) {
                element.type = "Airtime"
            }
            if (element.description.includes("Txn. ID : MB")) {
                element.type = "Airtime"
            }
            if (element.description.includes("Txn. ID : MO")) {
                element.type = "Airtime"
            }
            if (element.description.includes("Txn ID : RC")) {
                element.type = "Airtime"
            }
            if (element.description.includes("Txn. ID : ES")) {
                element.type = "Check"
            }
        }

        if (element.sender === "Airtel Data") {
            if (element.description.includes("insufficient funds")) {
                element.type = "Other"
                outputArray.push(element)
                continue
            }

            if (element.description.includes("successfully purchased")) {
                element.type = "Airtime"
            }
        }

        if (element.sender === "SoChe") {
            if (element.description.includes("insufficient funds")) {
                element.type = "Other"
                outputArray.push(element)
                continue
            }

            // some rows working some not working, why not?
            if (element.description.includes("successfully purchased")) {
                element.type = "Airtime"
            }
        }

        outputArray.push(element)

    }

    return outputArray

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
