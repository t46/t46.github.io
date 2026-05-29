---
layout: post
title: "Citation / Claim Audit Kit: Beyond Citation Existence"
date: 2026-05-29
permalink: /blogs/citation_claim_audit_kit.html
description: "Existing tools check whether a citation exists. But a citation can exist, point to a real paper, and still mischaracterize what that paper actually says. A minimal LLM-as-judge OSS for catching weak, tangential, and mischaracterized citations."
tags:
  - metascience-experiment
---

<h2>Citation / Claim Audit Kit: Beyond Citation Existence</h2>
<h3 style="text-align: center;">Real citation. Real paper. Wrong claim.</h3>

<p class="authors" style="text-align: center;">
    <a href="https://t46.github.io/">Shiro Takagi</a> &middot; drafted with <em>Claude Opus 4.7</em>
</p>

<br>

<section>
    <h3 style="text-align: center;">&sect;1 The gap between existence and support</h3>

    <p>As LLMs accelerate paper production, citation hygiene has become an open problem. Tools like <a href="https://arxiv.org/abs/2404.16139" target="_blank" rel="noopener noreferrer">HalluCiteChecker</a> and other hallucination-checkers verify whether the cited paper <em>exists</em>. That solves the most egregious failure mode &mdash; pure fabrication &mdash; but leaves a larger class of citation errors untouched.</p>

    <p>A citation can be a bad citation even when it points to a real, well-known paper. The cited work might be <em>weakly</em> related to the claim, <em>tangentially</em> connected, or worst, the claim might <em>mischaracterize</em> what the cited paper actually establishes. These are not malicious; they often come from sloppy literature management, especially in agentic research workflows where the agent picks a plausible-sounding reference without re-checking the original paper.</p>

    <p><strong>Citation / Claim Audit Kit</strong> is a minimal open-source experiment testing whether a lightweight LLM-as-judge can catch this layer.</p>

    <figure style="margin: 2.5em auto 1.5em; max-width: 640px;">
        <svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto; font-family: 'Cormorant Garamond', serif;">
            <defs>
                <style>
                    .axis-label { font-family: 'Cormorant Garamond', serif; font-size: 16px; font-weight: 600; font-style: italic; fill: #d8d5d0; }
                    .axis-tick  { font-family: 'Cormorant Garamond', serif; font-size: 15px; font-weight: 500; fill: #b8b5b0; }
                    .cell-title { font-family: 'Cormorant Garamond', serif; font-size: 19px; font-weight: 700; fill: #f0ebe5; }
                    .cell-body  { font-family: 'Cormorant Garamond', serif; font-size: 14.5px; fill: #c8c5c0; font-style: italic; }
                    .target-title { fill: #e8a8b6; }
                    .target-body  { fill: #e0c4cb; }
                    .grid { stroke: #b8b5b0; stroke-width: 0.6; opacity: 0.35; }
                    .grid-target { stroke: #c48b9a; stroke-width: 1.4; opacity: 0.85; }
                </style>
            </defs>
            <!-- top axis label -->
            <text x="320" y="28" class="axis-label" text-anchor="middle">Does the citation support the claim?</text>
            <text x="200" y="58" class="axis-tick" text-anchor="middle">no</text>
            <text x="440" y="58" class="axis-tick" text-anchor="middle">yes</text>
            <!-- left axis label (rotated) -->
            <text x="22" y="200" class="axis-label" text-anchor="middle" transform="rotate(-90, 22, 200)">Does the citation exist?</text>
            <text x="62" y="142" class="axis-tick" text-anchor="end">yes</text>
            <text x="62" y="262" class="axis-tick" text-anchor="end">no</text>
            <!-- 2x2 grid: 4 cells -->
            <!-- top-left: this kit's target (highlighted) -->
            <rect x="80" y="75" width="240" height="125" fill="rgba(196, 139, 154, 0.08)" class="grid-target"/>
            <text x="200" y="120" class="cell-title target-title" text-anchor="middle">weak / partial /</text>
            <text x="200" y="142" class="cell-title target-title" text-anchor="middle">mischaracterized</text>
            <text x="200" y="172" class="cell-body target-body" text-anchor="middle">&mdash; this kit's target &mdash;</text>
            <!-- top-right: OK -->
            <rect x="320" y="75" width="240" height="125" fill="none" class="grid"/>
            <text x="440" y="135" class="cell-title" text-anchor="middle">supports</text>
            <text x="440" y="165" class="cell-body" text-anchor="middle">citation does its job</text>
            <!-- bottom-left: hallucination checkers -->
            <rect x="80" y="200" width="240" height="125" fill="none" class="grid"/>
            <text x="200" y="252" class="cell-title" text-anchor="middle">fabrication</text>
            <text x="200" y="282" class="cell-body" text-anchor="middle">existing hallucination</text>
            <text x="200" y="300" class="cell-body" text-anchor="middle">checkers catch this</text>
            <!-- bottom-right: N/A -->
            <rect x="320" y="200" width="240" height="125" fill="none" class="grid" style="opacity: 0.18;"/>
            <text x="440" y="270" class="cell-body" text-anchor="middle" style="opacity: 0.55;">(empty by construction)</text>
        </svg>
        <figcaption style="text-align: center; font-style: italic; font-size: 0.9em; opacity: 0.7; margin-top: 0.5em;">
            The shaded quadrant &mdash; real citation, real paper, but it does not establish the claim &mdash; is what this kit targets.
        </figcaption>
    </figure>
</section>

<section>
    <h3 style="text-align: center;">&sect;2 How it works</h3>

    <p>The kit takes <code>(claim_text, cited_work_metadata)</code> pairs and asks an LLM judge to return a strict JSON verdict:</p>

    <pre><code>{
  "citation_exists": true,
  "support_verdict": "supports | partial | weak | contradicts | not_relevant | unavailable",
  "rationale": "1-3 sentences explaining the verdict",
  "evidence_excerpt": "what the cited work actually says/does"
}</code></pre>

    <p>The judge relies on its own knowledge of the cited works. When the cited work is unknown to the judge, it must return <code>unavailable</code> rather than hallucinate. The kit is deliberately small &mdash; one Python file, ~300 lines &mdash; so the failure modes are inspectable.</p>

    <p>Verdict semantics:</p>

    <ul>
        <li><strong>supports</strong>: the cited work directly establishes the claim.</li>
        <li><strong>partial</strong>: the cited work establishes part of the claim, or a related but weaker version.</li>
        <li><strong>weak</strong>: the cited work is in the same area but does not establish the claim.</li>
        <li><strong>contradicts</strong>: the cited work argues against the claim.</li>
        <li><strong>not_relevant</strong>: the citation is off-topic for the claim.</li>
        <li><strong>unavailable</strong>: the judge does not have enough information about the cited work.</li>
    </ul>
</section>

<section>
    <h3 style="text-align: center;">&sect;3 First audit: 30% of sampled citations were weaker than they appeared</h3>

    <p>We ran the kit over 20 manually extracted citation pairs from recent arXiv papers in the LLM / agent space. The result: <strong>6 of 20 (30%) received a <code>supports</code>-below verdict</strong> &mdash; 3 partial, 3 weak. Two illustrative examples:</p>

    <p><em>Example 1.</em> A paper claimed that &ldquo;MoE layers replace the FFN in modern LLMs&rdquo; and cited Vaswani et al. 2017 as evidence. Vaswani 2017 is the original Transformer paper. It introduces the FFN as part of the standard architecture; it does not establish or even mention any MoE-replaces-FFN claim. The citation is real, the paper is real, but the citation is doing different work than the body text implies. The judge flagged this as <code>weak</code>.</p>

    <p><em>Example 2.</em> A claim about MoE offloading cited a routed-scaling-laws paper. The cited paper is in the right neighborhood &mdash; it studies expert count and capability &mdash; but the body text used it to support a claim about <em>weight offloading</em> specifically, which is a different operational concern that the cited paper does not address. The judge flagged this as <code>partial</code>: the cite is relevant to the broader topic but does not establish the specific claim made.</p>

    <p>These are exactly the failure modes that pure existence-checkers miss. The citation exists, the paper exists, and the area is correct &mdash; but the citation does not establish what the prose says it does.</p>
</section>

<section>
    <h3 style="text-align: center;">&sect;4 Why this matters now</h3>

    <p>Agentic research pipelines are starting to produce papers at scale. The unit cost of generating a plausible-looking citation is approaching zero, while the unit cost of verifying that the citation actually supports the claim has not changed at all. The asymmetry favors citation noise.</p>

    <p>A lightweight, embeddable audit step &mdash; one that runs on (claim, cite) pairs during paper drafting or review &mdash; could keep this noise out of the literature without requiring full-text fetching or heavy infrastructure. Citation / Claim Audit Kit is a first artifact in that direction.</p>

    <p>The kit is intentionally a starting point. Three obvious extensions:</p>

    <ul>
        <li><strong>Fetch the cited paper's abstract / introduction</strong> rather than relying on judge world-knowledge. This handles cited works the judge does not know.</li>
        <li><strong>Integrate into review pipelines</strong> so the audit runs as part of paper review, flagging weak citations before publication.</li>
        <li><strong>Run at scale</strong> on a recent slice of arXiv to characterize the base rate of weak / tangential / mischaracterized citations in published work.</li>
    </ul>
</section>

<section>
    <h3 style="text-align: center;">&sect;5 Try it</h3>

    <p>The code is available at <a href="https://github.com/t46/citation-claim-audit-kit" target="_blank" rel="noopener noreferrer">github.com/t46/citation-claim-audit-kit</a> under MIT. Issues, PRs, and counter-examples (citations the judge mis-graded in either direction) are welcome.</p>

    <p>This is part of a wider exploration on what lightweight, agent-friendly infrastructure for research process integrity could look like. A companion artifact, <a href="/blogs/research_ledger_lite.html">Research Ledger Lite</a>, captures the research <em>process</em> as a Markdown + Git + SQLite append-only ledger.</p>
</section>
