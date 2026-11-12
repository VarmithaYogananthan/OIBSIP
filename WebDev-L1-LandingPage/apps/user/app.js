/* EduSpark learner preview — intentionally NOT secure authentication. */
(function(){
  "use strict";
  const db=window.EduStore, esc=db.escapeHTML;
  let selectedCourse=null, currentView="dashboard";
  const $=selector=>document.querySelector(selector);
  const $$=selector=>Array.from(document.querySelectorAll(selector));
  const title={dashboard:"Overview",catalog:"Explore courses",learning:"My learning",announcements:"Announcements",profile:"My profile"};
  function notice(msg,bad=false){
    const status=$("#global-status");
    status.textContent=msg;status.classList.toggle("error",bad);
  }
  function go(view){
    if(!title[view]) return;
    currentView=view;
    $$(".view").forEach(s=>s.classList.toggle("active",s.id==="view-"+view));
    $$(".side-nav button").forEach(b=>{
      const current=b.dataset.view===view;
      b.classList.toggle("active",current);
      if(current)b.setAttribute("aria-current","page"); else b.removeAttribute("aria-current");
    });
    $("#page-label").textContent=title[view];
    if(view!=="learning") selectedCourse=null;
    if(view==="learning") renderLearning();
    window.scrollTo({top:0,behavior:"instant"});
  }
  function announcement(item){
    return '<article class="announcement-item"><div><h3>'+esc(item.title)+'</h3><p>'+esc(item.body)+'</p></div><time>'+esc(item.created||"")+'</time></article>';
  }
  function renderAnnouncements(){
    const state=db.load(),markup=state.announcements.length?state.announcements.map(announcement).join(""):'<div class="empty">No announcements yet.</div>';
    $("#all-announcements").innerHTML=markup;
    $("#dash-announcements").innerHTML=state.announcements.length?state.announcements.slice(0,2).map(announcement).join(""):'<p>No notices published.</p>';
  }
  function courseCard(course,entry){
    const pct=entry?db.progress(entry,course):0;
    const person=db.getLearner();
    const action=entry?
      '<button type="button" class="btn" data-open="'+esc(course.id)+'">Continue learning →</button>':
      '<button type="button" class="btn" data-enroll="'+esc(course.id)+'">'+(person?"Join this course →":"Create demo learner to join →")+'</button>';
    const progress=entry?'<div class="course-progress"><span><span>Course progress</span><strong>'+pct+'%</strong></span><div class="progress"><div class="progress-bar" style="width:'+pct+'%"></div></div></div>':"";
    return '<article class="course-card"><div class="course-cover '+esc(course.color||"blue")+'"><strong>'+esc(course.icon||"✦")+'</strong><span>'+esc(course.level||"Beginner")+'</span></div><div class="course-details"><div class="course-type">'+esc(course.category)+'</div><h3>'+esc(course.name)+'</h3><p>'+esc(course.description)+'</p><div class="course-meta"><span>'+esc(course.duration||"Flexible")+'</span><span>'+course.lessons.length+' lessons</span></div>'+progress+action+'</div></article>';
  }
  function renderCatalog(){
    const state=db.load(),query=$("#catalog-search").value.trim().toLowerCase(),category=$("#catalog-category").value,person=db.getLearner();
    const matches=state.courses.filter(c=>c.active!==false).filter(c=>category==="all"||c.category===category)
      .filter(c=>[c.name,c.category,c.description,...c.lessons].join(" ").toLowerCase().includes(query));
    $("#catalog-count").textContent=matches.length+" course"+(matches.length===1?"":"s")+" available";
    $("#catalog-courses").innerHTML=matches.map(c=>{
      const e=person?state.enrollments.find(x=>x.learnerId===person.id&&x.courseId===c.id):null;
      return courseCard(c,e);
    }).join("");
    $("#catalog-empty").hidden=matches.length!==0;
    $("#featured-courses").innerHTML=state.courses.filter(c=>c.active!==false).slice(0,3).map(c=>{
      const e=person?state.enrollments.find(x=>x.learnerId===person.id&&x.courseId===c.id):null;
      return courseCard(c,e);
    }).join("")||'<div class="empty">No courses available yet.</div>';
  }
  function renderLearning(){
    const person=db.getLearner(),state=db.load();
    const enrolled=person?state.enrollments.filter(e=>e.learnerId===person.id).map(e=>({entry:e,course:state.courses.find(c=>c.id===e.courseId)})).filter(x=>x.course):[];
    $("#my-courses").innerHTML=enrolled.map(({entry,course})=>courseCard(course,entry)).join("");
    $("#my-empty").hidden=enrolled.length!==0;
    if(selectedCourse){
      const pair=enrolled.find(x=>x.course.id===selectedCourse);
      if(pair)showLessons(pair.course,pair.entry);
      else {selectedCourse=null;$("#lesson-detail").hidden=true;}
    }else $("#lesson-detail").hidden=true;
  }
  function showLessons(course,entry){
    $("#lesson-detail").hidden=false;
    $("#lesson-title").textContent=course.name;
    $("#lesson-info").textContent=course.description;
    const pct=db.progress(entry,course);
    $("#lesson-progress").innerHTML='<span><span>Completed lessons</span><strong>'+pct+'%</strong></span><div class="progress"><div class="progress-bar" style="width:'+pct+'%"></div></div>';
    $("#lesson-list").innerHTML=course.lessons.map((name,i)=>{
      const checked=(entry.completed||[]).includes(i)?" checked":"";
      return '<label class="lesson-item"><input type="checkbox" data-lesson="'+i+'" data-course="'+esc(course.id)+'"'+checked+'><span>'+(i+1)+'. '+esc(name)+'</span></label>';
    }).join("");
  }
  function renderProfile(){
    const person=db.getLearner(),letter=person?person.name.slice(0,1).toUpperCase():"G";
    $("#top-name").textContent=person?person.name:"Guest learner";
    $("#avatar-label").textContent=letter;
    $("#welcome-name").textContent=person?person.name.split(" ")[0]:"learner";
    $("#setup-panel").hidden=!!person;
    $("#profile-avatar").textContent=letter;
    $("#profile-display-name").textContent=person?person.name:"Guest learner";
    $("#profile-email-text").textContent=person?person.email:"No demo profile selected";
    $("#profile-name").value=person?person.name:"";
    $("#profile-form").hidden=!person;
  }
  function renderStats(){
    const person=db.getLearner(),state=db.load(),
    enrollment=person?state.enrollments.filter(e=>e.learnerId===person.id):[];
    const active=enrollment.map(e=>({e,c:state.courses.find(c=>c.id===e.courseId)})).filter(x=>x.c);
    $("#stat-enrolled").textContent=String(active.length);
    $("#stat-lessons").textContent=String(active.reduce((sum,{e,c})=>sum+(e.completed||[]).filter(i=>i>=0&&i<c.lessons.length).length,0));
    $("#stat-progress").textContent=String(active.length?Math.round(active.reduce((sum,{e,c})=>sum+db.progress(e,c),0)/active.length):0)+"%";
  }
  function renderAll(){
    renderProfile();renderStats();renderCatalog();renderLearning();renderAnnouncements();
  }
  document.addEventListener("click",e=>{
    const nav=e.target.closest("[data-view]");
    if(nav){go(nav.dataset.view);return;}
    const jump=e.target.closest("[data-go]");
    if(jump){go(jump.dataset.go);return;}
    const join=e.target.closest("[data-enroll]");
    if(join){
      if(!db.getLearner()){
        $("#setup-panel").hidden=false;
        $("#setup-panel").scrollIntoView({behavior:"smooth",block:"center"});
        $("#new-name").focus();
        notice("Create a demo learner profile to join courses.");
      }else{
        try{db.enroll(join.dataset.enroll);renderAll();go("learning");notice("Course added to My learning.");}
        catch(err){notice(err.message,true);}
      }
      return;
    }
    const open=e.target.closest("[data-open]");
    if(open){
      selectedCourse=open.dataset.open;go("learning");selectedCourse=open.dataset.open;renderLearning();
      $("#lesson-detail").scrollIntoView({behavior:"smooth",block:"start"});
      return;
    }
  });
  $("#demo-join-form").addEventListener("submit",e=>{
    e.preventDefault();
    try{
      db.enterLearner($("#new-name").value,$("#new-email").value);
      $("#setup-status").textContent="Demo learner profile ready.";
      $("#setup-status").classList.remove("error");
      renderAll();go("dashboard");notice("Welcome! Browse and join a course.");
    }catch(err){$("#setup-status").textContent=err.message;$("#setup-status").classList.add("error");}
  });
  $("#profile-form").addEventListener("submit",e=>{
    e.preventDefault();
    try{db.updateLearner($("#profile-name").value);renderAll();$("#profile-status").textContent="Display name saved.";$("#profile-status").classList.remove("error");}
    catch(err){$("#profile-status").textContent=err.message;$("#profile-status").classList.add("error");}
  });
  $("#signout").addEventListener("click",()=>{
    db.leaveLearner();
    $("#new-name").value="";$("#new-email").value="";$("#setup-status").textContent="";
    renderAll();go("dashboard");$("#setup-panel").scrollIntoView({behavior:"auto"});
    notice("Switched to guest mode. Existing progress remains in this browser.");
  });
  $("#catalog-search").addEventListener("input",renderCatalog);
  $("#catalog-category").addEventListener("change",renderCatalog);
  $("#lesson-list").addEventListener("change",e=>{
    const target=e.target.closest("input[data-lesson]");
    if(!target)return;
    try{
      db.toggleLesson(target.dataset.course,Number(target.dataset.lesson));
      renderAll();notice("Lesson progress saved in this browser.");
    }catch(err){notice(err.message,true);}
  });
  $("#lesson-back").addEventListener("click",()=>{
    selectedCourse=null;renderLearning();
    $("#my-courses").scrollIntoView({behavior:"smooth",block:"start"});
  });
  window.addEventListener("storage",renderAll);
  renderAll();go("dashboard");
})();