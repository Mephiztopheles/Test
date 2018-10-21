/**
 * Adapter for fast using of Map when possible
 */
class MapAdapter {

    private map = {};

    get( key:any ) {
        return this.map[ key ];
    }

    set( key:any, value ) {
        this.map[ key ] = value;
    }
}

const tests = new MapAdapter();
const ignores = new MapAdapter();

export default abstract class TestCase {

    private failed:number = 0;

    public run() {


        let prototype = Object.getPrototypeOf( this );
        let ig = ignores.get( prototype ) || [];
        let functions = tests.get( prototype ) || [];

        if ( ig.length != 0 )
            functions = functions.filter( ( value ) => ig.indexOf( value ) == -1 );

        console.log( `Running ${functions.length} tests in ${prototype.constructor.name} ${ig.length ? " (" + ig.length + " ignored" : ""}` );

        functions.forEach( method => {

            try {

                method.apply( this );

            } catch ( e ) {
                this.failed++;
                console.error( `Test ${name} failed. Message: ${e.stack}` );
            }
        } );

        console.log( `${this.failed} tests failed` );
    }
}

export function test( target, propertyKey:string, descriptor:PropertyDescriptor ) {


    let targetTests = tests.get( target );

    if ( targetTests == null ) {

        targetTests = [];
        tests.set( target, targetTests );

    }

    targetTests.push( descriptor.value );
}

export function ignore( target, propertyKey:string, descriptor:PropertyDescriptor ) {


    let targetTests = ignores.get( target );

    if ( targetTests == null ) {

        targetTests = [];
        ignores.set( target, targetTests );

    }

    targetTests.push( descriptor.value );
}


export function assertTrue( value:boolean ) {

    if ( !value )
        fail( "assertTrue failed" );
}

export function assertFalse( value:boolean ) {

    if ( value )
        fail( "assertFalse failed" );
}

export function assertEquals( expected:any, actual:any ) {

    if ( expected !== actual )
        fail( `expected ${expected}, but was ${actual}` );
}

// noinspection JSMethodCanBeStatic
export function fail( message?:string ) {
    throw new Error( message );
}