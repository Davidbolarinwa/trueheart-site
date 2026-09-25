/*
 * Shared logic for every /careers/<role-slug>/<job-id> page. Identical on all
 * of them — the job id is read from the URL itself, so this file never needs
 * per-posting edits. See careers-data.js for the postings and copy.
 */
(function(){
  var MAKE_WEBHOOK_URL = "https://hook.us2.make.com/2cf78mwx3ffe85h52fspvntoheu7hala"; // Make.com webhook — careers application intake
  var MIN_SUBMIT_MS = 2500; // minimum time on page before a submit is trusted
  var MAX_RESUME_BYTES = 5 * 1024 * 1024; // 5MB
  var formLoadTime = Date.now();

  function jobIdFromPath(){
    var segments = location.pathname.split('/').filter(Boolean);
    var last = segments.pop() || '';
    return last.replace(/\.html$/i, '');
  }

  function findJob(id){
    var jobs = window.CAREERS_JOBS || [];
    for (var i = 0; i < jobs.length; i++){
      if (jobs[i].id === id) return jobs[i];
    }
    return null;
  }

  function el(tag, opts){
    var node = document.createElement(tag);
    if (opts){
      if (opts.text) node.textContent = opts.text;
      if (opts.className) node.className = opts.className;
    }
    return node;
  }

  function renderList(container, items){
    if (!container) return;
    container.innerHTML = '';
    (items || []).forEach(function(text){
      var li = document.createElement('li');
      li.textContent = text;
      container.appendChild(li);
    });
  }

  function setMeta(selector, attr, value){
    var node = document.querySelector(selector);
    if (node && value) node.setAttribute(attr, value);
  }

  function renderJob(job){
    document.title = job.title + ' | Careers | BonHeart Home Care';
    setMeta('meta[name="description"]', 'content', job.summary);
    setMeta('meta[property="og:title"]', 'content', job.title + ' | BonHeart Home Care Careers');
    setMeta('meta[property="og:description"]', 'content', job.summary);
    setMeta('meta[name="twitter:title"]', 'content', job.title + ' | BonHeart Home Care Careers');
    setMeta('meta[name="twitter:description"]', 'content', job.summary);

    var titleEl = document.getElementById('job-title');
    if (titleEl) titleEl.textContent = job.title;
    var summaryEl = document.getElementById('job-summary');
    if (summaryEl) summaryEl.textContent = job.summary;

    var badges = document.getElementById('job-badges');
    if (badges){
      badges.innerHTML = '';
      if (job.pay){
        badges.appendChild(el('span', {className: 'badge badge-pay', text: job.pay}));
      }
      badges.appendChild(el('span', {className: 'badge badge-type', text: job.type}));
    }
    var noteEl = document.getElementById('job-pay-note');
    if (noteEl){
      if (job.payNote){
        noteEl.textContent = job.payNote;
        noteEl.hidden = false;
      } else {
        noteEl.hidden = true;
      }
    }

    var about = document.getElementById('job-about');
    if (about){
      about.innerHTML = '';
      (job.intro || []).forEach(function(p){ about.appendChild(el('p', {text: p})); });
    }

    renderList(document.getElementById('job-responsibilities'), job.responsibilities);
    renderList(
      document.getElementById('job-requirements'),
      (job.roleRequirements || []).concat(window.CAREERS_COMMON_REQUIREMENTS || [])
    );

    var howSteps = document.getElementById('how-steps');
    if (howSteps){
      howSteps.innerHTML = '';
      (window.CAREERS_HOW_IT_WORKS || []).forEach(function(step){
        var card = el('div', {className: 'step'});
        card.appendChild(el('h3', {text: step.title}));
        card.appendChild(el('p', {text: step.desc}));
        howSteps.appendChild(card);
      });
    }

    var roleInput = document.getElementById('f-role');
    if (roleInput) roleInput.value = job.title;

    var content = document.getElementById('job-content');
    if (content) content.hidden = false;
  }

  function showNotFound(){
    document.title = 'Role no longer available | Careers | BonHeart Home Care';
    var titleEl = document.getElementById('job-title');
    if (titleEl) titleEl.textContent = 'This role isn’t available';
    var notFound = document.getElementById('job-not-found');
    if (notFound) notFound.hidden = false;
    var applySection = document.getElementById('apply');
    if (applySection) applySection.style.display = 'none';
  }

  var job = findJob(jobIdFromPath());
  if (job && job.status === 'open'){
    renderJob(job);
  } else {
    showNotFound();
  }

  // ---------------- application form ----------------
  var form = document.getElementById('apply-form');
  if (!form || !job || job.status !== 'open') return;

  var submitBtn = document.getElementById('apply-submit');
  var errorEl = document.getElementById('apply-error');
  var successEl = document.getElementById('apply-success');

  function val(name){
    var field = form.elements[name];
    if (!field) return '';
    return (field.value || '').trim();
  }

  function setError(msg){
    if (!errorEl) return;
    errorEl.textContent = msg;
    errorEl.style.display = msg ? 'block' : 'none';
  }

  function validate(){
    var required = [
      ['full_name', 'your full name'],
      ['email', 'a valid email address'],
      ['phone', 'a phone number'],
      ['experience', 'your years of relevant experience'],
      ['certifications', 'your certifications (or "None")'],
      ['availability', 'your general availability'],
      ['area', 'your area of Winnipeg']
    ];
    for (var i = 0; i < required.length; i++){
      if (!val(required[i][0])){
        setError('Please add ' + required[i][1] + '.');
        return false;
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val('email'))){
      setError('Please enter a valid email address.');
      return false;
    }
    if (!val('has_vehicle')){
      setError('Please let us know if you have your own reliable vehicle.');
      return false;
    }
    if (!val('checks_current')){
      setError('Please let us know if your checks are current within the last 6 months.');
      return false;
    }
    return true;
  }

  function readResume(){
    var input = form.elements.resume;
    var file = input && input.files && input.files[0];
    if (!file) return Promise.resolve(null);
    if (file.size > MAX_RESUME_BYTES){
      return Promise.reject(new Error('RESUME_TOO_LARGE'));
    }
    return new Promise(function(resolve, reject){
      var reader = new FileReader();
      reader.onload = function(){
        var base64 = String(reader.result || '').split(',')[1] || '';
        resolve({ filename: file.name, mimetype: file.type, base64: base64 });
      };
      reader.onerror = function(){ reject(new Error('RESUME_UNREADABLE')); };
      reader.readAsDataURL(file);
    });
  }

  function resetSubmitButton(){
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Application';
    form.removeAttribute('aria-busy');
  }

  function finishSuccess(){
    form.style.display = 'none';
    if (successEl) successEl.style.display = 'block';
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    setError('');

    // Validate first, always — so a genuine visitor who submits fast (e.g.
    // right after browser autofill) still gets real inline errors instead of
    // silently losing an incomplete submission to the spam check below.
    if (!validate()) return;

    // Spam protection: a filled honeypot or a too-fast submit both fail
    // silently — never reach the webhook, but the visitor sees no difference.
    var honeypotFilled = !!val('bh_hp');
    var submittedTooFast = (Date.now() - formLoadTime) < MIN_SUBMIT_MS;
    var isSpam = honeypotFilled || submittedTooFast;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';
    form.setAttribute('aria-busy', 'true');

    if (isSpam){
      setTimeout(finishSuccess, 400);
      return;
    }

    var payload = {
      role: job.title,
      job_id: job.id,
      job_slug: job.slug,
      full_name: val('full_name'),
      email: val('email'),
      phone: val('phone'),
      experience: val('experience'),
      certifications: val('certifications'),
      has_vehicle: val('has_vehicle'),
      checks_current: val('checks_current'),
      availability: val('availability'),
      area: val('area'),
      message: val('message'),
      submitted_at: new Date().toISOString(),
      source: 'careers-page'
    };

    readResume().then(function(resume){
      if (resume){
        payload.resume_filename = resume.filename;
        payload.resume_mimetype = resume.mimetype;
        payload.resume_base64 = resume.base64;
      }
      return fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });
    }).then(function(res){
      if (!res || !res.ok) throw new Error('BAD_RESPONSE');
      finishSuccess();
    }).catch(function(err){
      resetSubmitButton();
      if (err && err.message === 'RESUME_TOO_LARGE'){
        setError('That resume is a bit large for us to accept here — please keep it under 5MB, or email it to info@bonhearts.ca directly.');
        return;
      }
      setError('Something went wrong sending your application. Please try again, or email your details to info@bonhearts.ca.');
    });
  });
})();
