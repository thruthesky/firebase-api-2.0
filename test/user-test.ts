import { Injectable } from '@angular/core';
//import * as firebase from 'firebase';
import { User } from '../user';
export const TEST_NEW_NAME = "This-is-new-name!";
export const TEST_PASSWORD = 'Wc~,123a*';
@Injectable()
export class UserTest {

    constructor( private user: User ) {
    }

    run() {
 
            if( this.user.loggedIn ) this.user.logout();
            this.create_login_test();
        
    }


    getUserId( id ) {
        return id + (new Date).getMinutes() + (new Date).getSeconds();
    }



     create_login_test() {
          console.log( '=== create_login_test() begin ===');
          this.logout( () => {
             if ( this.user.loginUser ) return console.error("Failed: logout");
              let id = this.getUserId('user');
              this.createUser( id, ( uid: string ) => {
                  //console.info("createUser() uid: ", uid);
                  if ( this.user.loginUser ) console.info("Success: the user has logged in already");
                  else return console.error("Failed: User has not logged in after create an account");
  
                  this.logout(() => {
                      if ( ! this.user.loginUser ) console.info("Success: the user has logged out successfully.");
                      else return console.error("Failed: logout failed.");
  
                      this.login( id, uid => {
                          if ( this.user.loginUser ) {
                              console.info("Success: the user has logged in: ", this.user.loginUser);
                              this.updateUser( uid , () =>console.info('updated'))
                          }
                          else return console.error("Failed: login failed");
                      });
  
                  });
              });
          });
      }


    singleUserTest_CRUD_logInOut() {
        let id = this.getUserId('user.');
        this.createUser( id, ( uid: string ) => {
            console.log('uid : ', uid);
            this.getUser(  ( uid ) =>
                this.updateUser( uid, () => 
                    this.logout( () => 
                        this.login( id, () => 
                            this.deleteUser( () =>
                                console.log("TEST COMPLETE on UserTest::singleUserTest_CRUD_logInOut()!")
                            )
                        )
                    )
                )
            )
        });
    }




    /**
     * After success of 'user.create()', the user has logged in automatically.
     */
    createUser( id, success ) {
        console.log("Going to create user : " + id);

        let data = {};
        data['id'] = id;
        data['mobile'] = '09123456789';
        data['birthday'] = '02-02-2003';
        data['gender'] = 'M';
        data['email'] = id +'@gmail.com';
        data['password'] = TEST_PASSWORD;
        data['name'] = id + ' name';
        this.user.create( id, data,
                ( uid ) => { 
                    console.log(`create ${id} : success ${uid}`); 
                    success( uid ); 
                },
                (e) => console.error(`create ${id}: failure:`, e),
                () => console.log(`create ${id} : complete`) );
                
    }
    

    getUser(  success ) {
        this.user.get( this.user.loginUser.uid , user => {
            console.log('getUser: success: ', user );
            success( user.uid );
        },
        e => console.error("get user-abc: failure: ", e ),
        () => console.log("get user-abc: complete") );
    }
    updateUser( uid, success ) {
        let data = {
            name: TEST_NEW_NAME,
            mobile: '09777777777',
            gender: 'F',
            birthday: '11-23-1999'
        };
        this.user.update( uid, data,
            () => {
                console.log(`user update: ${uid} : success.`);
                success();
            } ,
            e => console.error( `user update: ${uid} : failure: `, e ),
            () => {  }
        );
    }


    logout( success: () => void ) {
        this.user.logout( () => {
            console.log('logout ok');
            success();
         }, () => console.error('logout failed') );
    }



    login( id, success: (uid: string) => void ) {
        let email = id + '@gmail.com';
        let password = TEST_PASSWORD;
        this.user.login( email, password, uid => {
            console.log( "Login ok: ", uid );
            success( uid );
        },
        error => {
            console.error("Login error: ", error );
        });
    }


    deleteUser( success ) {
        this.user.delete( () => {
            console.log( "user delete ok" );
            success();
        }, e => console.log( 'deleteuser() error ', e ) );
    }





}