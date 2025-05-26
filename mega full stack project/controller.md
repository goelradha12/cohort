# Saves all the authentication routes:

/api/v1/users

| **Route** | **Request Type** | **Goal** | **Data Accepted** | **Response** |
| --- | --- | --- | --- | --- |
| /register | POST | Register a new user | username  <br>email  <br>password | Send mail to user for emailVerification and register user. |
| /verifyMail/:token | GET | Verify entered email | \- |  |
| /login | POST | Login a verified user | email/username  <br>password | Add 2 tokens in cookies: access + refresh token |
| /changePassword | POST | Change old password to new | username/email  <br>oldPassword  <br>newPassword |  |
| /resendVerificationEmail | POST | Send email to user with new verifyEmail token | email/username  <br>password |  |
| /forgotPassword | POST | Send mail (to verify user mail) to user to reset password | email/username | Send mail to user with reset password link |
| /resetPassword/:token | POST | Save new password to db | newPassword |  |
| /getProfile | GET | if user is loggedIn | \- |  |
| /logout | GET | Remove refresh and access token | \- |  |
| /refreshAccessToken | GET | Get new access Token from refresh token | \- | new access token |
| /updateProfile | POST | Update avatarUrl/ name of user | avatar/name |  |