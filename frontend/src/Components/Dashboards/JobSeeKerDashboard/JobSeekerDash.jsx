 
import { useState } from "react";
import { SavedJobs } from "./SavedJobs.jsx";
import { SeekerSidebar } from "./SeekerSidebar.jsx";
import { SearchJobs } from "./SearchJobs.jsx";
import { SeekerSummary } from "./SeekerSummary.jsx";
import { Subscription } from "./Subscription.jsx";
import JobSeekerProfile from "./JobSeekerProfile.jsx";
import { Messages } from "../Messages.jsx";
import { AppliedJobs } from "./AppliedJobs.jsx";
import { Interviews } from "./Interviews.jsx";
   export const JobSeekerDash = () => {
  const [activeContent, setActiveContent] = useState("SeekerSummary"); 

 
   
 
  function handleActiveContent(contentId) {
    setActiveContent(contentId);
  
  }

  let content;
  switch (activeContent) { 
      case "SavedJobs":
      content = <SavedJobs onSetActiveContent={ handleActiveContent }/>;
      break;

      case "messages":
      content = <Messages onSetActiveContent={handleActiveContent} />;
      break;

      case "JobSeekerProfile":
      content = <JobSeekerProfile onSetActiveContent={ handleActiveContent }/>;
      break;

      case "Applications":
      content = <AppliedJobs onSetActiveContent={ handleActiveContent }/>;
      break;

      case 'Interviews': // New case
      content = <Interviews  onSetActiveContent={ handleActiveContent } />;
      break;

      case "SeekerSummary":
      content = <SeekerSummary onSetActiveContent={ handleActiveContent } />;
      break;
      case "SearchJobs":
      content = <SearchJobs onSetActiveContent={ handleActiveContent } />;
      break;
      case "Subscription":
      content = <Subscription onSetActiveContent={ handleActiveContent }/>;
      break;
      default:
      content = <SeekerSummary onSetActiveContent={handleActiveContent} />;
  }

  return (    

    
<div className="min-h-screen flex flex-col">
<main className="flex flex-1 overflow-hidden">
  <SeekerSidebar
    onSetActiveContent={handleActiveContent}
    activeContent={activeContent}
    className="flex-shrink-0 w-72 h-full overflow-y-auto"
  />

 {content}

   </main>

</div>
  
  );
};
 
 