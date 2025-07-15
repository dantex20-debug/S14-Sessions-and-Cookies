import mlflow

def log_sample_run():
    with mlflow.start_run():
        mlflow.log_param("param1", 5)
        mlflow.log_metric("accuracy", 0.92)
        print("Sample run logged to MLflow.")

if __name__ == "__main__":
    log_sample_run()