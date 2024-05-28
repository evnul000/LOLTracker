import React, { useEffect, useState } from 'react';
import './HomePage.scss'; 
import SearchBar from '../../components/SearchBar/SearchBar';
import backgroundImage1 from '../../assets/images/background1.png';
import backgroundImage2 from '../../assets/images/background2.png';
import backgroundImage3 from '../../assets/images/background3.jpg';
import backgroundImage4 from '../../assets/images/background4.jpg';
import backgroundImage5 from '../../assets/images/background5.png';
import backgroundImage6 from '../../assets/images/background6.png';

function HomePage() {
  // Store the background images in an array
  const backgroundImages = [backgroundImage1, backgroundImage2, backgroundImage3, backgroundImage4, backgroundImage5, backgroundImage6];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Function to handle changing the background image
  const changeBackgroundImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
  };

  // Automatically change background image every 5 seconds
  // You can adjust the interval as needed
  useEffect(() => {
    const interval = setInterval(changeBackgroundImage, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <div className="slideshow">
        <img src={backgroundImage1} alt="photo" className='leona-image'/>
        <img src={backgroundImage2} alt="photo"/>
        <img src={backgroundImage3} alt="photo"/>
        <img src={backgroundImage4} alt="photo"/>
        <img src={backgroundImage5} alt="photo"/>
        <img src={backgroundImage6} alt="photo"/>
      </div>
      <div className='title-search'>
      <div className='title'>
      <span class="fire">L</span><span class="burn">oltracke</span><span class="fire">Í</span>
      </div>
        <SearchBar/>
      </div>
    </div>
  );
}

export default HomePage;