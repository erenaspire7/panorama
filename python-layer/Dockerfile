FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    python3-dev \
    build-essential \
    libpq-dev

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY app.py app.py
COPY task.py task.py

CMD ["python", "-u","app.py"]