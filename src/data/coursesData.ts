export interface CourseDefinition {
  code: string;
  name: string;
  credits: number;
  branch: string; // 'CS' | 'ME' | 'EE' | 'ECE' | 'CE' | 'MM' | 'EP'
  semester: number; // 1 to 8
  category?: 'Core' | 'Elective' | 'Lab' | 'Basic Science' | 'HSS' | 'Breadth';
}

export interface BranchInfo {
  id: string;
  name: string;
  code: string;
  description: string;
}

export const BRANCHES: BranchInfo[] = [
  { id: 'CS', name: 'Computer Science & Engineering', code: 'CSE', description: 'Algorithms, Software, Systems & AI' },
  { id: 'ME', name: 'Mechanical Engineering', code: 'ME', description: 'Thermal, Design, Manufacturing & Robotics' },
  { id: 'EE', name: 'Electrical Engineering', code: 'EE', description: 'Power Systems, Control & Electrical Machines' },
  { id: 'ECE', name: 'Electronics & Communication Eng.', code: 'ECE', description: 'VLSI, Communications, Signal Processing & Embedded' },
  { id: 'CE', name: 'Civil Engineering', code: 'CE', description: 'Structures, Hydraulics, Geotech & Environmental' },
  { id: 'MM', name: 'Metallurgical & Materials Eng.', code: 'MEMS', description: 'Physical Metallurgy, Materials & Processing' },
  { id: 'EP', name: 'Engineering Physics', code: 'EP', description: 'Quantum Mechanics, Photonics & Applied Physics' },
];

// Common 1st Year Curriculum for IIT Bhubaneswar (Semesters 1 & 2)
const FIRST_YEAR_SEM1: Omit<CourseDefinition, 'branch'>[] = [
  { code: 'MA1L003', name: 'Calculus and Ordinary Differential Equations', credits: 4, semester: 1, category: 'Basic Science' },
  { code: 'PH1L002', name: 'Physics', credits: 3, semester: 1, category: 'Basic Science' },
  { code: 'PH1P001', name: 'Physics Laboratory', credits: 2, semester: 1, category: 'Lab' },
  { code: 'CS1L002', name: 'Programming in C', credits: 3, semester: 1, category: 'Core' },
  { code: 'CS1P002', name: 'Programming in C Laboratory', credits: 2, semester: 1, category: 'Lab' },
  { code: 'ID2L003', name: 'Environmental Science, Technology & Management', credits: 2, semester: 1, category: 'Basic Science' },
  { code: 'HS1L007', name: 'English for Learning and Communication', credits: 3, semester: 1, category: 'HSS' },
  { code: 'CE1P001', name: 'Engineering Drawing and Graphics', credits: 3, semester: 1, category: 'Core' },
  { code: 'ID1T001', name: 'Extra Academic Activity-1', credits: 1, semester: 1, category: 'Core' },
];

const FIRST_YEAR_SEM2: Omit<CourseDefinition, 'branch'>[] = [
  { code: 'MA1L004', name: 'Linear Algebra and Complex Analysis', credits: 4, semester: 2, category: 'Basic Science' },
  { code: 'CY1L002', name: 'Chemistry', credits: 3, semester: 2, category: 'Basic Science' },
  { code: 'CY1P001', name: 'Chemistry Laboratory', credits: 2, semester: 2, category: 'Lab' },
  { code: 'EE1L002', name: 'Basic Electrical and Electronics Engineering', credits: 4, semester: 2, category: 'Core' },
  { code: 'EE1P002', name: 'Basic Electrical & Electronics Eng. Lab', credits: 2, semester: 2, category: 'Lab' },
  { code: 'ME1L002', name: 'Engineering Mechanics', credits: 4, semester: 2, category: 'Core' },
  { code: 'ME1P001', name: 'Introduction to Manufacturing Process', credits: 2, semester: 2, category: 'Core' },
  { code: 'ID2L002', name: 'Introduction to Bio Science and Technology', credits: 2, semester: 2, category: 'Basic Science' },
  { code: 'ID1L001', name: 'Happiness and Life Skill', credits: 1, semester: 2, category: 'HSS' },
  { code: 'ID1L002', name: 'Introduction to Bharatiya Knowledge Traditions', credits: 2, semester: 2, category: 'HSS' },
  { code: 'ID1T002', name: 'Extra Academic Activity-2', credits: 1, semester: 2, category: 'Core' },
];

