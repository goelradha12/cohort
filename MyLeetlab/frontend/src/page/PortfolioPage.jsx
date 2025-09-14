import {
    Braces,
    Brush,
    ChevronRight,
    Code2,
    Database,
    File,
    GitBranch,
    Github,
    Globe,
    GraduationCap,
    Home,
    Linkedin,
    Mail,
} from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router";
import { useEffect } from "react";

const PortfolioPage = () => {
    const navigate = useNavigate();
    const educationData = [
        {
            degree: "MCA",
            year: "2024-27",
            detail: "9.71 CGPA",
            institute: "MANIT (NIT-Bhopal)",
        },
        {
            degree: "BCA",
            year: "2020-23",
            detail: "83.9%",
            institute: "MDU, Rohtak",
        },
        {
            degree: "12th",
            year: "2017-18",
            detail: "93.2%",
            institute: "Agrasen Public School, Hodal",
        },
        {
            degree: "10th",
            year: "2015-16",
            detail: "94.2%",
            institute: "Happy Modern School, Punhana",
        },
    ];

    const skills = [
        { name: "HTML", icon: <Globe className="w-5 h-5" />, tooltip: "Markup Language for Web Pages" },
        { name: "CSS", icon: <Brush className="w-5 h-5" />, tooltip: "Style Sheets for Web Design" },
        { name: "Tailwind CSS", icon: <Brush className="w-5 h-5" />, tooltip: "Utility-first CSS Framework" },
        { name: "JavaScript", icon: <Code2 className="w-5 h-5" />, tooltip: "Programming Language of the Web" },
        { name: "React JS", icon: <Braces className="w-5 h-5" />, tooltip: "JavaScript Library for UI" },
        { name: "Node JS", icon: <Braces className="w-5 h-5" />, tooltip: "JavaScript Runtime for Backend" },
        { name: "Express JS", icon: <Braces className="w-5 h-5" />, tooltip: "Web Framework for Node.js" },
        { name: "MongoDB", icon: <Database className="w-5 h-5" />, tooltip: "NoSQL Document Database" },
        { name: "Prisma PostgreSQL", icon: <Database className="w-5 h-5" />, tooltip: "PostgreSQL ORM with Prisma" },
        { name: "CPP", icon: <Code2 className="w-5 h-5" />, tooltip: "Object-oriented Programming Language" },
        { name: "WordPress", icon: <Globe className="w-5 h-5" />, tooltip: "CMS for Websites and Blogs" },
        { name: "Wix", icon: <Globe className="w-5 h-5" />, tooltip: "Drag-and-drop Website Builder" },
        { name: "Git", icon: <GitBranch className="w-5 h-5" />, tooltip: "Version Control System" },
        { name: "GitHub", icon: <GitBranch className="w-5 h-5" />, tooltip: "Hosting for Git Repositories" },
    ];

    const recommendations = [
        {
            name: "Jeeva (V Naveen Reddy)",
            designation: "Founder @ SenseOverCents",
            intro: "Radha’s client – Dec 29, 2024",
            feedback: `She has helped us build our company website recently on WordPress, throughout the process she has been very understanding in nature, and built us a good website. Finding people with talent and skills is hard, you know what’s much harder? To find the ones with character and humility, she has them both.`,
            profile: "https://www.linkedin.com/in/jeeva-v-naveen-reddy-333924188",
            summary: "Thoughtful, disciplined and technically strong.",
        },
        {
            name: "Abhijit Dharmadhikari",
            designation: "Blogger | Advance Excel | Analytics",
            intro: "Radha’s client – Aug 13, 2023",
            feedback: `Choosing the WordPress Website Design service From you was the best decision I made for my business. I am extremely satisfied with the WordPress Website Design service I received. Radha Goyal was professional, and efficient, and delivered a stunning website that perfectly captured my brand. The SEO optimization has significantly improved my website's visibility online. Highly recommend!`,
            profile: "https://www.linkedin.com/in/abhijit-dharmadhikari",
            summary: "Efficient, trustworthy and solution-oriented.",
        },
        {
            name: "Collins Enosh",
            designation: "1 Crore Views as a Writer | MBBS Dropout",
            intro: "Managed Radha directly – May 5, 2023",
            feedback: `Radha is a natural talent. She is so curious, and imaginative. This is the kind of writer, no AI can replace. If Radha writes for your brand, it will definitely be unique, quirky, eye-catching, and deep. On top of that she brings her child-like innocence, and energy. Working with Radha is fun, she enjoys her work; writing is her passion. If you love your work that much, of course you wille be good at it.`,
            profile: "https://www.linkedin.com/in/collinsenosh",
            summary: "Detail-driven and self-motivated.",
        },
        {
            name: "Alok Mishra",
            designation: "Social Media Manager | Copywriter",
            intro: "Radha’s client – Apr 14, 2023",
            feedback: `I needed help with my portfolio site — she took it on immediately. She gave life to my content, making it client-ready. If you're looking for a website creator, she’s top-notch.`,
            profile: "https://www.linkedin.com/in/alok-mishra-11ba84212",
            summary: "Creative and technically sharp.",
        },
        {
            name: "ASHWIN M",
            designation: "Personal Branding & Content Specialist",
            intro: "Managed Radha directly – Apr 14, 2023",
            feedback: `Radha is very passionate about web designing and content writing. Her zeal to purusue web development career is impressing. She is very kind and understands the requirements quickly. Her work is amazing and she helped me develope a website for my mental health space. Thanks radha. Good luck to you! :)`,
            profile: "https://www.linkedin.com/in/ashwin-murugesan",
            summary: "Professional and organized.",
        },
        {
            name: "Milan P Sony",
            designation: "Growth Marketer & SEO Content Manager",
            intro: "Radha’s client – Nov 7, 2022",
            feedback: `She was self-driven and creative with content writing. Highly recommend her. Thank you, Radha!`,
            profile: "https://www.linkedin.com/in/milanpsony",
            summary: "Creative and passionate.",
        },
    ];

    const experienceData = [
        {
            dateRange: "Feb, 2022",
            duration: "1 month",
            company: "Umeed A Drop Of Hope - Foundation",
            title: "Winter Intern",
            description: "Did 4 tasks during internship. Submitted ppt as final internship report.",
        },
        {
            dateRange: "May, 2023",
            duration: "2 months",
            company: "Hedgehomes - Real Estate",
            title: "WordPress Developer Intern",
            description: "A two month internship where I created landing pages for google ads for the company.",
        },
        {
            dateRange: "July, 2023 — Present",
            duration: "",
            company: "Hedgehomes - Real Estate",
            title: "Website Dev. Associate",
            description:
                "Managing the company’s official website. Built over 25+ landing pages with WordPress.",
        },
    ];

    const certificates = [
        {
            name: "Frontend Development with React",
            issued: "June 2024",
            skills: ["React", "JSX", "Hooks", "Tailwind"],
            image: "https://via.placeholder.com/300x200.png",
        },];

    const projects = [
        {
            name: "Jagruk Bano India – Blog Website",
            tech: ["WordPress"],
            duration: "May 2022 – Nov 2023",
            description:
                "Managed and owned a WordPress platform focused on government schemes for 1.5 years, publishing over 20+ articles. Optimized SEO to increase visibility and successfully achieved Google Ads approval.",
            link: [
                {
                    text: "Live",
                    link: "https://jagrukbanoindia.in/",
                },
            ],
        },
        {
            name: "SenseOverCents - Freelance",
            tech: ["WordPress"],
            duration: "Jan 2025 – March 2025",
            description:
                "Designed and developed the company website in WordPress, ensuring consistent branding, smooth user experience, and mobile responsiveness.",
            link: [
                {
                    text: "Live",
                    link: "https://senseovercents.com/",
                },
            ]
        },
        {
            name: "CookTheCode – LeetCode Clone",
            tech: ["ExpressJs", "PostgreSQL", "ReactJs"],
            duration: "May 2025 – July 2025",
            description:
                "Built a full-stack problem-solving platform with secure authentication (login, signup, reset/forgot/update password, and email verification). \nImplemented role-based access for adding, editing, updating, or deleting problems. Users can create a profile, select problems, track submissions, and view detailed editorial solutions.",
            link: [
                {
                    text: "GitHub",
                    link: "https://github.com/goelradha12/cohort/tree/main/MyLeetlab",
                },
                {
                    text: "Live Link",
                    link: "https://cookthecode.in",
                }
            ]

        },
        {
            name: "Kanban Board",
            tech: ["JavaScript"],
            duration: "Dec 2024",
            description:
                "Built a Kanban board using React and Tailwind CSS. It allows users to create, update, and delete tasks, and also allows users to drag and drop tasks between columns.",
            link: [
                {
                    text: "GitHub",
                    link: "https://github.com/goelradha12/cohort/blob/main/kanban%20dashboard/kanban.md",
                },
                {
                    text: "Live Link",
                    link: "https://kanbans.netlify.app/",
                }
            ]
        }
    ];

    useEffect(() => {
        document.title = "Developer's Portfolio";
    }, [])

    return (
        <div className="mb-20">
            {/* Breadcrumb */}
            <div className="card mx-auto p-4 max-w-7xl">
                <div className="flex items-center gap-1 text-base text-gray-400">
                    <Home onClick={() => navigate("/")} className="cursor-pointer w-4 h-4 text-primary" />
                    <ChevronRight className="w-4 h-4" />
                    <span>Portfolio</span>
                </div>
            </div>

            {/* Hero Section */}
            <section className="hero-content flex-col lg:flex-row-reverse text-center lg:text-left mx-auto pt-20 pb-10 relative">
                <div className="absolute inset-0 -z-20 pointer-events-none">
                    <div className="w-[600px] h-[600px] -z-20 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 opacity-10 blur-3xl rounded-full absolute top-1/2 left-1/2" />
                </div>
                <div className="grid justify-items-center text-center mx-auto gap-5">
                    <img
                        src="https://res.cloudinary.com/dualriiog/image/upload/v1753216816/me_rlhev5.jpg"
                        alt="Radha"
                        className="w-40 h-40 object-cover rounded-full border-4 border-primary shadow-md z-40"
                    />
                    <div className="max-w-xl">
                        <h1 className="text-3xl md:text-5xl font-semibold text-primary">Hi, I'm Radha</h1>
                        <p className="mt-4 text-base md:text-lg text-base-content">
                            An MCA student with a passion for coding and a love for solving complex problems through logic and design.
                        </p>
                        <a
                            href="https://drive.google.com/file/d/1zwcf3h_zh-eYfsQCFqYNhuw7WDAW2Uf5/view?usp=sharing"
                            target="_blank"
                            className="btn btn-outline gap-2 mt-4  border-2 border-primary hover:bg-primary hover:text-white"
                        >
                            <File className="w-5 h-5" /> Resume
                        </a>
                    </div>
                </div>
            </section>

            {/* Social Links */}
            <section className="bg-base-100 pb-20 text-center">
                <hr className="border-t border-gray-600 w-1/6 mx-auto" />
                <h2 className="text-2xl font-semibold pt-10 text-gray-500 mb-6">Connect with Me</h2>
                <div className="flex justify-center gap-4 flex-wrap">
                    <a
                        href="https://github.com/goelradha12"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-primary gap-2"
                    >
                        <Github className="w-5 h-5" /> GitHub
                    </a>
                    <a
                        href="https://www.linkedin.com/in/goyalradha123/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-info gap-2"
                    >
                        <Linkedin className="w-5 h-5" /> LinkedIn
                    </a>
                    <a
                        href="mailto:goyalradha2001@gmail.com"
                        className="btn btn-outline btn-accent gap-2"
                    >
                        <Mail className="w-5 h-5" /> Email
                    </a>

                </div>
            </section>

            {/* Education Timeline */}
            <section className="border-t border-base-300 py-20 container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Education</h2>

                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-center gap-10">
                    {educationData.map((item, idx, arr) => (
                        <div
                            key={idx}
                            className="flex flex-col items-center text-center relative w-full md:w-auto"
                        >
                            {/* Connector Line */}
                            {idx !== arr.length - 1 && (
                                <>
                                    <div className="hidden md:block absolute top-6 left-full w-10 h-1 bg-primary"></div>
                                    <div className="block md:hidden absolute top-full left-1/2 w-1 h-10 bg-primary"></div>
                                </>
                            )}

                            {/* Circle Icon */}
                            <div className="bg-primary text-white p-3 rounded-full mb-4 z-10 shadow-md">
                                <GraduationCap className="w-5 h-5" />
                            </div>

                            {/* Info Box */}
                            <div className="min-w-[220px] max-w-sm text-left md:text-center">
                                <h3 className="text-xl font-bold text-primary mb-1">{item.degree}</h3>
                                <p className="text-base text-gray-400 italic mb-2">{item.institute}</p>
                                <div className="text-base text-gray-400">
                                    <span className="font-semibold">{item.year}</span>
                                    <span className="hidden md:inline mx-1">•</span>
                                    <span className="font-medium">{item.detail}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Experience */}
            <section className="border-t border-base-300 py-20 container mx-auto px-4 ">
                <h2 className="text-3xl font-bold text-center mb-12">Experience</h2>
                <div className="grid grid-cols-[1fr_1px_2fr] gap-4">
                    {experienceData.map((exp, idx) => (
                        <div key={idx} className="contents">
                            {/* Left Column - Date + Duration */}
                            <div className="text-right pr-4 text-base text-gray-400 whitespace-nowrap">
                                <p>{exp.dateRange}</p>
                                {exp.duration && <p>{exp.duration}</p>}
                            </div>

                            {/* Vertical Line */}
                            <div className="border-l-2 border-gray-400"></div>

                            {/* Right Column - Experience Details */}
                            <div className="pl-4 pb-8">
                                <p className="text-base font-medium text-gray-400">{exp.company}</p>
                                <h3 className="text-lg font-semibold uppercase">{exp.title}</h3>
                                {exp.description && (
                                    <p className="text-base mt-1 text-gray-400">{exp.description}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* skills */}
            <section className="border-t border-base-300 py-20 container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Skills</h2>
                <div className="flex flex-wrap justify-center gap-6 px-4 max-w-6xl mx-auto">
                    {skills.map((skill) => (
                        <div
                            key={skill.name}
                            className="tooltip tooltip-top"
                            data-tip={skill.tooltip}
                        >
                            <div className="backdrop-blur-md bg-base-200/60 rounded-full border-b-1 border-base-300 shadow-md hover:shadow-lg transition-all duration-300 w-[240px] flex items-center gap-4 hover:-translate-y-1">
                                <div className="bg-gradient-to-br from-primary/40 to-secondary/40 text-white p-3 rounded-full shadow-lg">
                                    {skill.icon}
                                </div>
                                <span className="text-lg font-medium text-base-content">{skill.name}</span>
                            </div>
                        </div>

                    ))}
                </div>
            </section>

            {/* Projects */}
            <section className="border-t border-base-300 py-20 container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Projects</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, idx) => (
                        <div
                            key={idx}
                            className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="card-body">
                                <h3 className="card-title text-lg">{project.name}</h3>
                                <p className="text-base text-gray-400">{project.description}</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {project.tech.map((t, i) => (
                                        <span
                                            key={i}
                                            className="badge badge-outline badge-primary"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                                <div className="card-actions justify-end mt-4">
                                    {project.link.map((data, i) => (
                                        <a
                                            key={i}
                                            href={data.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-outline btn-primary gap-2"
                                        >
                                            {data.text}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="border-t border-base-300 py-20 container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">My Practice Platforms / Links</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* Frontend */}
                    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300 p-4">
                        <h3 className="font-semibold text-lg mb-2">HTML & CSS</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <span className="font-medium">CodePen.io</span> –
                                <a href="https://codepen.io/goelradha12" target="_blank" rel="noopener noreferrer" className="text-primary underline ml-1">Visit</a>
                            </li>
                            <li>
                                <span className="font-medium">Space Travel Website (Tutorial)</span><br />
                                <a href="https://travel-in-a-website.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Live</a> |
                                <a href="https://github.com/goelradha12/Space-Website" target="_blank" rel="noopener noreferrer" className="text-primary underline ml-1">Repo</a>
                            </li>
                        </ul>
                    </div>

                    {/* React Project */}
                    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300 p-4">
                        <h3 className="font-semibold text-lg mb-2">React</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <span className="font-medium">E-commerce Product Page - </span>
                                <a href="https://single-product-page-for-e-commerce.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Live</a> |
                                <a href="https://github.com/goelradha12/e-commerce-page" target="_blank" rel="noopener noreferrer" className="text-primary underline ml-1">Repo</a>
                            </li>
                            <li>
                                <span className="font-medium">Tenzies Game - </span>
                                <a href="https://64c654c961f7c9788630c9fa--incandescent-flan-f2db95.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Live</a> |
                                <a href="https://github.com/goelradha12/tenzies-game" target="_blank" rel="noopener noreferrer" className="text-primary underline ml-1">Repo</a>
                            </li>
                        </ul>
                    </div>

                    {/* JS Projects */}
                    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300 p-4">
                        <h3 className="font-semibold text-lg mb-2">JavaScript</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <span className="font-medium">30 Days of Code </span> –
                                <a href="https://github.com/goelradha12/js-intermediate" target="_blank" rel="noopener noreferrer" className="text-primary underline ml-1">Repo</a>
                            </li>
                            <li>
                                <span className="font-medium">Currency Converter </span>
                                <a href="https://coruscating-stroopwafel-d8f303.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Live</a> |
                                <a href="https://github.com/goelradha12/currency-convertor" target="_blank" rel="noopener noreferrer" className="text-primary underline ml-1">Repo</a>
                            </li>
                            <li>
                                <span className="font-medium">Tic-Tac-Toe </span>
                                <a href="https://radha-tic-tac-toe.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Live</a> |
                                <a href="https://github.com/goelradha12/tic-tac-toe" target="_blank" rel="noopener noreferrer" className="text-primary underline ml-1">Repo</a>
                            </li>
                            <li>
                                <span className="font-medium">Simon Game </span>
                                <a href="https://simonegames.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Live</a> |
                                <a href="https://github.com/goelradha12/simonGame" target="_blank" rel="noopener noreferrer" className="text-primary underline ml-1">Repo</a>
                            </li>
                        </ul>
                    </div>

                    {/* GitHub Java */}
                    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300 p-4">
                        <h3 className="font-semibold text-lg mb-2">Java (ongoing)</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <span className="font-medium">GitHub Repo</span> –
                                <a href="https://github.com/goelradha12/Java" target="_blank" rel="noopener noreferrer" className="text-primary underline ml-1">Visit</a>
                            </li>
                        </ul>
                    </div>

                    {/* CPP */}
                    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300 p-4">
                        <h3 className="font-semibold text-lg mb-2">C++</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <span className="font-medium">Competitive Programming</span> –
                                <a href="https://www.codechef.com/users/radhagoel123" target="_blank" rel="noopener noreferrer" className="text-primary underline ml-1">CodeChef</a>
                            </li>
                            <li>
                                <span className="font-medium">DSA with C++</span> –
                                <a href="https://auth.geeksforgeeks.org/user/goelradha12" target="_blank" rel="noopener noreferrer" className="text-primary underline ml-1">GeeksForGeeks</a>
                            </li>
                        </ul>
                    </div>

                    {/* HackerRank */}
                    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300 p-4">
                        <h3 className="font-semibold text-lg mb-2">30 Days of Code (C)</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <span className="font-medium">HackerRank</span> –
                                <a href="https://www.hackerrank.com/goyalradha2001?hr_r=1" target="_blank" rel="noopener noreferrer" className="text-primary underline ml-1">Profile</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* recommendation and feedback */}
            <section className="border-t border-base-300 py-20 container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-center mb-2">Recommendations</h2>
                    <p className="text-base opacity-70">Words shared by people I've worked with</p>
                </div>

                <div className="flex gap-6 overflow-x-auto pb-4 px-4">
                    {recommendations.map((ref, idx) => (
                        <div
                            key={idx}
                            className="min-w-[300px] max-w-sm p-6 rounded-2xl shadow-md bg-base-200 flex-shrink-0 hover:shadow-xl transition-shadow"
                        >
                            <div className="flex flex-col gap-4">
                                <div>
                                    <a
                                        href={ref.profile}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xl font-semibold text-primary hover:underline"
                                    >
                                        {ref.name}
                                    </a>
                                    <p className="text-base text-gray-400 pl-2">{ref.designation}</p>
                                    <p className="mt-2 italic text-md text-base-content">{ref.summary}</p>
                                </div>
                                <blockquote className="text-base text-gray-400 leading-relaxed">
                                    “{ref.feedback}”
                                </blockquote>
                                <p className="text-sm mt-1 text-gray-400 text-right">~{ref.intro}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default PortfolioPage;
