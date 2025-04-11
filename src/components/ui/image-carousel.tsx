import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

interface ImageCarouselProps {
  images: string[]; // Danh sách URL ảnh
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  return (
    <div>
      <Slider {...settings}>
        {images.map((url, index) => (
          <div key={index} className='p-2'>
            <img
              src={url}
              alt={`Carousel ${index}`}
              className='h-32 w-full cursor-pointer rounded object-cover'
              onClick={() => {
                setLightboxIndex(index);
                setIsLightboxOpen(true);
              }}
            />
          </div>
        ))}
      </Slider>

      {isLightboxOpen && (
        <Lightbox
          mainSrc={images[lightboxIndex]}
          nextSrc={images[(lightboxIndex + 1) % images.length]}
          prevSrc={images[(lightboxIndex + images.length - 1) % images.length]}
          onCloseRequest={() => setIsLightboxOpen(false)}
          onMovePrevRequest={() =>
            setLightboxIndex(
              (lightboxIndex + images.length - 1) % images.length
            )
          }
          onMoveNextRequest={() =>
            setLightboxIndex((lightboxIndex + 1) % images.length)
          }
        />
      )}
    </div>
  );
};

export default ImageCarousel;
