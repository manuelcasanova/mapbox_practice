// import React, { useEffect, useState } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:3500'); // Replace with your server URL

// const TestWebSocket = () => {
//   const [messages, setMessages] = useState([]);

// useEffect(() => {
//   socket.on('connection', () => {
//     console.log('Connected to server');
//   });
// }, [])

//   useEffect(() => {
//     // Listen for incoming messages from server
//     console.log("1")
    
//     socket.on('message', (message) => {
//       console.log('Received message:', message);
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });
//     console.log("2")

//     // Clean up socket connection on unmount
//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   const sendMessage = () => {
//     const message = 'Hello from client!'; // Example message
//     console.log("3")
//     socket.emit('message', message);
//     console.log("4")
//   };

//   return (
//     <div>
//       <h2>Test WebSocket Component</h2>
//       <button onClick={sendMessage}>Send Message to Server</button>
//       <div>
//         <h3>Received Messages:</h3>
//         <ul>
//           {messages.map((msg, index) => (
//             <li key={index}>{msg}</li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default TestWebSocket;
