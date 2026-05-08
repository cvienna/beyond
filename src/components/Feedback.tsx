const Feedback = ({ type }: { type: "positive" | "negative" }) => {
  return (
    <div>
      <span>Give {type} feedback</span>
    </div>
  );
};

export default Feedback;
