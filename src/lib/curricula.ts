export interface CurriculumCourse {
  name: string
  code: string
  credits: number
}

export interface CurriculumSemester {
  semester_number: number
  courses: CurriculumCourse[]
}

export interface BranchCurriculum {
  name: string
  semesters: CurriculumSemester[]
}

// Common first year courses
const commonSemester1: CurriculumCourse[] = [
  { name: 'Calculus and Ordinary Differential Equations', code: 'MA1L003', credits: 4 },
  { name: 'Environmental Science, Technology and Management', code: 'ID2L003', credits: 2 },
  { name: 'English for Learning and Communication', code: 'HS1L007', credits: 3 },
  { name: 'Programming in C', code: 'CS1L002', credits: 3 },
  { name: 'Physics / Chemistry', code: 'PH1L002', credits: 3 },
  { name: 'Physics / Chemistry Laboratory', code: 'PH1P001', credits: 2 },
  { name: 'Engineering Drawing and Graphics', code: 'CE1P001', credits: 3 },
  { name: 'Extra Academic Activity-1', code: 'ID1T001', credits: 1 },
]

const commonSemester2: CurriculumCourse[] = [
  { name: 'Linear Algebra and Complex Analysis', code: 'MA1L004', credits: 4 },
  { name: 'Introduction to Bio Science and Technology', code: 'ID2L002', credits: 2 },
  { name: 'Happiness and Life Skill', code: 'ID1L001', credits: 1 },
  { name: 'Introduction to Bharatiya Knowledge Traditions', code: 'ID1L002', credits: 2 },
  { name: 'Introduction to Manufacturing Process', code: 'ME1P001', credits: 2 },
  { name: 'Basic Electrical and Electronics Engineering', code: 'EE1L002', credits: 4 },
  { name: 'Basic Electrical and Electronics Engineering Lab', code: 'EE1P002', credits: 2 },
  { name: 'Engineering Mechanics', code: 'ME1L002', credits: 4 },
  { name: 'Extra Academic Activity-2', code: 'ID1T002', credits: 1 },
]

