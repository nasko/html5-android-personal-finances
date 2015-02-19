function newTransactionSubmitted() {
    var trType = document.getElementById('transactionType').value;
    var trDate = moment(document.getElementById('transactionDate').value, "YYYY-MM-DD");
    var trMonth = trDate.month();
    var trYear = trDate.year();

    var trAmountAbsolute = Math.abs(document.getElementById('transactionAmount').value);
    var trPayee = document.getElementById('transactionPayee').value;
    var trNote = document.getElementById('transactionNote').value;

    var transaction = {
        "date": trDate,
        "type": trType,
        "amount": ('deposit' === trType ? 1 : -1) * trAmountAbsolute,
        "payee": trPayee,
        "note": trNote
    };
    if(false === appTransactions.hasOwnProperty(trYear)) {
        appTransactions[trYear] = {};
    }

    if(false === appTransactions[trYear].hasOwnProperty(trMonth)) {
        appTransactions[trYear][trMonth] = [];
    }

    appTransactions[trYear][trMonth].push(transaction);
    if(typeof(Storage) !== "undefined") {
        sessionStorage.setItem('sessionTransactions', JSON.stringify(appTransactions));
        console.log(JSON.parse(sessionStorage.getItem('sessionTransactions')));
    }

    // populate the select with distinct months in case we just added a new distinct monnth to the
    // dictionary
    populateQuerySelectOptions();

    // console.log(transaction);
    return false;
}

function newQuerySubmitted(e) {

    var queryMethod = querySubmitActor.id;
    var result = window[queryMethod]();
    //console.log(querySubmitActor);
    return false;
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
    return true;
}

function initApp() {
    if(typeof(Storage) !== "undefined") {
        // global vars
        appTransactions = JSON.parse(sessionStorage.getItem('sessionTransactions')) || fixtureTransactions;
    }

    populateQuerySelectOptions();


    addEvent(document.getElementById('queryAverageExpenditure'), 'click', queryButtonClicked);
    addEvent(document.getElementById('queryMonthlyBalance'), 'click', queryButtonClicked);
    addEvent(document.getElementById('queryTransactionsForm'), 'submit', newQuerySubmitted);
    addEvent(document.getElementById('newTransactionForm'), 'submit', newTransactionSubmitted);

}

function queryButtonClicked(e) {
    e = e || window.event;
    // global var
    querySubmitActor = e.target || e.srcElement;
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
    return avgExp;
}

