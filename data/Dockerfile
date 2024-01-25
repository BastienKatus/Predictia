FROM postgres:latest
COPY ./model_training/source /csv_files
COPY ./init-scripts /docker-entrypoint-initdb.d/
COPY . .
