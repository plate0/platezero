FROM postgres:9.5.6-alpine
ADD *.sql /docker-entrypoint-initdb.d/
EXPOSE 5432
CMD ["postgres"]
