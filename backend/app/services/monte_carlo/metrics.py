# app/services/monte_carlo/metrics.py

from typing import Dict
import numpy as np


def summarize_losses(losses: np.ndarray) -> Dict[str, float]:
    """Turns a raw simulated-loss array into the standard reporting metrics."""
    return {
        "mean_eal": round(float(np.mean(losses)), 2),
        "std_eal": round(float(np.std(losses)), 2),
        "p50": round(float(np.percentile(losses, 50)), 2),
        "p90": round(float(np.percentile(losses, 90)), 2),
        "p95": round(float(np.percentile(losses, 95)), 2),
        "p99": round(float(np.percentile(losses, 99)), 2),
        "max_loss": round(float(np.max(losses)), 2),
    }