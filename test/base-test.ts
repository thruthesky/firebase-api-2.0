import { Injectable } from '@angular/core';
//import * as firebase from 'firebase';
import { Base } from '../base';

@Injectable()
export class BaseTest {

    constructor( private base: Base ) {
    }

    run() {
        let data =  ( new Date ).getMinutes() + ( new Date ).getSeconds();
        this.BaseTest( data );
    }


    BaseTest( data ) {


        this.nodeTest();
        this.createTest();
        // this.createPushTest();


        // // node test 
        // this.nodeTest( data, res =>{
        //     console.info(' node test success 1' );
        //     // push test
        //     this.createPushTest( data, pushRes =>{
        //         console.info( ' create push test success 2' + pushRes);
        //         // update push test
        //         this.updateTest( data, pushRes, s =>{
        //             console.info( ' update push post test success 3')
        //             // delete push test
        //             this.deteletTest( this.base.ref( this.base.getNode() ).key + '/' + pushRes , s=>{
        //                 console.info( ' delete push post test success 4')
        //             }, error => console.error( ' FAILED deleting push post ' ) )
        //         }, error => console.error( 'FAILED updating pushed data ' ) )
        //     }, err => console.error( ' error on create push test ' + err ) );
        //     // ref test
        //     this.createRefTest( data, refRes =>{
        //         console.info( ' create ref test success 5' );
        //         // update ref post test
        //         this.updateTest( data, 'refTest', updateRes =>{
        //             console.info(' update ref post test success 6' );
        //             //delete ref post test
        //             this.deteletTest( this.base.ref( this.base.getNode() ).key + '/'+'/refTest', s =>{
        //                 console.info( 'delete ref post Test success 7' );
        //             }, error => console.error( ' delete failed ' ) )
        //         }, error => console.error( 'error on updating ' ) )
        //     }, error => console.error( ' error on create ref test ' +  error) );
        // }, error => console.error( ' fail on Node Test ' ) )
    }



    getRandomString() : string {
        return  ( new Date ).getMinutes() + ( new Date ).getSeconds() + '';
    }


    nodeTest() {
        let key = this.getRandomString();
        this.base.node( 'testNode' +  key );
        if ( this.base.ref( this.base.getNode() ).key != 'testNode' + key ) console.error("FAIL: testnode ");
        else console.info('PASSED: testnode ');
    }



    // nodeTest( data, success, failure, complete? ) {
    //     this.base.node( 'testNode' +  data );

    //     if ( this.base.ref( this.base.getNode() ).key == 'testNode' + data ) this.base.success("OK: setting testNode", success, complete );
    //     else this.base.failure( "FAIL: setting testNode", failure, complete );

        
    // }


    deteletTest( node, success, failure, complete? ) {
        this.base.delete( node, res =>{
            this.base.success( res, success, complete );
        } , error => this.base.failure( error, failure, complete ), 
        () =>{} );
    }

    createTest() {
        let key = this.getRandomString();
        let data = {
            a: 'b',
            c: 'd'
        };
        this.base.create( key, data, success => {
            this.base.get( key, success => {
                console.log('success ' + JSON.stringify(data))
                if ( JSON.stringify(success) == JSON.stringify(data) ) {
                    console.log('success create')
                }
                else {
                    console.log("ERROR: ...");
                }
            }, error => console.log("ERROR: BaseTest::createTest() => get() ", error), () => {} );
        }, error => {
            console.log("ERROR: ... ", error);
        }, () => {

        })
    }
    

    createPushTest( content, success, failure, complete? ) {
        let data ={
            content: 'push test : ' + content
        };
         
        this.base.create( null, data,  res =>{
            console.log('push test res ' + res );
            this.base.success( res, success, complete );
        }, err => this.base.failure( err, failure , complete ), 
        () => {} );
    }


    createRefTest( _data, success, failure, complete? ) {
        let data ={
            content : 'ref test ' + _data
        }

        this.base.create( 'refTest', data, res =>{
            this.base.get( 'refTest' , test =>{
                if( test ) this.base.success( test, success, complete );
                else this.base.failure( 'error on test ', failure, complete );
            }, error => this.base.failure( error, failure, complete ) )
            
        }, error => this.base.failure( error, failure, complete ),
        () => {} )
    }

    updateTest( _data, key, success, failure, complete? ) {
        let data = {
            content: 'new updated data ' + _data
        }
        this.base.update( key, data, res =>{
            this.base.get( 'refTest' , res=>{
                this.base.success( res, success, complete );
            }, error => this.base.failure( error, failure, complete ) )
        } )
    }


    




}