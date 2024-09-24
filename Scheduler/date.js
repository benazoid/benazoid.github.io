
class MyDate{

    constructor(day_, month_, year_){
        this.day = day_;
        this.month = month_;
        this.year = year_;
    }


    static monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    toString(){
        return MyDate.monthNames[this.month] + " " + (this.day + 1) + ", " + (this.year);
    }
    toShortString(){
        return (""+(this.month+1)+"/"+(this.day+1)+"/"+(this.year));
    }

    getDayPlusN(n){

        let currentDate = this;
        if (n >= 0) {
            for (let i = 0; i < n; i++) {
                currentDate = currentDate.getNextDay();
            }
        } else {
            for (let i = 0; i > n; i--) {
                currentDate = currentDate.getNextDay();
            }
        }
        
        return currentDate;

    }

    getNextDay(){

        let monthDaysArr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (this.isLeapYear(this.year)) {
            monthDaysArr[1] = 29;
        }

        let newDay = this.day + 1;
        let newMonth = this.month;
        let newYear = this.year;

        if((this.day + 1) == monthDaysArr[this.month]){
            newDay = 0;
            newMonth = this.month + 1;
        }
        if (newMonth > 11) {
            newMonth = 0;
            newYear = this.year + 1;
        }

        return new MyDate(newDay, newMonth, newYear);
    }

    getPrevDay(){

        let monthDaysArr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (isLeapYear(year)) {
            monthDaysArr[1] = 29;
        }

        let newDay = this.day - 1;
        let newMonth = this.month;
        let newYear = this.year;

        if(day == 0){
            newMonth = this.month - 1;
            newDay = monthDaysArr[newMonth % 12];
        }
        if (newMonth == -1) {
            newMonth = 11;
            newYear = this.year - 1;
        }

        return new MyDate(newDay, newMonth, newYear);
    }



    // Monday = 0 ... Sunday = 6
    getWeekday(){

        // Jan 1, 1900 was a Monday
        let dayCt = 0;

        for (let y = 1900; y < this.year; y++) {
            if(!this.isLeapYear(y)){
                dayCt += 365;
            }
            else{
                dayCt += 366;
            }
        }

        let monthDaysArr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (this.isLeapYear(this.year)) {
            monthDaysArr[1] = 29;
        }

        for (let m = 0; m < this.month; m++) {
            dayCt += monthDaysArr[m];
        }

        dayCt += this.day;

        return dayCt % 7;

    }

    isLeapYear(y){
        return (y % 4 == 0) && (!(y % 100 == 0) || (y % 400 == 0));
    }


};


class Person{
    constructor(name, weekends){
        this.name = name;
        this.available = [];
        for(let i = 0; i < weekends; i++){
            this.available.push(0);
        }
    }

    getAvailabilityScore(){
        let score = 0;
        for(let i = 0; i < this.available.length; i++){
            if(this.available[i]){
                score++;
            }
        }
        return score;
    }
}