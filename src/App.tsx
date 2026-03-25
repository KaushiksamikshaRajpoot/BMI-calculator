import BmiCalculator from "./project/BmiCalculator";
import "./project/BmiCalculator.css";

// const handleSendMessage = async (userInput) => {
//   const response = await fetch('http://localhost:5000/api/chat', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       messages: [{ role: "user", content: userInput }]
//     })
//   });
//   const data = await response.json();
//   console.log(data);
// };

function App() {
  return (
    <>
      <BmiCalculator />
    </>
  );
}

export default App;
