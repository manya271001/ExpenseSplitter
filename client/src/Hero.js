import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Hero.css"; 
import AboutSection from "./About";
import ContactPage from "./ContactPage";
import Navbar from "./Navbar";
import Footer from "./Footer";


const HeroSection = () => {
  return (
    <>
    <Navbar/>
    <div
      id="heroCarousel"
      className="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval="2000"
    >
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active"></button>
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2"></button>
      </div>

      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src="pexels-karolina-grabowska-5942518.jpg" className="carousel-img" alt="Split Expenses" />
          <div className="carousel-caption" style={{marginBottom:"10%"}}>
            <h2>Effortless Expense Splitting</h2>
            <p>Track and manage shared expenses easily.</p>
          </div>
        </div>

        <div className="carousel-item">
          <img src="pexels-tima-miroshnichenko-7567591.jpg" className="carousel-img" alt="Track Expenses" />
          <div className="carousel-caption" style={{marginBottom:"10%"}}>
            <h2>Real-Time Expense Tracking</h2>
            <p>Stay updated with who owes what in your group.</p>
          </div>
        </div>

        <div className="carousel-item">
          <img src="pexels-fauxels-3184183.jpg" className="carousel-img" alt="Settle Payments" />
          <div className="carousel-caption" style={{marginBottom:"10%"}}>
            <h2>Easy Settlements</h2>
            <p>Mark expenses as settled in just one click.</p>
          </div>
        </div>
      </div>
    </div>
    <AboutSection/>
    <ContactPage/>
    <Footer/>
    </>
  );
};

export default HeroSection;
