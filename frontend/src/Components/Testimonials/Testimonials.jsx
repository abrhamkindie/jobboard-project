import Hair from './TestimonialsProfiles/Hair.jpg';
import Brand from './TestimonialsProfiles/Personal_Branding.jpg';
import Shout from './TestimonialsProfiles/Shot_of_businessman.jpg'; 

import Cards from "./Cards.jsx";

export default function Testimonials() {
  const comments = [
    { id: 1, source: Shout, title: "John Smith", name: "John Smith", expertAt: "Senior Developer", taught: "\"JobFlare helped me find my dream job. I couldn't be happier!\"" },
    { id: 2, source: Hair, title: "Jane Doe", name: "Jane Doe", expertAt: "CEO", taught: "\"The platform made it so easy to find qualified candidates for my company.\"" },
    { id: 3, source: Brand, title: "Michael Chen", name: "Michael Chen", expertAt: "Lead Engineer", taught: "\"JobFlare made my job search so easy. I landed my ideal role in just a few weeks!\"" },
  ];

  return (
    <section className="w-full text-center py-8 sm:py-10 bg-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-teal-600 mb-4 sm:mb-6 tracking-tight">
          What People Are Saying
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {comments.map((comment) => (
            <Cards
              key={comment.id}
              source={comment.source}
              title={comment.title}
              name={comment.name}
              expertAt={comment.expertAt}
              taught={comment.taught}
              className="bg-white border border-teal-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            />
          ))}
        </div>
      </div>
    </section>
  );
}