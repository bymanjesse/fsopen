import { useState } from 'react';

const StatisticsLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
);

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad;
  const average = total > 0 ? (good + bad * -1) / total : 0;
  const positivePercentage = total > 0 ? (good / total) * 100 : 0;

  return (
    <>
      <h2>Statistics</h2>
      {total > 0 ? (
        <table>
          <tbody>
            <StatisticsLine text="Good" value={good} />
            <StatisticsLine text="Neutral" value={neutral} />
            <StatisticsLine text="Bad" value={bad} />
            <StatisticsLine text="Total" value={total} />
            <StatisticsLine text="Average" value={average} />
            <StatisticsLine text="Positive" value={`${positivePercentage.toFixed(2)}%`} />
          </tbody>
        </table>
      ) : (
        <p>No feedback given</p>
      )}
    </>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div className="App">
      <header>
        <h1>Give feedback</h1>
      </header>
      <div>
        <button onClick={() => setGood(good + 1)}>Good</button>
        <button onClick={() => setNeutral(neutral + 1)}>Neutral</button>
        <button onClick={() => setBad(bad + 1)}>Bad</button>
      </div>
      <Statistics good={good} neutral={neutral} bad={bad} />
      {/* the rest of your component content goes here */}
    </div>
  );
};

export default App;