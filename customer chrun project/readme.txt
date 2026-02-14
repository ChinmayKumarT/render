Customer Churn Prediction with Explainable ML & API Deployment
--Overview
This project builds an end-to-end customer churn prediction system for a telecom dataset.
It includes:
* Data preprocessing and model training
* Model comparison (Logistic Regression vs Random Forest)
* Explainable AI using SHAP
* Production-ready FastAPI REST API
* Docker containerization for deployment
The final solution prioritizes recall for churn customers, ensuring that high-risk customers are not missed.

Problem Statement
--Customer churn directly impacts revenue.
The objective is to:
* Predict whether a customer will churn
* Identify key churn drivers
* Provide actionable business insights
* Deploy the model as a REST API

Dataset
--Telco Customer Churn dataset containing:
* Demographic information
* Service subscriptions
* Billing details
* Contract types
* Internet service types
Target variable: Churn (Yes / No)

Data Preprocessing
* Removed irrelevant identifiers
* Converted TotalCharges to numeric
* Handled missing values
* Applied one-hot encoding using pd.get_dummies
* Used stratified train-test split
* Prevented data leakage
* Integrated scaling inside a Pipeline

 Model Development
1-- Logistic Regression (Final Model)
Used Pipeline to combine:
* StandardScaler
* LogisticRegression (class_weight="balanced")
Test Performance
* Recall (Churn class): ~0.80
* Precision (Churn class): ~0.51
* ROC-AUC: ~0.84
Recall was prioritized to minimize missed churners.

2-- Random Forest (Evaluated)
Random Forest was tested but did not significantly improve ROC-AUC or recall.
The simpler Logistic Regression model was selected for:
* Comparable performance
* Better interpretability
* Easier deployment

Explainable AI (SHAP)
SHAP was used to interpret:
Global Insights
Top churn drivers:
* Short tenure
* High monthly charges
* High total charges
* Month-to-month contracts
* Fiber optic internet service
Protective factors:
* Long-term contracts
* Longer tenure
Local Insights
Individual predictions were analyzed using SHAP force plots to understand why specific customers were predicted as high-risk.

Production Architecture
Training
* Model trained using sklearn Pipeline
* Entire pipeline serialized using joblib
* Feature columns saved to maintain consistent inference
API
* Built using FastAPI
* Accepts raw customer input
* Reconstructs feature space
* Returns:
o Churn probability
o Risk level (High / Low)
Endpoint:
POST /predict

Docker Deployment
Dockerized using:
* Python 3.10 slim base image
* Requirements defined in requirements.txt
* FastAPI served via Uvicorn
Build:
docker build -t churn-api .
Run:
docker run -p 8000:8000 churn-api
Swagger docs:
http://localhost:8000/docs

Project Structure
customer-churn-api/

+-- app/
   +-- main.py
   +-- schema.py

+-- model/
   +-- churn_pipeline.pkl
   +-- feature_columns.pkl

+-- Dockerfile
+-- requirements.txt
+-- README.md

Business Impact
Instead of blanket retention campaigns, this system enables:
* Targeted retention for short-tenure customers
* Strategic contract upgrades
* Focused interventions for high monthly charge segments

Limitations
* SHAP explains model behavior, not causality
* Dataset represents a specific telecom context
* Model requires retraining for different markets

Tech Stack
* Python
* Pandas
* NumPy
* scikit-learn
* SHAP
* FastAPI
* Docker

Key Learnings
* Importance of preventing data leakage
* Model simplicity vs complexity trade-offs
* Feature alignment during deployment
* End-to-end ML pipeline engineering
* Containerized model serving

Final Note
This project demonstrates not only machine learning modeling but also:
* Engineering discipline
* Production deployment mindset
* Explainable AI integration
* Business-focused decision making



POST /predict

{
  "tenure": 12,
  "MonthlyCharges": 70.35,
  ...
}

{
  "churn_probability": 0.82,
  "risk_level": "High"
}
