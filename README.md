# firebase-api-2.0
New Firebase api v2

# TODO
@see readme.md of english

 * 01-22-17:  


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



# UPDATE
   * changed database structure for database rules and also for listing users in adminpage.
       * Metadata, id, email.
       * In firebase database rules you can set rules on every nodes. 
   * database rules
       * user's metadata is now secured 
       * still working on securing other nodes; id, email.
   * Forum CRUD


#Node Structure and database RULE
current database rules.

rule in metadata in first ".read" you can set a user account considered as admin.
the user with this uid can read all the data in the user/metadata node.
and then i've set $uid === auth.uid so that each user can read and write/edit for their info/metadata.


{
  "rules": {
    "user": {
			".read": false,
      ".write": false,
      "metadata":{
        ".read": "auth.uid === '26QtQm8ihhVOMZDdegvFomCm29M2'",
        ".write": "auth.uid === '26QtQm8ihhVOMZDdegvFomCm29M2'",
        "$uid": {
          ".read": "$uid === auth.uid",
          ".write": "$uid === auth.uid",
        }
          
      },
      "email" :{
          ".read": true,
          ".write": true,
        
      },
      "id":{
        ".read": true,
        ".write": true,
      }

    },
      "forums":{
        ".write": true
      }
  }
}






