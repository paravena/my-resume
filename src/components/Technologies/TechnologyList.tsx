type Props = {
  title: string;
  items: string[];
};

const TechnologyList = ({ title, items }: Props) => {
  return (
    <section className="space-y-2 md:space-y-3">
      <h3 className="text-lg sm:text-h3 font-semibold text-secondary-700">{title}</h3>
      <div className="leading-loose">
        {items.map((text, index) => (
          <span
            key={`item-${title}-${index}`}
            className="text-body-sm rounded-md border border-primary-300 bg-primary-50 px-3 py-1 text-primary-700 transition-colors duration-250 hover:bg-primary-100 hover:border-primary-400 inline-block mr-2 mb-2"
          >
            {text}
          </span>
        ))}
      </div>
    </section>
  );
};

export default TechnologyList;
