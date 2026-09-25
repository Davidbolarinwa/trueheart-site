/*
 * BonHeart careers — single source of truth for job postings.
 *
 * To add a new job (no other code changes needed):
 *   1. Add an entry to CAREERS_JOBS below. Give it a fresh `id` (e.g. "hca-002")
 *      so it can't collide with a past posting for the same role.
 *   2. Copy any file under careers/<role-slug>/<job-id>.html to
 *      careers/<new-slug>/<new-id>.html (matching the slug/id you just chose).
 *   3. In the copy, update the <title>, meta description, og:*, and
 *      <link rel="canonical"> tags to match the new role — that's SEO
 *      metadata only. The visible page content renders from this file.
 *   4. Add the new job's card to the listing on /careers by... doing nothing —
 *      careers.html renders every "open" job from CAREERS_JOBS automatically.
 *
 * To close/remove a posting without deleting its page (so old links don't
 * 404), set its `status` to "closed" — it drops off the /careers listing and
 * its own page shows a friendly "no longer open" message instead of the form.
 */

window.CAREERS_JOBS = [
  {
    id: 'hca-001',
    slug: 'health-care-aide',
    title: 'Health Care Aide',
    status: 'open',
    pay: null,
    payNote: null,
    type: 'Contract, Casual',
    summary: 'Personal care, companionship, and respite support in clients’ homes. Contract, casual.',
    intro: [
      'BonHeart Health Care Aides provide hands-on personal care, companionship, and respite support to Winnipeg families in their own homes.',
      'This is independent contract work, not employment — you’re not a BonHeart employee, and there’s no guaranteed schedule. You set your own availability, and client jobs come to you through the BonHeart platform, which also handles the case management side.',
      'It’s flexible, meaningful work you can build around the rest of your life — a good way to put real care experience to use on your own terms.'
    ],
    responsibilities: [
      'Assist clients with personal care such as bathing, dressing, grooming, and mobility',
      'Provide companionship and steady emotional support during visits',
      'Cover respite shifts so family caregivers can take a real break',
      'Follow each client’s individual care plan',
      'Communicate with clients, families, and BonHeart’s case coordinators through the platform'
    ],
    roleRequirements: [
      '1–2+ years of experience as a Health Care Aide, or in a comparable personal care role'
    ]
  },
  {
    id: 'sw-001',
    slug: 'support-worker',
    title: 'Support Worker',
    status: 'open',
    pay: null,
    payNote: null,
    type: 'Contract, Casual',
    summary: 'Companionship, daily living support, and respite in clients’ homes. Contract, casual.',
    intro: [
      'BonHeart Support Workers help Winnipeg clients with companionship, daily living support, and respite care in their own homes.',
      'Like every BonHeart role, this is independent contract work with no guaranteed hours. You set your own availability, and pick up client jobs that fit your schedule through the BonHeart platform, which also handles case management.',
      'If you’re reliable, genuinely warm with people, and looking for flexible work you can build around the rest of your life, this is a good place to start.'
    ],
    responsibilities: [
      'Provide companionship and attentive support during visits',
      'Help with daily living tasks such as light housekeeping, meal prep, and errands',
      'Cover respite shifts so family caregivers get a reliable break',
      'Follow each client’s care plan and flag changes or concerns',
      'Communicate with clients and BonHeart’s case coordinators through the platform'
    ],
    roleRequirements: [
      'Experience in a support, caregiving, or client-facing care role is preferred, but not required'
    ]
  },
  {
    id: 'cc-001',
    slug: 'case-coordinator',
    title: 'Case Coordinator',
    status: 'closed',
    pay: 'Paid per completed assessment',
    payNote: 'Rate is discussed directly with candidates who move forward — not a public hourly rate.',
    type: 'Contract',
    summary: 'Conduct client assessments and coordinate scheduling. Paid per completed assessment, contract.',
    intro: [
      'BonHeart Case Coordinators are the link between new clients and the caregivers who support them.',
      'You’ll conduct in-home client assessments and coordinate scheduling through the BonHeart platform. No healthcare background is required — just strong admin and scheduling instincts, and a genuine care for getting the details right.',
      'This is independent contract work, paid per completed assessment rather than an hourly rate. You set your own availability and take on assessments as they come up.'
    ],
    responsibilities: [
      'Conduct in-home assessments with new BonHeart clients and their families',
      'Translate each assessment into a clear, workable care plan',
      'Coordinate scheduling between clients and available caregivers on the platform',
      'Keep client records and case notes accurate and current',
      'Be the point of contact for questions as a new client gets started'
    ],
    roleRequirements: [
      'Background in administration, scheduling, or coordination — healthcare experience is not required'
    ]
  }
];

window.CAREERS_COMMON_REQUIREMENTS = [
  'Your own reliable vehicle',
  'A Criminal Record Check with Vulnerable Sector Search, completed within the last 6 months',
  'A Child Abuse Registry check, completed within the last 6 months',
  'An Adult Abuse Registry check, completed within the last 6 months',
  'Legal eligibility to work in Canada'
];

window.CAREERS_HOW_IT_WORKS = [
  {
    title: 'Apply',
    desc: 'Tell us a bit about your experience and availability. Takes a few minutes.'
  },
  {
    title: 'We review for fit',
    desc: 'We hire slowly and carefully — the person we send into a client’s home represents everything we stand for.'
  },
  {
    title: 'Train on our platform',
    desc: 'If it’s a match, we’ll get you set up and trained on the BonHeart platform, where scheduling and client case handling happen.'
  },
  {
    title: 'Set your availability & get to work',
    desc: 'You choose when you’re available. When client jobs come up that fit, you pick them up — flexible contract work you can build around the rest of your life.'
  }
];

window.CAREERS_JOB_URL = function(job){
  return '/careers/' + job.slug + '/' + job.id;
};
