// Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("predictionForm");

    const tenureSlider = document.getElementById("tenure");
    const monthlySlider = document.getElementById("MonthlyCharges");
    const totalSlider = document.getElementById("TotalCharges");

    const tenureValue = document.getElementById("tenureValue");
    const monthlyValue = document.getElementById("monthlyValue");
    const totalValue = document.getElementById("totalValue");

    const resultElement = document.getElementById("result");
    const probabilityElement = document.getElementById("probability");
    const progressBar = document.getElementById("progress");

    // ----------------------------
    // Live Slider Updates
    // ----------------------------
    tenureSlider.addEventListener("input", () => {
        tenureValue.textContent = tenureSlider.value;
    });

    monthlySlider.addEventListener("input", () => {
        monthlyValue.textContent = monthlySlider.value;
    });

    totalSlider.addEventListener("input", () => {
        totalValue.textContent = totalSlider.value;
    });

    // ----------------------------
    // Form Submit
    // ----------------------------
    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        resultElement.innerText = "Processing...";
        resultElement.style.color = "black";
        probabilityElement.innerText = "";
        progressBar.style.width = "0%";

        // Collect correct form values (radio buttons FIXED)
        const data = {
            gender: document.querySelector('input[name="gender"]:checked').value,
            SeniorCitizen: parseInt(document.querySelector('input[name="SeniorCitizen"]:checked').value),
            tenure: parseInt(tenureSlider.value),
            MonthlyCharges: parseFloat(monthlySlider.value),
            TotalCharges: parseFloat(totalSlider.value),
            Contract: document.querySelector('input[name="Contract"]:checked').value,
            InternetService: document.querySelector('input[name="InternetService"]:checked').value
        };

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
            console.log("Backend Response:", result);

            // Make sure backend sends correct keys
            const probability = Number(result.churn_probability);

            if (isNaN(probability)) {
                throw new Error("Invalid probability from backend");
            }

            const probabilityPercent = (probability * 100).toFixed(2);

            // Update risk text
            resultElement.innerText = "Risk Level: " + result.risk_level;

            // Color coding
            if (result.risk_level === "High") {
                resultElement.style.color = "red";
            } else if (result.risk_level === "Medium") {
                resultElement.style.color = "orange";
            } else {
                resultElement.style.color = "green";
            }

            probabilityElement.innerText = "Churn Probability: " + probabilityPercent + "%";
            progressBar.style.width = probabilityPercent + "%";

        } catch (error) {

            console.error("Error:", error);

            resultElement.innerText = "Error connecting to server.";
            resultElement.style.color = "red";
            probabilityElement.innerText = "";
            progressBar.style.width = "0%";
        }
    });
});
