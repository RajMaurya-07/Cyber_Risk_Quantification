import numpy as np

def calculate_fair_eal(likelihood: float, potential_loss: float) -> float:
    return likelihood * potential_loss

def run_monte_carlo(mean_loss: float, std_dev: float, iterations: int = 10000):
    return np.random.normal(mean_loss, std_dev, iterations).tolist()
