/* EduSpark public admin prototype — intentionally NOT a secure admin account. */
(function () {
  "use strict";
  const db=window.EduStore,esc=db.escapeHTML;
  const $=q=>document.querySelector(q);
  const $$=q=>Array.from(document.querySelectorAll(q));
  const views={dashboard:"Dashboard",courses:"Manage courses",learners:"Learners",announcements:"Announcements",reports:"Reports",settings:"Demo settings"};
  function flash(msg,bad=false,target="#global-status"){
    const el=$(target);if(!el)return;
    el.textContent=msg;el.classList.toggle("error",bad);
  }
  function go(view){
    if(!views[view])return;
    $$(".view").forEach(el=>el.classList.toggle("active",el.id==="view-"+view));
    $$(".side-nav button").forEach(button=>{
      const active=button.dataset.view===view;
      button.classList.toggle("active",active);
      if(active)button.setAttribute("aria-current","page");else button.removeAttribute("aria-current");
    });
    $("#page-label").textContent=views[view];
    window.scrollTo({top:0,behavior:"instant"});
  }
  function table(head,rows){
    return '<table><thead><tr>'+head.map(h=>'<th scope="col">'+esc(h)+'</th>').join("")+'</tr></thead><tbody>'+
      (rows.length?rows.join(""):'<tr><td colspan="'+head.length+'">No demo records found.</td></tr>')+'</tbody></table>';
  }
  function renderCourseTable(){
    const state=db.load();
    $("#course-count").textContent=state.courses.length+' course'+(state.courses.length===1?'':'s');
    $("#course-table").innerHTML=table(["Course","Category","Lessons","Status","Actions"],state.courses.map(course=>
      '<tr><td><strong>'+esc(course.name)+'</strong><br><span style="font-size:.7rem;color:#7583a0">'+esc(course.duration)+'</span></td><td>'+esc(course.category)+'</td><td>'+course.lessons.length+'</td><td><span class="status-tag '+(course.active===false?'muted':'')+'">'+(course.active===false?'Hidden':'Visible')+'</span></td><td><div class="table-actions"><button class="btn secondary small" type="button" data-edit="'+esc(course.id)+'">Edit</button><button class="btn secondary small" type="button" data-visibility="'+esc(course.id)+'">'+(course.active===false?'Show':'Hide')+'</button><button class="btn danger small" type="button" data-delete="'+esc(course.id)+'">Delete</button></div></td></tr>'
    ));
    $("#dashboard-courses").innerHTML=table(["Course","Category","Status"],state.courses.slice(0,5).map(course=>
      '<tr><td>'+esc(course.name)+'</td><td>'+esc(course.category)+'</td><td><span class="status-tag '+(course.active===false?'muted':'')+'">'+(course.active===false?'Hidden':'Visible')+'</span></td></tr>'
    ));
  }
  function renderLearners(){
    const state=db.load();
    $("#learner-table").innerHTML=table(["Learner name","Demo email","Enrolled","Average progress","Action"],state.learners.map(person=>{
      const entries=state.enrollments.filter(e=>e.learnerId===person.id);
      const vals=entries.map(e=>({e,course:state.courses.find(c=>c.id===e.courseId)})).filter(x=>x.course);
      const avg=vals.length?Math.round(vals.reduce((sum,{e,course})=>sum+db.progress(e,course),0)/vals.length):0;
      return '<tr><td><strong>'+esc(person.name)+'</strong></td><td>'+esc(person.email)+'</td><td>'+vals.length+'</td><td>'+avg+'%</td><td><button class="btn danger small" type="button" data-delete-learner="'+esc(person.id)+'">Remove</button></td></tr>';
    }));
  }
  function annItem(item){
    return '<article class="announcement-item"><div><h3>'+esc(item.title)+'</h3><p>'+esc(item.body)+'</p></div><div style="display:grid;justify-items:end;gap:10px"><time>'+esc(item.created)+'</time><button class="btn danger small" type="button" data-delete-announcement="'+esc(item.id)+'">Remove</button></div></article>';
  }
  function renderAnnouncements(){
    const entries=db.load().announcements;
    $("#announcement-list").innerHTML=entries.length?entries.map(annItem).join(""):'<div class="empty">No announcements. Use the form above to publish one.</div>';
    $("#dashboard-announcements").innerHTML=entries.length?entries.slice(0,2).map(item=>'<article class="announcement-item"><div><h3>'+esc(item.title)+'</h3><p>'+esc(item.body)+'</p></div><time>'+esc(item.created)+'</time></article>').join(""):'<div class="empty">No notices yet.</div>';
  }
  function performance(state){
    return state.courses.map(course=>{
      const entries=state.enrollments.filter(e=>e.courseId===course.id);
      const avg=entries.length?Math.round(entries.reduce((n,e)=>n+db.progress(e,course),0)/entries.length):0;
      return {course,entries:entries.length,average:avg};
    });
  }
  function renderReports(){
    const state=db.load(),rows=performance(state);
    $("#admin-total-courses").textContent=String(state.courses.length);
    $("#admin-learners").textContent=String(state.learners.length);
    $("#admin-enrollments").textContent=String(state.enrollments.length);
    $("#report-active").textContent=String(state.courses.filter(c=>c.active!==false).length);
    const entryMetrics=state.enrollments.map(e=>({entry:e,course:state.courses.find(c=>c.id===e.courseId)})).filter(x=>x.course);
    $("#report-lessons").textContent=String(entryMetrics.reduce((n,{entry,course})=>n+(entry.completed||[]).filter(i=>i>=0&&i<course.lessons.length).length,0));
    $("#report-average").textContent=(entryMetrics.length?Math.round(entryMetrics.reduce((n,{entry,course})=>n+db.progress(entry,course),0)/entryMetrics.length):0)+"%";
    $("#report-table").innerHTML=table(["Course","Status","Enrollments","Average progress"],rows.map(({course,entries,average})=>
      '<tr><td>'+esc(course.name)+'</td><td>'+(course.active===false?'Hidden':'Visible')+'</td><td>'+entries+'</td><td>'+average+'%</td></tr>'));
  }
  function renderAll(){renderCourseTable();renderLearners();renderAnnouncements();renderReports();}
  function clearCourseForm(){
    $("#course-form").reset();$("#course-id").value="";
    $("#course-form-title").textContent="Add a course";
    $("#save-course").textContent="Save course";
  }
  function editCourse(id){
    const course=db.load().courses.find(c=>c.id===id);
    if(!course)return;
    $("#course-id").value=course.id;
    $("#course-name").value=course.name;
    $("#course-category").value=course.category;
    $("#course-level").value=course.level;
    $("#course-duration").value=course.duration;
    $("#course-description").value=course.description;
    $("#course-lessons").value=course.lessons.join("\n");
    $("#course-form-title").textContent="Edit course";
    $("#save-course").textContent="Save changes";
    go("courses");
    $("#course-form").scrollIntoView({behavior:"smooth",block:"center"});
    $("#course-name").focus();
  }
  $("#course-form").addEventListener("submit",e=>{
    e.preventDefault();
    try{
      db.upsertCourse({
        id:$("#course-id").value||null,
        name:$("#course-name").value,
        category:$("#course-category").value,
        level:$("#course-level").value,
        duration:$("#course-duration").value,
        description:$("#course-description").value,
        lessons:$("#course-lessons").value,
        active:$("#course-id").value?db.load().courses.find(c=>c.id===$("#course-id").value)?.active!==false:true
      });
      clearCourseForm();renderAll();flash("Course saved in this browser.",false,"#course-status");
    }catch(err){flash(err.message,true,"#course-status");}
  });
  $("#cancel-edit").addEventListener("click",()=>{
    clearCourseForm();flash("Course editor cleared.",false,"#course-status");
  });
  $("#announcement-form").addEventListener("submit",e=>{
    e.preventDefault();
    try{
      db.addAnnouncement($("#announcement-title").value,$("#announcement-message").value);
      $("#announcement-form").reset();renderAll();flash("Announcement published to this browser demo.",false,"#announcement-status");
    }catch(err){flash(err.message,true,"#announcement-status");}
  });
  document.addEventListener("click",e=>{
    const nav=e.target.closest("[data-view]");
    if(nav){go(nav.dataset.view);return;}
    const goTo=e.target.closest("[data-go]");
    if(goTo){go(goTo.dataset.go);return;}
    const edit=e.target.closest("[data-edit]");
    if(edit){editCourse(edit.dataset.edit);return;}
    const visibility=e.target.closest("[data-visibility]");
    if(visibility){db.toggleCourseVisibility(visibility.dataset.visibility);renderAll();flash("Course visibility updated.");return;}
    const remove=e.target.closest("[data-delete]");
    if(remove){
      const course=db.load().courses.find(c=>c.id===remove.dataset.delete);
      if(course&&window.confirm('Delete "'+course.name+'" and associated demo enrollments?')){
        db.removeCourse(course.id);clearCourseForm();renderAll();flash("Demo course deleted.");
      }return;
    }
    const learner=e.target.closest("[data-delete-learner]");
    if(learner){
      const state=db.load(),person=state.learners.find(x=>x.id===learner.dataset.deleteLearner);
      if(person&&window.confirm('Remove demo learner "'+person.name+'" and their progress?')){
        state.learners=state.learners.filter(x=>x.id!==person.id);
        state.enrollments=state.enrollments.filter(x=>x.learnerId!==person.id);
        db.save(state);renderAll();flash("Demo learner removed.");
      }return;
    }
    const ann=e.target.closest("[data-delete-announcement]");
    if(ann&&window.confirm("Remove this demo announcement?")){
      db.deleteAnnouncement(ann.dataset.deleteAnnouncement);renderAll();flash("Announcement removed.");
    }
  });
  function makeCSV(rows){
    return rows.map(row=>row.map(value=>'"'+String(value).replace(/"/g,'""')+'"').join(",")).join("\r\n")+"\r\n";
  }
  $("#download-report").addEventListener("click",()=>{
    const state=db.load();
    const rows=[["Course ID","Course name","Category","Visible","Enrollments","Average progress percent"],...performance(state).map(({course,entries,average})=>[course.id,course.name,course.category,course.active!==false,entries,average])];
    const blob=new Blob([makeCSV(rows)],{type:"text/csv;charset=utf-8"});
    const url=URL.createObjectURL(blob),link=document.createElement("a");
    link.href=url;link.download="eduspark-course-report.csv";document.body.append(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    flash("Demo CSV report generated.",false,"#report-status");
  });
  $("#reset-demo").addEventListener("click",()=>{
    if(window.confirm("Reset ALL EduSpark demo changes in this browser? Learners, enrollments and course edits will be lost.")){
      db.resetDemo();clearCourseForm();renderAll();go("dashboard");
      flash("Demo data reset to the initial sample catalog.");
    }
  });
  window.addEventListener("storage",renderAll);
  renderAll();go("dashboard");
})();