# Changelog

All notable changes to this project will be documented here.

The format is inspired by Keep a Changelog, with changes organized around meaningful milestones rather than individual commits.

---

## [Unreleased] — Library Experience

---

## [0.8.0] — Website Foundation

The website now derives its navigation, shelf introductions, document relationships, and rendered pages directly from the Markdown repository. The repository remains the authoritative source; the website simply reveals its structure.
This milestone establishes the initial website structure for The Guide, transforming the repository from a collection of Markdown resources into a navigable experience.

### Added

- Added shelf landing pages generated directly from each shelf's `README.md`.
- Added reusable document rendering components and navigation components to establish a consistent page architecture.
- Added the website foundation using Astro.
- Added the first navigation layers:
  - Door
  - Front Desk
  - Library Shelves
  - Documents
- Added a landing page as the entry point into The Guide.
- Added the Front Desk as an orientation point for new visitors.
- Added shelf navigation allowing visitors to browse collections of related resources.
- Added document routing for rendering Markdown resources as readable pages.

### Changed

- Established shelf `README.md` files as the source of truth for introducing each section of The Guide.
- Refined the relationship between navigation layers:
  - The Front Desk introduces visitors to The Guide.
  - Shelves organize related resources.
  - Documents contain the actual content.
- Updated navigation to preserve both:
  - A recommended path for new readers.
  - Freedom to explore individual sections.

### Philosophy

The website structure reflects the purpose of The Guide itself.

The Guide is not intended to create a rigid path that replaces personal engagement with Scripture. Instead, it provides orientation, resources, and companions for walking faithfully.

The website mirrors this posture:

> The Guide points.
>
> God transforms.

---

## [0.7.0] — The Librarian

This release establishes the foundation for The Guide as a navigable digital resource.

The website is now able to read, interpret, and present the existing Markdown content of The Guide while preserving the repository as the source of truth.

### Added

- Added the initial website foundation built with Astro.
- Added The Librarian:
  - A document discovery layer that reads The Guide repository structure.
  - Automatic discovery of Markdown documents across project sections.
  - Extraction of document titles and metadata.
  - Resolution of internal document relationships.
- Added dynamic document routing:
  - Guide documents are now generated from repository content rather than manually created pages.
  - Each Markdown document can be accessed through a corresponding website route.
- Added Markdown rendering for Guide documents.
- Added intelligent handling of internal Markdown links:
  - Relative Markdown links remain unchanged within the repository.
  - Website routes are generated automatically when rendered.
- Added support for existing document navigation:
  - Recommended Next Step links.
  - Related Reading links.
- Connected the website navigation directly to the editorial structure already established throughout The Guide.

### Changed

- Established the repository Markdown files as the source of truth for website content.
- Changed the role of the website from a separate presentation layer into a companion interface for the existing Guide structure.
- Refined project architecture to separate responsibilities:
  - Markdown documents contain content and editorial relationships.
  - The Librarian interprets and organizes documents.
  - Astro presents the resulting journey.

### Architecture

This milestone establishes the foundational flow:
Markdown Documents
|
v
The Librarian
|
v
Document Relationships
|
v
Astro
|
v
The Guide Website

The website does not replace the repository. It reveals and organizes what already exists.

### Philosophy

The purpose of this milestone is not simply to make The Guide available online.

The goal is to preserve the posture that shaped the project:

The Guide points.  
God transforms.

The website serves as another doorway into the same journey: a companion that helps readers open God's Word, engage, and take the next faithful step.

### Notes

This release represents the first expression of The Guide as a living digital resource.

The foundation is intentionally simple:

- Content remains human-readable Markdown.
- Editorial decisions remain within the documents themselves.
- Navigation emerges from relationships already discovered throughout the project.

Future development will focus on improving presentation and usability while preserving the principle that Scripture remains the foundation and The Guide remains a companion.

---

## [0.6.0] — Stewardship and Transparency

This release establishes the foundation for The Guide as a publicly available resource while clarifying its identity, development process, and intended use.

### Added

- Added `TRANSPARENCY.md` to document the use of modern software tools, including large language models (LLMs), in the development of The Guide.
- Added a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International license to clarify how The Guide may be shared and adapted.
- Expanded the README to better explain:
  - The purpose and posture of The Guide.
  - How new readers can begin their journey.
  - The distinction between The Guide's content and project-level documentation.

### Changed

- Moved `philosophy.md` into the `introduction/` section alongside the foundational documents:
  - Heart of The Guide
  - Purpose of The Guide
  - Formation Compass
  - Path Into The Guide
- Updated repository links and navigation to reflect the revised introduction structure.
- Refined the repository organization to distinguish between:
  - The Guide as a companion for Scripture.
  - Project documentation describing the stewardship and development of the repository.

### Philosophy

This milestone represents a transition from primarily organizing the contents of The Guide to intentionally stewarding it as a public resource.

The Guide remains a companion to Scripture, not a replacement for it.

