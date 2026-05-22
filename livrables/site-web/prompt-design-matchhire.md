# Prompt Claude Design — Site web MatchHire

> Prompt à copier-coller dans Claude Design pour générer le design du site.

---

```
Create a modern, professional landing page and web app design for a recruitment 
platform called "MatchHire" (or suggest a better name).

## Concept
This is NOT a job board. This is NOT LinkedIn. 

MatchHire is a real-time, time-boxed recruitment platform built around human 
connection — inspired by speed dating. Recruiters don't post job offers and 
wait. Instead, they announce a live availability slot (e.g. "I'm available 
Thursday 3–4pm for 5 candidates"). Candidates apply, get in line, and meet 
the recruiter face-to-face in a structured, time-limited session.

The core differentiator: candidates know exactly when they'll be seen, 
recruiters protect their time, and both sides commit to a real interaction 
— not just a CV floating in a database.

## How It Works (the full flow)

### Recruiter side
1. Recruiter creates a profile (company, role, what they're hiring for)
2. They announce a session: date, time slot, number of CV slots available (e.g. 5)
3. For each candidate, they have a **5-minute review timer** to read the CV 
   and decide: Accept or Pass
4. Accepted candidates (e.g. 2 out of 5) are invited to a **30-minute video 
   interview** on the same platform
5. Recruiter status is visible: "Upcoming session", "Live now", "Session ended"

### Candidate side
1. Candidate creates a profile and uploads their CV
2. They browse upcoming recruiter sessions and apply to join one
3. They see their **position in the waiting list** (e.g. "You are #3 in line")
4. When their turn comes, their CV is presented to the recruiter for 5 minutes
5. If accepted: they receive a slot for a 30-minute interview
6. If passed: they can apply to another recruiter session

---

## Target Users
- **Candidates:** Job seekers who want real visibility and a fair shot — 
  not just sending CVs into the void
- **Recruiters:** HR professionals who want to reclaim their time, 
  meet real candidates efficiently, and commit to a structured process

---

## Key Pages to Design

### 1. Landing Page (Homepage)
- Hero section with a bold, differentiated tagline 
  (e.g. "Stop sending CVs. Start meeting recruiters." or 
  "The first recruitment platform built like speed dating.")
- Clear "How it works" section — two parallel flows: Candidate side / 
  Recruiter side, shown side by side
- CTA buttons: "I'm a candidate" / "I'm a recruiter"
- Key differentiators vs. LinkedIn / job boards (shown visually, not as text)
- Social proof: number of sessions hosted, candidates matched, companies
- Waitlist signup form with email input

### 2. Candidate Dashboard
- Upcoming recruiter sessions they can join (cards with company, role, date, 
  available slots)
- Their current waitlist position for sessions they've joined
- CV upload / management area (drag-and-drop)
- Status tracker: "Applied", "In queue (#3)", "CV reviewed", "Interview booked"

### 3. Recruiter Dashboard
- "Create a session" button — pick date, time, number of slots
- Active session view: CV review mode with a **visible countdown timer** 
  (5 minutes per candidate), Accept / Pass buttons
- Queue overview: who's next, how many candidates remain
- Past sessions summary: how many candidates reviewed, interviews scheduled
- Recruiter badge/status: "Verified Recruiter", "Session Live", 
  "Next session: [date]"

### 4. Live Session View (the core UX — make this the design centerpiece)
- Full-screen CV reader with countdown timer prominently displayed
- Large Accept / Pass buttons
- Candidate basic info sidebar (name, role sought, location)
- Queue indicator: "Candidate 2 of 5"
- Atmosphere: focused, clean, urgent — like a trading floor or live game show

### 5. Waitlist / Coming Soon Page
- Email capture form with role selector (candidate or recruiter)
- Live counter of people already on the waitlist
- Teaser of the 3 key features: live sessions, 5-minute CV review, 
  30-min interview slots

---

## Design Style
- Clean, modern, and energetic — nothing corporate, nothing boring
- Color palette: deep navy blue (#1A1F36) + electric teal accent (#00C9A7) 
  + white backgrounds
- Typography: bold sans-serif headers, readable body text
- Cards and rounded corners throughout
- Micro-interactions and animations on CTAs
- Mobile-first responsive design
- The live session screen should feel immersive and time-pressured — 
  think countdown clock, clear action buttons, no distractions

## Must-Have UI Components
- **Countdown timer** (5-minute CV review) — the signature component of the app
- Waitlist position badge ("You are #3 in line")
- Recruiter session status card ("Live now", "Starts in 2h", "Full")
- CV upload drag-and-drop zone
- Accept / Pass binary action buttons (large, tactile, satisfying)
- Recruiter status badge (Verified / Active / Session Live)
- Session capacity indicator (e.g. "3 of 5 slots filled")

---

Design this as a complete, polished product — something that could launch 
on Product Hunt tomorrow. Make it feel nothing like LinkedIn or Indeed. 
It should feel alive, urgent, and human. Include both desktop and mobile views.
```
