
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Chat } from "@google/genai";

// --- Data & Constants ---

const SERVICES = [
  { id: 1, title: 'Factories Act', hindi: 'फैक्ट्री एक्ट लाइसेंस', icon: 'fa-industry', desc: 'Complete licensing, map approval, and renewal services.' },
  { id: 2, title: 'ESI & PF', hindi: 'ईएसआई और पीएफ', icon: 'fa-users-gear', desc: 'Monthly return filing, challan generation, and employee claims.' },
  { id: 3, title: 'Pollution NOC', hindi: 'प्रदूषण नियंत्रण एनओसी', icon: 'fa-smog', desc: 'CTE and CTO clearances from UP Pollution Control Board.' },
  { id: 4, title: 'Fire Safety', hindi: 'अग्निशमन एनओसी', icon: 'fa-fire-extinguisher', desc: 'Fire department No Objection Certificate and safety audits.' },
  { id: 5, title: 'Labor License', hindi: 'लेबर लाइसेंस', icon: 'fa-id-card-clip', desc: 'Registration under CLRA for contract workers.' },
  { id: 6, title: 'Shop Registration', hindi: 'दुकान एवं स्थापना', icon: 'fa-store', desc: 'Commercial registration for shops and offices.' },
  { id: 7, title: 'Payroll Compliance', hindi: 'वेतन और बोनस', icon: 'fa-file-invoice-dollar', desc: 'Bonus, Gratuity, and Minimum Wages Act compliance.' },
  { id: 8, title: 'Electrical Safety', hindi: 'विद्युत सुरक्षा', icon: 'fa-bolt', desc: 'NOC for DG Sets and electrical load safety.' },
  { id: 9, title: 'Map Approval', hindi: 'नक्शा स्वीकृति', icon: 'fa-map-location-dot', desc: 'Factory building plan approvals from authorities.' },
  { id: 10, title: 'MSME / Udyam', hindi: 'एमएसएमई पंजीकरण', icon: 'fa-award', desc: 'Udyam registration for small business benefits.' },
  { id: 11, title: 'Legal Notices', hindi: 'कानूनी नोटिस', icon: 'fa-gavel', desc: 'Drafting replies to labor and factory inspector notices.' },
  { id: 12, title: 'Consultancy', hindi: 'परामर्श सेवाएं', icon: 'fa-handshake-angle', desc: 'Expert advice on industrial disputes and compliance.' },
];

const CONTACT_INFO = {
  phone: '9811155576',
  email: 'arvind.hi05@gmail.com',
  address: 'Shop No.-6, 1st Floor, SHD Complex, Shatabdi Enclave, Sector-49, Noida'
};

// --- Helper Components ---

interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const RevealOnScroll: React.FC<RevealOnScrollProps> = ({ children, className = "", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          if (entry.target) observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [delay]);

  return (
    <div ref={ref} className={`${className} transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
      {children}
    </div>
  );
};

// --- Theme Context ---
const useTheme = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return { theme, toggleTheme };
};

// --- Main Components ---

const Navbar = ({ toggleTheme, theme }: { toggleTheme: () => void, theme: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Expertise', href: '#services' },
    { name: 'Profile', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${scrolled ? 'bg-white/95 dark:bg-navy-950/95 backdrop-blur-sm shadow-md py-3' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group relative z-[60]">
          <div className="w-10 h-10 bg-navy-900 dark:bg-white text-white dark:text-navy-900 flex items-center justify-center rounded-sm shadow-lg transition-transform duration-500 group-hover:scale-105">
            <i className="fa-solid fa-scale-balanced text-lg"></i>
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-lg md:text-xl leading-none text-navy-900 dark:text-white tracking-tight transition-colors duration-500">
              Consultation House
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 transition-colors duration-500">
              Legal & Compliance
            </span>
          </div>
        </a>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="font-sans font-medium text-sm text-navy-800 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300 uppercase tracking-wide"
            >
              {link.name}
            </a>
          ))}
          
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2 transition-colors duration-500"></div>

          <button 
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center text-navy-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-800 transition-all duration-500 hover:scale-110 active:scale-95"
            aria-label="Toggle Theme"
          >
            <div className={`transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${theme === 'light' ? 'rotate-0' : 'rotate-180'}`}>
                <i className={`fa-solid ${theme === 'light' ? 'fa-moon text-navy-800' : 'fa-sun text-yellow-400'}`}></i>
            </div>
          </button>

          <a
            href={`tel:${CONTACT_INFO.phone}`}
            className="px-6 py-2.5 rounded-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all duration-300 flex items-center gap-2 active:scale-95 hover:shadow-glow"
          >
             <i className="fa-solid fa-phone"></i> 
             <span>{CONTACT_INFO.phone}</span>
          </a>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 lg:hidden relative z-[60]">
           <button 
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center text-navy-900 dark:text-white transition-all duration-500"
          >
             <div className={`transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${theme === 'light' ? 'rotate-0' : 'rotate-180'}`}>
                <i className={`fa-solid ${theme === 'light' ? 'fa-moon text-navy-800' : 'fa-sun text-yellow-400'}`}></i>
             </div>
          </button>

          <button
            className="text-2xl text-navy-900 dark:text-white focus:outline-none transition-transform duration-300 active:scale-90"
            onClick={() => setIsOpen(!isOpen)}
          >
            <i className={`fa-solid ${isOpen ? 'fa-times' : 'fa-bars-staggered'}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`lg:hidden fixed inset-0 bg-white dark:bg-navy-950 z-[50] transition-all duration-500 ease-in-out flex flex-col pt-24 pb-8 px-6 ${isOpen ? 'opacity-100 visible translate-x-0' : 'opacity-0 invisible translate-x-full'}`}
      >
        <div className="flex flex-col h-full justify-between overflow-y-auto">
           <div className="flex flex-col space-y-2 mt-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-2xl font-serif font-bold text-navy-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300 py-4 border-b border-gray-100 dark:border-navy-800"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </div>
          
           <div className="mt-8 bg-gray-50 dark:bg-navy-900 p-6 rounded-xl transition-colors duration-500">
             <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-widest font-bold mb-3">Quick Contact</p>
             <a 
                href={`tel:${CONTACT_INFO.phone}`} 
                className="text-2xl font-serif font-bold text-emerald-600 dark:text-emerald-400 block mb-2 transition-colors duration-300"
             >
                {CONTACT_INFO.phone}
             </a>
             <p className="text-sm text-navy-700 dark:text-gray-300 mb-4 transition-colors duration-300">{CONTACT_INFO.address}</p>
             <a href={`mailto:${CONTACT_INFO.email}`} className="text-sm font-medium text-navy-900 dark:text-white underline transition-colors duration-300">{CONTACT_INFO.email}</a>
           </div>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-28 pb-16 lg:pt-0 overflow-hidden bg-emerald-50/50 dark:bg-navy-950 transition-colors duration-700">
      
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-white dark:bg-navy-900 skew-x-[-12deg] translate-x-1/4 z-0 hidden lg:block transition-colors duration-700"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl z-0 transition-colors duration-700"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            <div className="w-full lg:w-1/2 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6 animate-fade-up transition-colors duration-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                    Serving Noida & Ghaziabad
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-navy-900 dark:text-white leading-[1.15] mb-6 animate-fade-up delay-100 transition-colors duration-500">
                  Compliance <br/>
                  <span className="text-emerald-600 dark:text-emerald-500 relative transition-colors duration-500">
                    Simplified.
                    <svg className="absolute w-full h-3 -bottom-1 left-0 text-emerald-200 dark:text-emerald-900 -z-10 transition-colors duration-500" viewBox="0 0 100 10" preserveAspectRatio="none">
                        <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                    </svg>
                  </span>
                </h1>
                
                <h2 className="text-lg sm:text-xl font-sans text-navy-600 dark:text-gray-300 mb-6 animate-fade-up delay-200 font-medium transition-colors duration-500">
                  फैक्ट्री और लेबर कानूनों का संपूर्ण समाधान
                </h2>
                
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0 animate-fade-up delay-300 transition-colors duration-500">
                   Navigating the complex landscape of industrial regulations so you can focus on growth. From licensing to daily compliance, we have you covered.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full animate-fade-up delay-300">
                  <a href="#contact" className="px-8 py-4 rounded-sm bg-navy-900 dark:bg-emerald-600 text-white font-bold text-sm uppercase tracking-wider hover:bg-navy-800 dark:hover:bg-emerald-500 transition-all duration-300 shadow-lg text-center w-full sm:w-auto active:scale-95">
                    Book Consultation
                  </a>
                  <a href="#services" className="px-8 py-4 rounded-sm border border-navy-200 dark:border-gray-700 bg-white dark:bg-navy-900 text-navy-900 dark:text-white font-bold text-sm uppercase tracking-wider hover:border-emerald-500 hover:text-emerald-600 transition-all duration-300 text-center w-full sm:w-auto active:scale-95">
                    Explore Services
                  </a>
                </div>
            </div>

            {/* Visual */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end animate-fade-up delay-200">
                <div className="relative w-full max-w-sm lg:max-w-md">
                     <div className="bg-white dark:bg-navy-800 p-2 shadow-2xl rounded-sm rotate-3 border-4 border-white dark:border-navy-700 transition-all duration-700">
                         <div className="bg-navy-900 h-64 lg:h-80 w-full flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
                             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                             <i className="fa-solid fa-scale-balanced text-6xl text-emerald-500 mb-4 transition-colors duration-500"></i>
                             <h3 className="text-white font-serif text-2xl mb-1">100% Legal</h3>
                             <p className="text-gray-400 text-xs uppercase tracking-widest">Compliance Guarantee</p>
                         </div>
                     </div>
                     <div className="absolute -bottom-6 -left-6 bg-emerald-600 text-white p-6 shadow-xl max-w-[200px] animate-float transition-all duration-500">
                         <p className="font-serif text-3xl font-bold mb-1">40+</p>
                         <p className="text-xs uppercase tracking-widest opacity-90">Years of Experience</p>
                     </div>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};

const Services = () => {
  return (
    <section id="services" className="py-20 lg:py-24 bg-white dark:bg-navy-950 transition-colors duration-700">
      <div className="container mx-auto px-4 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-emerald-600 dark:text-emerald-500 font-bold uppercase tracking-widest text-xs mb-3 block transition-colors duration-500">What We Do</span>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-navy-900 dark:text-white mb-6 transition-colors duration-500">Expertise Areas</h2>
            <div className="h-1 w-20 bg-emerald-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {SERVICES.map((service, index) => (
            <RevealOnScroll key={service.id} delay={index * 50}>
              <div className="group bg-gray-50 dark:bg-navy-900 p-6 lg:p-8 rounded-sm hover:bg-white dark:hover:bg-navy-800 border border-gray-100 dark:border-navy-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-elegant transition-all duration-500 h-full flex flex-col relative hover:-translate-y-1">
                
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

                <div className="w-12 h-12 bg-white dark:bg-navy-950 border border-gray-100 dark:border-navy-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xl shadow-sm mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                    <i className={`fa-solid ${service.icon}`}></i>
                </div>
                
                <h3 className="text-lg lg:text-xl font-serif font-bold text-navy-900 dark:text-white mb-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors duration-300">
                  {service.title}
                </h3>
                <h4 className="text-sm font-medium text-emerald-600 dark:text-emerald-500 mb-4 font-sans transition-colors duration-300">
                  {service.hindi}
                </h4>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 font-light transition-colors duration-300">
                  {service.desc}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-200 dark:border-navy-800 transition-colors duration-300">
                    <a href="#contact" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-navy-800 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                        Learn More <i className="fa-solid fa-arrow-right ml-2 text-xs"></i>
                    </a>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-20 bg-navy-900 dark:bg-black text-white relative overflow-hidden transition-colors duration-700">
      {/* Pattern */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(45deg,#1f2937_1px,transparent_1px),linear-gradient(-45deg,#1f2937_1px,transparent_1px)] [background-size:20px_20px]"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="w-full lg:w-1/2">
            <span className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-3 block">Firm Profile</span>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-6">A Legacy of Trust</h2>
            
            <p className="text-gray-300 mb-6 leading-relaxed font-sans text-lg">
                Since 1984, Consultation House has stood as a pillar of reliability for industries across Noida. We bridge the gap between complex government regulations and smooth business operations.
            </p>
            
            <div className="grid grid-cols-2 gap-8 mt-10">
                <div className="border-l-2 border-emerald-500 pl-6">
                    <h4 className="text-3xl font-serif font-bold text-white mb-1">500+</h4>
                    <p className="text-xs uppercase text-gray-400">Clients Served</p>
                </div>
                 <div className="border-l-2 border-emerald-500 pl-6">
                    <h4 className="text-3xl font-serif font-bold text-white mb-1">99%</h4>
                    <p className="text-xs uppercase text-gray-400">Success Rate</p>
                </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 bg-white/5 backdrop-blur-sm p-8 border border-white/10 rounded-sm transition-all duration-500">
             <h3 className="font-serif text-xl mb-6">Why Industries Trust Us</h3>
             <ul className="space-y-4">
                 {[
                     "Direct Liaisoning with Authorities",
                     "Proactive Compliance Audits",
                     "Zero Penalty Record",
                     "24/7 Crisis Support"
                 ].map((item, i) => (
                     <li key={i} className="flex items-center gap-4 text-gray-200">
                         <i className="fa-solid fa-check text-emerald-400"></i>
                         <span className="text-sm font-medium">{item}</span>
                     </li>
                 ))}
             </ul>
             <div className="mt-8 pt-6 border-t border-white/10">
                 <p className="text-xs text-gray-400 mb-2">Authorized Consultants For:</p>
                 <div className="flex gap-4 opacity-70 grayscale">
                     <i className="fa-solid fa-building-columns text-2xl"></i>
                     <i className="fa-solid fa-industry text-2xl"></i>
                     <i className="fa-solid fa-hard-hat text-2xl"></i>
                 </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setTimeout(() => {
      setFormState('success');
      setTimeout(() => setFormState('idle'), 3000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-20 lg:py-24 bg-emerald-50 dark:bg-navy-950 transition-colors duration-700">
      <div className="container mx-auto px-4 lg:px-8">
        <RevealOnScroll>
            <div className="max-w-5xl mx-auto bg-white dark:bg-navy-900 shadow-elegant rounded-sm overflow-hidden flex flex-col md:flex-row transition-colors duration-500">
                
                <div className="w-full md:w-5/12 bg-navy-900 text-white p-10 flex flex-col justify-between relative overflow-hidden">
                     <div className="absolute -bottom-10 -right-10 text-navy-800 text-[150px] opacity-20 transition-colors duration-500">
                         <i className="fa-solid fa-comments"></i>
                     </div>
                     <div className="relative z-10">
                        <h3 className="font-serif text-2xl font-bold mb-8">Contact Us</h3>
                        
                        <div className="space-y-8 font-sans">
                            <div className="flex items-start gap-4">
                                <i className="fa-solid fa-location-dot mt-1 text-emerald-400"></i>
                                <div>
                                    <p className="text-xs uppercase text-gray-400 mb-1">Office</p>
                                    <p className="text-sm">{CONTACT_INFO.address}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <i className="fa-solid fa-phone mt-1 text-emerald-400"></i>
                                <div>
                                    <p className="text-xs uppercase text-gray-400 mb-1">Phone</p>
                                    <a href={`tel:${CONTACT_INFO.phone}`} className="text-lg font-bold hover:text-emerald-400 transition-colors">{CONTACT_INFO.phone}</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <i className="fa-solid fa-envelope mt-1 text-emerald-400"></i>
                                <div>
                                    <p className="text-xs uppercase text-gray-400 mb-1">Email</p>
                                    <a href={`mailto:${CONTACT_INFO.email}`} className="text-sm hover:text-emerald-400 transition-colors">{CONTACT_INFO.email}</a>
                                </div>
                            </div>
                        </div>
                     </div>
                </div>

                <div className="w-full md:w-7/12 p-8 lg:p-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-6">
                             <div>
                                 <label className="block text-xs font-bold uppercase tracking-wide mb-2 text-navy-600 dark:text-gray-400 transition-colors duration-300">Name</label>
                                 <input type="text" required className="w-full bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-navy-700 rounded-sm px-4 py-3 focus:outline-none focus:border-emerald-500 transition-all duration-300 dark:text-white" placeholder="Full Name" />
                             </div>
                             <div>
                                 <label className="block text-xs font-bold uppercase tracking-wide mb-2 text-navy-600 dark:text-gray-400 transition-colors duration-300">Phone</label>
                                 <input type="tel" required className="w-full bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-navy-700 rounded-sm px-4 py-3 focus:outline-none focus:border-emerald-500 transition-all duration-300 dark:text-white" placeholder="Mobile Number" />
                             </div>
                        </div>
                        <div>
                             <label className="block text-xs font-bold uppercase tracking-wide mb-2 text-navy-600 dark:text-gray-400 transition-colors duration-300">Service</label>
                             <select className="w-full bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-navy-700 rounded-sm px-4 py-3 focus:outline-none focus:border-emerald-500 transition-all duration-300 dark:text-white">
                                 <option>General Inquiry</option>
                                 <option>Factory License</option>
                                 <option>Pollution NOC</option>
                                 <option>Fire Safety</option>
                             </select>
                        </div>
                        <div>
                             <label className="block text-xs font-bold uppercase tracking-wide mb-2 text-navy-600 dark:text-gray-400 transition-colors duration-300">Message</label>
                             <textarea rows={3} required className="w-full bg-gray-50 dark:bg-navy-950 border border-gray-200 dark:border-navy-700 rounded-sm px-4 py-3 focus:outline-none focus:border-emerald-500 transition-all duration-300 dark:text-white resize-none"></textarea>
                        </div>
                        <div className="pt-2">
                            <button 
                              type="submit" 
                              disabled={formState !== 'idle'}
                              className={`w-full font-bold uppercase tracking-widest text-xs py-4 px-10 rounded-sm transition-all duration-300 flex items-center justify-center gap-2 
                                ${formState === 'success' 
                                  ? 'bg-emerald-600 text-white cursor-default' 
                                  : 'bg-navy-900 text-white hover:bg-navy-800 active:scale-95'}`}
                            >
                                {formState === 'idle' && <span>Send Message</span>}
                                {formState === 'submitting' && (
                                  <>
                                    <i className="fa-solid fa-circle-notch animate-spin"></i>
                                    <span>Sending...</span>
                                  </>
                                )}
                                {formState === 'success' && (
                                  <>
                                    <i className="fa-solid fa-check"></i>
                                    <span>Sent Successfully!</span>
                                  </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-navy-950 border-t border-gray-100 dark:border-navy-900 pt-16 pb-8 transition-colors duration-700">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8 mb-12">
            
            <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-emerald-600 flex items-center justify-center text-white text-lg rounded-sm transition-colors duration-500">
                    <i className="fa-solid fa-scale-balanced"></i>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xl text-navy-900 dark:text-white transition-colors duration-500">Consultation House</h4>
                  <p className="text-xs text-emerald-600 dark:text-emerald-500 uppercase tracking-widest transition-colors duration-500">Industrial Experts</p>
                </div>
            </div>

            <div className="flex gap-8">
                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-navy-900 text-navy-600 dark:text-gray-400 hover:bg-emerald-600 hover:text-white transition-all duration-300 hover:scale-110">
                    <i className="fa-brands fa-linkedin-in"></i>
                </a>
                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-navy-900 text-navy-600 dark:text-gray-400 hover:bg-emerald-600 hover:text-white transition-all duration-300 hover:scale-110">
                    <i className="fa-brands fa-whatsapp"></i>
                </a>
            </div>
        </div>

        <div className="border-t border-gray-100 dark:border-navy-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-500">
            <p>&copy; {new Date().getFullYear()} Consultation House. All rights reserved.</p>
            <div className="flex gap-6">
                <a href="#home" className="hover:text-emerald-600 transition-colors">Home</a>
                <a href="#services" className="hover:text-emerald-600 transition-colors">Services</a>
                <a href="#contact" className="hover:text-emerald-600 transition-colors">Contact</a>
            </div>
        </div>
      </div>
    </footer>
  );
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "नमस्ते! I am the assistant for Consultation House. How may I help you?", sender: 'bot' }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (!hasInitialized && isOpen) {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const chat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: "You are a professional industrial consultant for 'Consultation House'. Be brief, formal, and helpful. Use a mix of Hindi and English.",
                }
            });
            setChatSession(chat);
            setHasInitialized(true);
        } catch (error) {
            console.error("Error initializing chat:", error);
        }
    }
  }, [isOpen, hasInitialized]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setInput("");
    setIsTyping(true);

    try {
        let responseText = "System busy. Please call 9811155576.";
        
        if (chatSession) {
             const result = await chatSession.sendMessage({ message: userMsg });
             responseText = result.text ?? "No response";
        } else {
             const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
             const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: userMsg 
             });
             if (result.text) responseText = result.text;
        }
        
        setMessages(prev => [...prev, { text: responseText, sender: 'bot' }]);
    } catch (error) {
        setMessages(prev => [...prev, { text: "Network error. Call 9811155576.", sender: 'bot' }]);
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[70] flex flex-col items-end font-sans">
      
      {!isOpen && (
        <div 
            className="mb-2 bg-navy-900 dark:bg-white text-white dark:text-navy-900 px-4 py-2 rounded-full text-xs font-bold shadow-xl cursor-pointer hover:scale-105 transition-all duration-300 border border-white/10 flex items-center gap-2 animate-fade-up" 
            onClick={() => setIsOpen(true)}
        >
           <span>संपर्क करें </span>
        </div>
      )}

      {isOpen && (
        <div className="bg-white dark:bg-navy-900 w-[90vw] sm:w-[350px] h-[450px] max-h-[70vh] shadow-2xl rounded-lg border border-gray-200 dark:border-navy-700 flex flex-col mb-4 overflow-hidden animate-fade-up transition-colors duration-500">
          {/* Header */}
          <div className="bg-navy-900 p-3 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                <i className="fa-solid fa-headset text-sm"></i>
              </div>
              <div>
                <h4 className="font-bold text-sm">Consultation House</h4>
                <p className="text-[10px] text-emerald-400">Online Support</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-emerald-400 transition-colors">
              <i className="fa-solid fa-times text-lg"></i>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 bg-gray-50 dark:bg-navy-950 p-4 overflow-y-auto transition-colors duration-500">
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-3 py-2 rounded-lg text-sm transition-colors duration-300 ${
                    msg.sender === 'user' 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-white dark:bg-navy-800 text-navy-800 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-navy-700'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                 <div className="flex justify-start">
                   <div className="px-3 py-2 bg-white dark:bg-navy-800 rounded-lg border border-gray-100 dark:border-navy-700 text-xs text-gray-500 flex items-center gap-1 transition-colors duration-300">
                     <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                     <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                     <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                   </div>
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-navy-900 border-t border-gray-100 dark:border-navy-800 shrink-0 transition-colors duration-500">
            <div className="flex gap-2 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask us anything..."
                className="w-full bg-gray-50 dark:bg-navy-950 rounded-sm px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 border border-transparent focus:border text-navy-900 dark:text-white transition-all duration-300"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-10 h-9 rounded-sm bg-navy-900 dark:bg-emerald-600 text-white flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition-all duration-300"
              >
                <i className="fa-solid fa-paper-plane text-xs"></i>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-xl transition-all duration-500 hover:scale-105 border-4 border-white dark:border-navy-800 ${isOpen ? 'bg-gray-800 text-white' : 'bg-emerald-600 text-white'}`}
      >
        <i className={`fa-solid ${isOpen ? 'fa-times' : 'fa-comment'}`}></i>
      </button>
    </div>
  );
};

const App = () => {
  const themeProps = useTheme();
  return (
    <div className="antialiased overflow-x-hidden min-h-screen bg-gray-50 text-navy-900 dark:bg-navy-950 dark:text-gray-100 transition-colors duration-500 ease-in-out font-sans">
      <Navbar {...themeProps} />
      <Hero />
      <Services />
      <About />
      <Contact />
      <Footer />
      <ChatWidget />
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
