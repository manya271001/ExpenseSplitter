import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ContactPage = () => {
  return (
    <div className="container my-5 d-flex justify-content-center">
      <div
        className="p-4 rounded shadow-lg"
        style={{
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)", 
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <h2 className="text-center text-dark mb-4">Contact Us</h2>
        <form>
          <div className="mb-3">
            <label className="form-label text-dark">Your Name</label>
            <input type="text" className="form-control" placeholder="Your Name" required />
          </div>

          <div className="mb-3">
            <label className="form-label text-dark">Email Address</label>
            <input type="email" className="form-control" placeholder="name@example.com" required />
          </div>

          <div className="mb-3">
            <label className="form-label text-dark">Your Message</label>
            <textarea className="form-control" rows="4" placeholder="Write your message here..." required></textarea>
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-primary px-4">Send Message</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
