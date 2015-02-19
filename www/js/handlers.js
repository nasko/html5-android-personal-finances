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
    // console.log(transaction);
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

function initTransactions() {
    if(typeof(Storage) !== "undefined") {
        // global vars
        appTransactions = JSON.parse(sessionStorage.getItem('sessionTransactions')) || fixtureTransactions;
    }

    // global
    distinctMonths = getDistinctMonths(appTransactions);

    var monthSelect = document.getElementById("distinctMonthsSelect");

    // populate the select with distinct months that actually have transactions
    for (var i = 0,op = i+1; i < distinctMonths.length; i++,op++){
        monthSelect[op] = new Option(distinctMonths[i],distinctMonths[i],false,false)
    }

}