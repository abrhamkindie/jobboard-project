import Category from "./Category.jsx";
import { useNavigate } from "react-router-dom";
import { FaLaptopCode, FaGlobe, FaMoneyBillAlt, FaUserTie, FaDatabase, FaClipboardList, FaCogs, FaChartLine, FaLock } from "react-icons/fa"; 

export default function JobCategories() {
  const navigate = useNavigate();

  const handleSearch = (category) => {
    localStorage.setItem("searchFilters", JSON.stringify({ searchTerm: category, jobType: '', location: '' }));
    navigate("/BrowseJobs");
  }

  const Categories = [
    { id: 1, JobCategory: "Software Engineer", icon: <FaLaptopCode className="text-teal-600" /> },
    { id: 2, JobCategory: "Web Developer", icon: <FaGlobe className="text-teal-600" /> },
    { id: 3, JobCategory: "Cashier", icon: <FaMoneyBillAlt className="text-teal-600" /> },
    { id: 4, JobCategory: "Manager", icon: <FaUserTie className="text-teal-600" /> },
    { id: 5, JobCategory: "Data Scientist", icon: <FaDatabase className="text-teal-600" /> },
    { id: 6, JobCategory: "Project Manager", icon: <FaClipboardList className="text-teal-600" /> },
    { id: 7, JobCategory: "Systems Administrator", icon: <FaCogs className="text-teal-600" /> },
    { id: 8, JobCategory: "Financial Analyst", icon: <FaChartLine className="text-teal-600" /> },
    { id: 9, JobCategory: "Cybersecurity Expert", icon: <FaLock className="text-teal-600" /> },
    { id: 10, JobCategory: "Graphic Designer", icon: <FaLaptopCode className="text-teal-600" /> },  
    { id: 11, JobCategory: "Sales Executive", icon: <FaUserTie className="text-teal-600" /> },
    { id: 12, JobCategory: "Content Writer", icon: <FaClipboardList className="text-teal-600" /> },
  ];

  return (
    <section className="w-full text-center pt-10 bg-gray-50">
      <div className="mx-auto p-10">
        <h2 className="text-3xl font-bold text-teal-600">Explore Job Categories</h2>
        <p className="text-gray-600 text-xs font-semibold mt-2 mb-6">
          Browse diverse job categories to find roles that match your skills and interests. Start your search now!
        </p>
        <div className="job-listings grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-20 my-8">
          {Categories.map((category) => (
            <Category
              key={category.id}
              onClick={() => handleSearch(category.JobCategory)}
              className="flex items-center justify-center border border-teal-100 p-4 rounded-lg cursor-pointer hover:bg-teal-50 text-gray-800"
            >
              <div className="mr-4">{category.icon}</div>
              {category.JobCategory}
            </Category>
          ))}
        </div>
      </div>
    </section>
  );
}