//create an object from the values involved
function changeDivision() {
    var division = {
        "numerator": parseInt($("#numerator").val(), 10),
        "denominator": parseInt($("#denominator").val(), 10),
        "nonDecimal": 0
    };
    repetitionFinder(division);
}

//calculate the non-decimal part, change denominator and nonDecimal values of the object accordingly
function calcNonDecimal(division) {
    if (division.numerator > division.denominator) {
        division.nonDecimal = Math.floor(division.numerator / division.denominator)
        division.numerator = division.numerator % division.denominator;
    }
}

//simplify the pair
function simplify(division) {
    var numCopy = division.numerator;
    for (var i = 2; i <= numCopy; i++) {
        while (division.numerator % i == 0 && division.denominator % i == 0) {
            division.numerator /= i;
            division.denominator /= i;
        }
    }
}

//check for repetition
function checkIfRepeats(division) {
    var denCopy = division.denominator;
    while (denCopy % 5 === 0 && denCopy > 0) {
        denCopy /= 5;
    }
    while (denCopy % 2 === 0 && denCopy > 0) {
        denCopy /= 2;
    }
    return !(denCopy === 1);
}

//returns the length of the repetition
function lengthOfRepetition(division) {
    var value = 1,
        length = 0,
        n = division.denominator;
    while (n % 2 == 0 && n > 0) {
        n /= 2;
    }
    while (n % 5 == 0 && n > 0) { //makes sure not divisable by 2 or 5
        n /= 5;
    }

    do {
        value = value * 10;
        value = value % n;
        length++;
    } while (value != 1); //checks after how many steps 'value' returns to what it started as
    return length;
}

//applies long division and returns the results in an array
function longDivision(division, length) {
    var remainder = 0,
        num = division.numerator,
        den = division.denominator,
        tracker,
        number = [];

    for (var i = 0; i < length * 3; i++) {
        tracker = 0;
        while (num < den) {
            num *= 10;
            if (tracker) {
                number.push(0);
                i++;
            }
            tracker++;
        }
        remainder = num % den;
        number.push(Math.floor(num / den));
        num = remainder;
    }
    return number;
}

//finds the repeating part and returns different parts in an object
function findRepetition(divided, len) {
    var match, nonRepeatString = "";
    for (var i = 0; i < len * 3; i++) {
        match = 0;
        var repeatString = "";
        for (var j = 0; j < len; j++) { //check the series for each digit
            if (divided[i + j] == divided[i + j + len]) { //check if repeats
                match++;
                repeatString += divided[i + j];
            }
        }
        if (match == len) { //if all the repeating digits were present.
            return {
                'repeat': true,
                'repeating': repeatString,
                'afterDecimal': nonRepeatString
            };
        } else {
            nonRepeatString += divided[i + j];
        }
    }
}

//puts the result to DOM
function display(toDisplay) {
    if (toDisplay.repeat) { //if repeats, formatting is required
        $("#result").html("= " + toDisplay.beforeDecimal + "." + toDisplay.afterDecimal + "<span class='repeating-part'>" + toDisplay.repeating + "</span>");
        $("#repetition-length").text("Length of Repetition: " + toDisplay.len);
    } else {
        $("#result").text("= " + (toDisplay.beforeDecimal + toDisplay.afterDecimal));
        $("#repetition-length").text("No repetition");
        console.log(toDisplay);
    }
}

//calculate the repeating part
function repetitionFinder(division) {
    //calculate the non-decimal part
    calcNonDecimal(division);

    if (division.numerator === 0) { //to prevent dividing by 0 and other unwanted errors
        display({
            'repeat': false,
            'beforeDecimal': division.nonDecimal,
            'afterDecimal': ""
        });
        return;
    }

    //simplify the pair
    simplify(division);

    //check for repetition
    if (checkIfRepeats(division)) { //repeats
        var lenRep = lengthOfRepetition(division);
        var longDivided = longDivision(division, lenRep);
        var toDisplay = findRepetition(longDivided, lenRep);
        toDisplay.beforeDecimal = division.nonDecimal;
        toDisplay.len = lenRep;
        display(toDisplay);
    } else { //doesn't repeat, we can just divide and print
        display({
            'repeat': false,
            'beforeDecimal': division.nonDecimal,
            'afterDecimal': division.numerator / division.denominator
        });
    }
}


function falseInput() {
    $('#numerator').css("background-color", "red");
    $('#denominator').css("background-color", "red")
}

function correctInput() {
    $('#numerator').css("background-color", "white");
    $('#denominator').css("background-color", "white")
}

window.onload = function () {
    var clipboard = new Clipboard('.btn');

    //evaluate the function as input is given
    $('input').bind("input", function () {
        if (/[^0-9]/g.test($('#numerator').val()) || /^0/.test($('#denominator').val()) ||
            /[^0-9]/g.test($('#denominator').val())) { //if something other than a number is given
            falseInput();
            return;
        } else {
            correctInput();
        }

        if ($('#numerator').val() !== "" && $('#denominator').val() !== "") { //if there is input
            $("#result-section").show();
            changeDivision();
        }
    });
};
