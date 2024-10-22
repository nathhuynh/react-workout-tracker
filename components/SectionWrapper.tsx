import { ReactNode } from 'react';

interface SectionWrapperProps {
  children: ReactNode;
  header: string;
  title: [string, string, string];
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ children, header, title }) => {
  return (
    <section className="gap-10 min-h-screen flex flex-col">
      <div className="p-4 gap-4 flex flex-col py-10 bg-slate-950 justify-center items-center">
        <p className="font-medium uppercase">{header}</p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold">
          {title[0]} {title[1]}<span className="uppercase text-indigo-400"> {title[2]}</span>
        </h2>
      </div>
      <div className="p-4 flex flex-col w-full max-w-[800px] mx-auto gap-10">
        {children}
      </div>
    </section>
  );
};

export default SectionWrapper;