import React, { useState, useEffect } from 'react';
 
 const App = () => {
   const [countdown, setCountdown] = useState('');
 
   useEffect(() => {
     const calculateCountdown = () => {
       const now = new Date();
       const christmas = new Date('25 Dec 2025');
       const difference = christmas - now;
 
       const days = Math.floor(difference / (1000 * 60 * 60 * 24));
       const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
       const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
       const seconds = Math.floor((difference % (1000 * 60)) / 1000);
 
       setCountdown(`Faltan ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds para Navidad`);
     };
 
     const interval = setInterval(calculateCountdown, 1000);
     return () => clearInterval(interval);
   }, []);
 
   return (
     <>
       <h1>{countdown}</h1>
       <h2 className="text-red-500">¡Feliz Navidad!</h2>
     </>
   );
 }
 
 export default App;