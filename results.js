async function fetchResults() {
    let response = await fetch("http://127.0.0.1:8080/votes");
    let data = await response.json();

    if (data.error) {
        document.getElementById("message").textContent = "No votes yet!";
        return;
    }

    let labels = Object.keys(data.percentages); // Party names
    let values = Object.values(data.percentages); // Vote percentages

    let ctx = document.getElementById("voteChart").getContext("2d");
    
    new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#8e5ea2"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function delayGoBack() {
    const timerMessage = document.getElementById("timerMessage");
    let countdown = 10;

    const interval = setInterval(() => {
        timerMessage.textContent = `Returning to voting page in ${countdown} seconds...`;
        countdown--;

        if (countdown < 0) {
            clearInterval(interval);
            window.location.href = 'index.html';
        }
    }, 1000);
}

document.getElementById("goBackBtn").addEventListener("click", delayGoBack);

fetchResults();
