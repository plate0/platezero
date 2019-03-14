# [PlateZero](https://platezero.com)

* `/`: Shows Users/Recipes
* `/login`: form to accept (email or username) and password
* `/register`: register form, requires username, email, password
* `/{username}`: Profile page, shows recipes of user. If your profile, button for adding new recipe
* `/{username}/{recipe}`: show {username}'s {recipe} recipe

## Development Environment

**Dependencies:** `docker`, `docker-compose`, a Node.js development environment
with `yarn` installed.

1. Clone the repository and `cd` into it.
2. Run `docker-compose build && docker-compose up -d` to spin up the local
   PostgreSQL server on port 5432.
3. `cd` into the `frontend` directory and run `yarn` to install packages
4. Still in `frontend`, run `yarn dev` to start the development server
5. Open <http://localhost:9100> to see your local PlateZero instance! If you do
   not have an account being automatically created in `db/seed.sql`, you can
   register for one and log in.
