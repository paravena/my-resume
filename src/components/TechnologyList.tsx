type Props = {
  title: string;
  items: string[];
};

const TechnologyList = ({ title, items }: Props) => {
  return (
    <section className="space-y-2">
      <h3 className="text-xl">{title}</h3>
      <ul className="flex flex-wrap gap-1">
        {items.map((text, index) => (
          <li
            key={`item-${title}-${index}`}
            className="text-md rounded-lg border-2 border-solid border-blue-500 p-1"
          >
            {text}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TechnologyList;
