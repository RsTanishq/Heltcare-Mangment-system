export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  availability: boolean;
  email: string;
  phone: string;
  address: string;
  education: string[];
  experience: number;
  rating: number;
  consultationFee: number;
  workingHours: {
    start: string;
    end: string;
    days: string[];
  };
  about: string;
  languages: string[];
  certifications: string[];
}

export const mockDoctors: Doctor[] = [
  {
    id: 'doc1',
    name: 'Dr. Rajesh Kumar',
    specialty: 'Cardiologist',
    image: '/doctors/doctor1.jpg',
    availability: true,
    email: 'rajesh.kumar@healchain.com',
    phone: '+91 98765 43210',
    address: 'Healchain Medical Center, Mumbai',
    education: [
      'MBBS - AIIMS Delhi',
      'MD Cardiology - PGIMER Chandigarh',
      'DM Cardiology - AIIMS Delhi'
    ],
    experience: 15,
    rating: 4.8,
    consultationFee: 1500,
    workingHours: {
      start: '09:00',
      end: '17:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    about: 'Dr. Rajesh Kumar is a renowned cardiologist with over 15 years of experience in treating complex cardiac conditions. He specializes in interventional cardiology and has performed over 1000 successful procedures.',
    languages: ['English', 'Hindi', 'Marathi'],
    certifications: [
      'Fellow of American College of Cardiology',
      'Member of Cardiological Society of India'
    ]
  },
  {
    id: 'doc2',
    name: 'Dr. Priya Sharma',
    specialty: 'Pediatrician',
    image: '/doctors/doctor2.jpg',
    availability: true,
    email: 'priya.sharma@healchain.com',
    phone: '+91 98765 43211',
    address: 'Healchain Children\'s Clinic, Delhi',
    education: [
      'MBBS - KEM Hospital Mumbai',
      'MD Pediatrics - AIIMS Delhi'
    ],
    experience: 10,
    rating: 4.9,
    consultationFee: 1200,
    workingHours: {
      start: '10:00',
      end: '18:00',
      days: ['Monday', 'Wednesday', 'Friday', 'Saturday']
    },
    about: 'Dr. Priya Sharma is a compassionate pediatrician known for her gentle approach with children. She specializes in developmental pediatrics and has extensive experience in handling complex pediatric cases.',
    languages: ['English', 'Hindi', 'Bengali'],
    certifications: [
      'Indian Academy of Pediatrics Fellow',
      'Child Development Specialist Certification'
    ]
  },
  {
    id: 'doc3',
    name: 'Dr. Arun Patel',
    specialty: 'Orthopedic Surgeon',
    image: '/doctors/doctor3.jpg',
    availability: true,
    email: 'arun.patel@healchain.com',
    phone: '+91 98765 43212',
    address: 'Healchain Orthopedic Center, Bangalore',
    education: [
      'MBBS - Grant Medical College Mumbai',
      'MS Orthopedics - JIPMER Puducherry',
      'Fellowship in Joint Replacement - UK'
    ],
    experience: 12,
    rating: 4.7,
    consultationFee: 1800,
    workingHours: {
      start: '09:30',
      end: '16:30',
      days: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday']
    },
    about: 'Dr. Arun Patel is a skilled orthopedic surgeon specializing in joint replacement surgery. He has successfully performed over 500 knee and hip replacement surgeries.',
    languages: ['English', 'Hindi', 'Gujarati', 'Kannada'],
    certifications: [
      'Indian Orthopedic Association Fellow',
      'Advanced Arthroscopy Certification'
    ]
  }
];

export default mockDoctors; 