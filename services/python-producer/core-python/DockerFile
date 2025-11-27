# ----- STAGE 1
FROM python:3.12-slim as builder

RUN apt-get update && apt-get install -y curl \
    && curl -sSL https://install.python-poetry.org | python3 - \
    && apt-get clean

ENV PATH="/root/.local/bin:$PATH"

WORKDIR /app

COPY pyproject.toml poetry.lock* ./

RUN poetry self add poetry-plugin-export
RUN poetry export -f requirements.txt -o requirements.txt --without-hashes


# ----- STAGE 2
FROM python:3.14-slim

WORKDIR /app

COPY --from=builder /app/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "-m", "src.main"]

