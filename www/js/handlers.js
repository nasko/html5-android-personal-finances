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