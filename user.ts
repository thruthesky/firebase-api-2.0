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
declare function require(name:string);
@Injectable()
export class User extends Base {
    ref = firebase.database().ref();
    auth: firebase.auth.Auth;

    /**
     * 
     * @var loginUser
     * 
     * @note get login user's data.
     * @note use this variable any time, any where. if this variable is true, then the user has logged in.
     * @note this is a variable changed on
     *      - constructor
     *      - the state of auth change.
     *
     * @attention This loads login user's data in the constructor which means
     *      when this provider injected into a component,
     *      there will not be second contructor call and nor user's data load.
     *      So, it is one time run and use everywhere.
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



    get loggedIn() : boolean {
        return !! ( this.loginUser && this.loginUser.uid );
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
        this.loginUser = data;

        // 2. get user name from firebase database over network.
        this.get( 'metadata/'+uid, user => {
            if ( user ) {
                // console.log("user: ", user);
                data = {
                    uid: uid,
                    name: user['name']
                };
                loginUser = JSON.stringify( data );
                localStorage.setItem( KEY_LOGIN_USER, loginUser);
                this.loginUser = data;
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
        // console.info("onAuthStateChanged: loginUser: ", this.loginUser );
        if ( user ) {
            // console.info("login: ", user.email);
        }
        else {
            // console.log("logout");
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
        
        this.register( data['email'], data['password'], user => { // user register into firebase authentication.
            // console.log('user::register() : ', user);
            let uid = user.uid;
            let id = data['id'];
            let email = data['email'];
            data['key'] = uid;
            data['uid'] = uid;
            delete data['password'];
            //console.log('data:', data);
            super.create('metadata', () => { // user create success. user has logged in now.
                //console.log("user::create() success. uid: ", uid);


                /**
                 * It creates 'User ID => UID' index for access uid by user id.
                 * @see README.md
                 */
                super.clear();
                let data = this.getData();
                data['email'] = email;
                data['key'] = id;
                data['uid'] = uid;
                //console.log("data: ", data);
                super.create('id', (x) => {
                    //console.info('user id index success');

                    /**
                     * 'email => uid'
                     */
                    super.clear();
                    let data = this.getData();
                    data['key'] = email.replace('@', '+');
                    data['key'] = data['key'].replace('.', '-');
                    data['id'] = id;
                    data['uid'] = uid;
                    super.create('email', x => {
                        this.setLoginUserData( uid );
                        success( uid );
                    }, failure, complete );
                }, failure, complete );
            }, failure, complete );
        }, error => this.failure( error, failure, complete ) );
    }



    /**
     * 
     * reset Password.
     * @description: user needs to provide a valid and registered email address, firebase authentication API.
     * 
     */
    resetpassword( email: string, success, failure, complete){
        this.auth.sendPasswordResetEmail(email).then(()=>{
            this.success('password reset sent to your email', success, complete );
        }, error =>{ 
            var errorCode = error['code'];
            var errorMessage = error.message;
            this.failure( errorCode + ' : ' + errorMessage )
        })
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
     * 
     * @todo update user passwd on firebase.auth
     * @description updates the KEY_LOGIN_USER in localStorage so that if ever the user updates his/her data loginUser.name will also be updated.
     * 
     */
    update( success?: ( data: any) => void, failure?: (error?: any) => void, complete?: () => void ) {
        let data = this.getData();
        this.loginUser.name = data['name'];
        localStorage.setItem( KEY_LOGIN_USER , JSON.stringify( this.loginUser ) )
        super.update( success, failure, complete );
    }



    /**
     * User log out.
     * 
     * @use to log out.
     */
    logout( success?, failure?, complete?: () => void ) {
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
     * @description this method will delete user's account in firebase authentication
     */
    resign( success, failure?: ( error: string ) => void, complete? ) {
        let user = firebase.auth().currentUser;
        let userdata;
        this.get( 'metadata/'+this.loginUser.uid , res =>{
           userdata = res;
           this.delete( 'email', userdata['email'].replace('@', '+').replace('.', '-'), res =>{
               console.log('deleted email' );
               this.delete('id', userdata['id'], res =>{
                   console.log('deleted id ' );
                   this.delete('metadata', userdata['uid'], res =>{
                       console.log('deleted metadata');
                        user.delete().then( () => {

                            this.deleteLoginUserData();
                            this.success( null, success, complete);
                        },
                        error => {
                            var errorCode = error['code'];
                            var errorMessage = error.message;
                            this.failure( errorCode + ' : ' + errorMessage, failure, complete );
                        });
                   }, error =>{})
               }, err =>{})
           }, error =>{})
        }, err => { console.error('error ' + err )})

    }

    /**
     * 
     * @description this method will delete user's account info from firebase database.
     * 
     */
    delete( childnode:string, key:string, success : ( key: string ) => void, failure: ( error:string ) => void, complete?){
        this.ref.child('user/'+childnode +'/'+ key )
        .remove().then( res =>{
            this.success( res, success, complete );
        }, error => this.failure( error, failure, complete) )
    }
}
