import pickle
import numpy as np

def predict_likelihood(cvss, criticality, internet_facing, exploit_active, incidents):
    return min(0.99, max(0.01, (cvss * 0.05) + (criticality * 0.03) + (0.2 if internet_facing else 0)))
