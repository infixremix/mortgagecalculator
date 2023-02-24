// JavaScript source code
function calculate() {
	// Get input values
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