The goal is not simply to make the work available, but to preserve the posture that shaped it:

> The Guide points.
>
> God transforms.

The repository now communicates not only what The Guide contains, but also why it exists, how it was developed, and how it is intended to be shared.

---

## [0.5.0] — Guided Journey

This release transforms The Guide from a collection of connected resources into a guided journey through Scripture, reflection, prayer, remembrance, and faithful walking.

### Added

- Added guided navigation throughout The Guide with recommended next steps, related reading, and practical engagement sections.
- Added consistent document footers across the repository to help readers continue their journey while preserving the freedom to explore.
- Added intentional pathways between major sections:
  - Introduction
  - Reading Scripture
  - Journaling
  - Prayer
  - Formation
  - Stones of Remembrance
  - Walking
- Added connections between foundational resources and the broader Guide:
  - Linked `philosophy.md` from relevant entry points.
  - Connected the Biblical Reading Plan with the practices taught throughout The Guide.
  - Added pathways from Field Notes back into the broader journey.
- Added navigation throughout the Biblical Reading Plans to help readers engage Scripture alongside the practices found throughout The Guide.
- Added navigation throughout Field Notes to help readers move from examples and reflections back into the broader journey.

### Improved

- Improved repository usability for readers unfamiliar with navigating GitHub.
- Refined the relationship between documents so resources no longer function as isolated pages.
- Established clear pathways while maintaining the ability for readers to wander, revisit, and explore according to their current season.
- Improved discoverability of supporting resources, including:
  - Project Philosophy
  - Biblical Reading Plan
  - Field Notes
- Strengthened the connection between learning, practice, reflection, and continued growth throughout the repository.

### Philosophy

The purpose of navigation within The Guide is not simply to move readers from one document to another. It is to accompany them through a process of receiving Scripture, reflecting on God's work, remembering His faithfulness, and taking the next faithful step.

The Guide offers a path, but not a requirement. Readers are invited to follow the journey, wander when needed, return often, and allow Scripture to remain the foundation of their growth.

---

## [0.4.0]

### Added

- Added the Path Into The Guide as the entry point for beginning the journey.
- Added the Biblical Books section:
  - Bible Reading Plan
  - Guidance for approaching the reading journey
- Added Field Notes as a place for examples, observations, and lessons gathered while walking with God.
- Added examples demonstrating The Guide in practice:
  - A Day With The Guide
  - Hebrews 6 Reflection Example
- Added The Resources That Shaped The Journey:
  - Personal study resources.
  - Additional study resources.
  - Authors and teachers who have influenced reflection and formation.

### Philosophy

- Clarified the distinction between:
  - The Guide as a companion to Scripture.
  - The Formation Map as a rhythm of practices.
  - Field Notes as observations and examples from the journey.
- Reinforced that resources, teachers, and tools are companions to Scripture rather than authorities over Scripture.
- Preserved the principle that personal experiences and reflections should point beyond themselves toward God's faithfulness.

### Refined

- Refined the voice of the repository to more consistently reflect the posture of a student being formed by Scripture rather than a teacher presenting a system.
- Clarified throughout the documentation that the practices and rhythms described in The Guide emerged gradually through walking with God rather than being intentionally designed as a framework.
- Strengthened the distinction between:
  - Scripture as the authority.
  - The Guide as a companion.
  - Personal experiences as testimonies of God's faithfulness rather than universal prescriptions.
- Improved consistency across the documentation by emphasizing ongoing formation, humility, and dependence on God's work.
- Refined repository navigation to create a clearer path for new readers:
  - Introduction provides orientation.
  - Biblical Books provides a starting point in Scripture.
  - Reading Scripture provides interpretive practices.
  - Formation provides connected practices.
  - Field Notes provides examples of the journey lived out.
- Refined the project structure from a collection of resources into a navigable path of formation.

### Notes

This milestone completes the first cohesive expression of The Guide as a journey.

The project now consistently reflects its guiding posture:

> The Guide points.
>
> God transforms.

Every section ultimately directs the reader back to Scripture as the foundation, while the surrounding practices, examples, and field notes serve as companions for walking faithfully with the light God provides.

> Open your Bible.
>
> Read carefully.
>
> Pray honestly.
>
> Reflect thoughtfully.
>
> Remember faithfully.
>
> Walk faithfully.

The Guide now contains:

- A front door.
- A path into Scripture.
- A formation rhythm.
- Practical examples.
- Field notes from the journey.

Future development will continue refining practices, resources, and reflections while maintaining the core purpose:

The Guide points. God transforms.

---

## [0.3.0]

### Added

- Added the Bible Reading Plan:
  - A structured path through Scripture focused on context, themes, and connections rather than speed.
  - Added Matthew as the conclusion of the New Testament section to return focus to Christ and the Kingdom.
  - Connected the reading plan with The Guide's practices of prayer, reflection, remembrance, and faithful walking.
