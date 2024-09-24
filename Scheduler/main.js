
let today = new Date();

let currentYear = today.getFullYear();
let currentMonth = today.getMonth();
let currentDay = today.getDay();

let currentDate = new MyDate(currentDay, currentMonth, currentYear);

let saturdays = getSaturdays(currentDate);

let currentPerson = null;

peopleList = []

makePeople();

function addTable(pri, em){
    let scheduleDiv = document.getElementById("schedule");

    let table = document.createElement("table");
    
    let headingRow = table.insertRow(0);
    let primaryRow = table.insertRow(1);
    let emergencyRow = table.insertRow(2);

    for(let i = 0; i < saturdays.length; i++){

        let saturdayStr = saturdays[i].toShortString();
        let sundayStr = saturdays[i].getNextDay().toShortString();
        let r1 = saturdayStr + "\n" + sundayStr;

        let r2 = pri[i];
        let r3 = em[i];

        let r1El = headingRow.insertCell(i);

        let r2El = primaryRow.insertCell(i);

        let r3El = emergencyRow.insertCell(i);

        r1El.innerHTML = r1;
        r2El.innerHTML = r2;
        r3El.innerHTML = r3;

    }

    scheduleDiv.appendChild(table);
}

function addPeopleNames(primaryList, emergencyList){
    let table = document.getElementsByTagName("table")[0];
    let tBody = table.children[0];

    let primaryRow = tBody.children[1];
    let emergencyRow = tBody.children[2];

    for(let i = 0; i < primaryList.length; i++){
        
        let elPrimary = primaryRow.children[i];
        let elEmergency = emergencyRow.children[i];
        if(primaryList[i] == null){
            elPrimary.innerHTML = "";
        } else{
            elPrimary.innerHTML = primaryList[i].name;
        }

        if(emergencyList[i] == null){
            elEmergency.innerHTML = "";
        } else{
            elEmergency.innerHTML = emergencyList[i].name;
        }
    }
}

function newEmployee(){

    let name = document.getElementById("nameInput").value;


    if(name == "") return;

    addProfileWeekends();


    for(let i = 0; i < peopleList.length;i++){
        if(name == peopleList[i].name) return;
    }

    document.getElementById("nameInput").value = "";
    

    peopleList.push(new Person(name, saturdays.length));

    let peopleDiv = document.getElementById("peopleDiv");


    let newPersonDiv = document.createElement("div");
    newPersonDiv.setAttribute("id", name);
    let newPersonButton = document.createElement("input");
    newPersonButton.setAttribute("type", "button");
    newPersonButton.setAttribute("value", name);
    newPersonButton.setAttribute("id", name + "Button");

    newPersonButton.addEventListener("click", function(e){
        let btn = e.target;
        changeProfile(btn.value);
    });

    newPersonDiv.appendChild(newPersonButton);
    newPersonDiv.appendChild(document.createElement("br"));

    peopleDiv.appendChild(newPersonDiv);

    changeProfile(name);

}

function changeProfile(name){

    let month1Div = document.getElementById("month1Div");
    let month2Div = document.getElementById("month2Div");
    let month3Div = document.getElementById("month3Div");

    month1Div.innerHTML = "";
    month2Div.innerHTML = "";
    month3Div.innerHTML = "";
    
    for(let i = 0; i < peopleList.length; i++){
        if(peopleList[i].name == name){
            currentPerson = peopleList[i];
            
            break;
        }
    }

    addProfileWeekends();

    let nameText = document.getElementById("profileName");
    nameText.innerHTML = name;

}

function removeCurrentPerson(){

    if(currentPerson == null) return;

    let peopleDiv = document.getElementById("peopleDiv");
    let personDiv = document.getElementById(currentPerson.name);
    peopleDiv.removeChild(personDiv);


    for(let i = 0; i < peopleList.length; i++){
        let p = peopleList[i];
        if(p == currentPerson){
            peopleList.splice(i, 1);
        }

    }

    if(peopleList.length > 0){
        
        changeProfile(peopleList[0].name);

    } else {
        currentPerson = null;
    }



}

function makePeople(){

    for(let i = 0; i < 16; i++){
        peopleList.push(new Person(i));
        let person = peopleList[i];

        for(let i = 0; i < saturdays.length; i++){
            person.available.push(Math.random() > 0.5);
        }
    }
    
}

function generateSchedule(){


    let scheduler = new Scheduler(peopleList);
    scheduler.schedule();
    scheduler.schedule();

    let nameListPri = [];
    let nameListEm = [];

    for(let i = 0; i < scheduler.priList.length; i++){
        if(scheduler.priList[i] == "empty"){
            nameListPri[i] = "empty";
        }else{
            nameListPri[i] = scheduler.priList[i].name;
        }
        if(scheduler.emList[i] == "empty"){
            nameListEm[i] = "empty";
        }else{
            nameListEm[i] = scheduler.emList[i].name;
        }
    }


    console.log(nameListPri);
    console.log(nameListEm);

    addTable(nameListPri, nameListEm);


}


function addProfileWeekends(){

    if(currentPerson == null) return;

    let profileDiv = document.getElementById("profile");

    let month1 = saturdays[1].month;
    let month2 = saturdays[6].month;
    let month3 = saturdays[10].month;

    let month1Div = document.getElementById("month1Div");
    let month2Div = document.getElementById("month2Div");
    let month3Div = document.getElementById("month3Div");
    
    for(let i = 0; i < saturdays.length; i++){
        let weekendButton = document.createElement("input");
        weekendButton.setAttribute("type", "button");

        let saturdayStr = saturdays[i].toString();
        let sundayStr = saturdays[i].getNextDay().toString();

        weekendButton.setAttribute("value", saturdayStr + "\n" + sundayStr);
        weekendButton.setAttribute("id", i);

        if(currentPerson != null && currentPerson.available[i]){
            weekendButton.style.background='#00ff00'
        } else{
            weekendButton.style.background='#ff0000'
        }

        weekendButton.addEventListener('click', function(e){
            let btn = e.target;
            let index = btn.id;
            currentPerson.available[index] = !currentPerson.available[index];

            if(currentPerson.available[index]){
                btn.style.background='#00ff00'
            } else{
                btn.style.background='#ff0000'
            }
        })

        if(saturdays[i].month == month1){
            month1Div.appendChild(weekendButton);
        } else if(saturdays[i].month == month2){
            month2Div.appendChild(weekendButton);
        } else if(saturdays[i].month == month3){
            month3Div.appendChild(weekendButton);
        } 

    }

}

function getSaturdays(date){
    //aug,sep,oct -- nov,dec,jan -- feb,mar,apr -- may,jun,jul
    
    let startMonth = (((date.month - 2) % 12) / 3) * 3 + 1;
    let startYear = date.year;
    if(date.month == 0){
        startYear = date.year-1;
    }

    // Date of beggining of 3 month range
    let startDate = new MyDate(0, startMonth, startYear);
    let weekDay = startDate.getWeekday();

    // the five is for saturday
    let currentDay = startDate.getDayPlusN(weekDay - 5);

    let saturdays = [];
    while (currentDay.month != (startDate.month + 3) % 12) { 
        saturdays.push(currentDay);
        currentDay = currentDay.getDayPlusN(7);
    }

    return saturdays;
}

