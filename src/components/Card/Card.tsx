// import { clsx } from "clsx";

type CardProps = {
  title?: string;
  height?: number | string;
  className?: string;
  children: React.ReactNode;
};

const Card = ({ height, className, title, children }: CardProps) => {
  return (
    <div className="p-4 overflow-hidden bg-[#242527] rounded-xl">
      {title && <h3 className="">{title}</h3>}
      <div className="">{children}</div>
    </div>
  );
};

export default Card;
