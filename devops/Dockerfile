# Backend Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY ../backend /app
COPY ../venv /venv
ENV VIRTUAL_ENV=/venv
ENV PATH="/venv/bin:$PATH"
RUN pip install --upgrade pip && pip install fastapi uvicorn[standard] python-jose[cryptography] passlib[bcrypt] pydantic[dotenv] sqlalchemy alembic
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]