import { useState, useEffect, useRef } from 'react';
import sfxFlip from './sfx_card_flip_2.mp3';
import './Card.css';

function Card({
    length = 336,
    width = 240,
    faceImg,
    faceBackgroundColor = 'green',
    backImg,
    backBackgroundColor = 'darkblue',
    value,
    flipTimer, 
}) {
    const [isFaceActive, setIsFaceActive] = useState(false);
    const [isFlippingAnimation, setIsFlippingAnimation] = useState(false);
    const autoFlipTimerRef = useRef(null); // Ref to track the auto-flip timeout

    const flipCard = () => {
        if (isFlippingAnimation) return;

        // Play flip sound
        const flipSound = new Audio(sfxFlip);
        flipSound.play();

        setIsFlippingAnimation(true);

        // Toggle face state
        setTimeout(() => {
            setIsFaceActive((prev) => {
                const newState = !prev;

                // Start auto-flip timer if card is flipped face-up
                if (flipTimer && newState) {
                    if (autoFlipTimerRef.current) {
                        clearTimeout(autoFlipTimerRef.current); // Clear any existing timer
                    }
                    autoFlipTimerRef.current = setTimeout(() => {
                        setIsFaceActive(false); // Flip card face-down
                    }, flipTimer);
                }

                return newState;
            });

            setIsFlippingAnimation(false);
        }, 100); // Match the CSS animation duration
    };

    // Clear the timer if the component unmounts
    useEffect(() => {
        return () => {
            if (autoFlipTimerRef.current) {
                clearTimeout(autoFlipTimerRef.current);
            }
        };
    }, []);

    return (
        <div
            className="card-container"
            style={{ width: `${width}px`, height: `${length}px` }}
            onClick={flipCard}
        >
            <div
                className={`card ${isFaceActive ? 'hidden' : 'flipped'}`}
                style={{
                    width: `${width}px`,
                    height: `${length}px`,
                }}
            >
                {/* Front Face */}
                <div
                    className="card-face front"
                    style={{
                        backgroundColor: faceBackgroundColor,
                        backgroundImage: `url(${faceImg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {/* Additional front content */}
                </div>

                {/* Back Face */}
                <div
                    className="card-face back"
                    style={{
                        backgroundColor: backBackgroundColor,
                        backgroundImage: `url(${backImg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {/* Additional back content */}
                </div>
            </div>
        </div>
    );
}

export default Card;

