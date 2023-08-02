FROM python:3.10
WORKDIR /
RUN apt-get update -y
RUN apt install -y python3 python3-pip
COPY requirements.txt /
RUN pip install --upgrade pip
RUN pip install -r /requirements.txt
COPY app.py /
EXPOSE 8080
ENTRYPOINT ["python"]
CMD ["./app.py"]