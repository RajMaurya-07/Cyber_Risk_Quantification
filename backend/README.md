# CYBERX — AI-Powered Continuous Cyber Risk Quantification & Investment Optimization Backend

FastAPI + SQLAlchemy + Monte Carlo FAIR Engine + Knapsack Portfolio Optimizer + Machine Learning.

## Features
- **Continuous FAIR Loss Quantification**: Monte Carlo EAL, P90, P95, P99 loss distributions.
- **Attack Graph Engine**: NetworkX reachability graph calculation.
- **Knapsack Investment Optimizer**: Dynamic capital allocation under fixed budget constraints.
- **AI Copilot & ML Predictor**: Threat likelihood prediction and business explanation generation.

## Run Locally
```bash
python -m venv venv
venv\Scripts\activate   # On Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
