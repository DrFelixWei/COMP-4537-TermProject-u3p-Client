import { useState, useEffect, useRef } from 'react';
import sfxFlip from './sfx_card_flip_2.mp3';
import './Card.css';
import { useTranslation } from 'react-i18next';

const Card = ({
    length = 336,
    width = 240,
    faceImg,
    faceBackgroundColor = 'green',
    backImg,
    backBackgroundColor = 'darkblue',
    value,
    flipTimer, 
}) => {
    const { t } = useTranslation();
    const [isFaceActive, setIsFaceActive] = useState(true);
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
                {/* Front Face - Question */}
                <div
                    className="card-face front"
                    style={{
                        backgroundColor: faceBackgroundColor,
                        backgroundImage: `url(${faceImg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '20px',
                        textAlign: 'center',
                        overflow: 'auto'
                    }}
                >
                    {value && value.front && (
                        <div className="card-content">
                            <h3 style={{ color: 'white', marginBottom: '10px' }}>{t('card.question')}</h3>
                            <p style={{ color: 'white', fontSize: '16px' }}>{value.front}</p>
                        </div>
                    )}
                </div>

                {/* Back Face - Answer */}
                <div
                    className="card-face back"
                    style={{
                        backgroundColor: backBackgroundColor,
                        backgroundImage: `url(${backImg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '20px',
                        textAlign: 'center',
                        overflow: 'auto'
                    }}
                >
                    {value && value.back && (
                        <div className="card-content">
                            <h3 style={{ color: 'white', marginBottom: '10px' }}>{t('card.answer')}</h3>
                            <p style={{ color: 'white', fontSize: '16px' }}>{value.back}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Card;