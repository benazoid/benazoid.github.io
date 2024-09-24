
class Scheduler {

    constructor(people){
        this.people = people;

        let daysLength = people[0].available.length;
        this.priList = [];
        this.emList = [];
        for(let i = 0; i < daysLength; i++){
            this.priList[i] = "empty";
            this.emList[i] = "empty";
        }
        
    }

    schedule(){
        // Sort people on how available they are
        let people = sortPeople(this.people);
        // Sort days on how available they are
        let days = sortDays(this.people);

        // Assign the least available people to the least available days
        for(let pi = 0; pi < people.length; pi++){
            for(let di = 0; di < days.length; di++){
                if(this.personCanDoShift(people[pi], days[di])){
                    let priOrEm = this.primaryOrEmergency(days[di]);
                    if(priOrEm == 0){
                        this.priList[days[di]] = people[pi];
                    } else if(priOrEm == 1){
                        this.emList[days[di]] = people[pi];
                    }
                    break;
                }
            }
        }
    }

    personCanDoShift(person, dayIndex){
        let available = person.available[dayIndex];
        let dayFull = !(this.priList[dayIndex] == "empty" || this.emList[dayIndex] == "empty");
        let alreadyWorking = (this.priList[dayIndex] === (person) || this.emList[dayIndex] === (person));
        

        return available && !dayFull && !alreadyWorking;
    }

    primaryOrEmergency(dayIndex){
        let dayFull = !(this.priList[dayIndex] == "empty" || this.emList[dayIndex] == "empty");
        if(dayFull){
            console.error("day is full");
            return -1;
        }
        let bothEmpty = (this.priList[dayIndex] == "empty" && this.emList[dayIndex] == "empty");
        if(bothEmpty){
            return Math.round(Math.random());
        } else if(this.priList[dayIndex] == "empty") {
            return 0;
        } else{
            return 1;
        }
    }

}




function sortDays(people){

    let daysLength = people[0].available.length;
    let sortedDays = [];
    for(let i = 0; i < daysLength; i++){
        sortedDays[i] = i;
    }
    for(let i = 0; i < daysLength; i++){
        for(let j = 0; j < daysLength - 1; j++){
            let day1 = sortedDays[j];
            let day2 = sortedDays[j + 1];
            if(getDayScore(people, day1) > getDayScore(people, day2)){
                sortedDays[j] = day2;
                sortedDays[j + 1] = day1;
            }
        }
    }

    return sortedDays;
}

function getDayScore(people, dayIndex){

    let score = 0;
    for(let i = 0; i < people.length; i++){
        if(people[i].available[dayIndex]){
            score++;
        }
    }
    return score;
}


function sortPeople(people){
    let sortedPeople = [];
    for(let i = 0; i < people.length; i++){
        sortedPeople.push(people[i]);
    }

    for(let i = 0; i < people.length; i++){
        for(let j = 0; j < people.length - 1; j++){
            let p1 = sortedPeople[j];
            let p2 = sortedPeople[j + 1];
            if(p1.getAvailabilityScore() > p2.getAvailabilityScore()){
                sortedPeople[j] = p2;
                sortedPeople[j+1] = p1;
            }
        }
    }

    return sortedPeople;
}

