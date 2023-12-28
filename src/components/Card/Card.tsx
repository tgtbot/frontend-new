// import { clsx } from "clsx";

type CardProps = {
  title?: string;
  height?: number | string;
  className?: string;
  children: React.ReactNode;
};

const Card = ({ height, className, title, children }: CardProps) => {
  return (
    <div className="w-fill">
      {title && <h3 className="w-fill">{title}</h3>}
      <div className="w-fill">{children}</div>
    </div>
  );
};

export default Card;
