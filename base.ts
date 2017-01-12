
import * as firebase from 'firebase';
// import * as _ from 'lodash';

export class Base {
    db: firebase.database.Database;
    storage: firebase.storage.Storage;
    __node: string = null;
    __data: any = {};
    constructor() {
        this.db = firebase.database();
        this.storage = firebase.storage();
    }

    clear() : Base {
        this.__data = {};
        return this;
    }
    data( k, v ) : Base {
        this.__data[ k ] = v;
        return this;
    }
    getData() {
        return this.__data;
    }
    node( node ) : Base {
        this.__node = node;
        return this;
    }
    getRef( key ) : firebase.database.Reference {
        return this.db.ref( '/' + this.__node + '/' + key );
    }
    getPushRef() : firebase.database.Reference {
        return this.db.ref( '/' + this.__node ).push();
    }
    success( re?: any, success?: (re?: any) => void, complete?: () => void ) {
        if ( success ) success( re );
        if ( complete ) complete();
    }
    failure( error: any, failure?: (error?: any) => void, complete?: () => void ) {
        if ( failure ) failure( error );
        if ( complete ) complete();
    }
    /**
     * Use this when you want to
     * 
     * - create a new node
     * 
     * @note mandatory data
     *      - data('key', '....')
     */
    create( success?: ( data: any) => void, failure?: (error?: any) => void, complete?: () => void ) {
        let data = this.getData();
        console.log("base::create() : ", JSON.stringify( data ));
        let key = data['key'];
        if ( ! this.isValidKey( key ) ) return this.failure('invalid key', failure, complete );
        let ref;
        if ( key === void 0 ) {
            // this.failure( 'no key', failure, complete );
            ref = this.getPushRef();
        }
        else ref = this.getRef( key );

        ref.set( data )
            .then( ( re ) => {
                console.log("base::create() success");
                this.success( re, success, complete );
            })
            .catch( e => this.failure( e, failure, complete ));
    }


    /**
     * Updates a node.
     * It does not create a node.
     */
    update( success?: ( data: any) => void, failure?: (error?: any) => void, complete?: () => void ) {

        let data = this.getData();
        console.log("base::update() : data : ", JSON.stringify(data));
        let key = data['key'];
        if ( key === void 0 ) return this.failure('key is empty.', failure, complete );
        if ( ! this.isValidKey( key ) ) return this.failure('invalid key', failure, complete );
            
        this.get( key, re => {   // yes, key exists on server, so you can update.
        if ( re == null ) return this.failure('the key does not exists. so it cannot update.', failure, complete );
        console.log("Going to update: data : ", data);
        this.getRef( key )
            .update( data, re => {
            if ( re == null ) this.success( null, success, complete );
            else this.failure( re.message, failure, complete );
            } )
            .catch( e => this.failure( e.message, failure, complete ) );
        }, e => this.failure('sync failed: ' + e, failure, complete) );
    }



    get(key, success: (user: any) => void, failure?: (error?: any) => void, complete?) {
        console.log("base::get() key: ", key);
        this.getRef( key ).once( 'value', snapshot => {
            if ( snapshot.exists() ) {
                console.log("base::get() snapshot : ", snapshot.val() );
                this.success( snapshot.val(), success, complete );
            }
            else this.success( null, success, complete );
        }, () => this.failure( null, failure, complete ) );
    }


    /**
     * It checks if the 'key' is in valid form ( KEY of ref ).
     * return true if the key is valied
     */
    isValidKey(key) {
        if ( key === undefined ) return false;
        var invalidKeys = { '': '', '$': '$', '.': '.', '#': '#', '[': '[', ']': ']' };
        return invalidKeys[key] === undefined;
    }


    // set( key:string, value:any ) : Base {
    //     this.data[ key ] = value;
    //     return this;
    // }


  /**
   *
   */
//   create( successCallback: () => void, failureCallback: (e: string) => void, completeCallback: () => void ) {
//     console.log('FireframeBase::create() data: ', this.data);
//     // @deprecated. It submits even if the value is empty. so, you can use it to mark the field as empty.
//     // this.data = _.omitBy( this.data, _.isEmpty ); // remove empty field.

//     let data = _.cloneDeep(this.data);

//     if ( data.key === void 0 ) { // push the data ( push a key and then set )
//       console.log('No key. Going to push()');
//       this.ref
//         .push( data )
//         .then( () => { successCallback(); } )
//         .catch( e => { failureCallback(e.message); } );
//     }
//     else { // set the data
//       let key = data.key;
//       delete data.key;
//       console.log('Key exists. Going to set() with key : ' + key);
//       console.log('FireframeBase::create() data: ', data);
//       this.list
//       this.getChildObject( key )
//         .set( data )
//         .then( () => { successCallback(); } )
//         .catch( e => {
//           console.log("set() ERROR: " + e);
//           failureCallback(e.message);
//         } );
//     }
//   }

}
