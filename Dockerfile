FROM python:3.7

ARG project_directory

ADD src/requirements.txt $project_directory

WORKDIR $project_directory

RUN apt-get update

RUN apt-get install -y libgl1-mesa-dev

RUN pip install -r requirements.txt
