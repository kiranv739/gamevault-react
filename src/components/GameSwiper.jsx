import React, { useState } from 'react';
import { Swiper, SwiperSlide} from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, EffectCoverflow, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import './gameswiper.css';
import GameSlide from './GameSlide';

// Ensure the component name starts with an uppercase letter
function GameSwiper({ games, onGameClick }) { 
    const [active, setActive] = useState(false);
    
    const handelToggleVideo = () => {
        setActive(!active);
    };
    
    return (
       
        <Swiper
            effect={'coverflow'}
            grabCursor={true}
            navigation={true}
            loop={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            coverflowEffect={{
                rotate: 35,
                stretch: 200,
                depth: 250,
                modifier: 1,
                slideShadows: true,
            }}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
            modules={[EffectCoverflow, Navigation, Autoplay]}
            className="gameSwiper"
        >
            {games.map(game => (
             <SwiperSlide key={game._id}> 
                <GameSlide 
                  active={active} 
                  game={game}
                  onGameClick={onGameClick}
                />
             </SwiperSlide>
            ))}
        </Swiper>
    );
}

export default GameSwiper; // Ensure the component name is consistent and capitalized
