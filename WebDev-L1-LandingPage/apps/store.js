/* EduSpark V1.0 demo data store — browser-local simulation, NOT a server or authentication service. */
(function () {
  "use strict";
  const KEY = "eduspark_demo_platform_v1";
  const ACTIVE = "eduspark_active_demo_learner";
  const seedCourses = [
    {id:"web",name:"Web Development Foundations",category:"Web Development",level:"Beginner",duration:"4 weeks",icon:"⌘",color:"blue",description:"Build a responsive website from semantic HTML and modern CSS.",lessons:["HTML structure and semantics","CSS styling and layout","Responsive interfaces","Publish a personal website"]},
    {id:"design",name:"UI/UX Design Essentials",category:"Design",level:"Beginner",duration:"3 weeks",icon:"✦",color:"violet",description:"Learn research, wireframes and thoughtful digital interface design.",lessons:["User needs and research","Wireframes and user journeys","Typography, color and components","Design a mobile app screen"]},
    {id:"python",name:"Python Programming Starter",category:"Programming",level:"Beginner",duration:"5 weeks",icon:"{ }",color:"cyan",description:"Write real Python programs with functions, loops and problem solving.",lessons:["Variables and data types","Conditions and loops","Reusable functions","Build a simple Python utility"]},
    {id:"data",name:"Data Analytics Basics",category:"Data",level:"Beginner",duration:"4 weeks",icon:"▥",color:"peach",description:"Organize data and create practical charts and simple insights.",lessons:["Reading and cleaning data","Tables and useful metrics","Charts and visualization","Present a mini analysis"]},
    {id:"brand",name:"Creative Brand Design",category:"Design",level:"Intermediate",duration:"3 weeks",icon:"◈",color:"rose",description:"Create a consistent visual identity for a small business.",lessons:["Visual research","Logo and identity ideas","Brand color system","Make a brand style guide"]},
    {id:"js",name:"JavaScript Interactivity",category:"Programming",level:"Intermediate",duration:"4 weeks",icon:"⚡",color:"gold",description:"Add responsive actions and interactions to your web pages.",lessons:["Events and the DOM","Forms and input validation","Local browser storage","Build a small interactive tool"]}
  ];
  function seed() {
    return {
      version:1,
      courses:seedCourses.map(course => ({...course,lessons:[...course.lessons]})),
      learners:[],
      enrollments:[],
      announcements:[
        {id:"welcome",title:"Welcome to your learning space",body:"Explore a course, join it for the demo and mark lessons complete to see your progress.",created:"2026-11-12"}
      ]
    };
  }
  let fallback = null;
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const obj = JSON.parse(raw);
        if (obj && Array.isArray(obj.courses) && Array.isArray(obj.learners) && Array.isArray(obj.enrollments) && Array.isArray(obj.announcements)) return obj;
      }
    } catch (_) { /* restricted browser storage: use in-memory preview */ }
    if (!fallback) fallback = seed();
    return fallback;
  }
  function save(state) {
    fallback = state;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) { /* session-only fallback */ }
    window.dispatchEvent(new CustomEvent("eduspark:change"));
  }
  function id() {
    return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID() : "demo-" + Date.now() + "-" + Math.random().toString(36).slice(2,9);
  }
  function activeId() { try { return localStorage.getItem(ACTIVE) || ""; } catch (_) { return window.__demoActive || ""; } }
  function setActiveId(value) {
    window.__demoActive = value;
    try { localStorage.setItem(ACTIVE,value); } catch (_) {}
  }
  function getLearner() {
    const state = load();
    return state.learners.find(person => person.id === activeId()) || null;
  }
  function enterLearner(name,email) {
    name = String(name || "").trim().slice(0,60);
    email = String(email || "").trim().toLowerCase().slice(0,120);
    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw Error("Enter a name and a valid email for this demo profile.");
    const state = load();
    let person = state.learners.find(entry => entry.email === email);
    if (!person) { person = {id:id(),name,email,joined:new Date().toISOString()}; state.learners.push(person); }
    else person.name = name;
    save(state); setActiveId(person.id);
    return person;
  }
  function leaveLearner() { setActiveId(""); window.dispatchEvent(new CustomEvent("eduspark:change")); }
  function updateLearner(name) {
    name = String(name || "").trim().slice(0,60);
    if (name.length < 2) throw Error("Name must contain at least two characters.");
    const state = load(), person = state.learners.find(p => p.id === activeId());
    if (!person) throw Error("Open a learner demo profile first.");
    person.name = name; save(state);
  }
  function enroll(courseId) {
    const person = getLearner(), state = load(), course = state.courses.find(c => c.id === courseId && c.active !== false);
    if (!person || !course) throw Error("Select a demo learner and an available course.");
    if (!state.enrollments.some(e => e.learnerId === person.id && e.courseId === courseId)) {
      state.enrollments.push({learnerId:person.id,courseId,completed:[],joined:new Date().toISOString()});
      save(state);
    }
  }
  function toggleLesson(courseId,index) {
    const state = load(), course = state.courses.find(c=>c.id===courseId),
          entry = state.enrollments.find(e=>e.learnerId===activeId() && e.courseId===courseId);
    if (!course || !entry || !Number.isInteger(index) || index < 0 || index >= course.lessons.length) throw Error("Join this course to track lessons.");
    entry.completed = Array.isArray(entry.completed) ? entry.completed : [];
    if (entry.completed.includes(index)) entry.completed = entry.completed.filter(x=>x!==index);
    else entry.completed.push(index);
    save(state);
  }
  function upsertCourse(item) {
    const state=load();
    const data={
      id:item.id || id(),
      name:String(item.name||"").trim().slice(0,80),
      category:String(item.category||"Web Development"),
      level:item.level==="Intermediate"?"Intermediate":"Beginner",
      duration:String(item.duration||"").trim().slice(0,35),
      icon:"✦",color:"blue",
      description:String(item.description||"").trim().slice(0,260),
      lessons:String(item.lessons||"").split("\n").map(x=>x.trim()).filter(Boolean).slice(0,16),
      active:item.active!==false
    };
    if(data.name.length<3 || data.description.length<10 || !data.duration || data.lessons.length===0) throw Error("Enter course name, duration, description (at least 10 characters) and lessons.");
    if(!["Web Development","Design","Programming","Data"].includes(data.category)) throw Error("Select a valid category.");
    const existing=state.courses.find(c=>c.id===data.id);
    if(existing) { data.icon=existing.icon; data.color=existing.color; Object.assign(existing,data); }
    else state.courses.unshift(data);
    save(state); return data.id;
  }
  function removeCourse(courseId) {
    const state=load();
    if(!state.courses.some(c=>c.id===courseId)) return;
    state.courses=state.courses.filter(c=>c.id!==courseId);
    state.enrollments=state.enrollments.filter(e=>e.courseId!==courseId);
    save(state);
  }
  function toggleCourseVisibility(courseId) {
    const state=load(), course=state.courses.find(c=>c.id===courseId);
    if(!course) return;
    course.active=course.active===false;
    save(state);
  }
  function addAnnouncement(title,body) {
    title=String(title||"").trim().slice(0,90);
    body=String(body||"").trim().slice(0,300);
    if(title.length<3||body.length<8) throw Error("Enter an announcement title and message.");
    const state=load();
    state.announcements.unshift({id:id(),title,body,created:new Date().toISOString().slice(0,10)});
    state.announcements=state.announcements.slice(0,25);
    save(state);
  }
  function deleteAnnouncement(idValue) {
    const state=load();state.announcements=state.announcements.filter(item=>item.id!==idValue);save(state);
  }
  function resetDemo() {
    save(seed());setActiveId("");window.dispatchEvent(new CustomEvent("eduspark:change"));
  }
  function progress(enrollment,course) {
    if(!course || !course.lessons.length) return 0;
    const completed=Array.isArray(enrollment.completed)?enrollment.completed.filter(n=>Number.isInteger(n) && n>=0 && n<course.lessons.length):[];
    return Math.round(new Set(completed).size*100/course.lessons.length);
  }
  function escapeHTML(value) {
    return String(value??"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
  }
  window.EduStore={load,save,seed,activeId,getLearner,enterLearner,leaveLearner,updateLearner,enroll,toggleLesson,upsertCourse,removeCourse,toggleCourseVisibility,addAnnouncement,deleteAnnouncement,resetDemo,progress,escapeHTML};
})();