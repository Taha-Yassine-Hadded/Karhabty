import React from "react";

const ClientAreaOne = () => {
  return (
    <div
      className="client-bg-area"
      style={{ backgroundImage: "url(assets/img/bg/client-bg1-1.png)" }}
    >
      {/*==============================
    Appointment Area  
    ==============================*/}
      <div className="appointment-area-1 overflow-hidden">
        <div className="container">
          <div className="row">
            <div className="col-lg-7">
              <div className="appointment-form-wrap bg-theme">
                <div className="title-area">
                  <span className="sub-title text-white">Send a request</span>
                  <h2 className="sec-title text-white">
                    Our One-Stop Car Repair Shop
                  </h2>
                </div>
                <form
                  action="mail.php"
                  method="POST"
                  className="appointment-form ajax-contact"
                >
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control style-border2"
                          name="name"
                          id="name"
                          placeholder="Your Name"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control style-border2"
                          name="email"
                          id="email"
                          placeholder="Email Address"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control style-border2"
                          name="number"
                          id="number"
                          placeholder="Phone Number"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <select
                          name="subject"
                          id="subject"
                          className="form-select style-border2"
                          defaultValue={"Choose"}
                        >
                          <option value="Choose">Choose a Option</option>
                          <option value="Construction">Auto Repair</option>
                          <option value="Real Estate">Car Repair</option>
                          <option value="Industry">Automotive</option>
                        </select>
                        <i className="fas fa-angle-down text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="form-group col-12">
                    <textarea
                      placeholder="Message here.."
                      id="contactForm"
                      className="form-control style-border2"
                      defaultValue={""}
                    />
                  </div>
                  <div className="form-btn col-12">
                    <button className="btn style3">
                      Appointment Now <i className="fas fa-arrow-right ms-2" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="appointment-thumb-1">
          <img
            src="assets/img/normal/appointment-thumb-1-1.png"
            alt="Fixturbo"
          />
        </div>
      </div>
    </div>
  );
};

export default ClientAreaOne;
