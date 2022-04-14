FROM python:3.9
WORKDIR /code
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
EXPOSE 80
CMD ["uvicorn", "app.server", "--host", "0.0.0.0", "--port", "80"]
