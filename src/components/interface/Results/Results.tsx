interface Props {
  className?: string;
}

const Results: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={`pointer-events-none text-slate-100 text-center text-lg p-16 bg-slate-500 opacity-90 rounded-3xl ${className}`}
    >
      <p className="my-2">Вы промахнулись</p>
      <p className="my-2">
        Для перезапуска игры щёлкните мышкой или нажмите пробел
      </p>
    </div>
  );
};

export default Results;
