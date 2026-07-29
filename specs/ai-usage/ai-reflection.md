# AI Usage Reflection

## What Worked Well

### Accelerated Architecture Planning
AI helped me quickly evaluate different architectural patterns (Repository
Pattern vs direct DbContext, JWT vs Session, SQLite vs PostgreSQL) by
explaining trade-offs clearly. This saved significant research time and
allowed me to make informed decisions faster.

### Code Generation for Repetitive Patterns
Generating boilerplate code for Repository interfaces and implementations
was much faster with AI. Each repository followed the same pattern, and
AI could generate a complete, correct implementation quickly.

### Debugging
The CORS issue (port conflict with macOS AirPlay) would have taken much
longer to diagnose without AI assistance. AI helped me systematically
eliminate possible causes and identify the root issue.

### Security Review
After finding one instance of missing [Authorize] attributes, AI helped
me understand the vulnerability pattern and proactively search for it
across the entire codebase - catching 5 instances total.

---

## What I Learned to Do Differently

### Verify Package Versions
Early in the project, AI suggested package versions that didn't exist or
were incompatible with .NET 10. I learned to always verify version numbers
against NuGet before using AI suggestions directly.

### Ask for Trade-offs, Not Just Solutions
Initially I asked "how do I do X" and got one solution. Better prompts
were "what are the options for doing X and what are the trade-offs" -
this gave more context for making good decisions.

### Review Before Committing
A few early commits included AI-generated code I hadn't fully understood.
I changed my workflow to always read through and understand code before
committing, even if AI generated it.

---

## AI's Limitations I Encountered

- AI sometimes suggested overly complex solutions for a showcase project
- Version numbers and API signatures changed between AI's training cutoff
  and current library versions
- AI occasionally gave conflicting advice between conversations
- AI couldn't run the code to verify it worked - that was always my job

---

## Overall Assessment

AI tools significantly accelerated my development workflow, particularly
for architecture planning, boilerplate generation, and debugging. However,
the quality of the final product depended on my ability to critically
evaluate AI suggestions, understand the code, and make informed design
decisions. AI was a powerful tool, but the developer's judgment remained
essential throughout.
