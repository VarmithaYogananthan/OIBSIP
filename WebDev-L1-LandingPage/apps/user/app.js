/* EduSpark learner preview — intentionally NOT secure authentication. */
(function(){
  "use strict";
  const db=window.EduStore, esc=db.escapeHTML;
  let selectedCourse=null, currentView="dashboard", detailId=null, pendingCourse=null;
  const $=selector=>document.querySelector(selector);
  const $$=selector=>Array.from(document.querySelectorAll(selector));
  const title={dashboard:"Overview",catalog:"Explore courses",learning:"My learning",announcements:"Announcements",profile:"My profile",course:"Course details"};
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
    if(view!=="course" && window.location.hash!=="#"+view) window.history.replaceState(null,"","#"+view);
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
    return '<article class="course-card"><a class="course-cover '+esc(course.color||"blue")+'" href="#course/'+encodeURIComponent(course.id)+'" data-detail="'+esc(course.id)+'" aria-label="View '+esc(course.name)+' course details"><strong>'+esc(course.icon||"✦")+'</strong><span>'+esc(course.level||"Beginner")+'</span></a><div class="course-details"><div class="course-type">'+esc(course.category)+'</div><h3><a href="#course/'+encodeURIComponent(course.id)+'" data-detail="'+esc(course.id)+'">'+esc(course.name)+'</a></h3><p>'+esc(course.description)+'</p><div class="course-meta"><span>'+esc(course.duration||"Flexible")+'</span><span>'+course.lessons.length+' lessons</span></div>'+progress+'<a class="btn secondary course-details-link" href="#course/'+encodeURIComponent(course.id)+'" data-detail="'+esc(course.id)+'">View course details →</a>'+action+'</div></article>';
  }

  const STATIC_DETAILS = {web:"../../courses/web-development.html",design:"../../courses/ui-ux-design.html",python:"../../courses/python-programming.html"};
  function showCourseDetails(id,changeURL=true){
    const state=db.load(), course=state.courses.find(item=>item.id===id), person=db.getLearner();
    const entry=person?state.enrollments.find(item=>item.learnerId===person.id&&item.courseId===id):null;
    if(!course || (course.active===false&&!entry)){
      go("catalog");
      notice("This course is not currently available in the demo catalog.",true);
      return false;
    }
    detailId=id;
    $("#course-detail-title").textContent=course.name;
    $("#course-detail-subtitle").textContent="Detailed information, modules and learning goals for "+course.name+".";
    $("#course-detail-category").textContent=course.category;
    $("#course-detail-heading").textContent=course.name;
    $("#course-detail-description").textContent=course.description;
    $("#course-detail-level").textContent=course.level;
    $("#course-detail-duration").textContent=course.duration;
    $("#course-detail-count").textContent=course.lessons.length+" lessons";
    $("#course-detail-icon").textContent=course.icon||"✦";
    $("#course-detail-modules").innerHTML=course.lessons.map((lesson,index)=>'<li><span class="course-module-count">'+String(index+1).padStart(2,"0")+'</span><div><strong>'+esc(lesson)+'</strong><small>Interactive demo lesson checklist</small></div></li>').join("");
    const text=entry?"Continue course →":person?"Join this course →":"Create demo learner to join →";
    const attr=entry?'data-open="'+esc(id)+'"':'data-enroll="'+esc(id)+'"';
    $("#course-detail-actions").innerHTML='<button type="button" class="btn" '+attr+'>'+text+'</button><button type="button" class="btn secondary" data-go="catalog">Browse other courses →</button>';
    $("#course-detail-enrollment").innerHTML=entry?'<p class="course-enroll-status">Enrolled · '+db.progress(entry,course)+'% complete</p><div class="course-progress"><div class="progress"><div class="progress-bar" style="width:'+db.progress(entry,course)+'%"></div></div></div>':'<p class="course-enroll-status">Not enrolled yet · '+course.lessons.length+' sample modules</p>';
    const publicPage=STATIC_DETAILS[id];
    $("#course-static-link").innerHTML=publicPage?'<a class="course-source-link" href="'+publicPage+'">View public course overview <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true" style="display:inline-block;vertical-align:-.1em"><path d="M6 18 18 6M6 6h12v12"/></svg></a>':'<span class="form-note">Created inside the demo Admin catalog.</span>';
    go("course");
    if(changeURL && window.location.hash!=="#course/"+encodeURIComponent(id)) window.history.pushState(null,"","#course/"+encodeURIComponent(id));
    return true;
  }
  function routeFromHash(){
    const value=window.location.hash||"";
    if(value.startsWith("#course/")){
      let id;
      try{id=decodeURIComponent(value.slice(8));}catch(error){go("catalog");return true;}
      return showCourseDetails(id,false);
    }
    if(["#catalog","#learning","#announcements","#profile","#dashboard"].includes(value)){
      go(value.slice(1));return true;
    }
    return false;
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
    if(currentView==="course" && detailId) showCourseDetails(detailId,false);
  }
  document.addEventListener("click",e=>{
    const details=e.target.closest("[data-detail]");
    if(details){e.preventDefault();showCourseDetails(details.dataset.detail);return;}
    const nav=e.target.closest("[data-view]");
    if(nav){go(nav.dataset.view);return;}
    const jump=e.target.closest("[data-go]");
    if(jump){go(jump.dataset.go);return;}
    const join=e.target.closest("[data-enroll]");
    if(join){
      if(!db.getLearner()){
        pendingCourse=join.dataset.enroll;
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
      renderAll();
      if(pendingCourse){const courseToShow=pendingCourse;pendingCourse=null;showCourseDetails(courseToShow);}
      else go("dashboard");
      notice("Welcome! Browse the course details and join your first class.");
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
      const courseId=target.dataset.course, lessonIndex=Number(target.dataset.lesson);
      const restoreFocus=document.activeElement===target;
      db.toggleLesson(courseId,lessonIndex);
      renderAll();
      // Rendering progress rebuilds the checkbox list; keep keyboard users on their lesson.
      if(restoreFocus){
        const replacement=$$("#lesson-list input[data-lesson]").find(input=>
          input.dataset.course===courseId && Number(input.dataset.lesson)===lessonIndex);
        if(replacement)replacement.focus({preventScroll:true});
      }
      notice("Lesson progress saved in this browser.");
    }catch(err){notice(err.message,true);}
  });
  $("#lesson-back").addEventListener("click",()=>{
    selectedCourse=null;renderLearning();
    $("#my-courses").scrollIntoView({behavior:"smooth",block:"start"});
  });
  $("#course-back").addEventListener("click",()=>go("catalog"));
  window.addEventListener("hashchange",routeFromHash);
  window.addEventListener("popstate",routeFromHash);
  window.addEventListener("storage",renderAll);
  renderAll();
  if(!routeFromHash())go("dashboard");
})();