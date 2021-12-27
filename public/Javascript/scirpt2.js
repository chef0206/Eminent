// This function clear all the values
function clearScreen() {
    document.getElementById("amount").value = "";
    document.getElementById("month").value = "";
    document.getElementById("rate").value = "";
    document.getElementById("interest").value = "";
    document.getElementById("total").value = "";
}

// This function evaluates the expression and return result
function calculate() {

    var amt = parseFloat(document.getElementById("amount").value);
    var rate = parseFloat(document.getElementById("rate").value);
    var month = parseFloat(document.getElementById("month").value);

    var mon = (amt/month);
    var monthly = mon + (mon*rate)/100;
    document.getElementById("interest").value = monthly;

    var sum = monthly*month;
    document.getElementById("total").value = sum;
}