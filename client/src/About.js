import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AboutSection = () => {
  return (
    <div className="container my-5">
      <div
        className="p-4 rounded shadow-lg text-white"
        style={{
        background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)", 
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          height: "100%",
          textAlign: "center",
        }}
      >
        <h2 className="mb-3" style={{textDecoration:"underline",color:"black"}}>About Expense Splitter</h2>
        <p className="lead text-dark">
          Expense Splitter is designed to help you **track shared expenses**, 
          **split costs fairly**, and **settle payments seamlessly**. Whether 
          you're on a **trip, planning an event, or sharing a household**, 
          we've got you covered!
        </p>

        <div className="row mt-4">
          <div className="col-md-4">
            <h3 className="fw-bold text-warning">10,000+</h3>
            <p className="text-dark">Happy Users</p>
          </div>
          <div className="col-md-4">
            <h3 className="fw-bold text-warning">5,000+</h3>
            <p className="text-dark">Groups Created</p>
          </div>
          <div className="col-md-4">
            <h3 className="fw-bold text-warning">₹50M+</h3>
            <p className="text-dark">Expenses Tracked</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
