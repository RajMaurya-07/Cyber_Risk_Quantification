# app/services/monte_carlo/distributions.py

from typing import Optional, Tuple
import numpy as np


def sample_triangular_impact(
    rng: np.random.Generator,
    min_val: float,
    likely_val: float,
    max_val: float,
    iterations: int,
) -> np.ndarray:
    """
    Samples financial impact from a Triangular distribution parameterized by
    (minimum, most likely, maximum).
    """
    min_v = max(0.0, float(min_val))
    likely_v = max(min_v + 1.0, float(likely_val))
    max_v = max(likely_v + 1.0, float(max_val))
    return rng.triangular(left=min_v, mode=likely_v, right=max_v, size=iterations)


def sample_probability_bernoulli(
    rng: np.random.Generator,
    probability: float,
    iterations: int,
) -> np.ndarray:
    """
    Performs Bernoulli trials (attack occurs / does not occur) with given breach probability.
    Returns boolean array of length iterations.
    """
    prob = min(max(float(probability), 0.0), 1.0)
    return rng.random(iterations) < prob