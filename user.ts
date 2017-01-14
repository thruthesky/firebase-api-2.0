import { Injectable } from '@angular/core';
import { Base } from './base';
import * as firebase from 'firebase';

@Injectable()
export class User extends Base {
    auth: firebase.auth.Auth;
    constructor() {
        super();
        this.node( 'user' );
        this.auth = firebase.auth();
    }

    /**
     * Check if the user has logged in or not.
     * @note this is blocking code.
     */
    get isLogin() : boolean {
        return !! this.auth.currentUser;
    }

    /**
     * Get auth.currentUser
     * @note this is blcoknig code.
     */
    get currentUser() : firebase.User {
        return this.auth.currentUser;
    }

    /**
     * 
     * @note mandatory data.
     *      data['id'] as key
     *      data['email']
     *      data['password']
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
            super.create( () => {
                //console.log("user::create() success. uid: ", uid);
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



    logout( success?, failure?, complete? ) {
        this.auth.signOut()
            .then( () => this.success( null, success, complete),
                () => this.failure( null, failure, complete ) );
    }

    login( email, password, success: ( uid: string ) => void, failure: ( error: string ) => void, complete? ) {
        this.auth.signInWithEmailAndPassword(email, password)
            .then( (user: firebase.User) => {
                this.success( user.uid, success, complete );
            }, error => {
                var errorCode = error['code'];
                var errorMessage = error.message;
                this.failure( errorCode + ' : ' + errorMessage, failure, complete );
            });
    }

    delete( success, failure?: ( error: string ) => void, complete? ) {
        let user = this.auth.currentUser;
        user.delete().then( () =>
            this.success( null, success, complete),
            error => {
                var errorCode = error['code'];
                var errorMessage = error.message;
                this.failure( errorCode + ' : ' + errorMessage, failure, complete );
            });
    }
}
