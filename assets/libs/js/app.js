const grid = $('.grid');
const results = $( '.results' );

let currentShooterIndex = 202;
let width = 15;
let direction = 1;
let invadersId;
let goingRight = true;
let removedInvaders = [];

for ( let i = 0; i < 225; i++ ) {
    const square = $('<div></div>');
    grid.append(square);
}

const squares = Array.from( $('.grid div') );

const invaders = [
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
];

function draw() {
    for ( let i = 0; i < invaders.length; i++) {
        if(!removedInvaders.includes(i)){
            squares[ invaders[i] ].classList.add( 'invader' );
        }
        
    }
}

draw();

function remove() {
    for ( let i = 0; i < invaders.length; i++) {
        squares[ invaders[i] ].classList.remove( 'invader' );
    }
}

squares[ currentShooterIndex ].classList.add( 'shooter' );

function moveShooter( e ) {
    squares[ currentShooterIndex ].classList.remove( 'shooter' );
    switch( e.key ) {
        case 'ArrowLeft':
            if ( currentShooterIndex % width !== 0 ) currentShooterIndex -= 1
            break;
        case 'ArrowRight':
            if( currentShooterIndex % width < width -1 ) currentShooterIndex += 1
            break;
    }
    squares[ currentShooterIndex ].classList.add( 'shooter' );
}

$( document ).on( 'keydown', moveShooter );


function moveInvaders(e) {
    const leftEdge = invaders[ 0 ] % width === 0;
    const rightEdge = invaders[ invaders.length - 1 ] % width === width -1;
    remove();
    if( rightEdge && goingRight ) {
        for ( let i = 0; i < invaders.length; i++ ) {
            invaders[ i ] += width + 1;
            direction = -1;
            goingRight = false;
        }
    }

    if( leftEdge && !goingRight ) {
        for ( let i = 0; i < invaders.length; i++ ) {
            invaders[ i ] += width -1;
            direction = 1;
            goingRight = true;
        }
    }
  

    for ( let i = 0; i < invaders.length; i++ ) {
        invaders[ i ] += direction;
    }
     draw();

     if( squares[ currentShooterIndex ].classList.contains( 'invader', 'shooter' ) ) {
         results.html('GAME OVER!!!!')
         clearInterval( invadersId );
     }

     for ( let i = 0; i < invaders.length; i++ ) {
         if ( invaders[i] > ( squares.length - width )) {
            results.html('GAME OVER!!!!')
            clearInterval( invadersId );
         }
     }
     if ( removedInvaders.length === invaders.length ) {
        results.html('YOU WIN!!!!');
        clearInterval( invadersId );
     }
}

invadersId = setInterval( moveInvaders, 500);

function shoot( e ) {
    let laserId;
    let currentLaserIndex = currentShooterIndex;

    function moveLaser() {
        if( squares[currentLaserIndex].classList.contains( 'laser' ) ) {
            squares[currentLaserIndex].classList.remove( 'laser' );
        }
        currentLaserIndex -= width;
        squares[currentLaserIndex].classList.add( 'laser' );

        if( squares[ currentLaserIndex ].classList.contains( 'invader' ) ) {
            squares[ currentLaserIndex ].classList.remove( 'laser' );
            squares[ currentLaserIndex ].classList.remove( 'invader' );
            squares[ currentLaserIndex ].classList.add( 'boom' );

            setTimeout( () => squares[ currentLaserIndex ].classList.remove( 'boom' ), 200);
            clearInterval( laserId );

            const invaderRemoved = invaders.indexOf(currentLaserIndex)
            removedInvaders.push( invaderRemoved )
        }
    }
    switch( e.key ) {
        case 'ArrowUp':
            laserId = setInterval( moveLaser, 100 )
            break;
    }
}

$( document ).on( 'keydown', shoot );