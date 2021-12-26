// This function clear all the values
function clearScreen() {
    document.getElementById("amount").value = "";
    document.getElementById("rate").value = "";
    document.getElementById("time").value = "";
    document.getElementById("interest").value = "";
    document.getElementById("total").value = "";
}

// This function evaluates the expression and return result
function calculate() {

    var amt = parseFloat(document.getElementById("amount").value);
    var rate = parseFloat(document.getElementById("rate").value);
    var time = parseFloat(document.getElementById("time").value);

    var int = (amt*time*rate)/100;
    document.getElementById("interest").value = int;

    var sum = amt+int;
    document.getElementById("total").value = amt+int;
}