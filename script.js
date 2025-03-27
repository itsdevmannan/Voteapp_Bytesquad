document.getElementById('voteForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    const voterId = document.querySelector('input[name="voter_id"]').value;
    const party = document.querySelector('select[name="party"]').value;
    const messageBox = document.getElementById('messageBox');

    try {
        // Make the POST request to store the vote
        let response = await fetch("http://127.0.0.1:8080/vote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "voter_id": voterId
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