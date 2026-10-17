import React from "react";
import "./Home.css";
import bgImage from "./e-waste-bg.jpg";
import recyclingImage from "./e-waste-bg.jpg"; 
import Navbar from "./Navbar";

const Home = () => {
  const handleLinkClick = (section) => {
    document.getElementById(section).scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home-container">
      {/* <div className="overlay"></div> */}
      <Navbar onLinkClick={handleLinkClick} />
      <h1 className="home-title">E-Waste Management</h1>

      <div className="content">
        <div id="home" className="section">
          <h2>Welcome to E-Waste Management</h2>
          <p>
            Learn about the importance of managing electronic waste and how you can contribute to a sustainable future. Proper e-waste management helps protect the environment by recycling valuable materials and reducing pollution.
          </p>
        </div>

        <div id="recycling" className="section">
          <h2>Recycling E-Waste</h2>
          <p>
            Recycling electronic waste involves extracting valuable materials while safely disposing of hazardous substances. This process minimizes landfill waste, saves energy, and protects the environment.
          </p>
          <img src={recyclingImage} alt="E-Waste Recycling Process" />
        </div>

        <div id="advantages" className="section">
          <h2>Advantages of E-Waste Management</h2>
          <ul>
            <li><strong>Environmental Protection:</strong> Reduces pollution from hazardous materials.</li>
            <li><strong>Resource Conservation:</strong> Recovers valuable metals and components.</li>
            <li><strong>Economic Benefits:</strong> Creates jobs in the recycling industry.</li>
            <li><strong>Energy Savings:</strong> Uses less energy than raw material extraction.</li>
           <li><strong>Data Security:</strong> Ensures safe disposal of devices containing sensitive information.</li>
          </ul>
        </div>

        <div id="semiconductors" className="section">
          <h2>Semiconductors in E-Waste</h2>
          <p>
            Semiconductors play a crucial role in electronics. Recycling them helps recover rare elements and prevents environmental contamination.
          </p>
          <img src="https://www.src.org/image/dirty-job.jpg" alt="Semiconductors in Electronics" />
        </div>

        <div id="about" className="section">
          <h2>About Us</h2>
          <p>
            We aim to educate and promote sustainable e-waste recycling solutions. Our mission is to create awareness and support a greener future.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
