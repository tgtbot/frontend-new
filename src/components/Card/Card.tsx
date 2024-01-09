// import { clsx } from "clsx";

type CardProps = {
  title?: string;
  height?: number | string;
  className?: string;
  children: React.ReactNode;
};

const Card = ({ height, className, title, children }: CardProps) => {
  return (
    <div className={`p-4 bg-[#242527] rounded-xl ${className}`}>
      {title && <h3 className="mb-3 leading-[16px]">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
