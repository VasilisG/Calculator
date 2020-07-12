function strToNum(temp){
    var result;
    if(temp.includes(".")){
        result = parseFloat(temp.join(""));
    }
    else result = parseInt(temp.join(""));
    return result;
}

function evaluateExpression(exp){
    var finalResult = 0;
    var newArr = [];
    var temp = [];

    for(var i=0; i<exp.length; i++){
        if(i == exp.length-1){
            temp.push(exp[i]);
            temp = strToNum(temp);
            newArr.push(temp);
            temp = [];
        }
        if(exp[i] == "*" || exp[i] == "/"){
            temp = strToNum(temp);
            newArr.push(temp);
            newArr.push(exp[i]);
            temp = [];
        }
        else if(exp[i] == "+" || exp[i] == "-"){
            if(temp.length == 0){
                temp.push(exp[i]);
            }
            else {
                temp = strToNum(temp);
                newArr.push(temp);
                newArr.push(exp[i]);
                temp = [];
            }
        }
        else temp.push(exp[i]);
    }

    for(var i=0; i<newArr.length; i++){
        if(newArr[i] == "*"){
            var result = newArr[i-1] * newArr[i+1];
            newArr.splice(i-1,0,result);
            newArr.splice(i,3);
            i = 0;
        }
        if(newArr[i] == "/"){
            var result = newArr[i-1] / newArr[i+1];
            newArr.splice(i-1,0,result);
            newArr.splice(i,3);
            i = 0;
        }
    }
   
    for(var i=0; i<newArr.length; i++){
        if(newArr[i] != '+' && newArr[i] != '-'){
            if(i>1 && newArr[i-1] == '-'){
                finalResult -= newArr[i];
                continue;
            }
            finalResult += newArr[i];
        }
    }
    return finalResult;
}

$(document).ready(function(){

    var operators = ['+', '-', '*', '/'];
    var canAppendDecimal = true;

    var $display = $("#display");
    var displayText = '';

    $display.text("0");

    $("#clear").on("click", function(){
        $display.text("0");
        canAppendDecimal = true;
    });

    $(".digit").on("click", function(){
        var number = $(this).find("span").text();
        displayText = $display.text();
        if(number == '0'){
            if(displayText.length > 1 && (displayText[displayText.length-1] != '0' || !operators.includes(displayText[displayText.length-2]))){
                $display.text(displayText + number);
            }
            if(displayText.length == 1 && displayText[0] != '0'){
                $display.text(displayText + number);
            }
            if(displayText.length == 0){
                $display.text(number);
            }
        }
        else {
            if(displayText.length > 1 && (displayText[displayText.length-1] == '0' && operators.includes(displayText[displayText.length-2]))){
                $display.text(displayText.slice(0,displayText.length-1) + number);
            }
            else if(displayText.length == 1 && displayText == '0'){
                $display.text(displayText.slice(0,displayText.length-1) + number);
            }
            else $display.text(displayText + number);
        }
    });

    $(".operator").on("click", function(){
        displayText = $display.text();
        var operator = $(this).find("span").text();
        var prevChar = displayText[displayText.length-1];
        
        if(operator == "-"){
            if(prevChar == "*" || prevChar == "/"){
                $display.text(displayText + operator);
            }
            else if(prevChar == "+"){
                $display.text(displayText.slice(0,displayText.length-1) + operator);
            }
            else if(prevChar != "." && prevChar != "-"){
                $display.text(displayText + operator);
            }
            canAppendDecimal = true;
        }
        else {
            if(operators.includes(prevChar)){
                $display.text(displayText.slice(0,displayText.length-1) + operator);
                displayText = $display.text();
                prevChar = displayText[displayText.length-2];
                if(operators.includes(prevChar)){
                    $display.text(displayText.slice(0,displayText.length-2) + operator);
                }
            }
            else if(prevChar != "."){
                $display.text(displayText + operator);
            }
            canAppendDecimal = true;
        }
    });

    $("#decimal").on("click", function(){
        displayText = $display.text();
        if(displayText.length == 0){
            $display.text("0.");
            canAppendDecimal = false;
        }
        else {
            if(canAppendDecimal){
                if(operators.includes(displayText[displayText.length-1])){
                    $display.text(displayText + '0.');
                }
                else{
                    $display.text(displayText + '.');
                }
                canAppendDecimal = false;
            }
        }
    });

    $("#equals").on("click", function() {
        displayText = $display.text();
        var result;
        var lastChar = displayText[displayText.length-1];
        if(!operators.includes(lastChar) && lastChar != '.'){
            result = evaluateExpression(displayText);
            $display.text(result);
        }
    });
});