- Added the Formation Compass as the orientation point for The Guide.
- Added the Formation Map as the framework connecting the practices of formation.
- Added the Prayer framework:
  - Purpose of Prayer
  - Praying Honestly
  - Daily Prayer Rhythm
  - Daily Prayer Set
- Expanded the Formation Map:
  - Scripture
  - Prayer
  - Reflection
  - Remembrance
  - Walking

### Philosophy

- Clarified that The Guide is shaped around a rhythm of formation rather than a system of spiritual achievement.
- Established that prayer is a response to God's revelation, rooted in relationship and dependence.
- Preserved prayer practices as anchors for returning to God rather than formulas to complete.
- Reinforced that spiritual formation begins with God's work and flows into faithful response.

### Refined

- Refined the language of the Formation framework from "Formation Stack" toward "Formation Map."
  - The Formation Stack describes how the connected practices were discovered.
  - The Formation Map describes how people orient themselves within those practices.
- Refined the project structure to distinguish between:
  - Formation Compass: orientation within The Guide.
  - Formation Map: the connected rhythm of formation practices.

### Notes

This milestone completes the first expression of the Formation Map:

> Scripture → Prayer → Reflection → Remembrance → Walking

The Guide now contains:

- A foundational purpose and philosophy.
- A Scripture approach.
- A reflection practice.
- A remembrance practice.
- A prayer rhythm.
- A walking framework.

Future development will continue refining practices, resources, and reflections while maintaining the core purpose:

Open your Bible.  
Read carefully.  
Pray honestly.  
Reflect thoughtfully.  
Remember faithfully.  
Walk faithfully.

---

## [0.2.0]

### Added

- Expanded The Guide from foundational philosophy into practical formation rhythms.
- Added the Journal Framework:
  - Scripture Reflection
  - Sermon Reflection
  - Bible Study Reflection
- Added examples demonstrating how the framework may be applied personally.
- Introduced Stones of Remembrance:
  - Purpose of Stones of Remembrance
  - Recognizing a Stone of Remembrance
  - Stones in Practice
- Added examples of Stones emerging from:
  - Scripture reflection
  - Sermon reflection
  - Bible study
  - Prayer and seasons of life
- Added the Walking framework:
  - Purpose of Walking
  - Walking in the Light
  - The Next Faithful Step

### Philosophy

- Preserved the principle that The Guide documents faithful practices rather than creating spiritual formulas.
- Established that Stones of Remembrance are not created for the sake of collecting, but emerge as markers of God's faithfulness.
- Clarified that walking with God is not about seeing the entire path, but faithfully taking the next step with the light provided.

### Notes

This milestone completes the first expression of the Formation Stack:

> Scripture → Prayer → Reflection → Remembrance → Walking

The Guide now contains both the foundational philosophy and practical examples of how these rhythms may look when lived out.

Future development will continue refining practices, resources, and reflections while maintaining the core purpose:

Open your Bible.  
Read carefully.  
Pray honestly.  
Reflect thoughtfully.  
Remember faithfully.  
Walk faithfully.

---

## [0.1.0]

### Added

- Established the foundational structure of The Guide repository.
- Added project purpose, philosophy, and heart documents.
- Created the Scripture reading framework:
  - How to Approach Scripture
  - Read Slowly
  - Learn to Notice
  - Ask Good Questions
  - Understand Author Intent
  - Interpret Faithfully
  - Apply Faithfully
- Created the initial Formation Stack framework:
  - Scripture
  - Prayer
  - Reflection
  - Remembrance
  - Walking
- Established the journaling framework:
  - Purpose of Journaling
  - Scripture Reflection Template
- Integrated the Receive → Understand → Respond rhythm into the journaling practice.
- Added the concepts of:
  - Bear Fruit
  - Framework Connection
  - The Quiet Whisper
  - Stones of Remembrance
- Preserved personal reflection markers:
  - Lamp to my feet
  - Left foot. Right foot.

### Philosophy

- Established The Guide as a companion to Scripture, not a replacement for it.
- Defined the guiding principle:
  > The Guide points. God transforms.
- Clarified that journaling is not a formula, checklist, or measure of spiritual maturity, but a practice of listening, reflecting, responding, and remembering.

### Refined

- Distinguished The Quiet Whisper from The Stone of Remembrance:
  - The Quiet Whisper captures what continues to echo after sitting with a passage.
  - The Stone of Remembrance captures the truth that should be carried forward.
- Refined the journaling framework from a generic study template into a Scripture reflection practice rooted in the project's guiding philosophy.
- Preserved the principle that Scripture is the foundation, understanding precedes application, and personal response flows from faithfully receiving God's Word.

### Notes

This initial release establishes the foundation of the project.

Future development will continue refining practices, resources, and reflections while maintaining the core purpose:

Open your Bible.  
Read carefully.  
Pray honestly.  
Reflect thoughtfully.  
Walk faithfully.
