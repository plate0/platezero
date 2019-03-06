# Frontend #

Install it and run:

```bash
$ yarn
$ yarn dev
```

## The idea behind the example

Server entry point is `server/index.ts` in development and
`production-server/index.js` in production. The second directory should be
added to `.gitignore`.

eb create \
    platezero \
    --vpc.id vpc-0765a08b57347032d \
    --vpc.ec2subnets subnet-0b38c20da507f2569 \
    --vpc.elbsubnets subnet-06783d62b112cb182 \
    --vpc.elbpublic \
    --vpc.securitygroups sg-0f1a960844ec26d90 \
    --scale 1 \
    --keyname 'Macbook Pro' \
    --instance_type t2.small \
    --instance_profile arn:aws:iam::159538620585:instance-profile/platezero-beanstalk \
    --region us-east-1 \
    --envvars NPM_USE_PRODUCTION=false SITE_URL=https://platezero.com API_URL=https://platezero.com/api JWT_SECRET=a9c26d0b386547839929e7f9c96af8fb1f7d2347f1e0405ebed9dcb88ec3f765 PORT=9100 DATABASE_NAME=platezero DATABASE_USER=platezero DATABASE_PASSWORD=vk8DdjpbrMFQGJ9iYBAhGATKP3okryYhwaVzecRtMfTcciEiQL84M4qaW8YViD6K DATABASE_HOST=platezero-prod.covs3ezp6dam.us-east-1.rds.amazonaws.com \
    --timeout 30
