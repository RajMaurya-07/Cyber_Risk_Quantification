import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import pickle
import os

print("Training CYBERX Likelihood Model...")
df = pd.read_csv("ml/datasets/training_data.csv")
X = df.drop("exploit_probability", axis=1)
y = df["exploit_probability"]

model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)

os.makedirs("ml/models", exist_ok=True)
with open("ml/models/likelihood_model.pkl", "wb") as f:
    pickle.dump(model, f)
print("Model trained and saved to ml/models/likelihood_model.pkl")
