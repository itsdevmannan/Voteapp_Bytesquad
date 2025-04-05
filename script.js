document.getElementById('voteForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    const voterId = document.querySelector('input[name="voter_id"]').value;
    const adhaarId = document.querySelector('input[name="adhaar_id"]').value;
    const party = document.querySelector('select[name="party"]').value;
    const messageBox = document.getElementById('messageBox');

    try {
        // Validate Aadhaar ID before submitting the vote
        let validateResponse = await fetch(`https://voteapp-bytesquad.onrender.com/${adhaarId}`);
        let validateData = await validateResponse.json();

        if (!validateResponse.ok) {
            messageBox.style.color = "red";
            messageBox.textContent = "❌ " + validateData.error;
            return;
        }

        // Make the POST request to store the vote
        let response = await fetch("https://voteapp-bytesquad.onrender.com/vote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "voter_id": voterId,
                "adhaar_id": adhaarId
            },
            body: JSON.stringify({ party })
        });

        let data = await response.json();

        // Handle success or error message
        if (response.ok) {
            messageBox.style.color = "green";
            messageBox.textContent = "✅ Vote recorded successfully!";
            
            // Enable the Show Results button after voting
            document.getElementById("resultsBtn").disabled = false;
        } else {
            messageBox.style.color = "red";
            messageBox.textContent = "❌ " + data.error;
        }
    } catch (error) {
        console.error('Error submitting vote:', error);
        messageBox.style.color = "red";
        messageBox.textContent = "❌ An error occurred while submitting your vote.";
    }
});

const darkModeToggle = document.getElementById('darkModeToggle');

// Load dark mode state from localStorage on page load
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    document.querySelectorAll('button, input, select, .message').forEach(element => {
        element.classList.add('dark-mode');
    });
    document.body.style.backgroundImage = "url('BYTESQUAD_DARK.jpg')";
    darkModeToggle.innerHTML = "&#9790;"; // Moon symbol for dark mode
}

// Update dark mode state on toggle
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.querySelectorAll('button, input, select, .message').forEach(element => {
        element.classList.toggle('dark-mode');
    });

    if (document.body.classList.contains('dark-mode')) {
        document.body.style.backgroundImage = "url('BYTESQUAD_DARK.jpg')";
        darkModeToggle.innerHTML = "&#9790;";
        localStorage.setItem('darkMode', 'enabled');
    } else {
        document.body.style.backgroundImage = "url('BYTESQUAD.jpg')";
        darkModeToggle.innerHTML = "&#9728;";
        localStorage.setItem('darkMode', 'disabled');
    }
});