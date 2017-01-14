/**
 * 
 * @attention User Login Check
 *      - Since 'user login state' is based on 'firebase.auth()' that needs to connect to firebase server over netowrk, the 'login check' takes some time.
 *      - And you don't want to wait.
 *          -- Once a user login, 'user' key of LocalStorage will hold user information until the user data in localstorage destroyed or the user logs out.
 *          -- use 'loginUser' to get the login user's data in LocalStorage. 
 * 
 * 
 */
import { Injectable } from '@angular/core';
import { Base } from './base';
import { USER_LOGIN_DATA } from './interfaces';
import * as firebase from 'firebase';
const KEY_LOGIN_USER = 'loginUser';
@Injectable()
export class User extends Base {
    auth: firebase.auth.Auth;

    /**
     * 
     * @var loginUser
     * 
     * @note get login user's data.
     * @note this is a variable changed on
     *      - constructor
     *      - the state of auth change.
     *
     * @attention this loads login user's data in the constructor which means when this provider injected into a component, there will not be second contructor call and nor user's data load.
     * 
     * 
     * 
     */
    loginUser: USER_LOGIN_DATA = null;
    constructor() {
        super();
        this.node( 'user' );
        this.auth = firebase.auth();
        this.loginUser = this.getLoginUserData();
        this.auth.onAuthStateChanged( ( user ) => this.onAuthStateChanged( user ) );
    }

    private getLoginUserData() : USER_LOGIN_DATA {
        let data = localStorage.getItem( KEY_LOGIN_USER );
        if ( data ) {
            try {
                let user = JSON.parse( data );
                if ( user && user.uid ) return user;
            }
            catch ( e ) {
                console.log("getLoginUserData() : ", e);
            }
        }
        return null;
    }


    /**
     * save login user data into localStorage.
     */
    private setLoginUserData( uid: string ) {
        if ( ! uid ) return alert("CRITICAL ERROR: uid cannot be null on setLoginUserData()");
        
        // 1. save uid only. since you cannot get user name yet.
        let data: USER_LOGIN_DATA = {
            uid: uid,
            name: ''
        };

        let loginUser;
        try {
            loginUser = JSON.stringify( data );
        }
        catch( e ) {
            console.error('setLoginUserData() failed');
            return;
        }
        localStorage.setItem( KEY_LOGIN_USER, loginUser);
        this.loginUser = loginUser;

        // 2. get user name from firebase database over network.
        this.get( uid, user => {
            if ( user ) {
                console.log("user: ", user);
                data = {
                    uid: uid,
                    name: user['name']
                };
                loginUser = JSON.stringify( data );
                localStorage.setItem( KEY_LOGIN_USER, loginUser);
                this.loginUser = loginUser;
            }
        }, e => {
            return alert("CRITICAL ERROR: failed to get user data");
        });
    }

    private deleteLoginUserData() {
        localStorage.removeItem( KEY_LOGIN_USER );
        this.loginUser = null;
    }


    /**
     * Returns firebase.auth().currentUser
     * @note this is blcoknig code.
     * @attention this may return null until 'firebase' initialize()
     */
    get currentUser() : firebase.User {
        return this.auth.currentUser;
    }

    /**
     * 
     */
    onAuthStateChanged( user: firebase.User ) {
        console.info("onAuthStateChanged: loginUser: ", this.loginUser );
        if ( user ) {
            console.info("login: ", user.email);
        }
        else {
            console.log("logout");
        }
    }
    

    /**
     * 
     * @note mandatory data.
     *      data['id'] as key
     *      data['email']
     *      data['password']
     *      data['name']
     * @note optional but mostly needed data
     *      data['gener']
     *      data['birthday']
     *      data['mobile']
     * 
     * @note on success callback, 'firebase.User.uid' will be passed as parameter.
     * @attention once user account has created, the user has logged in automatically.
     * @see UserTest::create_login_test()
     */
    create( success?: ( uid: string ) => void, failure?: (error?: any) => void, complete?: () => void ) {
        //console.log("user::create()");
        let data = this.getData();
        this.register( data['email'], data['password'], user => {
            //console.log('user::register() : ', user);
            let uid = user.uid;
            data['key'] = uid;
            data['uid'] = uid;
            delete data['password'];
            super.create( () => { // user has logged in now.
                //console.log("user::create() success. uid: ", uid);

                this.setLoginUserData( uid );

                success( uid );
            }, failure, complete );
        }, error => this.failure( error, failure, complete ) );
    }


    register( email, password, success: ( user: firebase.User ) => void, failure: (error: string) => void  ) {
        this.auth.createUserWithEmailAndPassword( email, password )
            .then( user => {
                // console.log("User " + firebaseUser.uid + " created successfully!");
                // return firebaseUser;
                success( user );
            }, error => {
                // Handle Errors here.
                var errorCode = error['code'];
                var errorMessage = error.message;
                if (errorCode == 'auth/weak-password') {
                    errorMessage = 'The password is too weak.';
                }
                failure( errorCode + ' : ' + errorMessage );
            });
    }


    /**
     * @todo update user passwd on firebase.auth
     */
    update( success?: ( data: any) => void, failure?: (error?: any) => void, complete?: () => void ) {
        super.update( success, failure, complete );
    }



    /**
     * User log out.
     * 
     * @use to log out.
     */
    logout( success?, failure?, complete? ) {
        this.auth.signOut()
            .then( () => {
                    this.deleteLoginUserData();
                    this.success( null, success, complete)
                },
                () => this.failure( null, failure, complete ) );
    }

    /**
     * User login.
     * 
     * @use to login.
     */
    login( email, password, success: ( uid: string ) => void, failure: ( error: string ) => void, complete? ) {
        this.auth.signInWithEmailAndPassword(email, password)
            .then( (user: firebase.User) => {
                this.setLoginUserData( user.uid );
                this.success( user.uid, success, complete );
            }, error => {
                var errorCode = error['code'];
                var errorMessage = error.message;
                this.failure( errorCode + ' : ' + errorMessage, failure, complete );
            });
    }

    /**
     * @todo it needs to delete data on firebase database.
     */
    delete( success, failure?: ( error: string ) => void, complete? ) {
        let user = this.auth.currentUser;
        user.delete().then( () => {
                this.deleteLoginUserData();
                this.success( null, success, complete);
            },
            error => {
                var errorCode = error['code'];
                var errorMessage = error.message;
                this.failure( errorCode + ' : ' + errorMessage, failure, complete );
            });
    }
}
