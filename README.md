# Cloud Trading Robot Platform Skeleton

## Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt  # or install dependencies manually
uvicorn main:app --reload
```

## Frontend (Vite + React + Tailwind)

```bash
cd frontend
npm install
npm run dev
```

## Docker Compose (Local Dev)

```bash
cd devops
# Build and run both services
docker-compose up --build
```

## Kubernetes (Cloud Deployment)

- Edit manifests in `devops/k8s/` and apply to your cluster:

```bash
kubectl apply -f devops/k8s/
```

## ML Pipeline

- See `backend/ml/sample_mlflow.py` for MLflow tracking example.

---

This skeleton is ready for further development and deployment.