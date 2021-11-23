# X-Press Publishing

This NodeJS application is an internal management tool for a comic book publishing company: X-Press Publishing. The code can be found on [GitHub](https://github.com/vsifiwe/x-press-publishing) and the live app is hosted on Heroku [here](https://x-press-publish.herokuapp.com)

## Installation

### Requirements

1.  NodeJS and NPM or Yarn

### Local Machine testing

- Clone [this](https://github.com/vsifiwe/x-press-publishing) project from GitHub to your local machine
- In the project directory, you can run: `yarn start` or `npm run start`. This command runs the app in development mode on your local machine.
- Open [http://localhost:3000](http://localhost:3000) to test it.

### Endpoints

The API has the following methods:

#### Artist

- GET /api/artist : This endpoint returns all currently employed artists.
- GET /api/artist/:artistId: This endpoint returns the artist with the specified ID
- POST /api/artist: This endpoint creates a new artist given that all required parameters (name, dateOfBirth, biography) are provided in the body of the request as an artist object
- PUT /api/artist/:artistId: This endpoint edits the artist with the specified id
- DELETE /api/artist/:artistId: This endpoint disables the artist with the specified id by changing the is_currently_employed attribute to false

#### Series

- GET /api/series : This endpoint returns all series in from the Database.
- GET /api/series/:seriesId: This endpoint returns series with the specified ID
- POST /api/series: This endpoint creates a new series given that all required parameters (name, desc) are provided in the body of the request.
- PUT /api/series/:seriesId: This endpoint edits the series with the specified id
- DELETE /api/series/:seriesId: This endpoint deletes the series with the specified id given that the particular series has no associated issues

#### Issue

- GET /api/series/:seriesId/issues: This endpoint returns all issues associated with the given series ID
- POST /api/series/:seriesId/issues: This endpoint creates a new issue given that all required parameters (name, issueNumber, publicationDate, artistId) are provided in the body of the request
- PUT /api/series/:seriesId/issues/:issueId: This endpoint edits the issue with the specified id
- DELETE /api/series/:seriesId/issues/:issueId: This endpoint deletes the issue with the ID specified as a parameter.

### Deployment

This project is deployed on Heroku on [this link](https://x-press-publish.herokuapp.com).
