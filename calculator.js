function calculate() {
	// Get input values
	document.getElementById("paymentScheduleWrapper").style.display = "block";
	var loanAmount = document.getElementById("loanAmount").value;
	var interestRate = document.getElementById("interestRate").value;
	var loanTerm = document.getElementById("loanTerm").value;
	var paymentFrequency = document.getElementById("paymentFrequency").value;
	var startDate = document.getElementById("startDate").value;

	// Validate input values
	if (!loanAmount) {
		alert("Please enter the loan amount.");
		return;
	}
	if (!interestRate) {
		alert("Please enter the interest rate.");
		return;
	}
	if (!loanTerm) {
		alert("Please enter the loan term.");
		return;
	}

	// Convert interest rate to monthly rate
	var monthlyRate = interestRate / 1200;

	// Calculate number of payments
	var numPayments;
	if (paymentFrequency == "monthly") {
		numPayments = loanTerm * 12;
	} else if (paymentFrequency == "biweekly") {
		numPayments = loanTerm * 26;
	} else {
		numPayments = loanTerm * 52;
	}

	// Calculate mortgage payment
	var mortgagePayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numPayments));

	// Calculate payment schedule
	var balance = loanAmount;
	var principalPaid = 0;
	var interestPaid = 0;
	var totalPayments = 0;
	var paymentDate = new Date(startDate);
	var paymentSchedule = document.getElementById("paymentSchedule").getElementsByTagName("tbody")[0];
	paymentSchedule.innerHTML = "";
	for (var i = 0; i < numPayments; i++) {
		// Calculate interest paid
		var interest = balance * monthlyRate;
		interestPaid += interest;

		// Calculate principal paid
		var principal = mortgagePayment - interest;
		principalPaid += principal;

		// Update balance
		balance -= principal;

		// Add row to payment schedule table
		var row = paymentSchedule.insertRow();
		var cell1 = row.insertCell();
		var cell2 = row.insertCell();
		var cell3 = row.insertCell();
		var cell4 = row.insertCell();
		var cell5 = row.insertCell();
		cell1.innerHTML = paymentDate.toLocaleDateString("en-GB", { day: "numeric", month: "numeric", year: "numeric" });
		cell2.innerHTML = mortgagePayment.toFixed(2);
		cell3.innerHTML = principal.toFixed(2);
		cell4.innerHTML = interest.toFixed(2);
		cell5.innerHTML = balance.toFixed(2);

		// Increment payment date
		if (paymentFrequency == "monthly") {
			paymentDate.setMonth(paymentDate.getMonth() + 1);
		} else if (paymentFrequency == "biweekly") {
			paymentDate.setDate(paymentDate.getDate() + 14);
		} else {
			paymentDate.setDate(paymentDate.getDate() + 7);
		}

		// Update total payments
		totalPayments += mortgagePayment;
	}

	// Display total payments
	document.getElementById("totalPayments").innerHTML = "Total payments: &pound;" + totalPayments.toFixed(2);

	// Add "Show More" button
	var tableRows = paymentSchedule.rows;
	var showMoreButton = document.createElement("button");
	showMoreButton.textContent = "Show More";
	showMoreButton.classList = "btn btn-primary";
	showMoreButton.onclick = function () {
		for (var i = 0; i < numPayments; i++) {
			tableRows[i].style.display = "table-row";
		}
		showMoreButton.style.display = "none";
	};
	paymentSchedule.parentElement.appendChild(showMoreButton);

	// Hide rows beyond the row limit
	var rowLimit = 12;
	for (var i = rowLimit; i < tableRows.length; i++) {
		tableRows[i].style.display = "none";
	}
}
// Encrypt data using AES encryption
function encryptData(data, password) {
  var encryptedData;
  try {
    var salt = CryptoJS.lib.WordArray.random(128/8); // generate random salt
    var key = CryptoJS.PBKDF2(password, salt, { keySize: 256/32 }); // derive key from password and salt
    var iv = CryptoJS.lib.WordArray.random(128/8); // generate random IV
    encryptedData = CryptoJS.AES.encrypt(data, key, { iv: iv }).toString() + ":" + salt.toString() + ":" + iv.toString(); // concatenate ciphertext, salt, and IV
  } catch (err) {
    console.error(err);
    return null;
  }
  return encryptedData;
}
// Encrypt and save data to local storage
function saveData() {
  // Get input values
  var loanAmount = document.getElementById("loanAmount").value;
  var interestRate = document.getElementById("interestRate").value;
  var loanTerm = document.getElementById("loanTerm").value;
  var paymentFrequency = document.getElementById("paymentFrequency").value;
  var startDate = document.getElementById("startDate").value;

  // Check if any input is empty
  if (!loanAmount || !interestRate || !loanTerm || !paymentFrequency || !startDate) {
    alert("Please fill out all fields.");
    return;
  }

  // Create data object
  var data = {
    loanAmount: loanAmount,
    interestRate: interestRate,
    loanTerm: loanTerm,
    paymentFrequency: paymentFrequency,
    startDate: startDate
  };

  // Get user password
  var password = prompt("Please enter a password to protect your data:");

  // Encrypt data and save to local storage
  var encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), password).toString();
  localStorage.setItem("mortgageData", encryptedData);
  alert("Data saved successfully.");
}

// Load and decrypt data from local storage
function loadData() {
  // Get user password
  var password = prompt("Please enter your password to access your data:");

  // Load data from local storage
  var encryptedData = localStorage.getItem("mortgageData");

  // Check if data is empty
  if (!encryptedData) {
    alert("No saved data found.");
    return;
  }

  // Decrypt data using user password
  try {
    var decryptedData = CryptoJS.AES.decrypt(encryptedData, password).toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.error(err);
    alert("Incorrect password. Please try again.");
    return;
  }

  // Parse decrypted data and set input values
  var data = JSON.parse(decryptedData);
  document.getElementById("loanAmount").value = data.loanAmount;
  document.getElementById("interestRate").value = data.interestRate;
  document.getElementById("loanTerm").value = data.loanTerm;
  document.getElementById("paymentFrequency").value = data.paymentFrequency;
  document.getElementById("startDate").value = data.startDate;
  calculate();
  alert("Data loaded successfully.");
}
function exportToCSV() {
  var csvRows = [];
  var headers = ["Date", "Payment Amount", "Principal", "Interest", "Balance"];
  var paymentSchedule = document.getElementById("paymentSchedule").getElementsByTagName("tbody")[0];

  // Push header row to csvRows
  csvRows.push(headers.join(","));

  // Loop through payment schedule table rows and push to csvRows
  for (var i = 0; i < paymentSchedule.rows.length; i++) {
    var rowData = [];
    var row = paymentSchedule.rows[i];

    for (var j = 0; j < row.cells.length; j++) {
      rowData.push(row.cells[j].innerText);
    }

    csvRows.push(rowData.join(","));
  }

  // Join csvRows with new line separator
  var csvString = csvRows.join("\n");

  // Encode the CSV data as a URI
  var encodedCSV = encodeURIComponent(csvString);
  var dataUri = "data:text/csv;charset=utf-8," + encodedCSV;

  // Create mailto link with CSV data URI as the body
  var mailtoLink = "mailto:recipient@example.com?subject=Payment Schedule&body=" + encodedCSV;

  // Open the mailto link in the current tab
  window.location.href = mailtoLink;
}
