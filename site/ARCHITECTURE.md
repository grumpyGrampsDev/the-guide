# The Guide Website Architecture

> The Guide points. God transforms.

This document describes the architectural philosophy behind The Guide website. The website exists to provide an accessible doorway into The Guide: a living companion for reading, studying, praying, reflecting on, and being formed by Scripture. The website is not intended to replace Scripture, personal study, prayer, or community. It exists to help people engage those things more intentionally.

---

# Purpose

The Guide repository and The Guide website serve different but connected purposes. The repository is the workshop. The website is the doorway.

The repository preserves the ongoing development of The Guide:

- reflections
- practices
- study notes
- frameworks
- lessons learned
- resources

The website presents those materials in a way that allows others to explore and walk alongside the journey.

---

# Architectural Principles

## Content First

The Guide begins with content, not technology. The structure of the website should emerge from the structure of the journey already present in the repository. Technology exists to serve clarity, accessibility, and faithful engagement.

---

## Scripture Remains Central

The Guide is a companion to Scripture, not a replacement for it.

The website should continually point beyond itself:

- toward God's Word
- toward prayer
- toward reflection
- toward remembrance
- toward faithful walking

---

## Formation Over Information

The Guide is not designed as a course to complete or a collection of information to consume. The purpose is formation.

The website should encourage the rhythm:

Scripture → Prayer → Reflection → Remembrance → Walking

---

# Current Content Architecture

The repository currently contains the following areas of content. The website should reflect these categories while allowing them to grow naturally.

---

## Introduction

Purpose:

"What is The Guide?"

Location:

introduction/

Current content:

- Purpose of The Guide
- Philosophy of The Guide
- Heart of The Guide
- Formation Compass
- Path Into The Guide

Future possibilities:

- introductory reading paths
- guided entry points
- explanations of the framework

---

## Biblical Books

Purpose:

"Walking through Scripture"

Location:

biblical-books/

Current content:

- Bible reading plans

Future possibilities:

- Bible book introductions
- reading guides
- observations
- reflections
- Stones of Remembrance connected to Scripture

The structure intentionally leaves room for growth without assuming a complete Scripture library.

---

## Reading Scripture

Purpose:

"Learning how to approach God's Word"

Location:

reading-scripture/

Current content:

- approaching Scripture
- asking good questions
- observing
- interpretation
- author intent
- faithful application

Future possibilities:

- expanded study practices
- guided examples
- learning paths

---

## Formation

Purpose:

"The rhythm of becoming"

Location:

formation/

Current content:

The Formation Stack:

Scripture → Prayer → Reflection → Remembrance → Walking

Includes:

- prayer
- reflection
- remembrance
- walking

Future possibilities:

- deeper practices
- connections between disciplines
- guided formation paths

---

## Prayer

Purpose:

"Learning to speak honestly with God"

Location:

prayer/

Current content:

- daily prayer rhythm
- prayer set
- praying honestly
- purpose of prayer

Future possibilities:

- prayer practices
- examples
- seasonal prayers

---

## Journaling

Purpose:

"Practicing reflection"

Location:

journaling/

Current content:

- journal framework
- reflection templates
- examples

Future possibilities:

- guided journals
- printable resources
- digital journaling support

---

## Stones of Remembrance

Purpose:

"Remembering God's faithfulness"

Location:

stones-of-remembrance/

Current content:

- purpose
- recognizing a Stone
- examples

Future possibilities:

- searchable collection
- Scripture connections
- personal reflection prompts

Stones are discovered markers of God's faithfulness.

They are not collected as achievements.

They point back to God.

---

## Field Notes

Purpose:

"Observations from the journey"

Location:

field-notes/

Current content:

- reflections
- resources
- examples

Future possibilities:

- ongoing discoveries
- lessons learned
- reflections from practice

---

## Walking

Purpose:

"Living faithfully one step at a time"

Location:

walking/

Current content:

- next faithful step
- walking in the light
- purpose of walking

Future possibilities:

- practical applications
- reflections on obedience
- daily rhythms

---

# Site Architecture

The website mirrors the physical metaphor of The Guide:

Door → Front Desk → Shelves → Books

Each layer has a specific purpose.

### Door

The landing page is the first invitation into The Guide.

Its purpose is not to explain everything, but to welcome visitors and invite them inside.

### Front Desk

The front desk provides orientation.

Visitors can:

- Begin the recommended path.
- Browse the available shelves.

The front desk does not contain the library contents. It helps visitors understand where to go.

### Shelves

Shelves organize related documents into meaningful collections.

Examples:

- Introduction
- Reading Scripture
- Formation
- Prayer
- Walking

Each shelf provides an entry point into the documents it contains.

### Books

Documents contain the actual writings of The Guide.

Documents are rendered from Markdown files in the repository and remain the source of truth.

---

## Routing

The current routing structure:
/
Landing page
/front-desk
Orientation and navigation
/library/[shelf]
Shelf doorway
/library/[...slug]
Individual document

The routing intentionally separates:

- Orientation.
- Organization.
- Content.

This allows visitors to either follow a recommended journey or explore freely.

---

# Repository and Website Relationship

The repository remains the source of truth. The website is a presentation of that living work.

The expected relationship:

Creation

↓

Repository

↓

Website

↓

Reader engagement

The website should not become detached from the practices and reflections that created it.

---

# The Librarian

The Librarian is the internal component responsible for discovering, organizing, and retrieving the Guide's documents. It treats the repository as the source of truth and presents a simple API (getAllDocuments, getDocument, getSection) to the rest of the application. The Librarian discovers structure. It does not define structure.

---

# Growth Philosophy

The Guide should grow organically. New sections should emerge from faithful practice rather than being created simply because future possibilities exist. The architecture should leave room for growth while resisting unnecessary complexity.

The question is not:

"What features could we add?"

The question is:

"What would help someone walk more faithfully with God through Scripture?"

---

# Future Considerations

Some decisions intentionally remain open.

---

## Scripture Access

A future version of The Guide may include Scripture resources.

Possible approaches:

- linking to existing Bible resources
- displaying selected passages
- integrating Scripture text where appropriate

Any implementation should consider:

- Scripture as authority
- translation choices
- copyright and licensing
- keeping Scripture central rather than secondary

---

## Growth Without Rebuilding

The architecture should allow The Guide to grow organically.

Potential future additions:

- search
- guided reading paths
- Scripture study tools
- interactive reflection
- additional resources

New technology should serve the formation process, not define it.

---

# Guiding Question

Every architectural decision should answer:

"Does this help someone open God's Word with a humble heart, attentive mind, and desire to know Him more?"
