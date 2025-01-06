import React, {useState, useEffect} from "react";
import { getAllProjects, updateTaskProgress, logTaskTime } from "../pmsApi";

export const Projects: React.FC = () => {
    const [projects, setProjects] = useState([]);
  useEffect(() => {
      fetchProjects();
    }, []);


    async function fetchProjects() {
            const myProjects = await getAllProjects();
            console.log('myProjects: ', myProjects.data);
            setProjects(myProjects.data);
          }
    return (
        <div className="projects-screen">
        <h1 className="text-2xl font-bold mb-4">Projects</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="left-panel">
            <h2 className="text-xl font-semibold mb-2">Project List</h2>
            <ul className="space-y-2">
              {projects.map((project) => (
                <li
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                >
                  {project.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="right-panel">
            {/* {selectedProject && <ChatComponent projectId={selectedProject.id} />} */}
          </div>
        </div>
      </div>
    );
};