import React from 'react';
import Lottie from "lottie-react";
import loadingAnim from "../../assets/Lottifiles/loading.json";
import Particles from "../../Components/BackgroundAnimation/Particles";

const Loader = () => {
    return (
        <div className="relative flex items-center justify-center max-w-5xl mx-auto h-[60vh]">
            {/* Background Animation */} 
                  <div style={{ width: '100%', height: '600px', position: 'absolute' }}>
                    <Particles
                      particleColors={['#ffffff', '#ffffff']}
                      particleCount={200}
                      particleSpread={10}
                      speed={0.1}
                      particleBaseSize={100}
                      moveParticlesOnHover={true}
                      alphaParticles={false}
                      disableRotation={false}
                    />
                  </div>
            <Lottie animationData={loadingAnim} loop={true} />
            </div>
    );
};

export default Loader;