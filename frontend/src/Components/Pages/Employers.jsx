import Button from "../Button";
import ChoseUs from "../ChoseUs";

export const Employers = () => {
  const WhyChoseUs = [
    {
      id: 1,
      advantage: "Access to Top Talent",
      descriptions:
        "We connect you with highly qualified candidates across various industries.",
    },
    {
      id: 2,
      advantage: "Easy Job Posting",
      descriptions: "Post your job openings quickly and easily with our simple interface.",
    },
    {
      id: 3,
      advantage: "Streamlined Recruitment",
      descriptions: "Manage your applications and communicate with candidates efficiently.",
    },
  ];

  const HowItWorks = [
    {
      id: 1,
      step: "1. Create an Account",
      descriptions: "Sign up to create an employer account and start posting jobs.",
    },
    {
      id: 2,
      step: "2. Post a Job",
      descriptions: "Fill in the details of the job position and publish it.",
    },
    {
      id: 3,
      step: "3. Manage Applications",
      descriptions: "Review and manage applications through your employer dashboard.",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-teal-800 to-teal-900 text-white py-12 md:py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center shadow-lg">
        <div className="max-w-4xl w-full px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold my-4 md:my-6 text-teal-200">
            Welcome, Employers!
          </h1>
          <p className="font-semibold text-lg sm:text-xl my-3 md:my-4">Discover the Perfect Fit for Your Company</p>
          <p className="text-base sm:text-lg leading-relaxed text-teal-100">
            Access a vast pool of talent and find the right candidates quickly and easily. 
            Post your job openings and connect with top professionals ready to make an impact.
          </p>
          <p className="font-bold text-lg sm:text-xl mt-4 md:mt-6 mb-6 md:mb-8 text-teal-300">Start Hiring Today</p>
          <Button className="bg-teal-600 hover:bg-teal-700 px-4 py-2 sm:px-6 sm:py-3 text-base sm:text-lg font-bold rounded-lg transition duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-1">
            Post a Job
          </Button>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="w-full py-12 md:py-20 bg-teal-50">
        <div className="max-w-6xl mx-auto text-center px-4 sm:px-6">
          <h1 className="font-bold text-3xl sm:text-4xl text-teal-800 mb-2">Why Choose Jobflars?</h1>
          <p className="text-base sm:text-lg text-teal-600 max-w-3xl mx-auto mb-8 sm:mb-12">
            We provide the tools and talent to help your business grow
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-10">
            {WhyChoseUs.map((chose) => (
              <ChoseUs
                key={chose.id}
                advantage={chose.advantage}
                description={chose.descriptions}
                icon={chose.icon}
                className="bg-white shadow-md rounded-xl p-6 sm:p-8 hover:shadow-lg transition duration-300 border border-teal-100 hover:border-teal-200"
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto text-center px-4 sm:px-6">
          <h1 className="font-bold text-3xl sm:text-4xl text-teal-800 mb-2">How It Works</h1>
          <p className="text-base sm:text-lg text-teal-600 max-w-3xl mx-auto mb-8 sm:mb-12">
            Simple steps to find your perfect candidate
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-10">
            {HowItWorks.map((prev, index) => (
              <div key={prev.id} className="relative">
                <div className="absolute -top-4 -left-4 bg-teal-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center">
                  {index + 1}
                </div>
                <ChoseUs
                  advantage={prev.step}
                  description={prev.descriptions}
                  icon={prev.icon}
                  className="bg-teal-50 shadow-md rounded-xl p-6 sm:p-8 hover:shadow-lg transition duration-300 border border-teal-100 relative"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};