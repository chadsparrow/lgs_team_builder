# TODO

## Front End

- [x] remove all localStorage options and use cookies only
- [x] remove all token storage and calls to localStorage
- [x] remove console.log for expiry timer test
- [x] move all view components to `views` folder
- [ ] DRY - go through view and look for components to create that can be shared
- [ ] Axios Interceptor - if `401` error code, check if token is expired and if so call `refresh-token` endpoint to refresh tokens

## Back End

- [x] create logout route
  - [x] remove all cookies when logged out
- [ ] endpoint & controller to refresh access / refresh token when access token expires
