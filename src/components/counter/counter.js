import { useEffect, useState } from "react";

export const Counter = (props) => {
  const { handleTime } = props;
  const [counter, setCounter] = useState(30);

  // Third Attempts
  useEffect(() => {
    const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    if (counter === 0) {
      handleTime();
    }
    return () => clearInterval(timer);
  }, [counter]);

  return (
    <div className="App">
      <div>Resend OTP in {counter} Sec</div>
    </div>
  );
};
