/* ============================================================
   DATA — the editable surface of the tracker.
   Sourced 2026-08-18 from:
     Saanvi folder + university list + family plan
     DETAILED APPLICATION PLAN.xlsx
     Amogh-Saanvi-University-List.xlsx
   Hard rule: no invented dates. Unverified stays TBD-VERIFY.
   ============================================================ */
const DATA = {
  studentName: "Saanvi",
  studentOwner: "saanvi",
  classYear: "Class of 2027",
  entry: "Fall 2027",
  sibling: {name:"Amogh", href:"https://mailtovmat.github.io/amogh/"},
  notes: {
    overview: "<strong>This is not a mock with invented acceptances.</strong> Nothing has been submitted. Saanvi\u2019s Excel column has 15 Yes schools (11 US + 4 UK). Northwestern is Yes for her; the Boston location on the spreadsheet is still wrong (OQ-05).",
    applications: "<strong>15 Yes from Saanvi’s list.</strong> Cornell, Boston University and Northwestern are Yes. Intended direction from meeting notes: Aerospace / Mechanical.",
    financial: "<strong>The counter-intuitive part.</strong> Saanvi is a non-resident of every US state, so out-of-state publics charge full freight and reserve need-based aid for residents. Full-need privates treat her as any other domestic applicant. On this list the cheap-looking schools are the expensive ones. Three net price calculators would settle it in an evening. No dollar figures appear here because none have been run."
  },
  tz: "Asia/Kolkata",
  built: "2026-08-18",
  source: "Saanvi meeting notes + university list + family plan",

  /* PUBLIC = true strips SAT score and aid detail. Live site is the
     full build at the father's direction — see OQ-13. */
  PUBLIC: false,

  SAT_TOTAL: null,
  SAT_SPLIT: null, /* Meeting notes say “SAT - 150” — incomplete. Not recorded. */

  tasks: [
    {id:"SAA-GEN-LOR-01", t:"Ask the two teachers and the counselor for recommendations", owner:"saanvi", due:"2026-08-19", status:"todo", hard:false,
      why:"Overdue against the family's own plan (was 15 Aug). Hours of work. Gates letter drafts due 31 Aug. Ask now, name schools later.", overdueFrom:"2026-08-15", cat:"Person", college:"General"},
    {id:"SAA-GEN-APP-03", t:"Create the Common App account and add the Yes schools", owner:"saanvi", due:"2026-08-19", status:"todo", hard:false,
      why:"Overdue (was 15 Aug). Supplement prompts are invisible until a school is added — this blocks the entire prompt log.", overdueFrom:"2026-08-15", cat:"Form", college:"General"},
    {id:"SAA-GEN-TST-04", t:"Record the SAT total and section split", owner:"parent", due:"2026-08-19", status:"todo", hard:false,
      why:"Meeting notes do not have a usable SAT total. Record the real score and split before any retake decision.", cat:"Doc", college:"General"},
    {id:"SAA-GEN-SCH-01", t:"Email the counselor — Common App capability, school profile, predicted grades", owner:"parent", due:"2026-08-21", status:"todo", hard:false,
      why:"Draft is in the counselor-exchange folder. Every answer has a multi-week turnaround. A counselor not set up on Common App is a silent application failure.", cat:"Person", college:"General"},
    {id:"SAA-GEN-TST-06", t:"SAT sitting — 22 August", owner:"saanvi", due:"2026-08-22", status:"todo", hard:true,
      why:"Meeting notes do not confirm a 22 Aug registration for Saanvi. Verify whether she is sitting that date.", cat:"Doc", college:"General"},
    {id:"SAA-GEN-FIN-04", t:"Create both FSA IDs at studentaid.gov", owner:"parent", due:"2026-08-22", status:"todo", hard:false,
      why:"Confirm Saanvi has an SSN before creating the FSA ID. Foreign address and foreign phone routinely route to manual identity review (1–3 weeks). FAFSA opens 1 Oct.", cat:"Doc", college:"General"},
    {id:"SAA-GEN-ADM-01", t:"Decide whether the five UK universities are actually on the list, and lock the course", owner:"parent", due:"2026-08-24", status:"todo", hard:true,
      why:"ESAT registration closes 28 Sep and UCAS closes 15 Oct. Neither has a late route. Parking without a decision is withdrawal by default.", cat:"Form", college:"UK"},
    {id:"SAA-GEN-SCH-02", t:"Confirm exam board, A-Level subjects, AS grades, retake subjects", owner:"parent", due:"2026-08-24", status:"todo", hard:false,
      why:"Feeds the curriculum mapping. CIE and Edexcel are different qualifications and 'IGCSE' alone tells a US reader nothing.", cat:"Doc", college:"General"},
    {id:"SAA-GEN-APP-01", t:"Draft the resume", owner:"saanvi", due:"2026-08-24", status:"todo", hard:false,
      why:"Needed for the recommender packets, not for any college deadline. A teacher writing from memory writes a worse letter.", cat:"Doc", college:"General"},
    {id:"SAA-GEN-APP-02", t:"Draft the brag sheet for the counselor", owner:"saanvi", due:"2026-08-24", status:"todo", hard:false,
      why:"Question 7 — 'is there anything in the transcript that needs explaining' — is the one that matters, given the AS retakes.", cat:"Doc", college:"General"},
    {id:"SAA-GEN-ESS-01", t:"Common App personal statement — first full draft", owner:"saanvi", due:"2026-08-31", status:"todo", hard:false,
      why:"650 words, hard cap. Consider doing the activities list first — it is a forced inventory and routinely surfaces the essay.", cat:"Doc", college:"General"},
    {id:"SAA-GEN-ADM-03", t:"Decide the intended major (Chemical vs Aerospace/Mechanical)", owner:"saanvi", due:"2026-08-31", status:"todo", hard:false,
      why:"CMU, Georgia Tech, UIUC, Michigan and Cornell admit by college or by major, and the choice is not switchable after admission.", cat:"Form", college:"General"},
    {id:"SAA-GEN-FIN-03", t:"Run three net price calculators — MIT, one OOS public, one mid private", owner:"parent", due:"2026-08-31", status:"todo", hard:false,
      why:"Free, one evening, and it will settle the shape of the school list faster than any amount of reading.", cat:"Doc", college:"General"},
    {id:"SAA-GEN-APP-04", t:"Cut the school list to a real number", owner:"parent", due:"2026-08-31", status:"todo", hard:false,
      why:"Saanvi's Excel column has 15 Yes (11 US + 4 UK). Confirm Northwestern (OQ-05) and whether any extra schools should join before October.", cat:"Form", college:"General"},
    {id:"SAA-GEN-FIN-06", t:"Resolve whether mother needs an FSA ID (OQ-02)", owner:"parent", due:"2026-08-31", status:"todo", hard:false,
      why:"Required if she is a contributor on the FAFSA. Also determines whether a Noncustodial Profile is in play.", cat:"Doc", college:"General"},
    {id:"SAA-GEN-TST-01", t:"Register for the ESAT October sitting", owner:"parent", due:"2026-09-14", status:"blocked", hard:true,
      why:"Blocked by the UK-list decision. Hard cutoff 28 Sep. Sitting 12–16 Oct. Indian centres fill; access arrangements must be requested before booking.", cat:"Doc", college:"UK"},
    {id:"SAA-GEN-FIN-08", t:"Confirm which schools require CSS Profile and Noncustodial Profile", owner:"parent", due:"2026-09-15", status:"todo", hard:false,
      why:"Per-school, always. The Noncustodial Profile is a second deadline people find in December.", cat:"Doc", college:"General"},
    {id:"SAA-GEN-TST-02", t:"Decide on an October SAT sitting — after the 4 Sept scores land", owner:"parent", due:"2026-09-16", status:"todo", hard:true,
      why:"Skip Sept 12: registration closes 28 Aug, before the 22 Aug result is known, and it collides with half-yearly exams. Oct 3 registration closes 18 Sept.", cat:"Doc", college:"General"},
    {id:"SAA-GEN-FIN-10", t:"Assemble the FEIE packet before FAFSA opens", owner:"parent", due:"2026-09-25", status:"todo", hard:false,
      why:"FEIE is added straight back into the Student Aid Index — the formula sees full worldwide earnings, not US taxable income.", cat:"Doc", college:"General"},
    {id:"SAA-GEN-APP-05", t:"Activities list — 10 slots, 150 characters each", owner:"saanvi", due:"2026-09-30", status:"todo", hard:false,
      why:"Characters, not words, and they include spaces. Slot 1 is read carefully; slot 10 often isn't. Order by significance, not chronology.", cat:"Doc", college:"General"},
    {id:"SAA-GEN-FIN-07", t:"File FAFSA 2027–28", owner:"parent", due:"2026-10-07", status:"todo", hard:false,
      why:"Opens 1 Oct 2026, uses the 2025 return. Expat returns frequently fail the automatic IRS data transfer — plan on manual entry.", cat:"Doc", college:"General"},
    {id:"SAA-GEN-FIN-09", t:"File CSS Profile", owner:"parent", due:"2026-10-14", status:"todo", hard:false,
      why:"Separate from FAFSA, treats foreign income differently, per-school fees. Check requires_ncp per school.", cat:"Doc", college:"General"},
    {id:"SAA-GEN-ADM-02", t:"Confirm Saanvi has a US Social Security Number", owner:"parent", due:"2026-08-20", status:"todo",
      why:"Saanvi's SSN is not recorded here. Confirm it. Unblocks her FSA ID and FAFSA.", cat:"Doc", college:"General"},
    {id:"SAA-GEN-TST-05", t:"Record Saanvi's SAT total and section split", owner:"parent", due:"2026-08-19", status:"todo",
      why:"Meeting notes have an incomplete “SAT - 150”. Do not invent a number.", cat:"Doc", college:"General"},
    {id:"SAA-GEN-ADM-04", t:"Move the counselor-exchange folder out of the vault", owner:"parent", due:"2026-08-24", status:"done",
      why:"RESOLVED 17 Aug. Folder now sits beside the vault. Safe to share with the counselor as Commenter.", cat:"Doc", college:"General"}
  ],

  events: [
    {d:"2026-08-22", short:"SAT sitting", l:"SAT sitting — confirm whether Saanvi is registered", track:"testing", hard:true, tz:"local centre", note:"Scores release 4 Sept if sat"},
    {d:"2026-08-29", short:"SAT Sep-12 reg.", l:"SAT Sept-12 registration closes", track:"testing", hard:false, tz:"28 Aug 23:59 ET", note:"Skip — decision would be blind, and it collides with half-yearly exams"},
    {d:"2026-08-31", l:"School list finalisation (family plan)", track:"us", hard:false, tz:"IST"},
    {d:"2026-08-31", l:"Common App essay target (family plan)", track:"us", hard:false, tz:"IST"},
    {d:"2026-09-04", l:"SAT scores release — 22 Aug sitting", track:"testing", hard:false, tz:"US", note:"The gate on any October retake decision"},
    {d:"2026-09-12", l:"SAT sitting (skip)", track:"testing", hard:false, tz:"local centre"},
    {d:"2026-09-19", short:"SAT Oct-3 reg.", l:"SAT Oct-3 registration closes", track:"testing", hard:true, tz:"18 Sept 23:59 ET", note:"09:29 IST · decide here, with the 22 Aug score in hand"},
    {d:"2026-09-28", short:"ESAT reg.", l:"ESAT registration closes — UK", track:"uk", hard:true, tz:"UK, time TBD", note:"PARKED — lapses without action"},
    {d:"2026-10-01", l:"FAFSA 2027–28 opens", track:"aid", hard:false, tz:"US"},
    {d:"2026-10-01", l:"CSS Profile opens", track:"aid", hard:false, tz:"US"},
    {d:"2026-10-03", l:"SAT sitting (decide after 4 Sept)", track:"testing", hard:false, tz:"local centre"},
    {d:"2026-10-15", short:"UCAS", l:"UCAS deadline — Cambridge", track:"uk", hard:true, tz:"15 Oct 18:00 UK", note:"22:30 IST · PARKED"},
    {d:"2026-10-15", l:"Supplements batch 1 (family plan)", track:"us", hard:false, tz:"IST"},
    {d:"2026-10-22", short:"Cambridge supp.", l:"My Cambridge Application + transcript", track:"uk", hard:true, tz:"22 Oct 18:00 UK", note:"22:30 IST · PARKED"},
    {d:"2026-11-01", short:"EA / ED", l:"Typical Early Action / ED deadlines", track:"us", hard:true, tz:"per school — verify", note:"Family plan has no early round. MIT EA is 1 Nov — verify."},
    {d:"2026-11-30", short:"MIT tests · EA", l:"MIT — tests must be taken by, for EA", track:"testing", hard:true, tz:"US"},
    {d:"2026-12-01", l:"Supplements batch 2 (family plan)", track:"us", hard:false, tz:"IST"},
    {d:"2026-12-15", l:"★ US Regular Decision submit target", track:"us", hard:false, tz:"IST", note:"The family plan's only milestone — two weeks ahead of typical RD"},
    {d:"2026-12-31", short:"MIT tests · RA", l:"MIT — tests must be taken by, for RA", track:"testing", hard:true, tz:"US"},
    {d:"2027-01-01", short:"RD deadlines", l:"Typical Regular Decision deadlines", track:"us", hard:true, tz:"per school — verify"}
  ],

  bands: [
    {lane:"school", s:"2026-09-12", e:"2026-09-28", l:"Half-yearly exams", freeze:true},
    {lane:"school", s:"2026-09-30", e:"2026-11-10", l:"AS Level retakes", freeze:true},
    {lane:"school", s:"2026-12-02", e:"2026-12-24", l:"Winter break / study camp"},
    {lane:"us", s:"2026-08-17", e:"2026-08-31", l:"Common App essay"},
    {lane:"us", s:"2026-09-01", e:"2026-10-15", l:"Supplements — batch 1"},
    {lane:"us", s:"2026-10-16", e:"2026-12-01", l:"Supplements — batch 2"},
    {lane:"us", s:"2026-12-01", e:"2026-12-15", l:"Final review & submit"},
    {lane:"testing", s:"2026-08-17", e:"2026-08-22", l:"SAT prep"},
    {lane:"testing", s:"2026-09-04", e:"2026-09-19", l:"October retake decision"},
    {lane:"aid", s:"2026-08-17", e:"2026-09-25", l:"FSA IDs + FEIE packet"},
    {lane:"aid", s:"2026-10-01", e:"2026-10-14", l:"FAFSA + CSS filing"},
    {lane:"uk", s:"2026-08-17", e:"2026-09-28", l:"ESAT registration window", parked:true},
    {lane:"uk", s:"2026-09-01", e:"2026-10-15", l:"UCAS statement + reference", parked:true},
    {lane:"uk", s:"2026-12-01", e:"2026-12-21", l:"Cambridge interviews", parked:true}
  ],

  lanes: [
    {k:"us", n:"US applications", c:"#2f6feb"},
    {k:"testing", n:"Testing", c:"#d4a017"},
    {k:"aid", n:"Financial aid", c:"#4a3aa7"},
    {k:"school", n:"School & exams", c:"#2e7d57"},
    {k:"uk", n:"UK / UCAS (parked)", c:"#eb6834", parked:true}
  ],

  /* Week 0 = Mon 10 Aug 2026. Colours from the family plan + redesign. */
  plan: [
    {type:"period", label:"Half-Yearly Exams", sub:"Sep 12–28", red:[5,6]},
    {type:"period", label:"AS-Level Retakes", sub:"Sep 30 – Nov 10", red:[7,8,9,10,11,12]},
    {type:"period", label:"Winter Break / Study Camp", sub:"Dec 2–24", amber:[17,18,19]},
    {type:"section", label:"United States"},
    {type:"task", label:"College List Finalisation", target:"2026-08-31", blue:[0,1,2,3,4,5]},
    {type:"task", label:"Common App Setup & Profile", target:"2026-08-15", blue:[0,1], overdue:true},
    {type:"task", label:"Request Counsellor & Teacher LORs", target:"2026-08-15", blue:[0], overdue:true},
    {type:"task", label:"Teacher & Counsellor LOR Drafts", target:"2026-08-31", blue:[10,11,12,13]},
    {type:"task", label:"Activity List", target:"2026-09-30", blue:[1,2]},
    {type:"task", label:"Common App Essay", target:"2026-08-31", blue:[0,1,2,3]},
    {type:"task", label:"Supplemental Essays — Batch 1", target:"2026-10-15", blue:[3,4,13]},
    {type:"task", label:"Supplemental Essays — Batch 2", target:"2026-12-01", blue:[14,15,16]},
    {type:"task", label:"Submit SAT Scores (College Board)", target:"2026-10-15", blue:[17]},
    {type:"task", label:"InitialView Interview (optional)", target:"2026-10-10", status:"Depends on uni"},
    {type:"task", label:"School Transcripts — Follow-up", target:"2026-09-13", blue:[13,14,15,16]},
    {type:"task", label:"LOR — Teacher Follow-up", target:"2026-09-13", blue:[13,14,15,16]},
    {type:"task", label:"Common App Final Review", target:"2026-10-16", blue:[17]},
    {type:"milestone", label:"US RD Submit Target", target:"2026-12-15", dark:[18,19,20]}
  ],

  /* Marks from Amogh-Saanvi-University-List.xlsx Saanvi column. */ 
  schools: [
    {name:"MIT", tier:"Reach", loc:"Cambridge, MA", country:"US", mark:"Yes", sys:"Direct", ce:5, am:5, tp:"Required", aid:"Full need — verify for citizen abroad", aidCat:"full-need", deadline:"2026-11-01", deadlineUnverified:true, deadlineLabel:"EA 1 Nov / RA 1 Jan — verify", round:"EA / RA", status:"Planning"},
    {name:"University of Pennsylvania", tier:"Reach", loc:"Philadelphia, PA", country:"US", mark:"Yes", sys:"Common App", ce:4, am:4, tp:"TBD-VERIFY", aid:"Full need — verify", aidCat:"full-need", deadline:null, deadlineLabel:"TBD-VERIFY", round:"TBD", status:"Planning"},
    {name:"Carnegie Mellon", tier:"Reach", loc:"Pittsburgh, PA", country:"US", mark:"Yes", sys:"Common App", ce:3, am:5, tp:"TBD-VERIFY", aid:"TBD-VERIFY", aidCat:"private", deadline:null, deadlineLabel:"TBD-VERIFY", round:"TBD", status:"Planning", note:"Admits by college — major choice matters"},
    {name:"Georgia Tech", tier:"Match", loc:"Atlanta, GA", country:"US", mark:"Yes", sys:"Common App", ce:5, am:5, tp:"TBD-VERIFY", aid:"OOS public — likely little", aidCat:"oos", deadline:null, deadlineLabel:"TBD-VERIFY", round:"TBD", status:"Planning", note:"Admits by major"},
    {name:"Virginia Tech", tier:"Safety", loc:"Blacksburg, VA", country:"US", mark:"Yes", sys:"Common App", ce:4, am:5, tp:"TBD-VERIFY", aid:"OOS public — likely little", aidCat:"oos", deadline:null, deadlineLabel:"TBD-VERIFY", round:"TBD", status:"Planning"},
    {name:"Rutgers–New Brunswick", tier:"Safety", loc:"New Brunswick, NJ", country:"US", mark:"Yes", sys:"Direct / Common App", ce:4, am:4, tp:"TBD-VERIFY", aid:"OOS public — likely little", aidCat:"oos", deadline:null, deadlineLabel:"TBD-VERIFY", round:"TBD", status:"Planning"},
    {name:"RPI", tier:"Match", loc:"Troy, NY", country:"US", mark:"Yes", sys:"Common App", ce:4, am:5, tp:"TBD-VERIFY", aid:"Merit likely", aidCat:"merit", deadline:null, deadlineLabel:"TBD-VERIFY", round:"TBD", status:"Planning"},
    {name:"UIUC", tier:"Match", loc:"Champaign, IL", country:"US", mark:"Yes", sys:"Common App", ce:5, am:5, tp:"TBD-VERIFY", aid:"OOS public — likely little", aidCat:"oos", deadline:null, deadlineLabel:"TBD-VERIFY", round:"TBD", status:"Planning", note:"Admits by major"},
    {name:"University of Cambridge", tier:"Reach", loc:"Cambridge, England", country:"UK", mark:"Yes", sys:"UCAS", ce:null, am:null, tp:"ESAT", aid:"International fees — no aid", aidCat:"uk", deadline:"2026-10-15", deadlineLabel:"15 Oct 2026 — PARKED", round:"UCAS", status:"Parked", parked:true},
    {name:"Imperial College London", tier:"Reach", loc:"London, England", country:"UK", mark:"Yes", sys:"UCAS", ce:null, am:null, tp:"ESAT", aid:"International fees — no aid", aidCat:"uk", deadline:null, deadlineLabel:"Jan 2027 — PARKED", round:"UCAS", status:"Parked", parked:true},
    {name:"University College London", tier:"Reach", loc:"London, England", country:"UK", mark:"Yes", sys:"UCAS", ce:null, am:null, tp:"ESAT (course-dep.)", aid:"International fees — no aid", aidCat:"uk", deadline:null, deadlineLabel:"Jan 2027 — PARKED", round:"UCAS", status:"Parked", parked:true},
    {name:"University of Leeds", tier:"Safety", loc:"Leeds, England", country:"UK", mark:"Yes", sys:"UCAS", ce:null, am:null, tp:"None — verify", aid:"International fees — no aid", aidCat:"uk", deadline:null, deadlineLabel:"Jan 2027 — PARKED", round:"UCAS", status:"Parked", parked:true},
    {name:"Cornell", tier:"Reach", loc:"Ithaca, NY", country:"US", mark:"Yes", sys:"Common App", ce:5, am:5, tp:"TBD-VERIFY", aid:"Full need", aidCat:"full-need", deadline:null, deadlineLabel:"TBD-VERIFY", round:"TBD", status:"Planning", note:"Admits by college"},
    {name:"Boston University", tier:"Match", loc:"Boston, MA", country:"US", mark:"Yes", sys:"Common App", ce:3, am:4, tp:"TBD-VERIFY", aid:"TBD-VERIFY", aidCat:"private", deadline:null, deadlineLabel:"TBD-VERIFY", round:"TBD", status:"Planning"},
    {name:"Northwestern", tier:"Reach", loc:"listed as Boston, MA", country:"US", mark:"Yes", sys:"Common App", ce:null, am:null, tp:"TBD-VERIFY", aid:"Full need — verify", aidCat:"full-need", deadline:null, deadlineLabel:"TBD-VERIFY", round:"TBD", status:"Planning", note:"OQ-05 — Excel lists location as Boston, MA. Northwestern is Evanston, IL."}
  ],

  people: [
    {name:"Teacher 1 — Math", role:"Math teacher", kind:"Recommender", asked:false, agreed:false, packet:false, invited:false, received:false, req:0, sub:0, nextDue:"2026-08-15"},
    {name:"Teacher 2 — English", role:"English teacher", kind:"Recommender", asked:false, agreed:false, packet:false, invited:false, received:false, req:0, sub:0, nextDue:"2026-08-15"},
    {name:"Shraddha Chauhan", role:"Counselor + School Report", kind:"Counselor", asked:false, agreed:false, packet:false, invited:false, received:false, req:0, sub:0, nextDue:"2026-08-15"},
    {name:"Optional — Math SAT internship", role:"Supervisor", kind:"Optional", asked:false, agreed:false, packet:false, invited:false, received:false, req:0, sub:0, nextDue:null},
    {name:"Optional — senior citizen", role:"Other", kind:"Optional", asked:false, agreed:false, packet:false, invited:false, received:false, req:0, sub:0, nextDue:null}
  ],

  docs: [
    {name:"Common App personal statement", kind:"Essay", due:"2026-08-31", done:false, note:"650-word hard cap. Family plan target 31 Aug. Prompt not yet chosen."},
    {name:"Resume / activities list", kind:"Record", due:"2026-08-24", done:false, note:"Resume for recommender packets (24 Aug). Activities list 10×150 chars by 30 Sep."},
    {name:"SAT score report", kind:"Test", due:"2026-08-19", done:false, note:"Total not recorded. Meeting notes say “SAT - 150” — incomplete. Do not invent a number."},
    {name:"SAT sitting 22 Aug", kind:"Test", due:"2026-08-22", done:false, note:"Not confirmed for Saanvi. Verify registration."},
    {name:"Official transcript", kind:"Record", due:null, done:false, note:"From counselor. Needed well before first deadline. Some schools also want grades typed into Common App / SRAR."},
    {name:"School profile document", kind:"Record", due:null, done:false, note:"Ask in the same counselor email."},
    {name:"Predicted grades", kind:"Record", due:null, done:false, note:"Subject teachers → counselor. TBD-VERIFY when they are issued."},
    {name:"10th & 11th board documents, scanned", kind:"Record", due:null, done:false, note:"Keep in one Drive folder."},
    {name:"All certificates, scanned", kind:"Record", due:"2026-08-24", done:false, note:"Some schools want these before writing LORs."},
    {name:"AP Calculus BC score report", kind:"Test", due:null, done:false, note:"Meeting notes: score 4. Separate send from College Board. Year TBD-VERIFY."},
    {name:"Passport / CRBA / SSN card", kind:"Record", due:"2026-08-18", done:false, note:"Confirm Saanvi has an SSN. Do not transcribe the number anywhere on this site."},
    {name:"SRAR / self-report platform credentials", kind:"Record", due:null, done:false, note:"Arrives after submission. Watch inbox."},
    {name:"Mid-year report", kind:"Record", due:"2027-02-01", done:false, note:"Sends after fall grades. Typical — verify per school."}
  ],

  materials: [
    {item:"2 Teacher LORs", from:"Teachers", due:"2026-08-15", status:"Not started", note:"Time-consuming — request ASAP. Family plan asked-by was 15 Aug; drafts 31 Aug."},
    {item:"1 Counsellor LOR", from:"Counsellor", due:"2026-08-15", status:"Not started", note:"Request early alongside teachers. FERPA waiver must be completed before invites."},
    {item:"1–3 Optional LORs", from:"Internship / senior citizen", due:null, status:"Not started", note:"Not all unis accept these — check the list. Only useful if they say something the two teachers cannot."},
    {item:"Certificates", from:"Yourself", due:"2026-08-24", status:"Not started", note:"Some schools want these before writing LORs. Keep scanned in one Drive folder."},
    {item:"School Transcripts", from:"Counsellor", due:null, status:"Not started", note:"Request ASAP. Some unis also need grades entered into Common App / SRAR."},
    {item:"10th & 11th Board Documents", from:"Yourself", due:null, status:"Not started", note:"Scan and store in one place."},
    {item:"SAT Scores", from:"College Board", due:"2026-10-15", status:"Pending sitting", note:"Send from CB directly — not instant. Only some unis need official reports (MIT is self-report)."},
    {item:"FAFSA & CSS Profile", from:"Student / Parent", due:"2026-10-01", status:"Not started", note:"Both open 1 Oct. File early to get the aid package with the offer. FAFSA for US citizens; CSS per school."}
  ],

  aid: [
    {i:"FSA ID — Saanvi", d:"By 22 Aug 2026", o:"parent", s:"not started", n:"Confirm SSN first. Foreign address may trigger 1–3 week manual review."},
    {i:"FSA ID — father", d:"By 22 Aug 2026", o:"parent", s:"unblocked", n:"Separate email and phone from Saanvi's."},
    {i:"FSA ID — mother", d:"By 31 Aug 2026", o:"parent", s:"open question", n:"OQ-02 — only if she is a FAFSA contributor."},
    {i:"FEIE documentation packet", d:"By 25 Sept 2026", o:"parent", s:"not started", n:"Form 2555, full 1040 with all schedules, employer statements, currency basis."},
    {i:"FAFSA 2027–28", d:"Opens 1 Oct 2026", o:"parent", s:"waiting", n:"Uses the 2025 return. FEIE added straight back into the SAI."},
    {i:"CSS Profile", d:"Opens 1 Oct 2026", o:"parent", s:"waiting", n:"Per-school. Check requires_ncp — the Noncustodial Profile is a separate deadline."},
    {i:"Net price calculators ×3", d:"By 31 Aug 2026", o:"parent", s:"not started", n:"MIT, one OOS public, one mid-tier private. Free. The single most informative hour available right now."},
    {i:"Noncustodial Profile", d:"TBD", o:"parent", s:"open question", n:"OQ-02 — do both parents appear on aid applications?"}
  ],

  oqs: [
    {id:"OQ-01", t:"Intended major — meeting notes say Aerospace / Mechanical, also open to Mechanical. Lock the UCAS course."},
    {id:"OQ-02", t:"Do both parents appear on the aid applications? Noncustodial Profile?"},
    {id:"OQ-03", t:"Budget ceiling, and is full-pay viable? Answer before the list is cut."},
    {id:"OQ-04", t:"Saanvi’s column is 15 Yes with no add. Confirm Northwestern and whether any other schools should join her list."},
    {id:"OQ-05", t:"Northwestern is Yes for Saanvi but listed as Boston, MA. Northwestern is Evanston, IL."},
    {id:"OQ-06", t:"Which AS subjects are being retaken, and why?"},
    {id:"OQ-07", t:"Is there an Indian ESAT test centre, and where?"},
    {id:"OQ-08", t:"InitialView interview — which schools accept it, and is it worth an October task?"},
    {id:"OQ-09", t:"Fee waivers and application costs on a 35-row list."},
    {id:"OQ-10", t:"Do the UK five even make financial sense at international fees?"},
    {id:"OQ-12", t:"SAT total and section split — meeting notes are incomplete."}
  ]
};
