const Greeting = () => {
  const hour = new Date().getHours();

  let greeting;
  if (hour < 4) {
    greeting = "Good night.";
  } else if (hour < 12) {
    greeting = "Good morning.";
  } else if (hour < 18) {
    greeting = "Good afternoon.";
  } else {
    greeting = "Good evening.";
  }

  return (
    <span className="text-[40px] font-hahmlet select-none">{greeting}</span>
  );
};

export default Greeting;