// Department Specific Curriculum (Semesters 3 to 8)
export const BRANCH_CURRICULA: Record<string, Omit<CourseDefinition, 'branch'>[]> = {
  CS: [
    // Semester 3
    { code: 'CS2L001', name: 'Data Structures', credits: 4, semester: 3, category: 'Core' },
    { code: 'CS2P001', name: 'Data Structures Laboratory', credits: 2, semester: 3, category: 'Lab' },
    { code: 'CS2L002', name: 'Discrete Structures', credits: 4, semester: 3, category: 'Core' },
    { code: 'CS2L003', name: 'Digital Logic and Computer Architecture', credits: 4, semester: 3, category: 'Core' },
    { code: 'CS2P003', name: 'Digital Logic Laboratory', credits: 2, semester: 3, category: 'Lab' },
    { code: 'MA2L101', name: 'Applied Partial Differential Equations', credits: 2, semester: 3, category: 'Basic Science' },
    { code: 'HS2L001', name: 'Introduction to Economics', credits: 3, semester: 3, category: 'HSS' },

    // Semester 4
    { code: 'CS2L004', name: 'Design and Analysis of Algorithms', credits: 4, semester: 4, category: 'Core' },
    { code: 'CS2L005', name: 'Object Oriented Programming', credits: 3, semester: 4, category: 'Core' },
    { code: 'CS2P005', name: 'Object Oriented Programming Lab', credits: 2, semester: 4, category: 'Lab' },
    { code: 'CS3L004', name: 'Theory of Computation', credits: 4, semester: 4, category: 'Core' },
    { code: 'MA2L104', name: 'Applied Numerical Methods', credits: 3, semester: 4, category: 'Basic Science' },
    { code: 'HS2L002', name: 'Principles of Management', credits: 3, semester: 4, category: 'HSS' },

    // Semester 5
    { code: 'CS3L001', name: 'Operating Systems', credits: 4, semester: 5, category: 'Core' },
    { code: 'CS3P001', name: 'Operating Systems Laboratory', credits: 2, semester: 5, category: 'Lab' },
    { code: 'CS3L002', name: 'Database Management Systems', credits: 4, semester: 5, category: 'Core' },
    { code: 'CS3P002', name: 'DBMS Laboratory', credits: 2, semester: 5, category: 'Lab' },
    { code: 'CS3L003', name: 'Computer Networks', credits: 4, semester: 5, category: 'Core' },
    { code: 'CS3P003', name: 'Computer Networks Laboratory', credits: 2, semester: 5, category: 'Lab' },
    { code: 'CS4L001', name: 'Artificial Intelligence', credits: 3, semester: 5, category: 'Elective' },

    // Semester 6
    { code: 'CS3L005', name: 'Compiler Design', credits: 4, semester: 6, category: 'Core' },
    { code: 'CS3P005', name: 'Compiler Design Laboratory', credits: 2, semester: 6, category: 'Lab' },
    { code: 'CS4L002', name: 'Machine Learning', credits: 4, semester: 6, category: 'Elective' },
    { code: 'CS4L004', name: 'Cryptography & Network Security', credits: 3, semester: 6, category: 'Elective' },
    { code: 'CS4L005', name: 'Cloud Computing', credits: 3, semester: 6, category: 'Elective' },
    { code: 'HS3L001', name: 'Sociology of Science & Technology', credits: 3, semester: 6, category: 'HSS' },

    // Semester 7
    { code: 'CS4T001', name: 'Industrial Training Defense', credits: 2, semester: 7, category: 'Core' },
    { code: 'CS4D001', name: 'B.Tech Project - Part I', credits: 4, semester: 7, category: 'Core' },
    { code: 'CS4L003', name: 'Computer Graphics', credits: 3, semester: 7, category: 'Elective' },
    { code: 'CS4L006', name: 'Distributed Systems', credits: 3, semester: 7, category: 'Elective' },
    { code: 'CS-EL1', name: 'Depth Elective - I', credits: 3, semester: 7, category: 'Elective' },

    // Semester 8
    { code: 'CS4D002', name: 'B.Tech Project - Part II', credits: 6, semester: 8, category: 'Core' },
    { code: 'CS-EL2', name: 'Depth Elective - II', credits: 3, semester: 8, category: 'Elective' },
    { code: 'CS-EL3', name: 'Depth Elective - III', credits: 3, semester: 8, category: 'Elective' },
    { code: 'CS-BR1', name: 'Open Breadth Elective', credits: 3, semester: 8, category: 'Breadth' },
  ],

  ME: [
    // Semester 3
    { code: 'ME2L001', name: 'Theory of Machines - I', credits: 4, semester: 3, category: 'Core' },
    { code: 'ME2L105', name: 'Thermodynamics', credits: 4, semester: 3, category: 'Core' },
    { code: 'ME2L004', name: 'Mechanics of Solids', credits: 4, semester: 3, category: 'Core' },
    { code: 'MA2L101', name: 'Applied Partial Differential Equations', credits: 2, semester: 3, category: 'Basic Science' },
    { code: 'ME2L102', name: 'Measurements and Instrumentation', credits: 3, semester: 3, category: 'Core' },
    { code: 'ME2P001', name: 'Workshop Practices', credits: 2, semester: 3, category: 'Lab' },
    { code: 'ME2P004', name: 'Material Testing Laboratory', credits: 2, semester: 3, category: 'Lab' },

    // Semester 4
    { code: 'ME2L005', name: 'Theory of Machines - II', credits: 4, semester: 4, category: 'Core' },
    { code: 'ME2L002', name: 'Fluid Mechanics', credits: 4, semester: 4, category: 'Core' },
    { code: 'ME2L103', name: 'Engineering Materials', credits: 2, semester: 4, category: 'Core' },
    { code: 'MA2L104', name: 'Applied Numerical Methods', credits: 3, semester: 4, category: 'Basic Science' },
    { code: 'ME2P101', name: 'Mechanisms and Vibration Laboratory', credits: 2, semester: 4, category: 'Lab' },
    { code: 'ME2P002', name: 'Fluid Mechanics Laboratory', credits: 2, semester: 4, category: 'Lab' },
    { code: 'HS2L001', name: 'Introduction to Economics', credits: 3, semester: 4, category: 'HSS' },

    // Semester 5
    { code: 'ME3L004', name: 'Systems & Control', credits: 3, semester: 5, category: 'Core' },
    { code: 'ME3L003', name: 'Casting, Welding and Forming', credits: 3, semester: 5, category: 'Core' },
    { code: 'ME3L001', name: 'Heat Transfer', credits: 4, semester: 5, category: 'Core' },
    { code: 'ME3L002', name: 'Design of Machine Elements', credits: 3, semester: 5, category: 'Core' },
    { code: 'ME3P003', name: 'Machine Design Practice', credits: 2, semester: 5, category: 'Lab' },
    { code: 'ME3P001', name: 'Thermo-Fluid Lab - 1', credits: 2, semester: 5, category: 'Lab' },
    { code: 'ME3P002', name: 'Casting, Welding & Forming Lab', credits: 2, semester: 5, category: 'Lab' },

    // Semester 6
    { code: 'ME3L007', name: 'Machine Tool & Machining', credits: 3, semester: 6, category: 'Core' },
    { code: 'ME3L005', name: 'IC Engines', credits: 3, semester: 6, category: 'Core' },
    { code: 'ME3L006', name: 'Refrigeration & Air-Conditioning', credits: 3, semester: 6, category: 'Core' },
    { code: 'ME3L008', name: 'Power Plant Engineering', credits: 3, semester: 6, category: 'Core' },
    { code: 'ME3P004', name: 'Thermo-Fluid Lab - 2', credits: 2, semester: 6, category: 'Lab' },
    { code: 'ME3P005', name: 'MTM Laboratory', credits: 2, semester: 6, category: 'Lab' },
    { code: 'ME-EL1', name: 'Elective - 1', credits: 3, semester: 6, category: 'Elective' },

    // Semester 7
    { code: 'ME4T001', name: 'Industrial Training Defense', credits: 2, semester: 7, category: 'Core' },
    { code: 'ME4D001', name: 'B.Tech Project - Part I', credits: 4, semester: 7, category: 'Core' },
    { code: 'ME-EL2', name: 'Elective - 2', credits: 3, semester: 7, category: 'Elective' },
    { code: 'ME-EL3', name: 'Elective - 3', credits: 3, semester: 7, category: 'Elective' },
    { code: 'ME-BR1', name: 'Breadth Elective - 1', credits: 3, semester: 7, category: 'Breadth' },

    // Semester 8
    { code: 'ME4D002', name: 'B.Tech Project - Part II', credits: 6, semester: 8, category: 'Core' },
    { code: 'ME-EL4', name: 'Elective - 4', credits: 3, semester: 8, category: 'Elective' },
    { code: 'ME-EL5', name: 'Elective - 5', credits: 3, semester: 8, category: 'Elective' },
    { code: 'ME-BR2', name: 'Breadth Elective - 2', credits: 3, semester: 8, category: 'Breadth' },
  ],

  EE: [
    // Semester 3
    { code: 'EE2L001', name: 'Signals and Systems', credits: 4, semester: 3, category: 'Core' },
    { code: 'EE2L002', name: 'Network Analysis and Synthesis', credits: 4, semester: 3, category: 'Core' },
    { code: 'EE2L003', name: 'Electrical Machines - I', credits: 4, semester: 3, category: 'Core' },
    { code: 'EE2P003', name: 'Electrical Machines Laboratory - I', credits: 2, semester: 3, category: 'Lab' },
    { code: 'MA2L101', name: 'Applied Partial Differential Equations', credits: 2, semester: 3, category: 'Basic Science' },
    { code: 'HS2L001', name: 'Introduction to Economics', credits: 3, semester: 3, category: 'HSS' },

    // Semester 4
    { code: 'EE2L004', name: 'Analog Electronics', credits: 4, semester: 4, category: 'Core' },
    { code: 'EE2P004', name: 'Analog Electronics Laboratory', credits: 2, semester: 4, category: 'Lab' },
    { code: 'EE3L002', name: 'Control Systems Engineering', credits: 4, semester: 4, category: 'Core' },
    { code: 'EE3P002', name: 'Control Systems Laboratory', credits: 2, semester: 4, category: 'Lab' },
    { code: 'MA2L104', name: 'Applied Numerical Methods', credits: 3, semester: 4, category: 'Basic Science' },
    { code: 'HS2L002', name: 'Principles of Management', credits: 3, semester: 4, category: 'HSS' },

    // Semester 5
    { code: 'EE3L001', name: 'Electrical Machines - II', credits: 4, semester: 5, category: 'Core' },
    { code: 'EE3P001', name: 'Electrical Machines Laboratory - II', credits: 2, semester: 5, category: 'Lab' },
    { code: 'EE3L003', name: 'Power Electronics', credits: 4, semester: 5, category: 'Core' },
    { code: 'EE3P003', name: 'Power Electronics Laboratory', credits: 2, semester: 5, category: 'Lab' },
    { code: 'EE3L004', name: 'Power Systems - I', credits: 4, semester: 5, category: 'Core' },
    { code: 'EE3P004', name: 'Power Systems Laboratory', credits: 2, semester: 5, category: 'Lab' },

    // Semester 6
    { code: 'EE4L001', name: 'Power System Protection', credits: 3, semester: 6, category: 'Elective' },
    { code: 'EE4L002', name: 'High Voltage Engineering', credits: 3, semester: 6, category: 'Elective' },
    { code: 'EE4L003', name: 'Electric Drives and Control', credits: 3, semester: 6, category: 'Elective' },
    { code: 'EE-EL1', name: 'Depth Elective - I', credits: 3, semester: 6, category: 'Elective' },
    { code: 'HS3L001', name: 'Sociology of Science & Tech', credits: 3, semester: 6, category: 'HSS' },

    // Semester 7
    { code: 'EE4T001', name: 'Industrial Training Defense', credits: 2, semester: 7, category: 'Core' },
    { code: 'EE4D001', name: 'B.Tech Project - Part I', credits: 4, semester: 7, category: 'Core' },
    { code: 'EE-EL2', name: 'Depth Elective - II', credits: 3, semester: 7, category: 'Elective' },
    { code: 'EE-BR1', name: 'Breadth Elective - 1', credits: 3, semester: 7, category: 'Breadth' },

    // Semester 8
    { code: 'EE4D002', name: 'B.Tech Project - Part II', credits: 6, semester: 8, category: 'Core' },
    { code: 'EE-EL3', name: 'Depth Elective - III', credits: 3, semester: 8, category: 'Elective' },
    { code: 'EE-BR2', name: 'Breadth Elective - 2', credits: 3, semester: 8, category: 'Breadth' },
  ],

  ECE: [
    // Semester 3
    { code: 'EC2L001', name: 'Semiconductor Devices and Circuits', credits: 4, semester: 3, category: 'Core' },
    { code: 'EC2P001', name: 'Semiconductor Devices Laboratory', credits: 2, semester: 3, category: 'Lab' },
    { code: 'EC2L002', name: 'Digital Electronics & Logic Design', credits: 4, semester: 3, category: 'Core' },
    { code: 'EC2P002', name: 'Digital Systems Laboratory', credits: 2, semester: 3, category: 'Lab' },
    { code: 'MA2L101', name: 'Applied Partial Differential Equations', credits: 2, semester: 3, category: 'Basic Science' },
    { code: 'HS2L001', name: 'Introduction to Economics', credits: 3, semester: 3, category: 'HSS' },

    // Semester 4
    { code: 'EC2L003', name: 'Electromagnetic Field Theory', credits: 4, semester: 4, category: 'Core' },
    { code: 'EC3L002', name: 'Digital Signal Processing', credits: 4, semester: 4, category: 'Core' },
    { code: 'EC3P002', name: 'DSP Laboratory', credits: 2, semester: 4, category: 'Lab' },
    { code: 'MA2L104', name: 'Applied Numerical Methods', credits: 3, semester: 4, category: 'Basic Science' },
    { code: 'HS2L002', name: 'Principles of Management', credits: 3, semester: 4, category: 'HSS' },

    // Semester 5
    { code: 'EC3L001', name: 'Analog Communication Systems', credits: 4, semester: 5, category: 'Core' },
    { code: 'EC3P001', name: 'Analog Communication Lab', credits: 2, semester: 5, category: 'Lab' },
    { code: 'EC3L004', name: 'Microprocessors and Microcontrollers', credits: 4, semester: 5, category: 'Core' },
    { code: 'EC3P004', name: 'Microprocessor Laboratory', credits: 2, semester: 5, category: 'Lab' },

    // Semester 6
    { code: 'EC3L003', name: 'Digital Communication Systems', credits: 4, semester: 6, category: 'Core' },
    { code: 'EC3P003', name: 'Digital Communication Lab', credits: 2, semester: 6, category: 'Lab' },
    { code: 'EC4L001', name: 'VLSI Design', credits: 4, semester: 6, category: 'Elective' },
    { code: 'EC4P001', name: 'VLSI Design Laboratory', credits: 2, semester: 6, category: 'Lab' },

    // Semester 7
    { code: 'EC4T001', name: 'Industrial Training Defense', credits: 2, semester: 7, category: 'Core' },
    { code: 'EC4D001', name: 'B.Tech Project - Part I', credits: 4, semester: 7, category: 'Core' },
    { code: 'EC4L002', name: 'Antennas and Wave Propagation', credits: 3, semester: 7, category: 'Elective' },
    { code: 'EC4L003', name: 'Wireless Mobile Communications', credits: 3, semester: 7, category: 'Elective' },

    // Semester 8
    { code: 'EC4D002', name: 'B.Tech Project - Part II', credits: 6, semester: 8, category: 'Core' },
    { code: 'EC-EL1', name: 'Depth Elective', credits: 3, semester: 8, category: 'Elective' },
    { code: 'EC-BR1', name: 'Breadth Elective', credits: 3, semester: 8, category: 'Breadth' },
  ],

  CE: [
    // Semester 3
    { code: 'CE2L001', name: 'Surveying', credits: 3, semester: 3, category: 'Core' },
    { code: 'CE2P001', name: 'Surveying Practice', credits: 2, semester: 3, category: 'Lab' },
    { code: 'CE2L002', name: 'Mechanics of Solids for Civil Engineers', credits: 4, semester: 3, category: 'Core' },
    { code: 'MA2L101', name: 'Applied Partial Differential Equations', credits: 2, semester: 3, category: 'Basic Science' },
    { code: 'HS2L001', name: 'Introduction to Economics', credits: 3, semester: 3, category: 'HSS' },

    // Semester 4
    { code: 'CE2L003', name: 'Fluid Mechanics and Hydraulics', credits: 4, semester: 4, category: 'Core' },
    { code: 'CE2P003', name: 'Hydraulics Laboratory', credits: 2, semester: 4, category: 'Lab' },
    { code: 'CE3L001', name: 'Structural Analysis - I', credits: 4, semester: 4, category: 'Core' },
    { code: 'MA2L104', name: 'Applied Numerical Methods', credits: 3, semester: 4, category: 'Basic Science' },

    // Semester 5
    { code: 'CE3L002', name: 'Geotechnical Engineering - I', credits: 4, semester: 5, category: 'Core' },
    { code: 'CE3P002', name: 'Geotechnical Laboratory', credits: 2, semester: 5, category: 'Lab' },
    { code: 'CE3L003', name: 'Environmental Engineering - I', credits: 3, semester: 5, category: 'Core' },
    { code: 'CE3P003', name: 'Environmental Engineering Lab', credits: 2, semester: 5, category: 'Lab' },

    // Semester 6
    { code: 'CE3L004', name: 'Design of Reinforced Concrete Structures', credits: 4, semester: 6, category: 'Core' },
    { code: 'CE3L005', name: 'Transportation Engineering - I', credits: 3, semester: 6, category: 'Core' },
    { code: 'CE3P005', name: 'Transportation Engineering Lab', credits: 2, semester: 6, category: 'Lab' },

    // Semester 7
    { code: 'CE4T001', name: 'Industrial Training Defense', credits: 2, semester: 7, category: 'Core' },
    { code: 'CE4D001', name: 'B.Tech Project - Part I', credits: 4, semester: 7, category: 'Core' },
    { code: 'CE4L001', name: 'Design of Steel Structures', credits: 4, semester: 7, category: 'Core' },
    { code: 'CE4L002', name: 'Water Resources Engineering', credits: 3, semester: 7, category: 'Elective' },

    // Semester 8
    { code: 'CE4D002', name: 'B.Tech Project - Part II', credits: 6, semester: 8, category: 'Core' },
    { code: 'CE-EL1', name: 'Civil Depth Elective', credits: 3, semester: 8, category: 'Elective' },
    { code: 'CE-BR1', name: 'Open Breadth Elective', credits: 3, semester: 8, category: 'Breadth' },
  ],

  MM: [
    // Semester 3
    { code: 'ML2L001', name: 'Intro to Materials Science & Eng.', credits: 4, semester: 3, category: 'Core' },
    { code: 'ML2L002', name: 'Thermodynamics of Materials', credits: 4, semester: 3, category: 'Core' },
    { code: 'ML2L003', name: 'Physical Metallurgy', credits: 4, semester: 3, category: 'Core' },
    { code: 'ML2P003', name: 'Metallography Laboratory', credits: 2, semester: 3, category: 'Lab' },

    // Semester 4
    { code: 'ML3L001', name: 'Mechanical Behavior of Materials', credits: 4, semester: 4, category: 'Core' },
    { code: 'ML3P001', name: 'Mechanical Testing Laboratory', credits: 2, semester: 4, category: 'Lab' },

    // Semester 5
    { code: 'ML3L002', name: 'Phase Transformations', credits: 4, semester: 5, category: 'Core' },
    { code: 'ML3L003', name: 'Extractive Metallurgy', credits: 4, semester: 5, category: 'Core' },

    // Semester 6
    { code: 'ML3L004', name: 'Corrosion and Degradation', credits: 3, semester: 6, category: 'Elective' },

    // Semester 7
    { code: 'ML4T001', name: 'Industrial Training Defense', credits: 2, semester: 7, category: 'Core' },
    { code: 'ML4D001', name: 'B.Tech Project - Part I', credits: 4, semester: 7, category: 'Core' },

    // Semester 8
    { code: 'ML4D002', name: 'B.Tech Project - Part II', credits: 6, semester: 8, category: 'Core' },
    { code: 'ML-EL1', name: 'Materials Elective', credits: 3, semester: 8, category: 'Elective' },
  ],

  EP: [
    // Semester 3
    { code: 'EP2L001', name: 'Classical Mechanics', credits: 4, semester: 3, category: 'Core' },
    { code: 'EP2L002', name: 'Quantum Mechanics - I', credits: 4, semester: 3, category: 'Core' },
    { code: 'EP2L003', name: 'Electromagnetic Theory', credits: 4, semester: 3, category: 'Core' },
    { code: 'EP2P001', name: 'Modern Physics Laboratory', credits: 2, semester: 3, category: 'Lab' },

    // Semester 4
    { code: 'EP3L001', name: 'Statistical Mechanics', credits: 4, semester: 4, category: 'Core' },
    { code: 'EP3L002', name: 'Solid State Physics', credits: 4, semester: 4, category: 'Core' },
    { code: 'EP3P002', name: 'Solid State Physics Laboratory', credits: 2, semester: 4, category: 'Lab' },

    // Semester 5
    { code: 'EP3L003', name: 'Optics and Photonics', credits: 4, semester: 5, category: 'Core' },
    { code: 'EP3P003', name: 'Optics Laboratory', credits: 2, semester: 5, category: 'Lab' },

    // Semester 6
    { code: 'EP4L001', name: 'Nuclear and Particle Physics', credits: 3, semester: 6, category: 'Elective' },

    // Semester 7
    { code: 'EP4T001', name: 'Industrial Training Defense', credits: 2, semester: 7, category: 'Core' },
    { code: 'EP4D001', name: 'B.Tech Project - Part I', credits: 4, semester: 7, category: 'Core' },

    // Semester 8
    { code: 'EP4D002', name: 'B.Tech Project - Part II', credits: 6, semester: 8, category: 'Core' },
    { code: 'EP-EL1', name: 'Physics Elective', credits: 3, semester: 8, category: 'Elective' },
  ],
};

/**
 * Returns complete 8-semester curriculum for a specified branch.
 */
export function getCurriculumForBranch(branchId: string): CourseDefinition[] {
  const deptCurriculum = BRANCH_CURRICULA[branchId] || BRANCH_CURRICULA['CS'];

  const sem1 = FIRST_YEAR_SEM1.map((c) => ({ ...c, branch: branchId }));
  const sem2 = FIRST_YEAR_SEM2.map((c) => ({ ...c, branch: branchId }));
  const sem3to8 = deptCurriculum.map((c) => ({ ...c, branch: branchId }));

  return [...sem1, ...sem2, ...sem3to8];
}
