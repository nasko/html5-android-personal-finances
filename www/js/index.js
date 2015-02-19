// add event cross browser
function addEvent(elem, event, fn) {
    // avoid memory overhead of new anonymous functions for every event handler that's installed
    // by using local functions
    function listenHandler(e) {
        var ret = fn.apply(this, arguments);
        if (ret === false) {
            e.stopPropagation();
            e.preventDefault();
        }
        return(ret);
    }

    function attachHandler() {
        // set the this pointer same as addEventListener when fn is called
        // and make sure the event is passed to the fn also so that works the same too
        var ret = fn.call(elem, window.event);
        if (ret === false) {
            window.event.returnValue = false;
            window.event.cancelBubble = true;
        }
        return(ret);
    }

    if (elem.addEventListener) {
        elem.addEventListener(event, listenHandler, false);
    } else {
        elem.attachEvent("on" + event, attachHandler);
    }
}

function arrayHasOwnIndex(array, prop) {
    return array.hasOwnProperty(prop) && /^0$|^[1-9]\d*$/.test(prop) && prop <= 4294967294; // 2^32 - 2
}

function getDistinctMonths(transactions) {
    var dMonths = [];

    for (var year in transactions) {
        if (arrayHasOwnIndex(transactions, year)) {
            for (var month in transactions[year]) {
                if (arrayHasOwnIndex(transactions[year], month)) {
                    dMonths.push(String(year) + '/' + String(++month));
                }
            }
        }
    }
    return dMonths;
}

function populateQuerySelectOptions() {
    // global
    distinctMonths = getDistinctMonths(appTransactions);

    var monthSelect = document.getElementById("distinctMonthsSelect");
    // purge existing options
    monthSelect.length = 0;

    // populate the select with distinct months that actually have transactions
    monthSelect[0] = new Option('-- Изберете месец --','',false,true);
    monthSelect[0].disabled = true;

    for (var i = 0,op = i+1; i < distinctMonths.length; i++,op++){
        monthSelect[op] = new Option(distinctMonths[i],distinctMonths[i],false,false);
    }
    showTransactionsTable();
    return true;
}

function daysInMonth(y,m) {
    m = parseInt(m) + 1;
    return moment(String(y) + '-' + String(m), "YYYY-M").daysInMonth();
}

function queryMonthlyBalance() {
    var monthSelected = document.getElementById("distinctMonthsSelect").value;
    var parts = monthSelected.split('/');
    var year = parts[0];
    // months are zero-based
    var month = parts[1]-1;

    var transactions = appTransactions[year][month];

    var monthlyBalance = 0.00;
    var trLength = transactions.length;

    for(var i= 0; i < trLength; i++) {
        monthlyBalance += transactions[i].amount;
    }

    console.log("Month: " + monthSelected);
    console.log("Monthly balance: " + monthlyBalance.toFixed(2));
    
    var tableHTML = "<table border=\"1\"><tr><th> Month </th><th> Monthly balance </th></tr>";
    tableHTML += "<tr><td>" + monthSelected + "</td><td>" + monthlyBalance + "</td></tr>";
    var tableDiv = document.getElementById('showAveregeOrBalnce');
    tableDiv.innerHTML = tableHTML;
    
    return monthlyBalance.toFixed(2);
}

function queryAverageExpenditure() {
    var monthSelected = document.getElementById("distinctMonthsSelect").value;
    var parts = monthSelected.split('/');
    var year = parts[0];
    // months are zero-based
    var month = parts[1]-1;

    var transactions = appTransactions[year][month];
    var dInMonth = daysInMonth(year, month);

    var totalExpenditure = 0.00;
    var trLength = transactions.length;

    for(var i= 0; i < trLength; i++) {
        var amount = transactions[i].amount;
        // only withdrawals are regarded
        if (0 > amount) {
            totalExpenditure += amount;
        }
    }

    var avgExp = (Math.abs(totalExpenditure) / dInMonth).toFixed(2);

    console.log("Total expenditure: " + totalExpenditure);
    console.log("Month: " + monthSelected);
    console.log("Days in month: " + dInMonth);
    console.log("Average expenditure: " + avgExp);
    
    var tableHTML = "<table border=\"1\"><tr><th> Total expenditure: </th><th> Month </th><th> Days in month: </th><th> Average expenditure: </th></tr>";
    tableHTML += "<tr><td>" + totalExpenditure + "</td><td>" + monthSelected + "</td><td>" + dInMonth + "</td><td>" + avgExp + "</td></tr>";
    var tableDiv = document.getElementById('showAveregeOrBalnce');
    tableDiv.innerHTML = tableHTML;
    
    return avgExp;
}

function showTransactionsTable() {
    var tableHTML = "<p>Транзакции:</p><table border=\"1\" style=\"width:100%\"><tr><th> Date </th><th> Type </th><th> Amount </th><th> Payee </th><th> Note </th></tr>";
    
    var parts = distinctMonths[0].split('/');
    var year = parts[0];
    // months are zero-based
    var month = parts[1]-1;
    var transactions = appTransactions[year][month];
    for (i in distinctMonths){
        parts = distinctMonths[i].split('/');
        year = parts[0];
        // months are zero-based
        month = parts[1]-1;
        transactions = appTransactions[year][month];
        for(var j = 0; j<transactions.length; j++){
            tableHTML += '<tr><td>' + transactions[j].date._i + '</td>';
            tableHTML += '<td>' + transactions[j].type + '</td>';
            tableHTML += '<td>' + transactions[j].amount + '</td>';
            tableHTML += '<td>' + transactions[j].payee + '</td>';
            tableHTML += '<td>' + transactions[j].note + '</td></tr>';
        }
    }
    
    var tableDiv = document.getElementById('showTransactionsTable');
    tableDiv.innerHTML = tableHTML;
    
}
