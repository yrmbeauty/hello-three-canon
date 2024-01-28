interface Props {
  className?: string;
}

const Instructions: React.FC<Props> = props => {
  const { className } = props;

  return (
    <div
      className={`pointer-events-none text-orange-200 text-center text-lg ${className}`}
    >
      <p className="my-2">Ставьте блоки друг на друга.</p>
      <p className="my-2">
        Щёлкните мышкой или нажмите пробел, когда блок будет над пирамидой.
        Сможете дойти до синих блоков?
      </p>
      <p className="my-2">
        Щёлкните мышкой или нажмите пробел, чтобы начать игру.
      </p>
    </div>
  );
};

export default Instructions;
