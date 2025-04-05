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

// Load dark mode state from localStorage on page load
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    document.querySelectorAll('button').forEach(element => {
        element.classList.add('dark-mode');
    });
    document.body.style.backgroundImage = "url('BYTESQUAD_DARK.jpg')"; // Set dark mode background
    document.getElementById('darkModeToggle').innerHTML = "&#9790;"; // Moon symbol for dark mode
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

// Update dark mode state on toggle
document.getElementById('darkModeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.querySelectorAll('button').forEach(element => {
        element.classList.toggle('dark-mode');
    });

    if (document.body.classList.contains('dark-mode')) {
        document.body.style.backgroundImage = "url('BYTESQUAD_DARK.jpg')"; // Set dark mode background
        document.getElementById('darkModeToggle').innerHTML = "&#9790;";
        localStorage.setItem('darkMode', 'enabled');
    } else {
        document.body.style.backgroundImage = "url('BYTESQUAD.jpg')"; // Set light mode background
        document.getElementById('darkModeToggle').innerHTML = "&#9728;";
        localStorage.setItem('darkMode', 'disabled');
    }
});

fetchResults();
