document.getElementById("predictionForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    // Collect form data
    const data = {
        gender: document.getElementById("gender").value,
        SeniorCitizen: parseInt(document.getElementById("SeniorCitizen").value),
        tenure: parseInt(document.getElementById("tenure").value),
        MonthlyCharges: parseFloat(document.getElementById("MonthlyCharges").value),
        TotalCharges: parseFloat(document.getElementById("TotalCharges").value),
        Contract: document.getElementById("Contract").value,
        InternetService: document.getElementById("InternetService").value
    };

    const resultElement = document.getElementById("result");
    const probabilityElement = document.getElementById("probability");

    // Reset previous results
    resultElement.innerText = "Processing...";
    resultElement.style.color = "black";
    probabilityElement.innerText = "";

    try {
        const response = await fetch("https://render-f854.onrender.com/predict/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error("Server response not OK");
        }

        const result = await response.json();

        // Convert probability to percentage
        const probabilityPercent = (result.churn_probability * 100).toFixed(2);

        // Set Risk Level text
        resultElement.innerText = "Risk Level: " + result.risk_level;

        // Color coding
        if (result.risk_level === "High") {
            resultElement.style.color = "red";
        } else if (result.risk_level === "Medium") {
            resultElement.style.color = "orange";
        } else {
            resultElement.style.color = "green";
        }

        // Show probability
        probabilityElement.innerText = "Churn Probability: " + probabilityPercent + "%";

    } catch (error) {
        resultElement.innerText = "Error connecting to server.";
        resultElement.style.color = "red";
        probabilityElement.innerText = "";
        console.error(error);
    }
});
