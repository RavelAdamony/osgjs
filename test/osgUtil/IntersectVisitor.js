define( [
    'tests/mockup/mockup',
    'osgUtil/IntersectVisitor',
    'osg/Camera',
    'osg/Viewport',
    'osg/Matrix',
    'osg/Shape',
    'osgViewer/View',
    'osgDB/ReaderParser',
    'vendors/Q'
], function ( IntersectVisitor, Camera, Viewport, Matrix, Shape, View, ReaderParser, Q ) {

    return function () {

        module( 'IntersectVisitor' );

        test( 'Test IntersectVisitor', function () {

            var camera = new Camera();
            camera.setViewport( new Viewport() );
            camera.setViewMatrix( Matrix.makeLookAt( [ 0, 0, -10 ], [ 0, 0, 0 ], [ 0, 1, 0 ], [] ) );
            camera.setProjectionMatrix( Matrix.makePerspective( 60, 800 / 600, 0.1, 100.0, [] ) );
            var scene = Shape.createTexturedQuadGeometry( -0.5, -0.5, 0, 1, 0, 0, 0, 1, 0, 1, 1 );

            var iv = new IntersectVisitor();
            iv.pushCamera( camera );
            iv.addLineSegment( [ 400, 300, 0.0 ], [ 400, 300, 1.0 ] );
            scene.accept( iv );
            ok( iv.hits.length === 1, 'Hits should be 1 and result is ' + iv.hits.length );
            ok( iv.hits[ 0 ].nodepath.length === 1, 'NodePath should be 1 and result is ' + iv.hits[ 0 ].nodepath.length );

        } );

        asyncTest( 'Test IntersectVisitorScene', function () {

            var view = new View();
            view.getCamera().setViewport( new Viewport() );
            view.getCamera().setViewMatrix( Matrix.makeLookAt( [ 0, 0, -10 ], [ 0, 0, 0 ], [ 0, 1, 0 ] ), [] );
            view.getCamera().setProjectionMatrix( Matrix.makePerspective( 60, 800 / 600, 0.1, 100.0, [] ) );
            var promise = ReaderParser.parseSceneGraph( mockup.getScene() );
            Q.when( promise ).then( function ( quad ) {
                view.setSceneData( quad );

                var result = view.computeIntersections( 400, 300 );
                //console.log(result);
                ok( result.length === 1, 'Hits should be 1 and result is ' + result.length );
                start();
            } );
        } );
    };
} );
