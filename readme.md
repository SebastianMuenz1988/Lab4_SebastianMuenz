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

- If you logged in as admin you can access every page (also the profile pages)

- If you are logged in as (role)"student1" or "student2" you will be redirected directly to the corresponding Home Page".
- As (role) "teacher" or "student" you will be directly redirected to you personal profile page which no one but you and role "admin" can access but you can also reach the corresponding Home-Page with links below in the profile page or manually with URL (https://localhost:5000/teacher resp. student). Note that teacher can also access the students Home Page" but not the idividual students profile page. (For this to work I added an extra Home Page for the role "student" which is not included in the demands for this task but it seems logical to have one)

Register:
You can register as teacher or student. You also need a username that is not already used and a valid password (capital and lowercase letters, a digt, a special character and min 8 characters).

If everything is valid you will be redirected to the identification for login.

No access:
If you are not allwoed to access a certain URL you will be redirected to the /identification. There will also an status code 401 before the redirection and an console log with error message.
