Instructions to run the website:

Get the website running:

- Clone git repository:
- Terminal: npm install
- Terminal: nodemon server.js

Enter the website:

- Browser: https://localhost:5000/

You will be redirected to the route https://localhost:5000/identification for Login.

Login:
You can log in with your usernname and password. If you are not registered jet you can do this in the Link bewlow: "Register"

After successfully login:

- If you are in the role "student" or "teacher" you will be dynamically redirected to you individual profile page.

- If you logged in as admin you can access every page (also the profile pages)

- If you are logged in as (role)"student1" or "student2" you will be redirected directly to the corresponding "role-page". As (role) "teacher" or "student" you will be directly redirected to you personal profile page but you can also access the corresponding "role-page" with links below in the profile page or manually with URL (https://localhost:5000/teacher resp. student). Note that teacher can also access the students "role-page" but not the idividual students profile page.

Register:
You can register as teacher or student. You also need a username that is not already used and a valid password (capital and lowercase letters, digts, special character and min 8 characters).

If everything is valid you will be redirected to the identification for login.
