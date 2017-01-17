# firebase-api-2.0
New Firebase api v2

# TODO


check if id exists on registration.
    => user.get('id', s => '', f => '', ...)
check if id is valid type. ( cannot contain '.', '$', '#', '[', ']' )


User password update.

Save id

Find ID.

--

Admin page for user management.

list user / update user / delete user


* forum
forum config management,
post crud
post list


# TEST

Inject the Test Class and call '.run()' method.

````
constructor( userTest: UserTest ) {
    userTest.run();
}
````



# User Authentication


When a user registers with email/password,

three nodes are created on database.


1. 'uid' => { user information }
2. 'id' => { uid }
3. 'email' => { uid }

1st node is for getting user's detail information.

2nd node is for finding user information ( email, etc ) by user id.

With the combination of 1st node and 2nd node, you can login with id/password.

Note: 3rd node 'email => { uid }', since node key cannot contain '@' and '.', it is replaced by '+'.

