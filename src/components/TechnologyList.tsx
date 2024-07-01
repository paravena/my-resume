type Props = {
  title: string;
  items: string[];
};

const TechnologyList = ({ title, items }: Props) => {
  return (
    <section>
      <h3 className="py-2 text-sm">{title}</h3>
      <ul className="flex flex-wrap gap-1">
        {items.map((text, index) => (
          <li
            key={`item-${title}-${index}`}
            className="rounded-lg border-2 border-solid border-blue-500 p-1 text-xs"
          >
            {text}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TechnologyList;
