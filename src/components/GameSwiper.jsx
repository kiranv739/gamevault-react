import React from 'react';
import { Swiper, SwiperSlide} from 'swiper/react';
import { Navigation, EffectCoverflow, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import './gameswiper.css';
import GameSlide from './GameSlide';

// Ensure the component name starts with an uppercase letter
function GameSwiper({ games, onGameClick }) { 
    
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
                  game={game}
                  onGameClick={onGameClick}
                />
             </SwiperSlide>
            ))}
        </Swiper>
    );
}

export default GameSwiper; // Ensure the component name is consistent and capitalized
