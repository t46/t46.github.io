---
layout: post
title: "Research Ledger Lite: Capturing the Process, Not Just the Conclusion"
date: 2026-05-29
permalink: /blogs/research_ledger_lite.html
description: "Most research artifacts capture only the conclusion. A minimal Markdown + Git + SQLite ledger for the seven kinds of events that make up the research process — claims, evidence, experiments, decisions, failures, belief updates, artifacts — anchored to observables rather than agent narration."
tags:
  - metascience-experiment
---

<h2>Research Ledger Lite: Capturing the Process, Not Just the Conclusion</h2>
<h3 style="text-align: center;">A 7-event, hash-chained ledger for agentic research.</h3>

<p class="authors" style="text-align: center;">
    <a href="https://t46.github.io/">Shiro Takagi</a> &middot; drafted with <em>Claude Opus 4.7</em>
</p>

<br>

<section>
    <h3 style="text-align: center;">&sect;1 The published paper is the wrong artifact</h3>

    <p>A finished paper is a polished summary of what worked. It almost never reflects what actually happened: the false starts, the claims that were demoted when better evidence came in, the experiments that failed silently, the decisions to abandon a thread that someone else might have followed.</p>

    <p>For human research this loss has always been costly. For <em>agentic</em> research it is also a missed opportunity: an agent that produced 700 events on the way to a paper has, in those 700 events, the actual record of how the research happened &mdash; including which beliefs were updated by which observations and which experiments terminated as failures. That record is currently locked inside agent transcripts and orchestration logs, where it cannot be queried, replayed, audited, or reused.</p>

    <p><strong>Research Ledger Lite</strong> is a minimal experiment in giving that record a first-class home.</p>
</section>

<section>
    <h3 style="text-align: center;">&sect;2 Seven event types</h3>

    <p>The schema names the kinds of things that actually happen during research:</p>

    <ul>
        <li><strong>claim</strong> &mdash; a hypothesis or assertion.</li>
        <li><strong>evidence</strong> &mdash; an observation, dataset, or experimental result.</li>
        <li><strong>experiment</strong> &mdash; the metadata of an experiment that was run.</li>
        <li><strong>decision</strong> &mdash; an adopted direction or cut-line.</li>
        <li><strong>failure</strong> &mdash; a non-result, including failed reproductions.</li>
        <li><strong>belief_update</strong> &mdash; a change in belief, linked to the prior and the evidence that caused it.</li>
        <li><strong>artifact</strong> &mdash; a produced object: paper, code, dataset, figure.</li>
    </ul>

    <p>Every event must be <em>anchored</em>. An anchor is an observable that a reader could in principle inspect: a commit hash, an output file path, a command transcript, a timestamp. Events without anchors are agent narration; the schema rejects them.</p>
</section>

<section>
    <h3 style="text-align: center;">&sect;3 Three layers, clear roles</h3>

    <p>The ledger is built from three storage layers, each with a different job:</p>

    <ul>
        <li><strong>JSONL</strong> &mdash; the canonical event log. One event per line, hash-chained so any retroactive edit is detectable.</li>
        <li><strong>Markdown</strong> &mdash; the human-readable layer. Per-event notes when useful, plus summary reports and the schema spec itself.</li>
        <li><strong>SQLite</strong> &mdash; the derived index. Rebuilt from JSONL by <code>ledger.py index</code>. Used for queries and joins.</li>
    </ul>

    <p>The choice is deliberate: JSONL + Git gives integrity and version history; Markdown gives readability and embeddability into existing research notes; SQLite gives query power without committing the project to a heavier database. None of the three layers is the source of truth on its own &mdash; the source of truth is the JSONL hash chain &mdash; but the three together make the ledger usable.</p>
</section>

