
import * as firebase from 'firebase';
// import * as admin from "firebase-admin";
import * as _ from 'lodash';


export class Base {
    private pagination_key: string = '';
    private pagination_last_page: boolean = false;
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
    /**
     * @attention Remember! it's a place holder. changes after this call will be applied into this.__data.
     */
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
    create(childref?, success?: ( data: any) => void, failure?: (error?: any) => void, complete?: () => void ) {
        let data = this.getData();
        //console.log("base::create() : ", JSON.stringify( data ));
        let key = data['key'];
        if ( ! this.isValidKey( key ) ) return this.failure('invalid key', failure, complete );
        let ref;
        if ( key === void 0 ) {
            // this.failure( 'no key', failure, complete );
            ref = this.getPushRef();
        }
        else ref = this.getRef( childref );

        

        ref
        .child(key)
        .set( data )
            .then( ( re ) => {
                //console.log("base::create() success");
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
            
        this.get( 'metadata/'+key, re => {   // yes, key exists on server, so you can update.
        if ( re == null ) return this.failure('the key does not exists. so it cannot update.', failure, complete );
        console.log("Going to update: data : ", data);
        this.getRef('metadata/'+ key)
            .update( data, re => {
            if ( re == null ) this.success( null, success, complete );
            else this.failure( re.message, failure, complete );
            } )
            .catch( e => this.failure( e.message, failure, complete ) );
        }, e => this.failure('sync failed: ' + e, failure, complete) );
    }


    /**
     * @description: page method is for getting list with pagination.
     */
  page( databaseRef, success, failure, complete? ) {
    let num = ( this.data['numberOfPosts'] ? this.data['numberOfPosts'] : 8 ) + 1;
    let ref = firebase.database().ref( databaseRef )
    let order = ref.orderByKey();
    let query;
    let newData;
    if ( this.pagination_key ) {
      query = order.endAt( this.pagination_key ).limitToLast( num );
    }
    else {
      query = order.limitToLast(num);
    }

    query
      .once('value', snapshot => {
          let data = snapshot.val();
          let keys = Object.keys( data );
          
          if ( keys.length < this.data['numberOfPosts'] + 1 ) {
            newData = data;
            this.pagination_last_page = true;
            
          }
          else {
            this.pagination_key = Object.keys( data ).shift();
            newData = _.omit( data, this.pagination_key );
          }
          this.success( newData, success, complete );
        }, error => this.failure( error, failure, complete ));
  }



    /**
     * 
     * @attention 2017-01-17 If the key does not exists,
     *      - instead of passing 'null' with success,
     *      - failure callback will be called.
     */
    get(key, success: (data: any) => void, failure?: (error?: any) => void, complete?) {
        // console.log("base::get() key: ", key);
        this.getRef( key ).once( 'value', snapshot => {
            if ( snapshot.exists() ) {
                // console.log("base::get() snapshot : ", snapshot.val() );
                let val = snapshot.val();
                if ( val ) this.success( val, success, complete );
                else this.failure( 'no-data', failure, complete )
            }
            else this.failure( null, failure, complete );
        }, () => this.failure( 'unknown-get-error', failure, complete ) );
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
