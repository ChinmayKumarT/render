from fastapi import FastAPI
from app.schema import CustomerData
import pandas as pd
import joblib

app = FastAPI()

model = joblib.load("models/churn_pipeline.pkl")
feature_columns = joblib.load("models/feature_columns.pkl")

@app.post("/predict")
def predict(data: CustomerData):

    # Convert input to dictionary
    input_dict = data.dict()

    # Convert to DataFrame
    input_df = pd.DataFrame([input_dict])

    # Apply same one-hot encoding
    input_df = pd.get_dummies(input_df)

    # Add missing columns
    for col in feature_columns:
        if col not in input_df.columns:
            input_df[col] = 0

    # Ensure same column order
    input_df = input_df[feature_columns]

    # Predict
    prediction = model.predict_proba(input_df)[0][1]

    return {
        "churn_probability": float(prediction),
        "risk_level": "High" if prediction > 0.5 else "Low"
    }
