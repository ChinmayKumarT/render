from pydantic import BaseModel

class CustomerData(BaseModel):
    gender: str
    SeniorCitizen: int
    tenure: int
    MonthlyCharges: float
    TotalCharges: float
    Contract: str
    InternetService: str
