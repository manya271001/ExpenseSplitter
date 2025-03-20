import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  return (
    <footer
      className="text-center text-light py-4"
      style={{
       background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)", 
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          color:"black",
      }}
    >
      <div className="container">
        {/* Footer Links */}
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5 style={{color:"yellow"}}>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-dark text-decoration-none">Home</a></li>
              <li><a href="/about" className="text-dark text-decoration-none">About</a></li>
              <li><a href="/contact" className="text-dark text-decoration-none">Contact</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="col-md-4 mb-3">
            <h5 style={{color:"yellow"}}>Follow Us</h5>
            <div>
              <a href="#" className="text-sucess me-3"><i className="bi bi-facebook fs-4"></i></a>
              <a href="#" className="text-sucess me-3"><i className="bi bi-twitter fs-4"></i></a>
              <a href="#" className="text-sucess"><i className="bi bi-instagram fs-4"></i></a>
            </div>
          </div>

          {/* Copyright */}
          <div className="col-md-4 mb-3 text-dark">
            <h5 style={{color:"yellow"}}>Contact Info</h5>
            <p>Email: support@expensesplitter.com</p>
            <p>Phone: +91 12345 67890</p>
          </div>
        </div>

        <hr className="border-light" />
        <p className="mb-0">© 2025 Expense Splitter. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
