import React, { useRef, useEffect } from 'react'

export const CanvasLogo = ({ isBlurred }) => {
    const canvasRef = useRef(null);
  
    useEffect(() => {
      const canvas = canvasRef.current;
  
      if(!canvas) return;
  
      const ctx = canvas.getContext('2d');
  
      // CLear for redrawing
      ctx.clearRect(0, 0, 40, 40);
  
      // Background gradient based on the scroll state
      const gradient = ctx.createLinearGradient(0, 0, 40, 40);
      if(isBlurred){
        gradient.addColorStop(0, '#2563EB');
        gradient.addColorStop(1, '#06B6D4');
      } else {
        gradient.addColorStop(0, '#FFFFFF');
        gradient.addColorStop(1, '#93C5FD');
      }
  
      ctx.fillStyle = gradient;
  
      // Drew the S-shape layer
      const drawChevron = (yOffset, alpha = 1) => {
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(10, yOffset + 8);
        ctx.lineTo(20, yOffset);
        ctx.lineTo(30, yOffset + 8);
        ctx.lineTo(20, yOffset + 16);
        ctx.fill();
      }
  
      drawChevron(18, 0.6); // Bottom
      drawChevron(10, 0.8); // Middle
      drawChevron(2, 1);    // Top
  
      ctx.globalAlpha = 1;
    }, [isBlurred]);
  
    return <canvas ref={canvasRef} width='40' height='40' className="w-8 h-8 md:w-10 md:h-10" />
}