import { EmpSidebar } from "./EmpSidebar.jsx";
import { JobPosting } from "./JobPosting.jsx";
import { EmpSummary } from "./EmpSummary.jsx";
 import { ManagePosts } from "./ManagePosts.jsx";
import { EditPost } from "./EditPosts.jsx";
import { useState } from "react";
import { Messages } from "../Messages.jsx";
import { JobApplicants } from "./JobApplicants.jsx";
import { EmployerInterviews } from "./EmployerInterviews.jsx";
import EmployerProfile from "./EmployerProfile.jsx";
 
export const EmpDash = () => {
  const [activeContent, setActiveContent] = useState("EmpSummary"); 

  function handleActiveContent(contentId) {
    setActiveContent(contentId);
  }

  let content;
  switch (activeContent) {
    case "JobPosting":
    content = <JobPosting onSetActiveContent={ handleActiveContent } />;
    break;
    
    case "ManagePosts":
    content = <ManagePosts onSetActiveContent={handleActiveContent} />;
    break;

    case 'Interviews':
    content = <EmployerInterviews onSetActiveContent={handleActiveContent} />;
    break;

    case "JobApplicants":
    content = <JobApplicants onSetActiveContent={handleActiveContent} />;
    break;
    case "Messages":  
    content = <Messages onSetActiveContent={handleActiveContent} />;
    break;
    case "EmployerProfile":
    content = <EmployerProfile onSetActiveContent={handleActiveContent} />;
    break;
    case "EmpSummary":
    content = <EmpSummary  onSetActiveContent={handleActiveContent} />;
    break;
    case "EditPost":
    content = <EditPost  onSetActiveContent={handleActiveContent} />;
    break;
    default:
    content = <EmpSummary onSetActiveContent={handleActiveContent} />;
  }

  return (

<div className="min-h-screen flex flex-col">
<main className="flex flex-1 overflow-hidden">
  <EmpSidebar
    onSetActiveContent={handleActiveContent}
    activeContent={activeContent}
    className="flex-shrink-0 w-72 h-full overflow-y-auto"
  />

 {content}

   </main>

</div>


   
  );
};
