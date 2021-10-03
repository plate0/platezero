FROM postgres:13-alpine
ADD *.sql /docker-entrypoint-initdb.d/
EXPOSE 5432
CMD ["postgres"]