export const branchCurricula: Record<string, BranchCurriculum> = {
  cse: {
    name: 'Computer Science and Engineering',
    semesters: [
      { semester_number: 1, courses: commonSemester1 },
      { semester_number: 2, courses: commonSemester2 },
      {
        semester_number: 3,
        courses: [
          { name: 'Data Structures and Algorithms', code: 'CS2L001', credits: 4 },
          { name: 'Discrete Mathematics', code: 'CS2L002', credits: 4 },
          { name: 'Digital Logic Design', code: 'CS2L003', credits: 3 },
          { name: 'Object Oriented Programming', code: 'CS2L004', credits: 3 },
          { name: 'Data Structures Laboratory', code: 'CS2P001', credits: 2 },
          { name: 'Digital Logic Design Laboratory', code: 'CS2P002', credits: 2 },
        ],
      },
      {
        semester_number: 4,
        courses: [
          { name: 'Design and Analysis of Algorithms', code: 'CS2L005', credits: 4 },
          { name: 'Computer Organization & Architecture', code: 'CS2L006', credits: 4 },
          { name: 'Database Management Systems', code: 'CS2L007', credits: 4 },
          { name: 'Operating Systems', code: 'CS2L008', credits: 4 },
          { name: 'Algorithms Laboratory', code: 'CS2P003', credits: 2 },
          { name: 'Operating Systems Laboratory', code: 'CS2P004', credits: 2 },
        ],
      },
    ],
  },
  ece: {
    name: 'Electronics and Communication Engineering',
    semesters: [
      { semester_number: 1, courses: commonSemester1 },
      { semester_number: 2, courses: commonSemester2 },
      {
        semester_number: 3,
        courses: [
          { name: 'Network Theory', code: 'EC2L001', credits: 4 },
          { name: 'Semiconductor Devices', code: 'EC2L002', credits: 4 },
          { name: 'Digital Electronics', code: 'EC2L003', credits: 3 },
          { name: 'Signals and Systems', code: 'EC2L004', credits: 4 },
          { name: 'Analog Circuits Laboratory', code: 'EC2P001', credits: 2 },
        ],
      },
      {
        semester_number: 4,
        courses: [
          { name: 'Electromagnetic Waves', code: 'EC2L005', credits: 4 },
          { name: 'Analog Communications', code: 'EC2L006', credits: 4 },
          { name: 'Microprocessors and Microcontrollers', code: 'EC2L007', credits: 4 },
          { name: 'Control Systems Engineering', code: 'EC2L008', credits: 4 },
          { name: 'Digital Design Laboratory', code: 'EC2P002', credits: 2 },
        ],
      },
    ],
  },
  ee: {
    name: 'Electrical Engineering',
    semesters: [
      { semester_number: 1, courses: commonSemester1 },
      { semester_number: 2, courses: commonSemester2 },
      {
        semester_number: 3,
        courses: [
          { name: 'Circuit Theory', code: 'EE2L001', credits: 4 },
          { name: 'Electrical Machines - I', code: 'EE2L002', credits: 4 },
          { name: 'Electromagnetic Fields', code: 'EE2L003', credits: 4 },
          { name: 'Signals and Networks', code: 'EE2L004', credits: 4 },
          { name: 'Electrical Machines Laboratory - I', code: 'EE2P001', credits: 2 },
        ],
      },
      {
        semester_number: 4,
        courses: [
          { name: 'Electrical Machines - II', code: 'EE2L005', credits: 4 },
          { name: 'Power Systems - I', code: 'EE2L006', credits: 4 },
          { name: 'Analog Electronic Circuits', code: 'EE2L007', credits: 4 },
          { name: 'Control Systems', code: 'EE2L008', credits: 4 },
          { name: 'Electrical Measurements Laboratory', code: 'EE2P002', credits: 2 },
        ],
      },
    ],
  },
  mechanical: {
    name: 'Mechanical Engineering',
    semesters: [
      { semester_number: 1, courses: commonSemester1 },
      { semester_number: 2, courses: commonSemester2 },
      {
        semester_number: 3,
        courses: [
          { name: 'Thermodynamics', code: 'ME2L105', credits: 4 },
          { name: 'Mechanics of Solids', code: 'ME2L004', credits: 4 },
          { name: 'Theory of Machines - I', code: 'ME2L001', credits: 4 },
          { name: 'Measurements and Instrumentation', code: 'ME2L102', credits: 3 },
          { name: 'Workshop Practices', code: 'ME2P001', credits: 2 },
          { name: 'Material Testing Laboratory', code: 'ME2P004', credits: 2 },
        ],
      },
      {
        semester_number: 4,
        courses: [
          { name: 'Fluid Mechanics', code: 'ME2L002', credits: 4 },
          { name: 'Theory of Machines - II', code: 'ME2L005', credits: 4 },
          { name: 'Applied Numerical Methods', code: 'ME2L104', credits: 3 },
          { name: 'Engineering Materials', code: 'ME2L103', credits: 2 },
          { name: 'Mechanisms and Vibration Laboratory', code: 'ME2P101', credits: 2 },
          { name: 'Fluid Mechanics Laboratory', code: 'ME2P002', credits: 2 },
        ],
      },
    ],
  },
  civil: {
    name: 'Civil Engineering',
    semesters: [
      { semester_number: 1, courses: commonSemester1 },
      { semester_number: 2, courses: commonSemester2 },
      {
        semester_number: 3,
        courses: [
          { name: 'Surveying', code: 'CE2L001', credits: 4 },
          { name: 'Mechanics of Materials', code: 'CE2L002', credits: 4 },
          { name: 'Fluid Mechanics', code: 'CE2L003', credits: 4 },
          { name: 'Engineering Geology', code: 'CE2L004', credits: 3 },
          { name: 'Civil Engineering Materials', code: 'CE2L005', credits: 3 },
        ],
      },
      {
        semester_number: 4,
        courses: [
          { name: 'Structural Analysis - I', code: 'CE2L006', credits: 4 },
          { name: 'Geotechnical Engineering - I', code: 'CE2L007', credits: 4 },
          { name: 'Transportation Engineering - I', code: 'CE2L008', credits: 4 },
          { name: 'Hydrology & Water Resources Engineering', code: 'CE2L009', credits: 4 },
          { name: 'Surveying Practice', code: 'CE2P001', credits: 2 },
        ],
      },
    ],
  },
  metallurgy: {
    name: 'Metallurgical and Materials Engineering',
    semesters: [
      { semester_number: 1, courses: commonSemester1 },
      { semester_number: 2, courses: commonSemester2 },
      {
        semester_number: 3,
        courses: [
          { name: 'Introduction to Metallurgy & Materials', code: 'MM2L001', credits: 4 },
          { name: 'Metallurgical Thermodynamics', code: 'MM2L002', credits: 4 },
          { name: 'Rate Processes in Metallurgy', code: 'MM2L003', credits: 4 },
          { name: 'Mechanical Behavior of Materials', code: 'MM2L004', credits: 4 },
          { name: 'Materials Testing Laboratory', code: 'MM2P001', credits: 2 },
        ],
      },
      {
        semester_number: 4,
        courses: [
          { name: 'Physical Metallurgy', code: 'MM2L005', credits: 4 },
          { name: 'Iron and Steel Making', code: 'MM2L006', credits: 4 },
          { name: 'Mineral Processing', code: 'MM2L007', credits: 4 },
          { name: 'Phase Transformations', code: 'MM2L008', credits: 4 },
          { name: 'Characterization of Materials Lab', code: 'MM2P002', credits: 2 },
        ],
      },
    ],
  },
}