<section>
    <h3 style="text-align: center;">&sect;4 Replay test: 733 events &rarr; 38 ledger events</h3>

    <p>To check that the schema actually captures something real, we replayed a full autonomous-research run through it. The source was an ARA run on a beyond-transformer architecture exploration (<code>2026-05-17-beyond-transformer-v4</code>), which produced 733 raw events &mdash; tool calls, sub-agent invocations, partial outputs, retries.</p>

    <p>After mapping into the 7-event schema, the same run condensed to <strong>38 ledger events</strong>: 12 claims, 9 pieces of evidence, 7 experiments (some of which were failed reproductions and re-emerged as <code>failure</code> events), 5 decisions, 3 belief updates, 2 artifacts. The 695 events that did not survive the map were intermediate scaffolding &mdash; tool noise, retries, internal sub-agent chatter &mdash; not research events.</p>

    <p>The compression ratio (~5%) is not a target; it is a property of this particular run. It does suggest that the schema is doing real selection work: it forces the question &ldquo;what observable does this event anchor to?&rdquo; and rejects the events that are scaffolding rather than substance.</p>

    <figure style="margin: 2.5em auto 1.5em; max-width: 680px;">
        <svg viewBox="0 0 680 260" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
            <defs>
                <style>
                    .stage-title { font-family: 'Cormorant Garamond', serif; font-size: 17px; font-weight: 700; fill: #f0ebe5; }
                    .stage-num   { font-family: 'Cormorant Garamond', serif; font-size: 46px; font-weight: 700; fill: #f0ebe5; }
                    .stage-num-target { fill: #e8a8b6; }
                    .stage-body  { font-family: 'Cormorant Garamond', serif; font-size: 14.5px; fill: #c8c5c0; font-style: italic; }
                    .stage-body-detail { font-family: 'Cormorant Garamond', serif; font-size: 13px; fill: #b8b5b0; font-style: italic; }
                    .filter-label { font-family: 'Cormorant Garamond', serif; font-size: 14px; font-weight: 600; fill: #b8d4cb; }
                    .filter-note  { font-family: 'Cormorant Garamond', serif; font-size: 13px; fill: #c8c5c0; font-style: italic; }
                    .panel { stroke: #b8b5b0; stroke-width: 0.7; opacity: 0.4; fill: none; }
                    .panel-target { stroke: #c48b9a; stroke-width: 1.4; opacity: 0.85; fill: rgba(196, 139, 154, 0.06); }
                    .arrow-target { stroke: #c48b9a; stroke-width: 1.6; opacity: 0.85; fill: none; }
                </style>
            </defs>
            <!-- left panel: raw events -->
            <rect x="20" y="60" width="200" height="160" rx="3" class="panel"/>
            <text x="120" y="40" class="stage-title" text-anchor="middle">raw agent run</text>
            <text x="120" y="125" class="stage-num" text-anchor="middle">733</text>
            <text x="120" y="150" class="stage-body" text-anchor="middle">events</text>
            <text x="120" y="183" class="stage-body-detail" text-anchor="middle">tool calls, retries,</text>
            <text x="120" y="200" class="stage-body-detail" text-anchor="middle">sub-agent chatter</text>
            <!-- middle: schema filter -->
            <text x="340" y="40" class="stage-title" text-anchor="middle">schema filter</text>
            <text x="340" y="102" class="filter-label" text-anchor="middle">7 event types</text>
            <text x="340" y="122" class="filter-label" text-anchor="middle">+ anchor required</text>
            <line x1="240" y1="140" x2="440" y2="140" class="arrow-target"/>
            <polygon points="434,134 448,140 434,146" fill="#c48b9a" opacity="0.85"/>
            <text x="340" y="172" class="filter-note" text-anchor="middle">reject events without</text>
            <text x="340" y="189" class="filter-note" text-anchor="middle">observable anchors</text>
            <!-- right panel: ledger -->
            <rect x="460" y="60" width="200" height="160" rx="3" class="panel-target"/>
            <text x="560" y="40" class="stage-title" text-anchor="middle">ledger</text>
            <text x="560" y="125" class="stage-num stage-num-target" text-anchor="middle">38</text>
            <text x="560" y="150" class="stage-body" text-anchor="middle">events</text>
            <text x="560" y="183" class="stage-body-detail" text-anchor="middle">12 claims &middot; 9 evidence</text>
            <text x="560" y="200" class="stage-body-detail" text-anchor="middle">7 experiments &middot; 5 decisions</text>
            <text x="560" y="217" class="stage-body-detail" text-anchor="middle">3 belief updates &middot; 2 artifacts</text>
        </svg>
        <figcaption style="text-align: center; font-style: italic; font-size: 0.9em; opacity: 0.7; margin-top: 0.5em;">
            The schema acts as a filter, keeping only events that anchor to an observable. Of 733 raw events, 38 survive as research events; the rest were scaffolding.
        </figcaption>
    </figure>

    <p>The replay script and the resulting <code>events.jsonl</code> are included in the repo at <code>replay/ara-2026-05-17-beyond-transformer-v4/</code>, so anyone can inspect both the raw input and the schema output and decide whether the mapping is fair.</p>
</section>

<section>
    <h3 style="text-align: center;">&sect;5 Platform-independent on purpose</h3>

    <p>It would be tempting to tie this schema to a specific research platform. We are not doing that, for three reasons:</p>

    <ul>
        <li>Researchers and agents not using any particular platform still need to record process.</li>
        <li>A schema that survives across platforms is a stronger schema. If only one platform can read it, it has fewer constraints to satisfy.</li>
        <li>Markdown + Git + SQLite are universally available. The ledger should run with no external service.</li>
    </ul>

    <p>So Research Ledger Lite at v0 is deliberately standalone. The integration question &mdash; how a research platform should ingest or export ledger files &mdash; is left for a later version, once the schema has been used by at least one independent project outside its origin.</p>
</section>

<section>
    <h3 style="text-align: center;">&sect;6 Try it</h3>

    <p>The code, schema, and the ARA replay are available at <a href="https://github.com/t46/research-ledger-lite" target="_blank" rel="noopener noreferrer">github.com/t46/research-ledger-lite</a> under MIT. The README is the entry point; <code>schema.md</code> is the field-by-field spec.</p>

    <p>This is part of a wider exploration on what lightweight, agent-friendly infrastructure for research process integrity could look like. A companion artifact, <a href="/blogs/citation_claim_audit_kit.html">Citation / Claim Audit Kit</a>, audits whether paper citations actually support the claims they are attached to.</p>
</section>
